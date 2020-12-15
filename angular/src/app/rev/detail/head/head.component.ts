import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {WarningService} from '../../../service/warning.service';
import {RequestService} from '../../../service/request.service';
import {QuoteService} from '../../../service/quote.service';

import {Quote} from '../../../model/quote';
import {ActivatedRoute} from '@angular/router';
import {InfoComponent} from '../../../plugins/info/info.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Messages} from '../../../model/msg';
import {
    atob,
    controlBuildInfo, controlBuildUser,
    controlHeadInfo, equalToSame,
    getPostName, showConfirmByState, showDesigner, showGraphByState, showPersonal,
    showRoleEditByState, showUsers
} from '../../../model/methods';
import {Default} from '../../../model/constant';
import {UserService} from '../../../service/user.service';
import {SettleService} from '../../../service/settle.service';
import {ItemDispatcherComponent} from '../../../plugins/item-dispatcher/item-dispatcher.component';
import {HeaderService} from '../../../service/header.service';

@Component({
    selector: 'rev-detail-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

    // @Output() dataChange:EventEmitter<any> = new EventEmitter<any>();

    public cid: string;

    public dataSource: any;
    //基础数据
    public baseQuote: any = new Quote();
    //是否进行增减项目v2.2.4
    public pauseState = 0;

    public agreement: any;
    //所有设计师
    public designQuote: any;
    //所有职权人员
    public memberQuote: any;
    //工程总监
    public leader: any;
    //工长
    public chief: any;
    //监理
    public supervisor: any;

    /**
     * 复用人员
     */
    public reusers: any = [];
    /**
     * 展示复用人员
     */
    // public showReusers:any;

    /**
     * APP查看人员
     * @type {any[]}
     */
    public viewUsers: any = [];

    //设备
    public deviceQuote: any;


    public state: number = Default.STATE.ITEM_1;
    //type:区分price contract
    public type: string;

    /**
     * 记录id
     */
    public rid: string;
    /**
     * 维修人员相关信息
     */
    public responsibility: any = {name: '', phone: '', status: 0};


    constructor(private activatedRoute: ActivatedRoute,
                private request: RequestService,
                private warn: WarningService,
                private quote: QuoteService,
                private modal: NgbModal,
                private user: UserService,
                private settle: SettleService,
                private header: HeaderService) {
    }

    ngOnInit() {
        try {
            this.state = this.activatedRoute.snapshot.firstChild ? parseInt(this.activatedRoute.snapshot.firstChild.params['state']) : parseInt(this.activatedRoute.snapshot.paramMap.get('state'));
        } catch (e) {
            this.state = Default.STATE.ITEM_1;
        }

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['rid']) {
                this.rid = atob(params['rid']);
            }
        });


        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
                // this.reloadHead();
                this.reloadQuoteHead(this.cid);
                // this.reloadDesign();
            }
        });

        // if (this.state === Default.STATE.ITEM_4) {
        //     this.settle.loadAttendWorkers(this.cid);
        //     this.settle.loadAttendRange(this.cid);
        // }
        // this.loadResue();
    }

    // ngAfterViewInit() {
    // this.loadHead();
    // }


    ngDoCheck() {
        const snapshot = this.activatedRoute.snapshot;
        this.type = snapshot.firstChild ? snapshot.firstChild.url[0]['path'] : null;

        if (this.quote && this.quote.getTypeByParam('head')) {
            this.quote.setTypeByParam('head', false);
            this.reloadQuoteHead(this.cid);
        }

        if (this.baseQuote) {
            this.baseQuote.quoteDepartmentName = this.baseQuote.quoteDepartmentName;
            this.baseQuote.quoteDepartmentId = this.baseQuote.quoteDepartmentId;
        }

        this.leader = this.getMemberByType(Default.STAFF.CLASS_5, false);
        this.chief = this.getMemberByType(Default.STAFF.CLASS_3, false);
        this.supervisor = this.getMemberByType(Default.STAFF.CLASS_4, false);
        this.reusers = this.getMemberByType(Default.STAFF.CLASS_6, true);
        this.viewUsers = this.getMemberByType(Default.STAFF.CLASS_7, true);
        // }

        /**
         * 复用人员提供
         */

        if (this.quote.getRecords()) {
            if (this.quote.getRecords()['responsibilityName'] && this.quote.getRecords()['responsibilityPhone']) {
                this.responsibility.name = this.quote.getRecords()['responsibilityName'];
                this.responsibility.phone = this.quote.getRecords()['responsibilityPhone'];
            }
            this.responsibility.status = this.quote.getRecords()['status'];
        }

        // console.log(this.controlHeadInfo());

    }

    modifyInfo(type, data) {
        if (type === 3) {
            this.judgeChiefByItem(type, data);
        } else {
            this.infoModal(type, data);
        }
    }

    /**
     * 删除复用人员
     */
    deleteInfo() {

    }

    /**
     * 报价列表新建
     * @param type
     * @param data
     */
    buildCustomer(type, data) {
        this.infoModal(type, data);
    }

    /**
     * 项目列表新建
     * @param type
     * @param data
     */
    createCustomer(type, data) {
        this.infoModal(type, data);
    }

    getTypeName(type) {
        return getPostName(type);
    }

    /**
     * 根据不同类型返回相应的成员信息
     * @param type 成员类型
     * @param bool 返回是否为数组
     * @returns {any}
     */
    getMemberByType(type, bool) {
        let members = null,
            that = this;
        if (bool) {
            members = [];
        }
        if (that.memberQuote && that.memberQuote.length > 0) {
            for (const m of that.memberQuote) {
                if (m.type === type) {
                    if (bool) {
                        members.push(m);
                    } else {
                        members = m;
                    }

                }
            }
        }
        return members;
    }

    judgeChiefByItem(type, data) {
        const that = this;
        that.request.doPost({
            url: 'checkPersonnel',
            data: {id: that.cid},
            success: (res => {
                if (res && res.code == 200) {
                    this.infoModal(type, data);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    infoModal(type, data) {
        const that = this;
        if (this.pauseState === 1) {
            that.warn.onModalInfo({
                title: '提示',
                content: Messages.DESIGNER_TIP.DOING,
                ok: () => {
                    console.log('tips');
                }
            });
            return;
        }

        const info = that.modal.open(InfoComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static'
        });
        info.componentInstance.type = type;
        info.componentInstance.id = that.cid;

        if (type === 1) {
            info.componentInstance.department = {
                departmentId: data.quoteDepartmentId,
                departmentName: data.quoteDepartmentName
            };
        } else if (showDesigner(type)) {
            info.componentInstance.designers = data;
        } else if (showPersonal(type)) {
            if (data && data.id) {
                info.componentInstance.qmid = data.id;
            }
            info.componentInstance.member = data;
        } else if (showUsers(type)) {
            //项目详情修改
            info.componentInstance.user = data;
        }
        // else if (type === 10) {
        //     //报价列表新建客户
        //     info.componentInstance.user = data;
        // } else if (type === 11) {
        //     //项目列表新建客户
        //     info.componentInstance.user = data;
        // }


        info.result.then((res) => {
                if (res) {
                    this.quote.setTypeByParam('head', true);
                    this.quote.setTypeByParam('data', true);
                    this.quote.setTypeByParam('price', true);
                }

            },
            (rea) => {
                // console.log(rea);
                if (this.cid) {
                    // this.quote.loadQuoteHeadById(this.cid);
                    this.quote.setTypeByParam('head', true);
                    // this.reloadDesign();
                }
            });
    }

//工长、监理、总监判断（复用人员、查看人员）
    showRoleByState() {
        switch (this.state) {
            case Default.STATE.ITEM_4:
                return true;
            case Default.STATE.ITEM_6:
                return true;
            case Default.STATE.ITEM_7:
                return true;
            case Default.STATE.ITEM_8:
                return true;
            default:
                return false;
        }
    }

    showRoleEditByState() {
        return this.baseQuote && this.baseQuote['quoteDepartmentId'] && showRoleEditByState(this.baseQuote) && !(this.state === Default.STATE.ITEM_6 || this.state === Default.STATE.ITEM_8);
    }

    /**
     * 专用于复用人员和查看人员修改
     * @returns {boolean}
     */
    showUserEditByState() {
        return this.baseQuote && showRoleEditByState(this.baseQuote);
    }

    /**
     * 根据状态来显示部门信息是否可修改
     * @returns {boolean}
     */
    controlDepartInfo() {
        return (controlHeadInfo(this.baseQuote) && showConfirmByState(this.baseQuote)) && equalToSame(this.user.getPhone(), this.designQuote) && (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && this.baseQuote.retreat === 0;
    }

    /**
     * 根据状态来显示客户可编辑状态
     * v2.2.4 新增已签单时可以编辑室卫和相应备注信息
     */
    controlHeadInfo() {
        return (controlHeadInfo(this.baseQuote) || this.baseQuote && this.baseQuote.state === 3) && showConfirmByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designQuote) && (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && this.baseQuote.retreat === 0;
    }


    controlHeadDesign() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designQuote) && (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && this.baseQuote.retreat === 0;
    }

    /**
     * 职能人员控制
     * @returns {boolean}
     */
    controlBuildInfo() {
        return !this.baseQuote['quoteDepartmentId'] && controlBuildInfo(this.baseQuote) && this.state === Default.STATE.ITEM_4 && this.baseQuote.retreat === 0;
    }

    /**
     * 设置修改或者添加客户信息
     * @returns {boolean}
     */
    controlBuildUser() {
        return controlBuildUser(this.baseQuote) && this.state === Default.STATE.ITEM_4 && this.baseQuote.retreat === 0;
    }

    /**
     * 控制显示置为竣工按钮
     * @returns {boolean}
     */
    controlFinishItem() {
        return !showGraphByState(this.baseQuote) && this.state === Default.STATE.ITEM_4 && this.baseQuote["customerType"] === 1;
    }

    controlBuildDesign() {
        return !showGraphByState(this.baseQuote) && this.designQuote && this.designQuote.length != 0 && (this.state === Default.STATE.ITEM_4) && this.baseQuote.retreat === 0;
    }

    controlBuildViewUsers() {
        return controlBuildInfo(this.baseQuote) && this.state === Default.STATE.ITEM_4 && this.baseQuote.retreat === 0;
    }

    controlBuildEmptyDesign() {
        return !showGraphByState(this.baseQuote) && (!this.designQuote || this.designQuote.length < 1) && this.state === Default.STATE.ITEM_4 && this.baseQuote.retreat === 0;
    }


    unbind(deviceNo) {
        const that = this;
        if (that.cid && deviceNo) {
            that.request.doPost({
                url: 'unbindProject',
                data: {
                    projectId: that.cid,
                    did: deviceNo
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.quote.setTypeByParam('head', true);
                        // that.reloadDesign();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    /**
     *派单人员
     */
    sendDispatcher() {
        const dispatch = this.modal.open(ItemDispatcherComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
            size: 'lg'
        });
        dispatch.componentInstance.user =
            dispatch.result.then(res => {
                if (res && res.length > 0) {
                    const params = {
                        recordId: this.rid,
                        responsibilityId: res[0].id,
                        userType: res[0].userType
                    };
                    this.request.doPost({
                        url: 'recordAssignCard',
                        data: params,
                        success: (res => {
                            if (res && res.code == 200) {
                                this.quote.loadRecordDynamic(this.rid);
                                this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            } else {
                                this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                            }

                        })
                    });
                }
            }, rea => {

            });
    }

    /**
     * 完成竣工
     * @param {number} id
     */
    finishProject(id: number) {
        if (id) {
            this.quote.finishProject(id).then(msg => {
                this.warn.onMsgSuccess(msg);
                this.reloadQuoteHead(this.cid);
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }

    }

    /**
     * 删除（复用人员和查看人员）
     * @param user
     */
    delUser(user) {
        if (this.pauseState === 1) {
            this.warn.onModalInfo({
                title: '提示',
                content: Messages.DESIGNER_TIP.DOING,
                ok: () => {
                    console.log('tips');
                }
            });
            return;
        }
        if (user && user.memberId) {
            this.request.doPost({
                url: 'removeCustom',
                data: {
                    id: this.cid,
                    userId: user.memberId
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam('head', true);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }


    getFinishTime() {
        if (this.agreement && this.agreement['engineeringStartTime']) {
            if (this.agreement['engineeringTimeLimit']) {
                return parseInt(this.agreement['engineeringStartTime']) + parseInt(this.agreement['engineeringTimeLimit']) * 86400000;
            }
        }
        return null;
    }


    reloadQuoteHead(id) {
        let p;
        if (this.state === Default.STATE.ITEM_2) {
            p = this.quote.loadFinanceHeadById(id);
        } else {
            p = this.quote.loadQuoteHeadById(id);
        }
        p.then(data => {
            this.renderHead(data);
        }).catch(err => {
            this.warn.onError(err);
        });
    }

    renderHead(data) {
        this.header.setHeaderInfo(data);
        if (data && data.quoteBase) {
            this.baseQuote = data.quoteBase;
            this.baseQuote.quoteDepartmentName = data.quoteBase.quoteDepartmentName;
            this.baseQuote.quoteDepartmentId = data.quoteBase.quoteDepartmentId;
            // console.log("data version is:",this.baseQuote["dataVersion"]);
            this.header.setHeaderVersion(this.baseQuote["dataVersion"]);
        }
        if (data && data.designers) {
            this.designQuote = data.designers.filter(designer => designer['name'] = designer.memberName);
        }
        if (data && data.members) {
            this.memberQuote = data.members;
        }

        if (data && data.agreement) {
            this.agreement = data.agreement;
        }

        if (data && data.pauseState) {
            this.pauseState = data.pauseState;
        }

        // this.deviceQuote = {id:12,diviceNo:'1025556884458'};
        //绑定设备
        if (data && data.device) {
            this.deviceQuote = data.device;
        }
    }

    /**
     * 字符串长度截取
     * @param {string} name
     * @param {number} num
     * @param {string} replace
     * @returns {any}
     */
    subText(name: string, num: number, replace: string = '.') {
        if (name.length > num) {
            return name.substring(0, num) + replace.repeat(3);
        }
        return name;
    }


}
