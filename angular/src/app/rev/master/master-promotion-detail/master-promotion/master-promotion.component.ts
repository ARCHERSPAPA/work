import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {getPromotionState, getPromotionStateName} from "../../../../model/methods";
import {WarningService} from "../../../../service/warning.service";
import {ACTIVITY_STATE, Default} from "../../../../model/constant";
import {Router, ActivatedRoute} from '@angular/router';
import {MasterService} from "../../master.service";
import {MasterPromotionDetailService} from "../master-promotion-detail.service";

@Component({
    selector: 'rev-master-promotion',
    templateUrl: './master-promotion.component.html',
    styleUrls: ['./../master-promotion-detail.component.scss', './master-promotion.component.scss'],
    providers: [MasterService]
})
export class MasterPromotionComponent implements OnInit {

    //标题
    public title: string;
    //tab切换标签
    public radioSwitch: Array<any>;
    //默认tab标签
    public defaultRadioSwitch: any;

    //head 按钮
    public buttons: Array<any>;
    //具体活动
    public promotions: Array<any>;

    //选择checkbox
    public allChecked: boolean = false;
    //中间状态变化
    public indeterminate: boolean = false;
    //选中的数据
    public selectItems: Array<any> = [];


    //查询条件
    public state: number;
    public materialId: number;
    public activityName: string;
    public type: number = 1;
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;


    //所有的参与公司信息
    public companyes: any;
    //是否显示弹出框
    public isVisible: boolean = false;
    public form:any;

    //所有活动状态
    public activityStates: Array<any>;

    //数据table表格渲染
    public loading: boolean = false;


    constructor(private fb: FormBuilder,
                private warn: WarningService,
                private master: MasterService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private masterPromotion: MasterPromotionDetailService) {
    }

    ngOnInit() {
        this.title = "活动管理";

        this.buttons = [
            {
                name: "创建活动"
            }
        ];

        this.radioSwitch = [
            {
                key: 1,
                text: "已创建"
            },
            {
                key: 2,
                text: "审核中"
            },
            {
                key: 3,
                text: "已通过"
            },
            {
                key: 4,
                text: "未通过"
            },
        ];

        this.activityStates = ACTIVITY_STATE;


        // this.initData();


        this.getCompany();

        this.activatedRoute.queryParams.subscribe(params =>{

            this.type = params && params["type"]? Number(params["type"]): this.radioSwitch[0].key;

            this.defaultRadioSwitch = this.radioSwitch.find(rs => rs.key === this.type);

            this.pageNo = params && params["page"]? params["page"]: Default.PAGE.PAGE_NO;

            this.pageSize = params && params["pageSize"]? params["pageSize"]: Default.PAGE.PAGE_SIZE;

            this.state = params && params["state"] ? Number(params["state"]): null;

            this.materialId = params && params["materialId"] ? Number(params["materialId"]): null;

            this.activityName = params && params["activityName"]? params["activityName"]: null;

            this.changeData();

        })
    }




    getCompany() {
        this.master.getCompanys().then(res => {
            this.companyes = res;
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    //翻页
    changePage(){
        this.router.navigate(["./"],{
            queryParams:{
                type: this.type,
                page: this.pageNo,
                pageSize: this.pageSize,
                state: this.state,
                materialId: this.materialId,
                activityName: this.activityName
            },
            relativeTo: this.activatedRoute
        });
    }


    //加载数据
    changeData() {
        let params = {
            type: this.type,
            page: this.pageNo,
            pageSize: this.pageSize
        };
        if (this.state !== undefined && this.state !== null) {
            params["state"] = this.state;
        }

        if (this.materialId) {
            params["materialId"] = this.materialId;
        }

        if (this.activityName) {
            params["activityName"] = this.activityName;
        }

        this.loading = true;
        this.masterPromotion.listMasterPromotions(params).then(data =>{
            this.promotions = data.list;
            this.total = data.total;
            this.loading = false;
        }).catch(err =>{
            this.loading = false;
            this.warn.onMsgError(err);
        })

    }


    //数据置为原始值域
    resetData() {
        if(this.pageNo === Default.PAGE.PAGE_NO){
            this.indeterminate = false;
            this.allChecked = false;
            this.selectItems = [];
            this.changeData();
        }else{
            this.pageNo = Default.PAGE.PAGE_NO;
            this.total = Default.PAGE.PAGE_TOTAL;
            this.indeterminate = false;
            this.allChecked = false;
            this.selectItems = [];
            this.changePage();
        }
    }



    modelStateChange(e: any) {
        this.state = e;
        this.resetData();
    }

    modelCompanyChange(e: any) {
        this.materialId = e;
        this.resetData();
    }


    //删除该活动
    deletePromotions(...ids) {
        if (ids && ids.length > 0) {
            this.masterPromotion.deleteMasterPromotions({ids:ids}).then(msg =>{
                this.warn.onMsgSuccess(msg);
                this.resetData();
            }).catch(err =>{
                this.warn.onMsgError(err);
            })
        }
    }

    //提交该活动
    submitPromotions(ids: any) {
        if (ids && ids.length > 0) {
            this.masterPromotion.submitMasterPromotions({largeActivity: ids}).then(msg => {
                this.warn.onMsgSuccess(msg);
                this.resetData();
            }).catch(err => {
                this.warn.onModalInfo({
                    title: "温馨提示",
                    content: err,
                    ok: () => {
                        console.log("ok");
                    }
                })
            })
        }
    }

    /**
     * 下架或撤回该活动
     * @param type 1:撤回 2：下架
     * @param ids
     */
    backPromotions(type, ...ids) {
        if (ids && ids.length > 0) {
            this.masterPromotion.backMasterPromotions(
                {recallAndOut: type, ids: ids}).then(msg => {
                this.warn.onMsgSuccess(msg);
                this.resetData();
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }
    }

    //全选
    checkAll(e) {
        this.allChecked = e;
        // console.log("this all checked is", this.allChecked);
        this.promotions.forEach(p => {
            p.checked = this.allChecked;
        })
        this.refreshStatus();
    }

    refreshStatus() {
        const allCheck = this.promotions.every(p => p.checked === true);
        const allUnCheck = this.promotions.every(p => !p.checked);

        this.allChecked = allCheck;
        this.indeterminate = (!allCheck) && (!allUnCheck);

        this.selectItems = this.promotions.filter(p => p.checked);

    }

    //切换tab是使用
    handleSwitch(e) {
        this.type = e;
        this.state = null;
        this.materialId = null;
        this.activityName = null;
        this.resetData();
    }

    //处理title的按钮
    handleName(e) {
        if (e === this.buttons[0].name) {
            this.isVisible = true;
            this.form = {};
        }
    }

    // //新建活动
    // createActivity(){
    //     this.isVisible = true;
    // }


    handleCancel() {
        this.isVisible = false;
    }


    handleOk(form: any) {
        let params = {};
        params["activityName"] = form.name;
        params["materialId"] = form.companyId;
        params["startTime"] = new Date(form.startTime).getTime();
        if (form.endTime) {
            params["endTime"] = new Date(form.endTime).getTime();
        }
        if (form.remark) {
            params["remark"] = form.remark
        }

        this.masterPromotion.addMasterPromotion(params).then(msg =>{
             this.handleCancel();
             this.warn.onMsgSuccess(msg);
             //开启重载
             this.resetData();
        }).catch(err =>{
            this.handleCancel();
            this.warn.onMsgError(err);
        })

    }


    //根据状态显示
    getStateIsTrue(...state) {
        if (state && state.length > 0) {
            for (let key of state) {
                if (this.type === key) return true;
            }
        }
        return false;
    }

    //根据活动状态显示对应的文案信息
    getStatusName(status: number) {
        return getPromotionStateName(status);
    }

    getPromotionByTime(m: any) {
        return getPromotionState(m);
    }


    //单个提交审核
    submitItem(id: number, mid: number) {
        this.submitPromotions([{id: id, materialId: mid}]);
    }

    //单个删除
    deleteItem(id: number) {
        this.deletePromotions(id);
    }

    //单个撤回
    recallItem(id: number) {
        this.backPromotions(1, id);
    }

    //单个下架
    removeItem(id: number) {
        this.backPromotions(2, id);
    }

    //批量提交
    submitItems() {
        let ids = this.getPromotionByCheckedObj();
        this.submitPromotions(ids);
    }

    //批量删除
    deleteItems() {
        let ids = this.getPromotionByChecked();
        this.deletePromotions(...ids);
    }

    //查看详情
    detailItem(p: any) {
        this.router.navigate(["../detail"], {
            queryParams: {item: JSON.stringify(p)},
            relativeTo: this.activatedRoute,
            preserveFragment:true
        });
    }

    //批量撤回
    recallItems() {
        let ids = this.getPromotionByChecked();
        this.backPromotions(1, ...ids);
    }

    //批量下架
    removeItems() {
        let ids = this.getPromotionByChecked();
        this.backPromotions(2, ...ids);
    }

    cancel() {
        console.log("close confirm is true");
    }

    /**
     * 选择批量ids
     * @returns {any[]}
     */
    getPromotionByCheckedObj() {
        let ids = [];
        if (this.promotions && this.promotions.length > 0) {
            this.promotions.forEach(p => {
                if (p.checked) {
                    ids.push({
                        id: p.id,
                        materialId: p.materialId
                    });
                }
            })
        }
        return ids;
    }

    getPromotionByChecked() {
        let ids = [];
        if (this.promotions && this.promotions.length > 0) {
            this.promotions.forEach(p => {
                if (p.checked) {
                    ids.push(p.id);
                }
            })
        }
        return ids;
    }

}
