import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Messages} from '../../../../model/msg';
import {Statics} from '../../../../model/categroy';
import {LocationComponent} from '../../../../plugins/location/location.component';
import {SettleService} from '../../../../service/settle.service';
import {LocateService} from '../../../../service/locate.service';
import {Default} from '../../../../model/constant';

//渲染图
import * as DataSet from '@antv/data-set';
import {atob} from '../../../../model/methods';


@Component({
    selector: 'rev-settle-detail-attend',
    templateUrl: './settle-detail-attend.component.html',
    styleUrls: ['./../../settle.component.scss', './settle-detail-attend.component.scss'],
})
export class SettleDetailAttendComponent implements OnInit {

    public currentDate: Date = new Date();
    //交互
    public selectMonth = 0;
    public selectDay = 0;
    public selectInfo: any;
    public isVisible = false;


    //当前数据信息head
    // public settleInfo: any;

    /**
     * 统计数据
     */
    public statistics: any;
    public data: any;

    public attendTimeRange: any = {
        startTime: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000,
        endTime: 0
    };

    public state: number;

    /**
     * aid 工人 id
     */
    public aid: string;

    /**
     *  cid 报价 id
     */
    public cid: string;

    //单个工人是否加载
    public load = false;

    /**
     * 选择工人
     */
    public selectWorker: any;
    public workers: any;

    //图表渲染
    public items: any;
    public itemTpl: any;
    public color: any;
    public tooltip: any;

    public settleInfo: any;
    //备注
    public remarks = '';


    constructor(private modalService: NgbModal,
                private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private settle: SettleService,
                private locate: LocateService) {
    }


    ngOnInit() {
        this.state = Number(this.activatedRoute.snapshot.paramMap.get('state'));

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['aid']) {
                this.aid = atob(params['aid']);
            }
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
            }

            if (this.state && this.state === Default.STATE.ITEM_4) {
                this.settle.loadAttendRange(this.cid)
                    .then(res => {
                        this.combineRange(res);
                        return this.settle.loadAttendWorkers(this.cid);
                    })
                    .catch(err => {
                        this.warn.onError(err);
                    })
                    .then(res => {
                        this.workers = res;
                        if (!this.selectWorker) {
                            this.selectWorker = this.workers[0];
                            this.loadAttend(this.workers[0]);
                        }
                    })
                    .catch(err => {
                        this.warn.onMsgError(err);
                    });

            } else {
                this.settle.loadAttendRange(this.cid)
                    .then(res => {
                        this.combineRange(res);
                        return this.settle.getSettleData();
                    })
                    .catch(err => {
                        this.warn.onError(err);
                    })
                    .then(data => {
                        if (data && data.workerId) {
                            this.loadAttend({id: data.workerId, type: 2});
                        }
                    })
                    .catch(err => {
                        this.warn.onError(err);
                    });
            }

        });



    }


    ngDoCheck() {
        // //单个工人加载
        if (!this.state) {
            // console.log(this.settle);
            if (this.settle.getSettleData()) {
                this.settleInfo = this.settle.getSettleData();
                // console.log(this.settleInfo);
            }
        }
        this.renderLocation();
    }


    renderLocation() {
        if (this.selectInfo) {
            if (!this.selectInfo.firstInfo && this.justPointBylngAndlat(this.selectInfo.firstLongitude,
                this.selectInfo.firstLatitude)) {
                this.selectInfo.firstInfo = Messages.LOADING;
                this.locate.firstLocation([this.selectInfo.firstLongitude, this.selectInfo.firstLatitude]);
            } else {
                if (this.locate.getFirstInfo()) {
                    this.selectInfo.firstInfo = this.locate.getFirstInfo();
                }
            }

            if (!this.selectInfo.lastInfo && this.justPointBylngAndlat(this.selectInfo.lastLongitude,
                this.selectInfo.lastLatitude)) {
                this.selectInfo.lastInfo = Messages.LOADING;
                this.locate.lastLocation([this.selectInfo.lastLongitude, this.selectInfo.lastLatitude]);
            } else {
                if (this.locate.getLastInfo()) {
                    this.selectInfo.lastInfo = this.locate.getLastInfo();
                }
            }
        } else {
            this.selectInfo = null;
            this.locate.setLastInfo(null);
            this.locate.setFirstInfo(null);
        }
    }

    selectChange(date: Date) {
        this.currentDate = date;
        this.selectMonth = this.getMonth(date);
        this.selectDay = this.getDate(date);
        this.selectInfo = this.getDataByDate(this.selectMonth, this.selectDay);
    }

    getMonth(date: Date) {
        return date.getMonth();
    }

    getDate(date: Date) {
        return date.getDate();
    }

    selectedDate(date) {
        return date.getMonth() === this.selectMonth && date.getDate() === this.selectDay;
    }

    getLocal(select, type) {
        // console.log(select);
        const modal = this.modalService.open(LocationComponent, {
            centered: true,
            keyboard: true
        });
        modal.componentInstance.title = '查看当前地理位置';
        const point = {lng: 104.065971, lat: 30.657154};
        if (type === 'first') {
            point.lng = select['firstLongitude'];
            point.lat = select['firstLatitude'];
        } else {
            point.lng = select['lastLongitude'];
            point.lat = select['lastLatitude'];
        }
        modal.componentInstance.point = point;
    }

    //展示审核弹窗
    viewAttend() {
        this.isVisible = true;
    }
    //审核弹窗通过与不通过
    confirm(ct: number) {
        const url = ct ? 'agreeLabourExpenses' : 'rejectLabourExpenses';
        this.req.doPost({
            url: url,
            data: {id: this.aid, remark: this.remarks},
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.settle.setTypeByParam('head', true);
                    this.isVisible = false;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }
    //关闭审核弹窗
    cancel() {
        this.isVisible = false;
    }

    /**
     * 拉取个人的考勤信息
     * @param worker
     */
    loadAttend(worker) {
        this.selectInfo = null;
        if (this.cid) {
            this.req.doPost({
                url: 'loadWorkAttendance',
                data: {
                    id: worker.id,
                    type: worker.type,
                    quoteId: this.cid
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.combineData(res.data);
                        if (this.currentDate) {
                            this.selectChange(this.currentDate);
                        }
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }


    //组装开工、竣工数据
    combineRange(data) {
        if (data && data.startTime) {
            this.attendTimeRange.startTime = data.startTime;
        }
        if (data && data.endTime) {
            this.attendTimeRange.endTime = data.endTime;
            this.selectMonth = this.getMonth(new Date(data.endTime));
            if (this.attendTimeRange.endTime >= new Date().getTime()) {
                this.selectDay = this.getDate(new Date(data.endTime));
            }
        }
    }

    //初始化所有数据信息
    combineData(data) {
        const that = this;
        if (data && data.length > 0) {
            for (const d of data) {
                if (d.firstCheck && d.lastCheck) {
                    d['day'] = that.getDateByTimestamp(d.firstCheck);
                    d['month'] = that.getMonthByTimestamp(d.firstCheck);
                }

                if (d.firstCheck && !d.lastCheck) {
                    d['day'] = that.getDateByTimestamp(d.firstCheck);
                    d['month'] = that.getMonthByTimestamp(d.firstCheck);
                }

                if (!d.firstCheck && d.lastCheck) {
                    d['day'] = that.getDateByTimestamp(d.lastCheck);
                    d['month'] = that.getMonthByTimestamp(d.lastCheck);
                }

            }
            that.data = data;
            that.statistics = that.combineStatics(that.data);
            console.log(that.data);
        } else {
            that.data = [];
            that.statistics = new Statics();
        }
        this.renderChart(that.statistics);
    }

    //根据时间戳得日子
    getDateByTimestamp(timestamp: number) {
        return new Date(timestamp).getDate();
    }

    //根据日间戳得月份
    getMonthByTimestamp(timestamp: number) {
        return new Date(timestamp).getMonth();
    }

    //组装统计数据
    combineStatics(data) {
        const statics = new Statics();
        for (const d of data) {

            if (d.firstCheck && d.lastCheck && this.justShowByDay(d.firstCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(d.lastCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false)) {
                statics['all'] += 1;
            }
            if (d.firstCheck && !d.lastCheck && this.justShowByDay(d.firstCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(d.firstCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false)) {
                statics['morning'] += 1;
            }
            if (!d.firstCheck && d.lastCheck && this.justShowByDay(d.lastCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(d.lastCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false)) {
                statics['night'] += 1;
            }

            if ((d.firstCheck && this.justShowByDay(d.firstCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(d.firstCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false)) || (d.lastCheck && this.justShowByDay(d.lastCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(d.lastCheck, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false))) {
                statics['doing'] += 1;
            }
        }
        console.log(statics);
        return statics;
    }

    justColorByDate(date: Date) {
        const that = this;
        const month = that.getMonth(date);
        const day = that.getDate(date);
        if (that.data && that.data.length > 0) {
            for (const d of that.data) {
                if (d['month'] === month && d['day'] === day) {
                    if (d.firstCheck && d.lastCheck) { return 'all'; } else if (d.firstCheck && !d.lastCheck) { return 'morning'; } else if (!d.firstCheck && d.lastCheck) { return 'night'; } else { return 'default'; }
                }
            }
        }
    }

    getDataByDate(month, day) {
        if (this.data && this.data.length > 0) {
            for (const d of this.data) {
                if (d['month'] === month && d['day'] === day) {
                    return d;
                }
            }
        }
        return null;
    }

    showDate(date: Date) {
        return this.justShowByDay(date, this.attendTimeRange.startTime, this.attendTimeRange.endTime, true) && this.justShowByDay(date, this.attendTimeRange.startTime, this.attendTimeRange.endTime, false);
    }

    //判断年、月、日
    justShowByDay(ct, st, bt, isOpen) {
        const c = new Date(ct),
            s = new Date(st),
            b = new Date(bt);

        let cy, cm, cd, sy, by, sm, bm, sd, bd;

        cy = Number(c.getFullYear());
        sy = Number(s.getFullYear());
        by = Number(b.getFullYear());

        cm = Number(c.getMonth());
        sm = Number(s.getMonth());
        bm = Number(b.getMonth());

        cd = Number(c.getDate());
        sd = Number(s.getDate());
        bd = Number(b.getDate());

        if (isOpen) {
            if (sy < cy) { return true; }
            if (sy == cy && sm < cm) { return true; }
            if (sy == cy && sm == cm && sd <= cd) { return true; }
            return false;
        } else {
            if (cy < by) { return true; }
            if (cy == by && cm < bm) { return true; }
            if (cy == by && cm == bm && cd <= bd) { return true; }
        }

        // if(sy <= cy && cy <= by && sm <= cm && cm <= bm && sd <= cd && cd <= bd){
        //     if(isOpen){
        //         return cy >= sy && cm >= sm && cd >= sd;
        //     }else{
        //         return cy <= by && cm <= bm && cd <= bd;
        //     }
        // }
        return false;
    }


    justPointBylngAndlat(lng, lat) {
        return parseInt(lng) && parseInt(lat);
    }


    modalChange(event: any) {
        this.loadAttend(this.selectWorker);
    }

    resetTimeRange(range) {
        if (range && !range['startTime']) {
            range.startTime = new Date().getTime() + 2 * 24 * 59 * 59 * 1000;
        }
        if (range && !range['endTime']) {
            range['endTime'] = new Date().getTime() + 2 * 24 * 59 * 59 * 1000;
        }
        return range;
    }

    /**
     * 加载时间区间
     * @param cid
     * @returns {Promise<any>}
     */
    // loadRangeTime(cid): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.req.doPost({
    //             url: "workAttendanceRange",
    //             data: {
    //                 quoteId: cid
    //             },
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     resolve(res.data);
    //                 } else {
    //                     reject(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     })
    // }

    /**
     * 拉取工人数据
     * @param cid
     * @returns {Promise<any>}
     */
    // loadWorkers(cid): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.req.doPost({
    //             url: "loadAttendanceWorkers",
    //             data: {id: cid},
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     resolve(res.data)
    //                 } else {
    //                     reject(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     });
    // }

    /**
     * 渲染图表
     */
    renderChart(statis: any) {
        let sourceData, colors;
        if (statis && (statis.morning || statis.night || statis.all)) {
            sourceData = [
                {item: '早卡', count: statis.morning},
                {item: '晚卡', count: statis.night},
                {item: '全勤', count: statis.all}
            ];
            colors = ['item', ['#FFB917', '#B2B2B2', '#1890FF']];
        } else {
            sourceData = [
                {item: '默认', count: 30}
            ];
            colors = ['item', ['#F5F5F5']];
        }


        const dv = new DataSet.View().source(sourceData);
        dv.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
        });
        const data = dv.rows;
        this.items = data;


        this.tooltip = ['item*count', (item, count) => {
            if (item === '默认') {
                return {
                    name: '考勤',
                    value: '暂无记录'
                };
            } else {
                return {
                    name: item,
                    value: count
                };
            }

        }];
        this.color = colors;

        this.itemTpl = '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>';
    }

}
