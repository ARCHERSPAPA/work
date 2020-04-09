import {Component, OnInit} from '@angular/core';
import {atob, getCostStateName, getPayType, showSettleByState, toInteger} from "../../../../model/methods";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as UserValidate from "../../../../validate/user-validate";
import {Messages} from "../../../../model/msg";
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {ActivatedRoute} from '@angular/router';
import {QuoteService} from "../../../../service/quote.service";
import {SettleService} from "../../../../service/settle.service";
import * as DataSet from "@antv/data-set";

@Component({
    selector: 'rev-settle-detail-cost',
    templateUrl: './settle-detail-cost.component.html',
    styleUrls: ['./../../../detail/detail.scss', './../../settle.component.scss', './settle-detail-cost.component.scss']
})
export class SettleDetailCostComponent implements OnInit {

    //合同分期款
    public Cpays: any;

    //项目工种各款
    public Ipay: any;

    public costForm: FormGroup;
    public costVisible: boolean = false;

    public aid: string;
    public cid: string;

    public ellVisible: boolean = false;

    //图表渲染

    public height: number = 400;
    public data: any;
    public scale: any;
    public viewData: any;
    public itemTpl: any;
    public tooltip: any;
    public color: any;
    public style: any;
    public colors = new Array<any>();

    public costAccount: string;
    //备注
    public remarks:string = '';
    //结算备注
    public settlement:string = '';

    constructor(private fb: FormBuilder,
                private req: RequestService,
                private warn: WarningService,
                private quote: QuoteService,
                private settle: SettleService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {

        this.costForm = this.fb.group({
            costAccount: ['', [
                Validators.maxLength(300),
                // UserValidate.ValidateAccount
            ]]
        });

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["aid"]) {
                this.aid = atob(params["aid"]);
                this.renderData(this.aid);
            }
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
                this.quote.loadFinanceContract(this.cid)
                    .then(res => {
                        this.Cpays = res["pays"] ? res["pays"] : [];
                    })
                    .catch(err => {
                        this.warn.onMsgError(err);
                })
            }
        });

    }


    /**
     * 加载渲染数据信息
     * @param aid
     */
    renderData(aid) {
        this.loadCost(aid).then(res => {
            this.Ipay = res;
            this.renderChart(this.Ipay);
            this.renderPercent(this.Ipay);
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderChart(this.Ipay);
            this.renderPercent(this.Ipay);
        });
    }

    /**
     * 渲染图表信息
     * @param pay
     */
    renderChart(pay) {
        let data1 = [{type: "已收入", value: 0}, {type: "待收入", value: 0}];
        let data2 = [{type: "已支付", value: 0}, {type: "待支付", value: 0}];
        if (pay && pay.total) {
            if (pay.accepted) {
                data1[0].value = pay.total - pay.accepted >= 0 ? pay.accepted : pay.total;
            }
            let v1 = this.changeToInt(pay.total, 2) - this.changeToInt(data1[0].value, 2);
            data1[1].value = Number(v1 / Math.pow(10, 2));

            if (pay.labor) {
                data2[0].value = pay.total - pay.labor >= 0 ? pay.labor : pay.total;
            }
            let v2 = this.changeToInt(pay.total, 2) - this.changeToInt(data2[0].value, 2);
            data2[1].value = Number(v2 / Math.pow(10, 2));
        }
        let dv = new DataSet.View().source(data2);
        dv.transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent',
        });
        let data = dv.rows;

        let viewDv = new DataSet.View().source(data1);
        viewDv.transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent'
        });
        let viewData = viewDv.rows;

        // let tooltip = [
        //     'type*value', (type, value) => {
        //         return {
        //             name: type,
        //             value: value,
        //         };
        //     },
        // ];

        // let itemTpl = '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>';

        let color1 = ['type', ['#69C0FF', '#F5F5F5']];
        let color2 = ['type', ['#1890FF', '#F5F5F5']];

        this.data = data
        console.log(viewData);
        this.viewData = viewData;
        // this.tooltip = tooltip;
        // this.itemTpl = itemTpl;
        this.colors = [color1, color2];
    }

    /**
     * 计算百分比数据
     * @param pay
     */
    renderPercent(pay) {
        if (pay && pay.total > 0) {
            pay["laborCostPercentage"] = ((pay.laborCost / pay.total) * 100).toFixed(2) + '%';
            pay["materialCostPercentage"] = ((pay.materialCost / pay.total) * 100).toFixed(2) + '%';
        }
    }

    //支付类型判断
    getPayType(type) {
        return getPayType(type);
    }

    //显示弹出框
    showCostModal() {
        this.costVisible = true;
    }

    //弹出框取消
    costCancel() {
        this.costVisible = false;
    }

    //去结算项目成本
    costOk() {
        if (this.costForm.valid && this.aid) {
            let bankName = this.costForm.value.costAccount;
            this.req.doPost({
                url: "submitLabourExpensesSettle",
                data: {
                    ids: [this.aid],
                    bankName: bankName
                },
                success: (res => {
                    this.costCancel();
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.renderData(this.aid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    //加载详情页面数据
    loadCost(aid): Promise<any> {
        return new Promise((resolve, reject) => {
            if (aid) {
                this.req.doPost({
                    url: "costLabourExpensesSettle",
                    data: {id: aid},
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(res.data);
                        } else {
                            reject(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }
        })
    }

    //显示按钮与否
    showSettleByState() {
        if (this.Ipay) {
            return showSettleByState(this.Ipay.state);
        }
        return false;
    }

    //是否显示忽略与结算
    showSettleResultByState() {
        if (this.Ipay) {
            return this.Ipay.state === 4;
        }
        return false;
    }

    //查看成本
    viewCost() {
        this.req.doPostApp({
            url: "down",
            data: "url=" + this.Ipay.costUrl,
            success: (res => {
                if (res && res.code == 200) {
                    window.location.href = res.data;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    changeToInt(num, curve) {
        return toInteger(num, curve)
    }

    getCostState(state: number) {
        return getCostStateName(state);
    }
    //展示忽略弹窗
    showEllModal(){
        this.ellVisible = true;
    }
    //点击取消弹窗
    ellCancel(){
        this.ellVisible = false;
    }
    //点击确定忽略项目成本
    ellOk(){
        if (this.aid) {
            this.req.doPost({
                url: "rejectLabourExpensesSettle",
                data: {id: this.aid,remark: this.remarks},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.renderData(this.aid);
                        this.ellVisible = false;
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

}
