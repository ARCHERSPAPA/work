import { Component, OnInit } from '@angular/core';
import { RegularService } from '../../service/regular.service';
import { Default, OFFER_DEFAULT_DATA } from '../../model/constant';
import { WarningService } from '../../service/warning.service';
import { RequestService } from '../../service/request.service';
import { ConfigService } from '../../service/config.service';
import { QuoteService } from '../../service/quote.service';
import { atob, btoa, changeToDecimal, hideAuditFailureByState, ObjToArrByImg, toInteger, showExamineState } from '../../model/methods';
import { ActivatedRoute } from '@angular/router';
import { Messages } from '../../model/msg';
import { renderColors } from '../../model/budget-method';
import { fadeAnimate } from "../../animation/transform.component";


@Component({
    selector: 'rev-view-quote',
    templateUrl: './view-quote.component.html',
    animations: [fadeAnimate],
    styleUrls: ['./../../rev/detail/detail.scss', './../../rev/detail/price/price.component.scss'],
})
export class ViewQuoteComponent implements OnInit {

    //特效动画
    public switch: boolean = true;
    //body拉取data数据
    public data: any;
    public loading = false;

    //备注信息
    public remarks = '';
    public discount = 0;

    public cid: string;
    public aid: string;

    public regulars;//进场前
    public afterRegulars;//进场后
    //成交价
    public finalPrice: number;
    //计算的总价
    public totalPrice: number;
    //优惠金额
    public preferentialPrice: number;

    public type: number;

    //工程管理费用
    public engineerFee = -1;
    public ratio = 0.08;
    public price = { //进场前后项目总额
        afterPausePrice: '',
        beforePausePrice: ''
    };


    //单项备注信息添加和修改
    public remarkImgs: Array<any> = [];
    //查看图片大图
    public albums: Array<any> = [];
    public imgIndex: number;

    public list: any;
    public isNewQuote;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public allData: any = [];//定制项，和增减项一起的数据
    public specialList: any = [];
    public quotePrice: any;

    constructor(private request: RequestService,
        private warn: WarningService,
        private quote: QuoteService,
        private config: ConfigService,
        private reg: RegularService,
        private activatedRoute: ActivatedRoute) {
    }


    ngOnInit() {

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['type']) {
                this.type = Number.parseInt(params['type']);
            }
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
                this.isNewQuote = params['isNewQuote']
                if (this.type) {
                    this.reloadData(this.cid, this.type);
                } else {
                    this.reloadData(this.cid);
                    this.loadQuoteHead(this.cid);

                    Promise.all([this.selcetSpecialList(), this.historyPause()]).then(res => {
                        if (this.regulars && this.regulars.length > 0) {
                            this.allData.push(this.regulars)
                        }
                        if (this.afterRegulars && this.afterRegulars.length > 0) {
                            this.allData.push(this.afterRegulars)
                        }
                        if (this.specialList && this.specialList.list && this.specialList.list.length > 0) {
                            this.allData.push(this.specialList);
                        }
                    })

                }
            }
            if (params && params['aid']) {
                this.aid = atob(params['aid']);
                if (this.aid !== 'undefined' && !this.type) {
                    this.reloadDetail(this.aid);
                }
            }
        });

    }


    renderData(data) {
        console.log(data)
        this.data = this.componentData(OFFER_DEFAULT_DATA, data);
        // 添加页码
        this.data.forEach(d => {
            if (d.infoMaps && d.infoMaps.length > 0 && data.type !== 5 && data.type !== 6 && data.type !== 7) {
                d.infoMaps.forEach(map => {
                    map["pageNo"] = 1;
                })
            }
        })
        this.data = this.computedData(this.data);
        if (this.type > 0) {
            this.data = this.data.filter(d => {
                return d.type === this.type;
            });
        } else {
            this.data = this.data.filter(d => {
                return d.type !== Default.OFFER_ITEM.ITEM_5;
            });
        }
    }
    selcetSpecialList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.request.doPost({
                url: 'selectSpecialList',
                data: {
                    id: this.cid
                },
                success: res => {
                    if (res && res.code == 200) {
                        this.specialList = res.data;
                        if(this.specialList && this.specialList.list && this.specialList.list.length>0){
                            this.specialList.type = 1;
                            this.specialList.list.forEach(item => {
                                item['pageNo'] = 1;
                            });
                        }
                        // this.specialList.list[0].infos.push(this.specialList.list[0].infos[1])
                        // this.specialList.list[0].infos.push(this.specialList.list[0].infos[1])
                        // this.specialList.list[0].infos.push(this.specialList.list[0].infos[1])
                        // this.specialList.list.push(this.specialList.list[0])
                        resolve(res.data);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        })
    }
    componentData(dfs, data) {
        if (data && data.length > 0) {
            const defs = dfs.map(df => {
                df['expand'] = true;
                const d = data.filter(d => {
                    d['expand'] = true;
                    if (d.infoMaps && d.infoMaps.length > 0) {
                        d.infoMaps.forEach(info => {
                            info['expand'] = true;
                        });
                    }
                    return d && d.type === df.type;
                });
                return df = d && d.length > 0 ? d[0] : df;
            });
            return defs;
        }
        return dfs;
    }

    showEditDetail(type){
        if(this.afterRegulars && this.afterRegulars.length>0 && type==2){
            return true;
        }else if(!this.afterRegulars && type==0){
            return true;
        }else{
            return false;
        }
    }
    getTitle(type: number) {
        switch (type) {
            case 2:
                return '主材';
            case 3:
                return '个性化项目';
            case 4:
                return '其它项目';
            default:
                return '其它';
        }
    }


    //主材或者个性化
    showSubByType1(type: number) {
        console.log(type)
        switch (type) {
            case 2:
                return true;
            case 3:
                return true;
            default:
                return false;
        }
    }

    //其它项目
    showSubByType2(type: number) {
        return type && type === 4;
    }

    //工程管理费专用
    showSubByType3(type: number) {
        return type && type === 6;
    }

    //设计费专用
    showSubByType4(type: number) {
        return type && type === 7;
    }
    //材料清单
    showSubByType5(type: number) {
        return type && type === 5;
    }


    //放大图片
    openLarge(src, index) {
        this.imgIndex = index;
        this.albums = [];
        src.forEach(img => {
            this.albums.push({ src: img });
        });
    }


    getMainColumn(source, type, state) {
        let total = 0;
        if (source && source.length > 0) {
            for (const so of source) {
                if (so && so['infos'] && so['infos'].length > 0) {
                    if (state === 2) {
                        if (so.isPlan !== 1) {
                            for (const s of so['infos']) {
                                total += this.changeToInt(s[type] ? s[type] : 0, 2) * this.changeToInt(s['num'] ? s['num'] : 0, 2);
                            }
                        }
                        if (so.isPlan === 1) {
                            if (so.splitPlan === 0) {
                                total += this.changeToInt(so['planTotalPrice'] ? so['planTotalPrice'] : 0, 4)
                            }
                            if (so.splitPlan === 1) {
                                for (const s of so['infos']) {
                                    total += this.changeToInt(s[type] ? s[type] : 0, 2) * this.changeToInt(s['num'] ? s['num'] : 0, 2);
                                }
                            }
                        }

                    } else {
                        for (const s of so['infos']) {
                            total += this.changeToInt(s[type] ? s[type] : 0, 2) * this.changeToInt(s['num'] ? s['num'] : 0, 2);
                        }
                    }

                }
            }
        }
        return (Number(total) / Math.pow(10, 4));
    }

    getDesignTotal(designs, type) {
        let total = 0;
        if (designs && designs.length > 0) {
            for (const des of designs) {
                if (des.yn) {
                    total += this.changeToInt(des[type], 2);
                }
            }
        }
        return (Number(total) / Math.pow(10, 2));
    }

    combineImgs(o) {
        return ObjToArrByImg(o);
    }

    renderList(list, data) {
        list = data.filter(d => {
            d['expand'] = false;
            return !this.hideAuditFailureByState(d.state);
        });
        list.forEach(regular => {
            regular.details.reverse().forEach((order, index) => {
                this.getRows(regular.details, index);
            })
            regular.details.reverse();
        })
        return list;
    }
    /**
     * 拉取历史增减项目数据
     */
    historyPause(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.cid) {
                this.request.doPost({
                    url: 'historyPause',
                    data: { id: this.cid },
                    success: (res => {
                        if (res && res.code == 200) {
                            this.regulars = [];
                            this.quotePrice = '';
                            if (res.data && res.data.afterPause && res.data.afterPause.length > 0) {
                                this.afterRegulars = this.renderList(this.afterRegulars, res.data.afterPause);
                                this.afterRegulars.type = 2;
                                this.price.afterPausePrice=res.data.afterPausePrice;
                            }
                            if (res.data && res.data.beforePause && res.data.beforePause.length > 0) {
                                this.regulars = this.renderList(this.regulars, res.data.beforePause);
                                this.regulars.type = 0;
                                this.quotePrice = res.data.quotePrice;
                                this.price.beforePausePrice=res.data.beforePausePrice;
                            }
                            resolve()
                        } else {
                            this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            }
        })

    }
    getName(type) {
        if (type == 1) {
            return '定制项'
        } else if (type == 2) {
            return '进场后增减项'
        } else if (type == 0) {
            return '进场前增减项'
        }
    }
    showData(data) {
        if (data.type == 1) {
            return (data && data.list.length > 0)
        } else {
            return (data && data.length > 0)
        }

    }
    getConut(num, pay) {
        if (num && pay) {
            return num * pay;
        } else {
            return '--';
        }

    }
    // 套餐合并单元格
    getRows(ms: Array<any>, index: number) {

        let current = ms[index];
        let next = ms[index + 1];
        if (current.planId) {
            if (next) {
                if (current.planId === next.planId && current.splitPlan == 0) {
                    if (current["rows"]) {
                        current["rows"] = current["rows"] + 1;
                    } else {
                        current["rows"] = 2;
                    }
                    next["rows"] = current["rows"];
                    current["rows"] = 0;
                } else {
                    if (!current["rows"]) {
                        current["rows"] = 1;
                    }
                    if (!next["rows"]) {
                        next["rows"] = 1;
                    }
                }
            } else {
                if (!current["rows"]) {
                    current["rows"] = 1;
                }
            }
        } else {
            if (!current["rows"]) {
                current["rows"] = 1;
            }
        }
        return ms;
    }

    hideAuditFailureByState(state) {
        return hideAuditFailureByState(state);
    }

    renderRemark(i, info, items) {
        if (items && items.length > 0) {
            items.forEach(item => {
                if (item.id === i.id) {
                    i.remark = info;
                }
            });
        }
    }

    /**
     * 将小数转化成正数
     * @param num
     * @param curve
     * @returns {number | any}
     */
    changeToInt(num, curve) {
        return toInteger(num, curve);
    }


    /**
     * 重新渲染数据（body）
     */
    reloadData(cid, ...args) {
        this.loading = true;
        if (this.isNewQuote == 1) {
            this.getMaterialList().then(res => {
                this.loading = false;
            });
        } else {
            this.quote.loadData(cid, ...args)
                .then(res => {
                    this.loading = false;
                    this.renderData(res);
                }).catch(err => {
                    this.loading = false;
                    this.warn.onError(err);
                });
        }

    }
    //2.2.9版本新接口,获取固定大项
    // getCopyList(infos) {
    //     this.request.doPost({
    //         url: 'getMarterialCategory',
    //         data: {
    //             type: 1
    //         },
    //         success: res => {
    //             if (res && res.code == 200) {
    //                 console.log(res.data)
    //                 this.data = Array.of({ infoMaps: '' })
    //                 this.data[0].type = this.type;
    //                 this.data[0].expand = true;
    //                 this.data[0].name = '';
    //                 this.data.infoMaps = res.data
    //                 console.log(this.data)
    //                 this.data.infoMaps.forEach((v, index) => {
    //                     v['expand'] = false;
    //                     if (v['infos'] && v['infos'].length > 0) {
    //                         v['expand'] = true;
    //                     }
    //                 });
    //                 console.log(this.data)
    //             } else {
    //                 this.warn.onError(res.msg || Messages.FAIL.DATA);
    //             }
    //         }
    //     })
    // }
    getMaterialList() {
        return new Promise((resolve, reject) => {
            this.request.doPost({
                url: 'materialDetailList',
                data: {
                    id: this.cid
                },
                success: res => {
                    if (res && res.code == 200) {
                        this.data = Array.of({ infoMaps: '' })
                        this.data[0].type = this.type;
                        this.data[0].expand = true;
                        // this.data[0].name = '';
                        this.data[0].infoMaps = res.data;
                        this.data[0].infoMaps.forEach((v, index) => {
                            v['expand'] = false;
                            if (v['infos'] && v['infos'].length > 0) {
                                v['expand'] = true;
                                v['infos'].forEach(item => {
                                    item['offerExplain'] = item['explainMsg'];
                                });
                            }
                        });
                        resolve(res.data)
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        })
    }
    /**
     * 备注图片设置
     * @param src
     * @returns {{"background-image": string; "background-size": string}}
     */
    showRemarkImgBg(src) {
        return {
            'background-image': 'url(' + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/72/h/72') + ')',
            'background-size': '100% 100%'
        };
    }

    /**
     * 转成小数
     * @param unit
     * @param num
     * @returns {any}
     */
    converseToDecimal(unit, num) {
        const result = this.changeToInt(unit, 2) * this.changeToInt(num, 2) / Math.pow(10, 4);
        return changeToDecimal(result);
    }

    /**
     * 计算出总额
     * @param source 数据源
     * @param type 计算单位
     * @returns {number}
     */
    getTotal(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const s of source) {
                total += this.converseToDecimal(s[type] ? s[type] : 0, s['num'] ? s['num'] : 0);
            }
        }
        return total;
    }


    /**
     * 处理异步加载编辑的增减项
     * @param aid
     * @returns {Promise<any>}
     */
    reloadDetail(aid) {
        if (aid) {
            this.reg.loadDetail(aid).then(res => {
                this.renderPause(res);
            }).catch((err) => {
                this.warn.onError(err);
            });
        }
    }

    renderPause(result: any) {
        if (result) {
            this.list = result;
            this.list['expand'] = true;
            this.list.details.reverse().forEach((order, index) => {
                this.getRows(this.list.details, index);

            })
            this.list.details.reverse();
        }

        if (this.list && this.list.pause && !this.list.pause.applyActualPrice) {
            this.list.pause.applyActualPrice = this.getTotal(this.list.details, 'totalPrice');
        }
    }

    loadQuoteHead(id) {
        this.quote.loadQuoteHeadById(id)
            .then(data => {
                this.renderHead(data);
            })
            .catch(err => {
                this.warn.onError(err);
            });
    }

    renderHead(data) {
        this.remarkImgs = (data && data.remarkPhotos && data.remarkPhotos.length > 0) ? this.combineImgs(data.remarkPhotos) : [];
        this.remarks = (data && data.quoteBase && data.quoteBase.remark) ? data.quoteBase.remark : '';
        this.preferentialPrice = (data && data.quoteBase && data.quoteBase.preferentialPrice) ? data.quoteBase.preferentialPrice : 0;
        this.totalPrice = (data && data.quoteBase && data.quoteBase.totalPrice) ? data.quoteBase.totalPrice : 0;
        this.finalPrice = (data && data.quoteBase && data.quoteBase.finalPrice) ? data.quoteBase.finalPrice : 0;
    }

    /**
     * 重置当前颜色组
     * @param {string} colours
     * @returns {Array<string>}
     */
    renderColors(colours: string): Array<string> {
        return renderColors(colours);
    }

    /**
     * 计算其它项目（分支）
     * @param source
     * @param type
     * @returns {number}
     */
    getDiscountTotal(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const s of source) {
                total += this.changeToInt(s[type], 2);
            }
        }
        return Number(total) / Math.pow(10, 2);
    }

    /**
     * 计算其它项目（主干）
     * @param source
     * @param type
     * @returns {number}
     */
    getOtherTotal(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const so of source) {
                if (so && so['infos'] && so['infos'].length > 0) {
                    for (const s of so['infos']) {
                        total += this.changeToInt(s[type] ? s[type] : 0, 2);
                    }
                }

            }
        }
        return (Number(total) / Math.pow(10, 2));
    }

    /*
     *  当前审核状态
     */
    getExamineState(state) {
        return showExamineState(state);
    }

    // 设计费第一行数据
    getDesignTitle(data) {
        if (data && data.infos && data.infos.length > 0) {
            let find = data.infos.find(info => {
                return info.yn
            })
            if (find) {
                return `${find.name}（单价：${this.numberToCurrency(find.univalent)}，面积：${find.num || 0}m²）`
            } else {
                return '--'
            }
        } else {
            return '--'
        }
    }

    // 设计费第二行数据
    getDesignPrice(data) {
        if (data && data.infos && data.infos.length > 0) {
            let find = data.infos.find(info => {
                return info.yn
            })
            if (find) {
                return `应收：${this.numberToCurrency(find.discountPrice)}\xa0\xa0实收：${this.numberToCurrency(find.totalPrice)}`
            } else {
                return '--'
            }
        } else {
            return '--'
        }
    }

    numberToCurrency(value) {
        if (!value) return '0.00'
        // 将数值截取，保留两位小数
        value = Number(value).toFixed(2)
        // 获取整数部分
        const intPart = Math.trunc(value)
        // 整数部分处理，增加,
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        // 预定义小数部分
        let floatPart = '.00'
        // 将数值截取为小数部分和整数部分
        const valueArray = value.toString().split('.')
        if (valueArray.length === 2) { // 有小数部分
            floatPart = valueArray[1].toString() // 取得小数部分
            return intPartFormat + '.' + floatPart
        }
        return intPartFormat + floatPart
    }

    // 分页
    pageChange(e: any, map: any) {
        map["pageNo"] = e;
        this.computedData(this.data)
    }

    /**
     * 组装数据，重新渲染时使用
     * @param data
     * @returns {any}
     */
    computedData(data) {
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].infoMaps && data[i].type !== 7 && data[i].type !== 6) {
                    let itemNum = 0, start = 0, end = 0;
                    for (let j = 0; j < data[i].infoMaps.length; j++) {
                        start = (data[i].infoMaps[j].pageNo - 1) * this.pageSize;
                        end = (data[i].infoMaps[j].pageNo) * this.pageSize;
                        if (data[i].infoMaps[j].infos) {
                            itemNum += data[i].infoMaps[j].infos.slice(start, end).length;
                        }
                    }
                    if (data[i].infoMaps.length > 0) {
                        data[i]["rows"] = itemNum + data[i].infoMaps.length + 2;
                    } else {
                        data[i]["rows"] = itemNum + data[i].infoMaps.length + 1;
                    }
                } else {
                    if (data[i].type === 7) {
                        data[i]["rows"] = 2;
                    } else {
                        data[i]["rows"] = 1;
                    }
                }
            }
        }
        return data;
    }

    /**
     * 小项分页
     * @param map
     * @returns {any}
     */
    computedBranchInfos(map) {
        if (map.infos && map.infos.length > 0) {
            return map.infos.slice((map.pageNo - 1) * this.pageSize, map.pageNo * this.pageSize);
        }
        return map
    }

    toggle() {
        this.switch = this.switch ? false : true;
    }

    btoa(id: string) {
        return btoa(id);
    }

    remarkStyle() {
        let imgW, imgS, relW
        if (this.remarkImgs && this.remarkImgs.length < 4) {
            imgW = 72 * Number(this.remarkImgs.length);
            imgS = 8 * Number(this.remarkImgs.length);
            relW = `100% - 16px - ${imgW}px - ${imgS}px`;
        } else {
            imgW = 72 * Number(4);
            imgS = 8 * Number(4);
            relW = `100% - 16px - ${imgW}px - ${imgS}px`;
        }
        return {
            'width':
                this.remarkImgs && this.remarkImgs.length > 0 ? `calc(${relW})` : '100%'
        };
    }
}
