import { Component, OnInit } from '@angular/core';
import { btoa, equalZero, getMaterialState, getOrderByType } from "../../../../model/methods";
import { ArticleExceptionService } from "../article-exception.service";
import { Default, orderMaterialStatus } from "../../../../model/constant";
import { WarningService } from "../../../../service/warning.service";
import { plus } from "../../../../model/count";
import { Router, ActivatedRoute } from '@angular/router';
import { SettleMaterialWageService } from "../../../settle/settle-material/settle-material-wage/settle-material-wage.service";

@Component({
    selector: 'rev-article-exception-list',
    templateUrl: './article-exception-list.component.html',
    styleUrls: ['./article-exception-list.component.scss']
})
export class ArticleExceptionListComponent implements OnInit {

    public title: string;
    public radioSwitch: Array<any> = [
        {
            key: 1,
            text: '待审核'
        },
        {
            key: 2,
            text: '已审核'
        }
    ];
    //默认switch值
    public defaultSwitchRatio: any;
    //初始化查询条件
    public forms: Array<any> = [
        {
            type: "select",
            name: "orderState",
            placeholder: "请选择订单状态",
            data: orderMaterialStatus,
            cols: 4,
            value: null
        },
        {
            type: "select",
            name: "company",
            placeholder: "请选择材料商",
            data: null,
            cols: 4,
            value: null,
            search: true
        },
        {
            type: "group",
            name: "group",
            placeholder: "请输入",
            data: [
                { label: "楼盘名称", value: 0 },
                { label: "客户", value: 1 },
                { label: "工长", value: 2 },
                { label: "材料订单编号", value: 3 }
            ],
            cols: 8,
            value: {
                select: 0,
                text: null
            }
        },
        {
            type: "button",
            text: "查询",
            name: "search",
            cols: 1
        }
    ];

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public loading: boolean = false;

    //所有材料商信息
    public companyList: any;
    //查询时选择的材料商
    public company: any;
    //查询订单状态
    public orderState: string;
    //审核订单状态
    public auditState: number;
    //楼盘名称
    public name: string;
    //客户
    public customerName: string;
    //工长
    public workerName: string;
    //订单编号
    public orderNo: string;

    //所有查询后的异常订单数据
    public excepts: any;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private warn: WarningService,
        private articleExpService: ArticleExceptionService,
        private settleMaterialWageService: SettleMaterialWageService) {
    }

    ngOnInit() {
        this.title = "异常审核";
        //加载材料商
        this.getMaterialList();

        this.activatedRoute.queryParams.subscribe(params => {
            if (params) {
                this.auditState = params["type"] ? parseInt(params["type"]) : 1;
                this.defaultSwitchRatio = this.auditState === 1 ? this.radioSwitch[0] : this.radioSwitch[1];
                this.pageNo = params["page"] ? params["page"] : Default.PAGE.PAGE_NO;
                this.orderState = params["state"] ? params["state"] : null;
                //订单状态回显
                if (this.orderState) {
                    let index = this.forms[0].data.findIndex(d => d.id === this.orderState);
                    if (index > -1) {
                        this.forms[0].value = this.forms[0].data[index];
                    } else {
                        this.forms[0].value = this.forms[0].data[0];
                    }
                } else {
                    this.forms[0].value = this.forms[0].data[0];
                }

                this.company = params["company"] ? params["company"] : null;

                this.name = params["name"] ? params["name"] : null;
                if (this.name) {
                    this.forms[2].value.select = this.forms[2].data[0].value;
                    this.forms[2].value.text = this.name;
                }
                this.customerName = params["customerName"] ? params["customerName"] : null;
                if (this.customerName) {
                    this.forms[2].value.select = this.forms[2].data[1].value;
                    this.forms[2].value.text = this.customerName;
                }
                this.workerName = params["workerName"] ? params["workerName"] : null;
                if (this.workerName) {
                    this.forms[2].value.select = this.forms[2].data[2].value;
                    this.forms[2].value.text = this.workerName;
                }
                this.orderNo = params["orderNo"] ? params["orderNo"] : null;
                if (this.orderNo) {
                    this.forms[2].value.select = this.forms[2].data[3].value;
                    this.forms[2].value.text = this.orderNo;
                }
                this.changeData();
            }
        })
    }

    //拉取材料商接口数据
    getMaterialList() {
        this.settleMaterialWageService.getMaterialSupplierList()
            .then((data: any) => {
                if (data && data.length > 0) {
                    data.forEach(d => {
                        d["content"] = d.companyName
                    });
                    this.companyList = data;
                }
                this.companyList.unshift({ id: '', content: '全部材料商' });
                this.forms[1].data = this.companyList;
                // this.forms[1].value = this.forms[0].data[0];
                if (this.company) {
                    this.forms[1].value = this.forms[1].data.filter(d => d.id === parseInt(this.company))[0];
                }
            })
            .catch(err => {
                this.warn.onMsgError(err);
            });
    }

    handleSwitch(e) {
        // console.log("audit state is",e);
        this.auditState = e;
        this.forms[2].value.select = this.forms[2].data[0].value;
        this.forms[2].value.text = null;
        this.cleanSelectInfo();
        this.cleanInputInfo();
        this.resetData();
    }

    //回调输入项
    handleForm(e: any) {
        let that = this;
        if (e && e.name === this.forms[3].name) {
            if (e.value) {
                that.cleanInputInfo();
                let maps = e.value;
                if (maps && maps.size > 0) {
                    maps.forEach((map, key) => {
                        if (key === this.forms[2].name) {
                            that.getInfoBySwitch(map.select, map.text);
                        }
                    });
                    this.resetData();
                }
            }
        }
    }

    //回调选择项
    handleSelect(e: any) {
        if (e && e.name === this.forms[0].name) {
            this.orderState = e.value ? e.value.id : null;
            this.resetData();
        }
        else if (e && e.name === this.forms[1].name) {
            this.company = e.value ? e.value.id : null;
            this.resetData();
        }
    }

    //获取对应的传参
    getInfoBySwitch(type: number, info: string) {
        switch (type) {
            case this.forms[2].data[0].value:
                this.name = info;
                break;
            case this.forms[2].data[1].value:
                this.customerName = info;
                break;
            case this.forms[2].data[2].value:
                this.workerName = info;
                break;
            case this.forms[2].data[3].value:
                this.orderNo = info;
                break;
            default:
                break;
        }
    }

    resetData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changePage();
    }

    cleanInputInfo() {
        this.name = null;
        this.customerName = null;
        this.workerName = null;
        this.orderNo = null;
    }

    cleanSelectInfo() {
        this.orderState = null;
        this.forms[0].value = null;
        this.company = null;
        this.forms[1].value = null;
    }


    //回退分页还原
    changePage() {
        this.router.navigate(['./'],
            {
                queryParams: {
                    type: this.auditState,
                    state: this.orderState,
                    company: this.company,
                    name: this.name,
                    customerName: this.customerName,
                    workerName: this.workerName,
                    orderNo: this.orderNo,
                    page: this.pageNo
                }, relativeTo: this.activatedRoute
            });
    }

    //拉取数据
    changeData() {
        let params = {
            page: this.pageNo,
            pageSize: this.pageSize,
            audit: this.auditState ? this.auditState : 0
        };

        if (this.company) {
            params["materialId"] = this.company;
        }
        if (this.orderState) {
            params["state"] = this.orderState;
        }
        if (this.name) {
            params["name"] = this.name.trim();
        }
        if (this.customerName) {
            params["customerName"] = this.customerName.trim();
        }
        if (this.workerName) {
            params["memberName"] = this.workerName.trim();
        }
        if (this.orderNo) {
            params["materialOrderNo"] = this.orderNo.trim();
        }

        this.loading = true;
        this.articleExpService.getExpList(params)
            .then(data => {
                this.loading = false;
                this.excepts = data.list;
                this.total = data.total;
                // this.excepts.forEach(v => {
                //     delete v.customerHouseAddress
                // });
            })
            .catch(err => {
                this.loading = false;
                this.warn.onMsgError(err);
            })
    }


    //获取订单类型
    getOrderName(type: number) {
        return getOrderByType(type);
    }

    getMaterialState(state: number) {
        return getMaterialState(state);
    }

    computedTotal(total: number, fee: number) {
        return Number(plus(total, fee));
    }

    btoa(id) {
        return btoa(id);
    }

    equalZero(t: number) {
        return equalZero(t, '--');
    }
}
