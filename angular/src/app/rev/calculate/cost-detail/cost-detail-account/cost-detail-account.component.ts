import {Component, OnInit, ElementRef} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemBasicComponent} from "../../../../plugins/item-basic/item-basic.component";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as UserValidate from '../../../../validate/user-validate';
import G2 from '@antv/g2/build/g2';
import {DataSet} from '@antv/data-set/build/data-set';

import {fadeAnimate} from "../../../../animation/transform.component";
import {WarningService} from "../../../../service/warning.service";
import {CostDetailService} from "../cost-detail.service";
import {Router, ActivatedRoute} from '@angular/router';
import {BRANCH_ITEMS, Default} from "../../../../model/constant";
import {HeaderService} from "../../../../service/header.service";
import {atob, equalZero, showItemInArray, subItemName} from "../../../../model/methods";
import {CostDetailAccountService} from "./cost-detail-account.service";
import {UserService} from "../../../../service/user.service";
import {Messages} from "../../../../model/msg";
import {ItemBasicCustomizeComponent} from "../../../../plugins/item-basic/item-basic-customize.component";
import {ItemPackComponent} from "../../../../plugins/item-pack/item-pack.component";
import {MasterPackService} from "../../../master/master-pack-detail/master-pack.service";
import { reverse } from 'core-js/fn/array';


@Component({
    selector: 'rev-cost-detail-account',
    templateUrl: './cost-detail-account.component.html',
    styleUrls: ['./../cost-detail.component.scss', './cost-detail-account.component.scss'],
    animations: [fadeAnimate]
})
export class CostDetailAccountComponent implements OnInit {

    //渲染数据时
    public listOfData: any;
    public loading: boolean = false;
    //设计费数据
    public designData: any;
    //数据移动时的菜单
    public moveMenus: any;

    //存储数据
    public storeData: any;

    //报价id
    public cid: number;
    //增减项id
    public pid: number;
    //上传状态
    public state: number = 0;

    public pageSize: number = Default.PAGE.PAGE_SIZE_5;

    // public infoNames = ["套餐", "主材", "个性化项目", "设计费","增减项目"];
    // public infoBranceNames = ["主卧", "客卧", "卫生间", "餐厅","其它"];

    public branchItems: Array<any> = BRANCH_ITEMS;
    //默认选择细项
    public branchType: number = BRANCH_ITEMS[0].value;

    public sumTotal: number = 0;

    public filterName: Array<any> = [
        {text: '装修类型', value: '1'},
        {text: '主材', value: '2'},
        {text: '材料清单', value: '3'},
        {text: '个性化项目', value: '4'},
        {text: '其它项目', value: '5'},
        {text: '增减项目', value: '6'},
        {text: '代购', value: '8'},
    ];

    public itemNames: Array<any> = [
        {text: '项目编号', value: '1'},
        {text: '品牌', value: '2'},
        {text: '规格', value: '3'},
        {text: '型号', value: '4'},
        {text: '序号', value: '5'},
    ];
    //全屏时使用
    // public itemFullNames: Array<any> = [
    //     {text: '项目编号', value: '1', byDefault: true},
    //     {text: '品牌', value: '2', byDefault: true},
    //     {text: '规格', value: '3', byDefault: true},
    //     {text: '型号', value: '4', byDefault: true},
    //     {text: '序号', value: '5', byDefault: true},
    // ]

    //控制显示与否
    public itemBool: Array<any> = [
        {key: "1", value: true},
        {key: "2", value: true},
        {key: "3", value: true},
        {key: "4", value: true},
        {key: "5", value: true}
    ];
    //全屏时使用，同上使用
    public itemFullBool: Array<any> = [
        {key: "1", value: true},
        {key: "2", value: true},
        {key: "3", value: true},
        {key: "4", value: true},
        {key: "5", value: true}
    ];


    //创建或者修改大类（大项）
    public modify: boolean = false;
    public isVisible: boolean = false;

    public editIndex: number;
    public editId: any;
    public editBranch: any;

    //类名
    public branchInfo: string;
    public branchForm: FormGroup;

    //修改套餐
    public packForm: FormGroup;
    public isPackVisible: boolean = false;
    public packNum: number;
    // public packPrice: number;
    public packItem: any;

    //图形渲染
    // public data: any;
    // public tooltip: any;
    // public color: any;
    // public itemTpl: any;
    public chart: any;

    //数据(毛利：profit,总成本：finalCost,材料成本：materialCost,人工成本：laborCost,工程总费：finalPrice,代购材料：procurementPrice,代购人工：procurementLaborCost)
    public profit: number = 0;
    public finalCost: number = 0;
    public finalPrice: number = 0;
    public materialCost: number = 0;
    public laborCost: number = 0;
    public purchaseCost: number = 0;
    public procurementPrice: number = 0;
    public procurementLaborCost: number = 0;
    //人工具体细项成本(木工：carpentryCost,泥工：tilerCost,漆工：painterCost,水电工：plumberCost)
    public carpentryCost: number = 0;
    public tilerCost: number = 0;
    public painterCost: number = 0;
    public plumberCost: number = 0;
    public percentTotal: number = 0;
    //特效动画
    public switch: boolean = true;

    //预算锁定状态
    public lockState: boolean = false;
    //获取header中的报价详情中的基础信息
    public baseQuote: any;
    //增减项目是否已完成
    public pauseCompleted: boolean = false;

    //项目备注、折扣信息
    // public costBrief = {
    //     remark: null,
    //     afterDiscount: null,
    //     totalDiscount: null
    // }
    public remark: string = "";
    public afterDiscount: number;
    public totalDiscount: number;
    // 代购金额
    public procurementMoney: number = 0; 

    //修改或者展示损耗比率时
    formatterPercent = value => `${value ? value : 0} %`;
    parserPercent = value => value.replace(' %', '');


    //屏幕放大设置
    public isFullScreen: boolean = false;
    //全屏时修改或者新增大项
    public isFullVisible: boolean = false;
    //全屏放大后选择细项目列表弹出框
    public isFullItemsVisible: boolean = false;
    public fullInfo: any;
    public fullIndex: any;
    public fullData: any;
    //全屏时的套餐选择
    public isFullPackVisible: boolean = false;
    public fullPackBranch: any;
    public fullPackItem: any;

    //控制成本是否在从审核列表页进入
    public sp: number;
    //数据来源
    public sourceInfo: number = Default.SOURCE.COST;
    
    // 参与活动
    public activityVisible = false;
    public activityItem:any;
    public activityList:Array<any> = [];

     // 弹出代购金额弹窗
    public priceVisible: boolean = false;
    public priceForm: FormGroup;

    // 其它金额弹窗
    public otherPriceVisible:boolean = false;
    public priceList:Array<any> = [];
    public priceCostList:Array<any> = [];
    public priceTotal:Number = 0;


    constructor(private modalService: NgbModal,
                private fb: FormBuilder,
                private costDetail: CostDetailService,
                private warn: WarningService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private header: HeaderService,
                private costDetailAccount: CostDetailAccountService,
                private user: UserService,
                private masterPack: MasterPackService,
                private el: ElementRef) {
    }

    ngOnInit(): void {

        this.sp = Number(this.activatedRoute.snapshot.params["state"]);

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['cid']) {
                this.cid = Number(atob(params['cid']));
                // this.getInfoAmount(this.cid);
                this.getExcludeInfo();
            }

            if (params && params['pid']) {
                this.pid = Number(atob(params['pid']));
                this.renderDetail(this.pid);
            } else {
                this.getCostInfo(this.cid);
            }
        });


        this.branchForm = this.fb.group({
            branchInfo: [this.branchInfo, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                UserValidate.ValidateAccount
            ]]
        });


        this.packForm = this.fb.group({
            packNum: ['', [
                Validators.required
            ]]
            // packPrice: ['', [
            //     Validators.required,
            //     Validators.min(0.01)
            // ]]
        })

        this.priceForm = this.fb.group({
            price: ['', [
                Validators.required
            ]]
        })
    }


    ngDoCheck() {
        if (this.header.getHeaderInfo() && this.header.getHeadBool()) {
            this.baseQuote = this.header.getHeaderInfo()['quoteBase'];
        }
        // openBranch(this.moveMenus);
    }


    /**
     * 锁定预算
     * @param {boolean} lock true:锁定，false:解锁
     */
    lockBudget(lock: boolean) {
        this.costDetail.lockBudget(lock, this.cid).then(data => {
            this.warn.onMsgSuccess(data);
            if (this.pid) {
                this.renderDetail(this.pid);
            }
            this.getCostInfo(this.cid);
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    /**
     * 显示锁定时的提示文案信息
     * @returns {string}
     */
    showTitle() {
        if (this.baseQuote && this.baseQuote.confirmState !== 2 && !this.pauseCompleted) {
            return '客户尚未确认预算，且正在在进行增减项，是否继续锁定';
        } else if (this.baseQuote && this.baseQuote.confirmState !== 2) {
            return '客户尚未确认预算，是否继续锁定';
        } else if (!this.pauseCompleted) {
            return '预算正在进行增减项，是否锁定预算';
        } else {
            return '锁定预算后，设计师将无法编辑预算';
        }
    }

    /**
     * 显示锁定时的提交按钮文案
     * @returns {string}
     */
    showText() {
        if (this.baseQuote && this.baseQuote.confirmState !== 2 && !this.pauseCompleted) {
            return '锁定';
        } else if (this.baseQuote && this.baseQuote.confirmState !== 2) {
            return '锁定';
        } else if (!this.pauseCompleted) {
            return '锁定';
        } else {
            return '确定';
        }
    }
    /**
     * 渲染chart 拉取详情
     * @param pid
     */
    renderDetail(pid) {
        this.costDetail.getCostDetail(pid).then(data => {
            this.lockState = data.lockBudget ? true : false;
            this.pauseCompleted = data.pauseCompleted;
            this.state = data.cost && data.cost.state ? data.cost.state : 0;
            this.remark = data.cost && data.cost.costRemark ? data.cost.costRemark : null;
            this.getCostInfo(this.cid);
        }).catch(err => {
            this.warn.onMsgError(err);
        });
    }

    /**
     * 渲染当前的数值
     * @param cost
     */
    renderCost(cost: any) {
        this.afterDiscount = cost && cost.giveAwayDiscount ? cost.giveAwayDiscount : null;
        this.totalDiscount = cost && cost.totalDiscount ? cost.totalDiscount : null;
        this.procurementMoney = cost && cost.procurementMoney ? cost.procurementMoney : 0;
        this.finalPrice = cost.finalPrice ? cost.finalPrice : 0;
        this.procurementPrice = cost.procurementPrice ? cost.procurementPrice : 0;
        this.procurementLaborCost = cost.procurementLaborCost ? cost.procurementLaborCost : 0;
        this.materialCost = cost.materialPrice ? cost.materialPrice : 0;
        this.purchaseCost = cost.procurementPrice ? cost.procurementPrice : 0;
        this.laborCost = this.getCostTotal(cost, ["carpenterPrice", "jpannerPrice", "masonPrice", "utilityCharge", "designerPrice"])
        this.carpentryCost = cost.carpenterPrice ? cost.carpenterPrice : 0;
        this.tilerCost = cost.masonPrice ? cost.masonPrice : 0;
        this.painterCost = cost.jpannerPrice ? cost.jpannerPrice : 0;
        this.plumberCost = cost.utilityCharge ? cost.utilityCharge : 0;
        // this.purchaseCost
        this.finalCost = (this.materialCost + this.laborCost);
        this.priceCostList = cost && cost.excludeCostList ? cost.excludeCostList:[];
        if(this.priceCostList && this.priceCostList.length > 0){
            let total = 0;
            this.priceCostList.forEach(item=>{
                total += item.price * Math.pow(10, 2)
            })
            this.priceTotal = Number((total / Math.pow(10, 2)).toFixed(2));
        }else{
            this.priceTotal = 0;
        }
        this.profit = (this.finalPrice * 100 - this.finalCost * 100 - this.procurementMoney * 100 - Number(this.priceTotal) * 100) / 100;
        // 用来计算占比
        this.percentTotal = (this.finalPrice * 100 - this.procurementMoney * 100 - Number(this.priceTotal) * 100) / 100;
        if (this.chart) {
            this.chart.clear();
        }

        const container = this.el.nativeElement.querySelector('#container');
        if(container){
            this.renderChart(container,this.finalCost, this.percentTotal);
        }

    }

    /**
     * 计算人工总成本
     * @param cost
     * @param {Array<string>} types
     * @returns {number}
     */
    getCostTotal(cost: any, types: Array<string>) {
        let total = 0;
        if (types && types.length > 0) {
            for (let i = 0; i < types.length; i++) {
                total += (cost[types[i]] ? cost[types[i]] : 0);
            }
        }
        return total;
    }

    /**
     * 计算增减项目中套餐的合计
     * @param {number} pid
     * @param {Array<any>} branch
     */
    getPackTotal(pid: number, branch: any) {
        let total = 0;
        if (pid && branch["infos"] && branch["infos"].length > 0) {
            let find = branch["infos"].filter(info => {
                return info["planFlag"] === 2 && info["costPlanId"] === pid;
            });
            // console.log("find data",find);
            if (find && find.length > 0) {
                total = find.reduce((total, fi) => {
                    let num = fi["num"] ? fi["num"] : 0;
                    let price = fi["unitPrice"] ? fi["unitPrice"] : 0;
                    return total + this.computedSingleTotal(num,price);
                    // let rate = fi["wastageRate"] ? Number(fi["wastageRate"]) / 100 : 0;
                    // let mid = this.computedSingleTotal(num, price);
                    // return total + mid + this.computedSingleTotal(rate, mid);
                },0)
            }
        }
        return total;
    }


    /**
     * 根据报价id 拉取当前成本数据
     * @param {number} cid
     */
    getCostInfo(cid: number) {
        this.loading = true;
        this.costDetailAccount.getCostDetailAccount(cid).then(data => {
            this.loading = false;
            if (data.list && data.list.length > 0) {
                //设计费
                const designData = data.list.filter(d => d.infoType === 7);
                if (designData && designData.length > 0) {
                    this.designData = designData[0].infoMaps[0].infos;
                }
                //除设计费的其它
                const showData = data.list.filter(d => d.infoType !== 7);
                showData.forEach(d => {
                    if (d.infoMaps && d.infoMaps.length > 0) {
                        d.infoMaps.forEach(m => m["pageNo"] = 1);
                    }
                });
                const initData = [{
                    infoType: 1,
                    name: "装修类型",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 2,
                    name: "主材",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 3,
                    name: "材料清单",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 4,
                    name: "个性化项目",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 5,
                    name: "其它项目",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 6,
                    name: "增减项目",
                    infoMaps: [],
                    rows: 2
                }, {
                    infoType: 8,
                    name: "代购",
                    infoMaps: [],
                    rows: 2
                }];

                // this.listOfData = initData;
                this.listOfData = this.computedData(this.uniqueData(initData, showData));

                this.moveMenus = this.computedMove(this.listOfData);
                this.storeData = this.listOfData;
            }
            //加载成本价格数据
            this.getInfoAmount(this.cid);
        }).catch(err => {
            this.loading = false;
            this.warn.onMsgError(err);
        })
    }

    /**
     * 初始化基础数据（可能存在没有细项的大类时初始基础名称）
     * @param target
     * @param source
     * @returns {any}
     */
    uniqueData(target, source) {
        for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < source.length; j++) {
                if (target[i].infoType === source[j].infoType) {
                    target[i] = source[j];
                    break;
                }
            }
        }
        return target;
    }


    /**
     * 更新现有的成本项目数据
     * @param params
     * @param type:区别输入值的判断
     */
    updateCostDetail(params: any, item: any, type: number = 0) {
        this.costDetailAccount.getCostDetailUpdate(params).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getInfoAmount(this.cid);
            if (item && item.infoType !== 7) {
                item["wastagePrice"] = equalZero(Number(params["wastagePrice"]), "无") === "无" ? 0 : params["wastagePrice"];
            }
            //重构当前item数据
            if (type === 1) {
                item["numFormula"] = params["numFormula"];
                item["num"] = params["num"];
            } else if (type === 2) {
                item["unitPriceFormula"] = params["unitPriceFormula"];
                item["unitPrice"] = params["unitPrice"];
            } else if (type === 3) {
                item["wastageRateFormula"] = params["wastageRateFormula"];
                item["wastageRate"] = params["wastageRate"];
                // item["wastagePrice"] = params["wastagePrice"];
            }
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid);
        });
    }

    /**
     * 数量变化时
     * @param item
     */
    // modelItemChange(item: any) {
    //     this.updateCostDetail({
    //         infoType: item.infoType,
    //         num: item.num,
    //         quoteId: this.cid,
    //         id: item.id,
    //         wastagePrice: this.computeWastage(item.num, item.unitPrice, item.wastageRate)
    //     }, item);
    // }

    changeItemNum(e: any, item: any) {
        this.updateCostDetail({
            infoType: item.infoType,
            num: e.num,
            numFormula: e.formula,
            quoteId: this.cid,
            id: item.id,
            wastagePrice: this.computeWastage(e.num, item.unitPrice, item.wastageRate)
        }, item, 1);
    }

    /**
     * 材料的单价变化时
     * @param item
     */
    // modelPriceChange(item: any) {
    //     this.updateCostDetail({
    //         infoType: item.infoType,
    //         unitPrice: item.unitPrice,
    //         quoteId: this.cid,
    //         id: item.id,
    //         wastagePrice: this.computeWastage(item.num, item.unitPrice, item.wastageRate)
    //     }, item);
    // }
    changeItemPrice(e: any, item: any) {
        this.updateCostDetail({
            infoType: item.infoType,
            unitPrice: e.num,
            unitPriceFormula: e.formula,
            quoteId: this.cid,
            id: item.id,
            wastagePrice: this.computeWastage(item.num, e.num ? e.num : 0, item.wastageRate)
        }, item, 2);
    }

    /**
     * 材料损耗变化时
     * @param item
     */
    // modelWastageRateChange(item: any) {
    //     this.updateCostDetail({
    //         infoType: item.infoType,
    //         wastageRate: item.wastageRate ? item.wastageRate : 0,
    //         quoteId: this.cid,
    //         id: item.id,
    //         wastagePrice: this.computeWastage(item.num, item.unitPrice, item.wastageRate)
    //     }, item);
    // }
    changeItemWastegeRate(e: any, item: any) {
        this.updateCostDetail({
            infoType: item.infoType,
            wastageRate: e.num ? e.num : 0,
            wastageRateFormula: e.formula,
            quoteId: this.cid,
            id: item.id,
            wastagePrice: this.computeWastage(item.num, item.unitPrice, e.num ? e.num : 0)
        }, item, 3)
    }


    // modelLabourChange(item: any, type: string) {
    //     console.log("labour item is", item);
    //     let params = {
    //         infoType: item.infoType,
    //         quoteId: this.cid,
    //         id: item.id
    //     };
    //     switch (type) {
    //         case "carpenter":
    //             params["carpenterPrice"] = item["carpenterPrice"];
    //             break;
    //         case "mason":
    //             params["masonPrice"] = item["masonPrice"];
    //             break;
    //         case "japanner":
    //             params["japannerPrice"] = item["japannerPrice"];
    //             break;
    //         case "utility":
    //             params["utilityCharge"] = item["utilityCharge"];
    //             break;
    //     }
    //     this.updateCostDetail(params, item);
    // }
    changeLaborNum(e: any, item: any, type: string) {
        console.log("labor is params in :", e);
        let params = {
            infoType: item.infoType,
            quoteId: this.cid,
            id: item.id
        };
        switch (type) {
            case "carpenter":
                item[type + "Formula"] = e && e.formula ? e.formula : null;
                item[type + "Price"] = e && e.num ? e.num : 0;
                params[type + "Formula"] = item[type + "Formula"];
                params[type + "Price"] = item[type + "Price"];
                break;
            case "mason":
                item[type + "Formula"] = e && e.formula ? e.formula : null;
                item[type + "Price"] = e && e.num ? e.num : 0;
                params[type + "Formula"] = item[type + "Formula"];
                params[type + "Price"] = item[type + "Price"];
                break;
            case "japanner":
                item[type + "Formula"] = e && e.formula ? e.formula : null;
                item[type + "Price"] = e && e.num ? e.num : 0;
                params[type + "Formula"] = item[type + "Formula"];
                params[type + "Price"] = item[type + "Price"];
                break;
            case "utility":
                item["utilityChargeFormula"] = e && e.formula ? e.formula : null;
                item["utilityCharge"] = e && e.num ? e.num : 0;
                params["utilityChargeFormula"] = item["utilityChargeFormula"];
                params["utilityCharge"] = item["utilityCharge"];
                break;
            default:
                break;
        }
        console.log("submit params is", params);
        this.updateCostDetail(params, item);
    }

    /**
     * 输入备注信息发生变化时触发
     * @param e
     */
    modelRemarkChange(e: any) {
        console.log("remark is : ", e);
        this.updateCostBrief({
            quoteId: this.cid,
            costRemark: this.remark ? this.remark.trim() : ''
        });
    }

    /**
     * 折扣
     * @param {number} type
     * @param {number} price 代购金额
     */
    modelDiscountChange(type: number,price = 0,...args) {
        let params = {quoteId: this.cid};
        if (type === 1) {
            console.log("after discount is", this.afterDiscount)
            params["giveAwayDiscount"] = this.afterDiscount;
        } else if(type === 2) {
            params["totalDiscount"] = this.totalDiscount;
        }else{
            params["procurementMoney"] = price;
        }
        if(args && args.length > 0){
            this.updateCostBrief(params,args);
        }else{
            this.updateCostBrief(params);
        }
    }


    /**
     * 设计费费率变化时调动
     * @param data
     */
    modelRateChange(data: any) {
        this.updateCostDetail({
            infoType: data.infoType,
            quoteId: this.cid,
            id: data.id,
            designerRate: data.designerRate
        }, data)
    }


    //跨模块移动时
    moveItem(item: any, menu: any, ...args) {
        const params = {
            infoType: menu.infoType,
            quoteId: this.cid,
            infoName: menu.name,
            cost: {
                id: item.id
            }
        };
        if (menu.infoType === 8) {
            params["cost"]["category"] = "代购项";
        } else {
            if (menu.id) {
                params["categoryId"] = menu.id;
            } else {
                if (args && args.length > 0 && args[0]) {
                    params["categoryId"] = args[0];
                } else {
                    params["cost"]["category"] = "未命名大项";
                }
            }
        }


        let find = this.findMoveItemFirst(params["infoType"], params["categoryId"]);
        if (find && find["id"]) {
            params["sort"] = find["sort"];
        }

        this.moveItemByParams(params);
    }

    /**
     * 查找移动到大项中的第一项数据
     * @param {number} type
     * @param {number} mid
     * @returns {any}
     */
    findMoveItemFirst(type: number, mid: number) {
        if (this.listOfData && this.listOfData.length > 0) {
            let findItem = this.listOfData.filter(list => list.infoType === type);
            if (findItem && findItem.length > 0) {
                if (findItem[0]["infoMaps"] && findItem[0]["infoMaps"].length > 0) {
                    let find = findItem[0].infoMaps.filter(f => f.categoryId === mid);
                    if (find && find.length > 0) {
                        if (find[0]["infos"] && find[0]["infos"].length > 0)
                            return find[0]["infos"][0];
                    }
                }
            }
            return null;
        }
        return null;
    }

    //向上移动（同模块）
    moveItemUp(branch: any, index: number) {
        if (branch["infos"] && branch.infos.length > 0) {
            let params = {};
            if (branch.infos[index].sort != branch.infos[index - 1].sort) {
                let find = this.findPackPos(branch.infos, branch.infos[index - 1].planId, true);
                if (find) {
                    params = {
                        id: branch.infos[index].id,
                        switchId: find.id,
                        sort: branch.infos[index].sort,
                        switchSort: find.sort,
                        quoteId: this.cid
                    }
                } else {
                    params = {
                        id: branch.infos[index].id,
                        switchId: branch.infos[index - 1].id,
                        sort: branch.infos[index].sort,
                        switchSort: branch.infos[index - 1].sort,
                        quoteId: this.cid
                    };
                }
            } else {
                params = {
                    id: branch.infos[index].id,
                    switchId: branch.infos[index - 1].id,
                    sort: branch.infos[index].sort,
                    switchSort: branch.infos[index - 1].sort,
                    quoteId: this.cid
                };
            }
            // console.log("move up item is:",params);
            this.moveItemByParams(params);

        }
        else {
            this.warn.onMsgWarn(Messages.SWITCH_POS.NO_MOVE);
        }

        // }
    }

    //向下移动（同模块）
    moveItemDown(branch: any, index: number) {
        if (branch["infos"] && branch.infos.length > 0) {
            if (branch.infos[index].sort != branch.infos[index + 1].sort) {
                let params = {};
                if (!branch.infos[index + 1]["sort"]) {
                    let find = this.findPackPos(branch.infos, branch.infos[index + 1].planId, false);
                    if (find) {
                        params = {
                            id: branch.infos[index].id,
                            switchId: find.id,
                            sort: branch.infos[index].sort,
                            switchSort: find.sort,
                            quoteId: this.cid
                        }
                    } else {
                        params = {
                            id: branch.infos[index].id,
                            switchId: branch.infos[index + 1].id,
                            sort: branch.infos[index].sort,
                            switchSort: branch.infos[index + 1].sort,
                            quoteId: this.cid
                        };
                    }
                } else {
                    params = {
                        id: branch.infos[index].id,
                        switchId: branch.infos[index + 1].id,
                        sort: branch.infos[index].sort,
                        switchSort: branch.infos[index + 1].sort,
                        quoteId: this.cid
                    };
                }
                // console.log("move item down is",params);
                this.moveItemByParams(params);
            } else {
                this.warn.onMsgWarn(Messages.SWITCH_POS.NO_MOVE);
            }

        }
    }

    /**根据套餐的id来定位套餐中的首相或末项
     * @param {Array<any>} infos
     * @param {number}  pid 套餐id
     * @param {boolean} pos true:查首相; false:查末项
     * @returns {{}}
     */
    findPackPos(infos: Array<any>, pid: number, pos: boolean) {
        let packs = [], find = null;
        for (let i = 0; i < infos.length; i++) {
            if (infos[i].planFlag === 2 && infos[i].planId === pid) {
                packs.push(infos[i]);
            }
        }

        if (packs && packs.length > 0) {
            if (pos) {
                find = packs[1];
            } else {
                find = packs[packs.length - 1];
            }
        }
        return find;
    }

    //置顶（同模块）
    moveItemTop(branch: any, index: number) {
        if (branch["infos"] && branch.infos.length > 0) {
            // if (branch.infos[index].sort != branch.infos[0].sort) {
            let top = this.findBranchFirstHaveSort(branch);
            // console.log("top in here",top);
            if (top) {
                this.moveItemByParams({
                    id: branch.infos[index].id,
                    switchId: top.id,
                    sort: branch.infos[index].sort,
                    switchSort: top.sort,
                    direction: 0,
                    quoteId: this.cid
                })
            } else {
                this.moveItemByParams({
                    id: branch.infos[index].id,
                    switchId: branch.infos[0].id,
                    sort: branch.infos[index].sort,
                    switchSort: branch.infos[0].sort,
                    direction: 0,
                    quoteId: this.cid
                })
            }

            // }
            // else {
            //     this.warn.onMsgWarn(Messages.SWITCH_POS.NO_MOVE);
            // }
        }
    }

    /**
     * 查找第一个的sort
     * @param branch
     * @returns {any}
     */
    findBranchFirstHaveSort(branch: any) {
        if (branch && branch.infos && branch.infos.length > 0) {
            let index = 0;
            for (let i = 0; i < branch.infos.length; i++) {
                if (branch.infos[i]["id"] && branch.infos[i]["sort"]) {
                    index = i;
                    break;
                }
            }
            return branch.infos[index];
        }

        return null;
    }

    /**
     * 移动相应的细项到对应的模块中去
     * @param params
     */
    moveItemByParams(params: any) {
        this.costDetailAccount.setCostDetailMove(params).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getCostInfo(this.cid);


        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid);
        })
    }


    /**
     * 插入细项
     * @param {number} type(1：项目，2:主材，3：辅材，4：暂定软材，5：自定义)
     * @param branchInfo
     * @param data
     */
    insertItem(type: number, branchInfo: any, i: number, data: any) {
        // let bowList = [];
        if (type !== Default.COST_ACCOUNT.ITEM_5) {
            const modal = this.modalService.open(ItemBasicComponent,
                {
                    centered: true,
                    keyboard: true,
                    size: "lg"
                });
            modal.componentInstance.type = type;
            modal.componentInstance.sourceInfo = this.sourceInfo;
            //固定版本为最新
            modal.componentInstance.dataVersion = 1;

            modal.result.then(res => {
                if (res && res.length > 0) {
                    // let list = this.computedParamsToAdd(res, data["infoName"]);
                    // if (branchInfo["infos"] && branchInfo["infos"].length > 0) {
                    //     for (let j = i + 1; j < branchInfo.infos.length; j++) {
                    //         bowList.push(branchInfo.infos[j].id);
                    //     }
                    // }
                    //
                    // let params = {
                    //     quoteId: this.cid,
                    //     list: list,
                    //     infoType: data["infoType"],
                    //     sort: data["sort"],
                    //     belowIdList: bowList
                    // };
                    // if (branchInfo && branchInfo["categoryId"]) {
                    //     params["categoryId"] = branchInfo["categoryId"];
                    // } else {
                    //     params["category"] = branchInfo["name"];
                    // }
                    //
                    // this.costDetailAccount.addCostDetailBranch(params).then(msg => {
                    //     this.warn.onMsgSuccess(msg);
                    //     this.getCostInfo(this.cid);
                    // }).catch(err => {
                    //     this.warn.onMsgError(err);
                    //     this.renderDetail(this.pid);
                    // })
                    this.submitCostDetailItem(res, branchInfo, i, data);
                }
            }, (rea) => {
                console.log(rea);
            })
        }
        else {
            const modal = this.modalService.open(ItemBasicCustomizeComponent,
                {
                    centered: true,
                    keyboard: true,
                    size: "lg"
                });

            modal.result.then(res => {
                if (res && res.length > 0) {
                    // let list = this.computedParamsToAdd(res, data["infoName"]);
                    // // list.forEach(item =>{
                    // //     if(data["sort"]){
                    // //         item["sort"] = last?(data["sort"] - 1):data["sort"];
                    // //     }
                    // //     return item;
                    // // })
                    // if (branchInfo["infos"] && branchInfo["infos"].length > 0) {
                    //     for (let j = i + 1; j < branchInfo.infos.length; j++) {
                    //         bowList.push(branchInfo.infos[j].id);
                    //     }
                    // }
                    // let params = {
                    //     quoteId: this.cid,
                    //     list: list,
                    //     infoType: data["infoType"],
                    //     sort: data["sort"],
                    //     belowIdList: bowList
                    // };
                    // if (branchInfo && branchInfo["categoryId"]) {
                    //     params["categoryId"] = branchInfo["categoryId"];
                    // } else {
                    //     params["category"] = branchInfo["name"];
                    // }
                    // // console.log("params is:",params);
                    //
                    // this.costDetailAccount.addCostDetailBranch(params).then(msg => {
                    //     this.warn.onMsgSuccess(msg);
                    //     this.getCostInfo(this.cid);
                    //     // this.getInfoAmount(this.cid);
                    // }).catch(err => {
                    //     this.warn.onMsgError(err);
                    //     this.renderDetail(this.pid);
                    // })
                    this.submitCostDetailItem(res, branchInfo, i, data);
                }
            }, (rea) => {
                console.log(rea);
            })
        }
    }

    insertFullItem(type: number, branchInfo: any, index: number, data: any) {
        this.branchType = type;
        this.isFullItemsVisible = true;
        this.fullInfo = branchInfo;
        this.fullIndex = index;
        this.fullData = data;
    }


    /**
     * 插入细项到具体某一项的下面
     * @param data 当前需要插入的数据
     * @param item
     * @param {number} index 当前索引
     * @param branch
     */
    submitCostDetailItem(data: any, item: any, index: number, branch: any) {
        console.log("branch data", branch);
        let list = this.computedParamsToAdd(data, branch["infoName"]);
        let bowList = [];
        if (item["infos"] && item["infos"].length > 0) {
            for (let j = index + 1; j < item.infos.length; j++) {
                bowList.push(item.infos[j].id);
            }
        }
        let params = {
            quoteId: this.cid,
            list: list,
            infoType: branch["infoType"],
            sort: branch["sort"],
            belowIdList: bowList
        };
        if (item && item["categoryId"]) {
            params["categoryId"] = item["categoryId"];
        } else {
            params["category"] = item["name"];
        }
        // console.log("params is:",params);

        this.costDetailAccount.addCostDetailBranch(params).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getCostInfo(this.cid);
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid);
        })
    }


    insertItemByPack(branch: any, item: any) {
        const modal = this.modalService.open(ItemPackComponent, {
            centered: true,
            keyboard: true,
            size: 'lg'
        });
        modal.componentInstance.type = 2;
        modal.result.then(data => {

            //过滤掉可拆分与不可拆分数据
            // let source = this.seprateDataSort(data);
            // let plans = [], plan1 = [], plan2 = [];
            // //不可拆分的数据整理
            // if (source.inseparable && source.inseparable.length > 0) {
            //     let inseparableData = this.masterPack.computedPackNumByGroup(source.inseparable, "id");
            //     plan1 = this.computedPackData(inseparableData, branch, item);
            //
            // }
            //
            // //可拆分数据整理
            // if (source.separable && source.separable.length > 0) {
            //     let separableData = this.masterPack.computedPackNumByGroup2(source.separable, "id");
            //     plan2 = this.computedPackData(separableData, branch, item);
            //     console.log("render plan2 is:", plan2);
            // }
            // plans = plan1.concat(plan2);
            //
            // this.costDetailAccount.getCostDetailAddPack({plans: plans}).then(msg => {
            //     this.warn.onMsgSuccess(msg);
            //     this.getInfoAmount(this.cid);
            //     this.renderDetail(this.pid)
            // }).catch(err => {
            //     this.warn.onMsgError(err);
            // })
            if (data && data.length > 0) {
                this.submitCostDetailPacks(data, branch, item);
            }
        }, (rea) => {
            console.log("reason in here", rea);
        })
    }


    insertItemFullByPack(branch: any, item: any) {
        this.isFullPackVisible = true;
        this.fullPackBranch = branch;
        this.fullPackItem = item;
    }

    handleDetailPackOk(e: any) {
        if (e && e.length > 0) {
            this.submitCostDetailPacks(e, this.fullPackBranch, this.fullPackItem);
            this.handleDetailPackCancel();
        }
    }

    handleDetailPackCancel() {
        this.isFullPackVisible = false;
        this.fullPackBranch = null;
        this.fullPackItem = null;
    }


    submitCostDetailPacks(data: any, branch: any, item: any) {
        //过滤掉可拆分与不可拆分数据
        let source = this.seprateDataSort(data);
        let plans = [], plan1 = [], plan2 = [];
        //不可拆分的数据整理
        if (source.inseparable && source.inseparable.length > 0) {
            let inseparableData = this.masterPack.computedPackNumByGroup(source.inseparable, "id");
            plan1 = this.computedPackData(inseparableData, branch, item);

        }

        //可拆分数据整理
        if (source.separable && source.separable.length > 0) {
            let separableData = this.masterPack.computedPackNumByGroup2(source.separable, "id");
            plan2 = this.computedPackData(separableData, branch, item);
            console.log("render plan2 is:", plan2);
        }
        plans = plan1.concat(plan2);

        this.costDetailAccount.getCostDetailAddPack({plans: plans}).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getInfoAmount(this.cid);
            this.renderDetail(this.pid)
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }


    /**
     * 区分拆分数据
     * @param data
     */
    seprateDataSort(data: any) {
        let source = {
            separable: [],
            inseparable: []
        };
        if (data && data.length > 0) {
            data.forEach(d => {
                if (d["separable"] && d["separable"] === 1) {
                    source.separable.push(d);
                } else {
                    source.inseparable.push(d);
                }
            })
        }
        return source;

    }


    /**
     * 表头过滤器
     * @param e
     */
    filterChange(e) {
        if (e && e.length > 0) {
            this.listOfData = this.filterDataByValue(this.storeData, e);
        } else {
            this.listOfData = this.storeData;
        }
    }

    /**
     * 合并单元格的过滤器
     */
    filterItemChange(e: any, type: string) {
        if (e && e.length > 0) {
            this.resetItemValue(type);
            e.forEach(val => {
                let items = type === "full" ? this.itemFullBool : this.itemBool;
                let ff = items.find(item => item.key === val);
                if (ff && ff.key) {
                    ff.value = false;
                }
            });
        } else {
            this.resetItemValue(type);
        }
    }

    /**
     * 重置默认
     */
    resetItemValue(type: string) {
        let items = type === "full" ? this.itemFullBool : this.itemBool;
        if (items.length > 0) {
            items.forEach(item => {
                item["value"] = true;
            })
        }
    }

    /**
     * 根据关闭当前的单项来显示合并单元格的数量
     */
    getCloseByColume(base: number, type: string = null) {
        return Math.abs(base - this.getCountByHideItem(type));
    }

    /**
     * 显示隐藏的列数
     * @returns {number}
     */
    getCountByHideItem(type: string) {
        let count = 0;
        let items = type === "full" ? this.itemFullBool : this.itemBool;
        if (items && items.length > 0) {
            items.forEach(item => {
                if (item.value) {
                    count += 1;
                }
            })
        }
        return count;
    }

    /**
     * 根据搜索类型显示过滤后的数据
     * @param data
     * @param values
     * @returns {any[]}
     */
    filterDataByValue(data, values) {
        let source = [];
        if (values && values.length > 0) {
            values.forEach(v => {
                let d = this.storeData.filter(s => s.infoType === Number(v));
                source = source.concat(d);
            })
        }
        return source;
    }

    /**
     * 组装数据，重新渲染时使用
     * @param data
     * @returns {any}
     */
    computedData(data) {
        if (data && data.length > 0) {
            //初始化序列号
            let serialNumber = 0;
            for (let i = 0; i < data.length; i++) {
                let itemSum = 0, start = 0, end = 0, itemNum = 0;
                for (let j = 0; j < data[i].infoMaps.length; j++) {
                    //独立增减项目
                    itemNum = 0;
                    if (data[i].infoMaps[j].infos.length > 0) {
                        if (this.showGradateByType(data[i].infoType)) {
                            data[i].infoMaps[j].infos = this.computedDataByGradate(data[i].infoMaps[j].infos);
                        }

                        data[i].infoMaps[j].infos.forEach(info => {
                            serialNumber += 1;
                            info["wastagePrice"] = info["wastagePrice"] ? info["wastagePrice"] : this.computeWastage(info["num"], info["unitPrice"], info["wastageRate"]);
                            info["sn"] = serialNumber;
                        })
                    }

                    start = (data[i].infoMaps[j].pageNo - 1) * this.pageSize;
                    end = (data[i].infoMaps[j].pageNo) * this.pageSize;
                    if (data[i].infoMaps[j].infos.length > 0) {
                        itemNum = data[i].infoMaps[j].infos.slice(start, end).length + 2;
                    } else {
                        itemNum = 1;
                    }

                    itemSum += itemNum;
                    data[i].infoMaps[j]["cols"] = itemNum;
                    // if(data[i].infoMaps[j].infos.length > 0){
                    //     data[i].infoMaps[j]["cols"] = item
                    // }
                    // data[i].infoMaps[j]["cols"] = data[i].infoMaps[j].infos.length > 0 ? data[i].infoMaps[j].infos.slice(start, end).length : 1;
                }

                //是不是成本审核页面进入成本详情
                if (this.controlBtnAndInp()) {
                    // console.log("edit input ads", true);
                    //可插入大项
                    if (this.disabledOperateByState()) {
                        if (this.limitBranchByType(data[i].infoType)) {
                            if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                                data[i]["rows"] = itemSum + 3;
                            } else {
                                data[i]["rows"] = itemSum + 2;
                            }
                        } else {
                            if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                                data[i]["rows"] = itemSum + 2;
                            } else {
                                data[i]["rows"] = itemSum + 1;
                            }
                        }
                    } else {
                        if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                            data[i]["rows"] = itemSum + 2;
                        } else {
                            data[i]["rows"] = itemSum + 1;
                        }

                    }

                } else {
                    if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                        data[i]["rows"] = itemSum + 2;
                    } else {
                        data[i]["rows"] = itemSum + 1;
                    }
                }


                // if (this.limitBranchByType(data[i].infoType) && this.controlBtnAndInp()) {
                //     if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                //         data[i]["rows"] = itemSum + 2;
                //     } else {
                //         data[i]["rows"] = itemSum + 1;
                //     }
                // } else {
                //     if (data[i].infoMaps && data[i].infoMaps.length === 0) {
                //         data[i]["rows"] = itemSum + 1;
                //     }
                // }
            }
        }
        return data;
    }

    /**
     * 组装增减项目的数据（套餐成型）
     * @param infos
     * @returns {any}
     */
    computedDataByGradate(infos: any) {
        //currentIndex 当前索引 currentId 当前的套餐id

        // console.log("infos ",infos);
        let packs = [];
        if (infos && infos.length > 0) {
            for (let i = 0; i < infos.length; i++) {
                if (!infos[i]["packFlag"] && infos[i]["planFlag"] === 2) {
                    //查找是否已经有新的数据
                    if (this.findPlanId(infos[i]["planId"], packs) == -1) {
                        //套餐中的多条数据
                        if (infos[i + 1] && infos[i]["planId"] === infos[i + 1]["planId"]) {
                            packs.push({
                                index: i,
                                id: infos[i]["planId"],
                                data: {
                                    name: infos[i]["planName"],
                                    planId: infos[i]["planId"],
                                    id: infos[i]["costPlanId"],
                                    quoteId: infos[i]["quoteId"],
                                    num: infos[i]["planNum"],
                                    planNum: infos[i]["planNum"],
                                    unitPrice: infos[i]["planPrice"],
                                    planPrice: infos[i]["planPrice"],
                                    remark: infos[i]["planRemark"],
                                    explain: infos[i]["planExplainMsg"],
                                    unit: infos[i]["planUnit"],
                                    packFlag: true, //自定义的标识，用于识别增减项目中的添加套餐
                                    infoType: 6,
                                    planFlag: 2,
                                }
                            });
                            //套餐中的单条数据
                        } else {
                            packs.push({
                                index: i,
                                id: infos[i]["planId"],
                                data: {
                                    name: infos[i]["planName"],
                                    planId: infos[i]["planId"],
                                    id: infos[i]["costPlanId"],
                                    quoteId: infos[i]["quoteId"],
                                    num: infos[i]["planNum"],
                                    planNum: infos[i]["planNum"],
                                    unitPrice: infos[i]["planPrice"],
                                    planPrice: infos[i]["planPrice"],
                                    remark: infos[i]["planRemark"],
                                    explain: infos[i]["planExplainMsg"],
                                    unit: infos[i]["planUnit"],
                                    packFlag: true,
                                    infoType: 6,
                                    planFlag: 2,
                                }
                            });
                        }
                    }
                }
            }

            if (packs && packs.length > 0) {
                for (let i = packs.length - 1; i >= 0; i--) {
                    if (infos[packs[i].index - 1] && infos[packs[i].index - 1].planId !== packs[i].id) {
                        infos.splice(packs[i].index, 0, packs[i].data);
                    }
                    if (!infos[packs[i].index - 1]) {
                        infos.splice(packs[i].index, 0, packs[i].data);
                    }
                }
            }

        }
        return infos;
    }

    /**
     * 查找相似的套餐id 是否已存在
     * @param {number} pid
     * @param {Array<any>} plans
     * @returns {any}
     */
    findPlanId(pid: number, plans: Array<any>) {
        return plans.findIndex(plan => plan.id === pid);
    }

    /**
     * 计算材料损耗
     * @param num 材料数量
     * @param unit 材料单价
     * @param ratio 材料损耗比率
     * @returns {any}
     */
    computeWastage(num, unit, ratio) {
        return ((Math.pow(10, 2) * (num ? num : 0)) * (Math.pow(10, 2) * (unit ? unit : 0)) * ratio / Math.pow(10, 6)).toFixed(2)
    }


    /**
     * 计算当前的移动菜单
     * @param data
     */
    computedMove(data) {
        let moveMenus = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (this.limitMenusInNum(data[i].infoType)) {
                    if (data[i].infoType === 6 && data[i].infoMaps && data[i].infoMaps.length > 0) {
                        moveMenus.push({
                            infoType: data[i].infoType,
                            name: data[i].name,
                            list: []
                        });
                    } else {
                        moveMenus.push({
                            infoType: data[i].infoType,
                            name: data[i].name,
                            list: []
                        });
                    }

                    if (data[i].infoMaps && data[i].infoMaps.length > 0) {
                        data[i].infoMaps.forEach(info => {
                            moveMenus[moveMenus.length - 1]["list"].push({
                                name: info.name,
                                id: info.categoryId,
                                infoType: data[i].infoType,
                                infoName: data[i].name
                            })
                        })
                    }
                }
            }
        }
        return moveMenus;
    }


    /**
     * 根据当前类别来区别开显示大项的输入端
     * @param {number} type
     * @returns {boolean}
     */
    showBranchInByType(type: number) {
        return showItemInArray(type, [1, 4, 5, 6, 8]);
    }

    /**
     * 是不是套餐中的细项
     * @param item
     * @returns {boolean}
     */
    showItemByPlan(item: any) {
        return item && item["planFlag"] !== 2;
    }

    /**
     * 对于代购项目的控制按钮
     * @param {number} type
     * @returns {boolean}
     */
    showPurchaseByType(type: number) {
        return showItemInArray(type, [8]);
    }

    /**
     * 增减项时的控制显示
     * @param {number} type
     * @returns {boolean}
     */
    showGradateByType(type: number) {
        return showItemInArray(type, [6]);
    }


    /**
     * 控制显示上下、置顶移动
     * @param item
     */
    controlPosMove(item: any) {
        return this.disabledOperateByState() && item["infoType"] !== 8;
    }

    /**
     * 用于生成移动项
     * @param {number} type
     * @returns {boolean}
     */
    limitBranchByType(type: number) {
        return showItemInArray(type, [1, 4, 5]);
    }

    /**
     * 限制生成菜单
     * @param {number} type
     * @returns {boolean}
     */
    limitMenusInNum(type: number) {
        return showItemInArray(type, [1, 4, 5, 8]);
    }

    /**
     * 限制修改套餐基本信息
     * @param {number} type 类别
     * @param {number} packFlag 是不是套餐 2表示是套餐
     * @returns {boolean}
     */
    limitPackByType(type: number, branch: any) {
        // console.log(branch);
        return showItemInArray(type, [2, 3, 6]) && branch && branch["planId"] > 0;
    }

    /**
     * 添加套餐的限制
     * @param {number} type
     * @param branch
     * @returns {boolean}
     */
    addPackByType(type: number, branch: any) {
        return showItemInArray(type, [2, 3]) && branch && branch["planId"] > 0;
    }

    /**
     * 细项中的移动设置
     * @param {number} type
     * @returns {boolean}
     */
    moveBranchByType(type: number) {
        return showItemInArray(type, [1, 2, 3, 4, 5]);
    }

    /**
     * 排队增减项目显示
     * @param {number} type
     * @returns {boolean}
     */
    showComputedByType(type: number) {
        return showItemInArray(type, [1, 2, 3, 4, 5, 8]);
    }

    /**
     * 根据不同类别计算其总计
     * @param branch
     * @param {string} type
     * @returns {number}
     */
    computedTotal(branch: any, type: string) {
        switch (type) {
            case "material":
                return this.getTotalByType(branch, "num", "unitPrice", true);
            case "carpentry":
                return this.getTotalByType(branch, "num", "carpenterPrice");
            case "tiler":
                return this.getTotalByType(branch, "num", "masonPrice");
            case "painting":
                return this.getTotalByType(branch, "num", "japannerPrice");
            case "plumber":
                return this.getTotalByType(branch, "num", "utilityCharge");
        }
    }

    /**
     * 计算材料损耗合计值
     * @param infos
     * @returns {number}
     */
    computedMaterialTotal(infos: any) {
        let total = 0;
        if (infos && infos.length > 0) {
            let num = 0, price = 0, rate = 0, waste = 0;
            total = infos.reduce((total, info) => {
                num = info["num"] ? info["num"] : 0;
                price = info["unitPrice"] ? info["unitPrice"] : 0;
                rate = info["wastageRate"] ? info["wastageRate"] : 0;
                waste = info["wastagePrice"] != null ? info["wastagePrice"] : null;
                return total + (this.computedSingleTotal(num, price) + Number(waste != null ? waste : this.computeWastage(num, price, rate)))
            }, 0);
        }
        return total;
    }

    /**
     * 独立计算增减项目中的总计
     * @param infos
     * @returns {number}
     */
    computedGradateTotal(infos: any) {
        let total = 0;
        if (infos && infos.length > 0) {
            total = infos.reduce((total, info) => {
                if (info && !info["packFlag"]) {
                    let num = info["num"] ? info["num"] : 0;
                    let price = info["unitPrice"] ? info["unitPrice"] : 0;
                    let rate = info["wastageRate"] ? Number(info["wastageRate"]) / 100 : 0;
                    let mid = this.computedSingleTotal(num, price);
                    return total + mid + this.computedSingleTotal(rate, mid);
                } else {
                    // if (info["packFlag"]) {
                    //     return total + this.computedSingleTotal(Number(info["planNum"]), info["planPrice"]);
                    // }
                    return total;
                }
            }, 0)
        }
        return total;
    }

    /**
     * 组装或生成套餐数据
     * @param data
     * @param item
     * @returns {any[]}
     */
    computedPackData(data: any, branch: any, item: any) {
        const packs = [];
        if (data && data.length > 0) {
            data.forEach(d => {
                packs.push({
                    quoteId: this.cid,
                    planId: d.id,
                    infoType: branch.infoType,
                    planUnit: d.unit,
                    planNum: d.number,
                    planPrice: d.sellingPrice,
                    planName: d.name,
                    remark: d.remark,
                    separable: d.separable,
                    cost: null
                });
                if (item["costCategoryId"]) {
                    packs[packs.length - 1]["costCategoryId"] = item.costCategoryId;
                } else if (item["costCategory"]) {
                    packs[packs.length - 1]["costCategory"] = item.costCategory;
                }
                if (d.details && d.details.length > 0) {
                    packs[packs.length - 1].cost = {
                        quoteId: this.cid,
                        category: d.name,
                        infoType: branch.infoType,
                        list: this.computedDetailPackToAdd(d.details, d, branch)
                    };
                }
            })
        }
        // console.log("packs is", packs);
        return packs;
    }

    /**
     * 再次整理各条细项数据到套餐中的成本详情中去
     * @param {Array<any>} details
     * @param {number} type
     * @param item
     * @returns {any[]}
     */
    computedDetailPackToAdd(details: Array<any>, item: any, branch: any) {
        let pts = [];
        if (details && details.length > 0) {
            details.forEach(dt => {
                pts.push({
                    infoType: branch.infoType,
                    infoName: branch.name,
                    infoRemark: branch.infoRemark,
                    materialId: dt.id,
                    code: dt.code ? dt.code : dt.sku,
                    name: dt.name,
                    brand: dt.brand,
                    spec: dt.spec,
                    model: dt.model,
                    unit: dt.unit ? dt.unit : null,
                    // unitPrice: dt.unitPrice ? dt.unitPrice : (dt.type ? dt.supplyPrice : null),
                    unitPrice: dt.unitPrice ? dt.unitPrice : equalZero(dt.materialActivityPrice, "0") !== "0" ? dt.materialActivityPrice : dt.supplyPrice,
                    wastageRate: dt.wastageRate,
                    carpenterPrice: dt.carpenterPrice,
                    masonPrice: dt.masonPrice,
                    japannerPrice: dt.japannerPrice,
                    utilityCharge: dt.utilityCharge,
                    remark: dt.remark,
                    num: dt.number ? dt.number : (dt.num ? dt.num : 1),
                    planId: item.id,
                    planFlag: 2
                })
            })
        }
        return pts;
    }

    /**
     * 计算单个类别总和
     * @param infos
     * @param num
     * @param price
     * @param loose 是否开启损耗计算
     * @returns {number}
     */
    getTotalByType(infos, num, price, loose: boolean = false) {
        let total = 0;
        if (infos && infos.length > 0) {
            total = infos.reduce((total, info) => {
                let mid = this.computedSingleTotal(info["" + num + ""], info["" + price + ""]);
                if (loose) {
                    return total + mid + this.computedSingleTotal((info["wastageRate"] ? info["wastageRate"] : 0) / 100, mid);
                } else {
                    return total + mid;
                }
            }, 0)
        }
        return total;
    }

    //单个的数量*单价
    computedSingleTotal(num: number, price: number): number {
        num = num ? Number(num) : 0;
        price = price ? Number(price) : 0;
        return Number(((num * Math.pow(10, 2)) * (price * Math.pow(10, 2)) / Math.pow(10, 4)).toFixed(2));
    }

    /**
     * 打开类名编辑框
     * @param {number} index
     */
    openBranch(index: number, branch: any, ...data) {
        this.renderOpenBranch(index, branch, ...data);
        this.isVisible = true;
    }

    openBranchFull(index: number, branch: any, ...data) {
        this.renderOpenBranch(index, branch, ...data);
        this.isFullVisible = true;
    }

    renderOpenBranch(index: number, branch: any, ...data) {
        if (data && data.length > 0) {
            this.modify = true;
            this.branchInfo = data[0].name;
            this.editId = data[0].categoryId;
        }
        this.editIndex = index;
        this.editBranch = branch;
    }

    /**
     * 打开套餐
     */
    openPack(item: any) {
        this.isPackVisible = true;
        this.packItem = item;
        this.packForm.patchValue({packNum: item["planNum"]});
        // this.packForm.patchValue({packPrice: item["planPrice"]});
    }


    /***
     * 添加大项
     * @param data
     */
    addBranch() {
        if (this.branchForm.valid) {
            const params = {
                quoteId: this.cid,
                category: this.branchForm.value["branchInfo"].trim()
            };
            if (this.modify) {
                params["id"] = this.editId;
            } else {
                let branch = {
                    name: params["category"]
                }
                this.openItem(this.branchType, branch, this.editBranch);
                this.handleCancel();
            }
        }
    }

    /**
     * 编辑或者修改大项名称
     */
    updateBranch() {
        if (this.branchForm.valid) {
            const params = {
                quoteId: this.cid,
                category: this.branchForm.value["branchInfo"].trim(),
                id: this.editId
            }
            this.costDetailAccount.setCostDetailBranch(params).then(data => {
                const findData = this.listOfData[this.editIndex];
                if (findData.infoMaps && findData.infoMaps.length > 0) {
                    let filterData = findData.infoMaps.find(d => d.categoryId === this.editId);
                    if (filterData && filterData.name) {
                        filterData.name = data.category;
                    }
                }
                this.handleCancel();
            }).catch(err => {
                this.warn.onMsgError(err);
                this.renderDetail(this.pid);
            })
        }
    }


    /**
     * 关闭大项弹出框
     */
    handleCancel() {
        if (this.isFullScreen) {
            this.isFullVisible = false;
        } else {
            this.isVisible = false;
        }
        if (this.fullData) {
            this.fullData = null;
            this.fullIndex = null;
            this.fullInfo = null;
        } else {
            this.editId = null;
            this.editIndex = null;
            this.editBranch = null;
            this.branchInfo = null;
        }
        this.modify = false;
        this.branchForm.reset();
    }

    /**
     * 大项添加或者修改时专用
     */
    handleOk() {
        if (!this.modify) {
            if (this.isFullScreen) {
                this.isFullItemsVisible = true;
            } else {
                this.addBranch();
            }

        } else {
            this.updateBranch();
        }

    }

    //侧栏框关闭
    handleItemOk(e: any) {
        this.isFullItemsVisible = false;
        if (e && e.length > 0) {
            if (this.fullInfo && this.fullData) {
                this.submitCostDetailItem(e, this.fullInfo, this.fullIndex, this.fullData);
            } else {
                this.submitCostDetail(e, {name: this.branchInfo}, this.editBranch);
            }
        }
        this.handleCancel();
    }

    handleItemCancel() {
        this.isFullItemsVisible = false;
        this.handleCancel();
    }

    handlePackCancel() {
        this.isPackVisible = false;
        this.packItem = null;
        this.packForm.reset();
    }

    handlePackOk() {
        if (this.packForm.valid) {
            let params = {
                id: this.packItem["id"],
                planId: this.packItem["planId"],
                quoteId: this.packItem["quoteId"],
                infoType: this.packItem["infoType"],
                planUnit: this.packItem["planUnit"],
                planNum: this.packForm.value["packNum"],
                // planPrice: this.packForm.value["packPrice"],
                planName: this.packItem["name"]
            };
            this.costDetailAccount.getCostDetailUpdatePack(params).then(msg => {
                this.handlePackCancel();
                this.getInfoAmount(this.cid);
                this.renderDetail(this.pid);
                this.warn.onMsgSuccess(msg);
            }).catch(err => {
                this.handlePackCancel();
                this.warn.onMsgError(err);
            })
        }
    }

    /**
     * 添加细项
     * @param branch
     */
    addItem(branch) {
        this.computedData(this.listOfData);
        this.moveMenus = this.computedMove(this.listOfData);
    }

    /**
     * 删除细项
     * @param branch
     * @param {number} index
     */
    removeItem(branch, index: number) {
        branch.infos.splice(index, 1);
        this.computedData(this.listOfData);
        this.moveMenus = this.computedMove(this.listOfData);
    }


    pageChange(e: any, branch: any) {
        branch["pageNo"] = e;
        this.computedData(this.listOfData);
        this.moveMenus = this.computedMove(this.listOfData);
    }

    /**
     * 计算显示的所有细项
     * @param branch
     * @returns {any}
     */
    computedBranchInfos(branch) {
        return branch.infos.slice((branch.pageNo - 1) * this.pageSize, branch.pageNo * this.pageSize);
    }


    /**
     * 确定删除大项
     * @param branch
     */
    confirmDeleteBranch(branch: any) {
        if (branch && branch.categoryId) {
            this.deleteInfo({
                id: branch.categoryId,
                quoteId: this.cid
            }, 1);
        }
    }

    /**
     * 删除套餐中
     * @param item
     */
    confirmDeletePack(item: any) {
        if (item && item["id"] && item["quoteId"]) {
            this.costDetailAccount.getCostDetailDeletePack({
                id: item.id,
                quoteId: item.quoteId,
                planId: item.planId,
                infoType: item.infoType
            }).then(msg => {
                this.warn.onMsgSuccess(msg);
                this.getInfoAmount(this.cid);
                this.renderDetail(this.pid);
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }

    }

    /**
     * 确定删除细项
     * @param item
     */
    confirmDeleteItem(item: any) {
        if (item && item.id) {
            this.deleteInfo({
                id: item.id,
                quoteId: this.cid
            }, 0);
        }
    }

    /**
     * 删除大项、细项
     * @param params
     * @param {number} type 0：细项，1：大项
     */
    deleteInfo(params: any, type: number) {
        this.costDetailAccount.getCostDetailDelete(params, type).then(data => {
            this.warn.onMsgSuccess(data);
            this.renderDetail(this.pid);
            this.getInfoAmount(this.cid);
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid);
        })
    }

    /**
     * 更新项目中的备注和折扣信息
     * @param params
     */
    updateCostBrief(params: any,...args) {
        this.costDetailAccount.getCostDetailOverview(params).then(msg => {
            this.warn.onMsgSuccess(msg);
            if(args && args.length > 0){
                this.getInfoAmount(this.cid);
            }
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid);
            this.getInfoAmount(this.cid);
        })
    }


    /**
     * 拉取相应的成本数据
     * @param {number} id 报价id
     */
    getInfoAmount(id: number) {
        if (id) {
            this.costDetailAccount.getCostDetailAmount(id).then(data => {
                this.renderCost(data);
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }
    }

    /**
     * 添加细项到大项中去
     * @param {number} type(1：项目，2:主材，3：辅材，4：暂定软材，5：自定义)
     * @param {number} branchInfo
     * @param data
     */
    openItem(type: number = 1, branchInfo: any, data: any) {
        if (type !== Default.COST_ACCOUNT.ITEM_5) {
            const modal = this.modalService.open(ItemBasicComponent,
                {
                    centered: true,
                    keyboard: true,
                    size: "lg"
                });
            modal.componentInstance.type = type;
            modal.componentInstance.sourceInfo = Default.SOURCE.COST;
            //固定版本为最新
            modal.componentInstance.dataVersion = 1;

            modal.result.then(res => {
                // console.log(res);
                if (res && res.length > 0) {
                    this.submitCostDetail(res, branchInfo, data);
                }
            }, (rea) => {
                console.log(rea);
            })
        }
        else {
            const modal = this.modalService.open(ItemBasicCustomizeComponent,
                {
                    centered: true,
                    keyboard: true,
                    size: "lg"
                });
            // modal.componentInstance.type = type;
            // modal.componentInstance.sourceInfo = Default.SOURCE.COST;
            // //固定版本为最新
            // modal.componentInstance.dataVersion = 1;

            modal.result.then(res => {
                if (res && res.length > 0) {
                    let list = this.computedParamsToAdd(res, data["name"]);
                    let params = {
                        quoteId: this.cid,
                        list: list,
                        infoType: data["infoType"]
                    };
                    if (branchInfo && branchInfo["categoryId"]) {
                        params["categoryId"] = branchInfo["categoryId"];
                    } else {
                        params["category"] = branchInfo["name"];
                    }

                    this.costDetailAccount.addCostDetailBranch(params).then(msg => {
                        this.warn.onMsgSuccess(msg);
                        this.getCostInfo(this.cid);
                        this.getInfoAmount(this.cid);
                    }).catch(err => {
                        this.warn.onMsgError(err);
                        this.renderDetail(this.pid)
                    })
                }
            }, (rea) => {
                console.log(rea);
            })
        }
    }

    //公共弹出框设置选中后的回填数据
    submitCostDetail(data: any, item: any, branch: any) {
        let list = this.computedParamsToAdd(data, branch["name"]);
        let params = {
            quoteId: this.cid,
            list: list,
            infoType: branch["infoType"]
        };
        if (item && item["categoryId"]) {
            params["categoryId"] = item["categoryId"];
        } else {
            params["category"] = item["name"];
        }

        this.costDetailAccount.addCostDetailBranch(params).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getCostInfo(this.cid);
            // this.getInfoAmount(this.cid);
        }).catch(err => {
            this.warn.onMsgError(err);
            this.renderDetail(this.pid)
        })
    }


    /**
     * 添加细项到大项中去
     * @param data
     * @param {string} name
     * @returns {any[]}
     */
    computedParamsToAdd(data: any, name: string) {
        let params = [];
        if (data && data.length > 0) {
            data.forEach(d => {
                params.push({
                    infoName: name,
                    materialId: d.id,
                    code: d.code ? d.code : d.sku,
                    name: d.name,
                    // category: d.category,
                    brand: d.brand,
                    spec: d.spec,
                    model: d.model,
                    unit: d.sellingUnit ? d.sellingUnit : null,
                    unitPrice: d.unitPrice ? d.unitPrice : (d.type ? d.supplyPrice : null),
                    wastageRate: d.wastageRate,
                    carpenterPrice: d.carpenterPrice,
                    masonPrice: d.masonPrice,
                    japannerPrice: d.japannerPrice,
                    utilityCharge: d.utilityCharge,
                    remark: d.remark,
                    num: d.num ? d.num : 1
                })
            })
        }
        return params;
    }


    /**
     * 绘制饼状图
     * @param
     * @param cost
     */
    renderChart(el:any,cost: number = 0, sum: number = 0) {
        let data = [
            {type: "成本", count: cost && cost > 0 ? cost : 0},
            {type: "毛利", count: sum - cost > 0 ? sum - cost : 0}
        ]

        let ds = new DataSet();
        let dv = ds.createView().source(data);
        dv.transform({
            type: 'map',
            callback(row) {
                row.value = parseFloat((row.count).toFixed(2));
                return row;
            }
        });
        this.chart = new G2.Chart({
            container: el,
            // width: 200,
            height: 180,
            padding: [0, 0, 0, 60],
            forceFit: true,
            animation: false
        });
        // G2.Global.renderer = 'svg';
        this.chart.source(dv);
        this.chart.legend(false);

        this.chart.tooltip(false);

        this.chart.coord('theta', {
            radius: 0.9,
            innerRadius: 0.85
        });

        this.chart.intervalStack().position('value')
            .color('type', ['#69C0FF', '#1890FF'])
            .opacity(1);

        this.chart.guide().html({
            position:["50%","50%"],
            htmlContent: `<div style="text-align:center;">
                     <p style="font-size: 20px;font-weight:700;line-height: 28px;color: rgba(0, 0, 0, 0.85);word-break: break-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="${sum}">${sum}</p>
                     <p style="font-size: 14px;line-height: 22px;color: rgba(0, 0, 0, 0.45);">总额</p>
                   </div>`
        });
        this.chart.render();
    }

    toggle() {
        this.switch = this.switch ? false : true;
    }

    /**
     * 提交到工长
     * @param e
     */
    sendCost(e) {
        e.stopPropagation();
        e.preventDefault();
        this.costDetailAccount.sendToForeman({
            id: this.pid,
            laborCost: this.laborCost ? (this.laborCost).toFixed(2) : 0,
            materialCost: this.materialCost ? (this.materialCost).toFixed(2) : 0,
            carpentryCost: this.carpentryCost ? (this.carpentryCost).toFixed(2) : 0,
            masonCost: this.tilerCost ? (this.tilerCost).toFixed(2) : 0,
            paintCost: this.painterCost ? (this.painterCost).toFixed(2) : 0,
            electricianCost: this.plumberCost ? (this.plumberCost).toFixed(2) : 0
        }).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.renderDetail(this.pid);
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    /**
     * 与导入成本表状态保持一致 2019-08-30(原來是state === 1:只有未提交時)
     * 2019-09-20 修改为在未确认合同之前均可修改
     * @returns {number}
     */
    showSendByState() {
        return showItemInArray(this.state, [0, 1, 2]) && this.isSuperUser();
    }

    // /**
    //  * 控制是否可以编辑文本（主要是数字输入）
    //  * @returns {boolean}
    //  */
    // editInfoByState() {
    //     if (this.isSuperUser()) {
    //         return showItemInArray( this.state,[3, 4])
    //     }
    //     return true;
    // }

    //超级用户 1:不是， 0：是超级
    isSuperUser() {
        return this.user.getChild() && this.user.getChild() === 1;
    }

    //关联超级用户时显示按钮
    disabledOperateByState() {
        return !showItemInArray(this.state, [3, 4]) && this.isSuperUser();
    }

    /**
     * 控制操作和输入（非成本审核列表进入不可编辑）
     * @returns {boolean}
     */
    controlBtnAndInp() {
        return this.sp && this.sp === Default.OFFER_ITEM.ITEM_6;
    }

    /**
     * 截取字符串
     * @param {string} name
     * @param {number} num
     */
    subItem(name: string, num: number) {
        return subItemName(name, num);
    }

    /**
     * 根据需求来显示插入的对象
     * @param args
     * @returns {any[]}
     */
    getBranchItems(...args) {
        let items = [];
        if (args && args.length > 0) {
            args.forEach(i => {
                let find = this.branchItems.find(b => b.value === i);
                items.push(find);
            });
        }
        return items;
    }


    /**
     * 根据总宽度来实现单独变窄功能
     * @param {number} tw
     */
    getWidthByTotal(tw: number) {
        return Math.ceil(tw - this.getCountByHideItem(null) * 80);
    }


    /**
     * 放大屏幕 open close getWidth
     */
    open() {
        this.isFullScreen = true;
    }

    close() {
        this.isFullScreen = false;
    }

    getWinHeight() {
        return parseInt(window.screen.height + '');
    }

    getWinWidth() {
        return parseInt(window.screen.width + '');
    }

    /**
     * 重签成本
     */
    reSign() {
        this.costDetailAccount.getCostDetailResign(this.cid).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.renderDetail(this.pid);
        }).catch(err => {
            if (err[0] === 120) {
                this.warn.onModalInfo({
                    title: '提示',
                    content: err[1],
                    ok: () => {
                        console.log('tips');
                    }
                });
            } else {
                this.warn.onMsgError(err[1] || Messages.FAIL.DATA);
            }
        })
    }

    /**
     * 判断当前数据是否为nan
     * @param val
     * @returns {any}
     */
    justNaN(val: any) {
        if (typeof val === "string" && val === "NaN") return true;
        return Number.isNaN(val) === true;
    }

    /**
     * 打开材料参与活动修改单价弹窗
     * @params item
     */
    openActivity(item){
        if(item.materialId){
            this.activityItem = item;
            this.costDetailAccount.getMaterialActivity(item.materialId).then(data => {
                this.activityVisible = true;
                this.activityList = data;
                this.activityList.forEach(ac => ac.isUse = false)
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }else{
            this.warn.onMsgError('当前材料不支持修改单价');
        }
    }      
    
    handleActivityCancel(){
        this.activityVisible = false;
        this.activityItem = null;
        this.activityList = [];
    }

    replacePriceOperate(data){
        this.activityList.forEach(ac => ac.isUse = false)
        data["isUse"] = true;
        this.activityItem.unitPrice = data.activityPrice;
        this.changeItemPrice({num:this.activityItem.unitPrice,formula:this.activityItem.unitPriceFormula},this.activityItem)
    }

    // 打开代购金额弹窗
    editPrice() {
        this.priceVisible = true;
        this.priceForm.patchValue({price:this.procurementMoney})
    }

    priceCancel() {
        this.priceVisible = false;
        this.priceForm.reset();
    }

    handlePrice(){
        if(this.priceForm.valid){
            this.modelDiscountChange(3,this.priceForm.value['price'],true);
            this.priceCancel();
        }
    }

    // 查询不计总额的项目
    getExcludeInfo(){
        this.costDetailAccount.getExcludeInfo(this.cid).then(data => {
            this.priceList = data;
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    // 打开其他金额弹窗
    openOtherPrice(){
        this.otherPriceVisible = true;
        this.priceList = JSON.parse(JSON.stringify(this.priceCostList));
    }

    handleOtherPriceCancel(){
        this.otherPriceVisible = false;
        this.priceList = []
    }

    addPriceItem(){
        this.priceList.push({name:'',price:0,remark:'',isEdit:true})
    }

    operateResult(params,str){
        this.costDetailAccount.operateExcludeInfo(params,str).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.getInfoAmount(this.cid);
            this.getExcludeInfo()
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }
    /** 
     * 其他项目弹窗操作
     * @params str
     * @params data
     * @params i
     */
    priceOperate(str:string,data:any,i:any){
        switch (str) {
            case 'edit':
                data.isEdit = true
                break;
            case 'save':
                if(data.name && (data.price || data.price === 0)){
                    // data.isEdit = false
                    let saveParams = {
                        quoteId:this.cid,
                        id:data.id,
                        name:data.name,
                        price:data.price,
                        remark:data.remark,
                    }
                    this.operateResult(saveParams,'save')
                }else{
                    this.warn.onWarn('请填写名称和金额');
                }
                break;
            case 'delete':
                let deleteParams = {
                    id:data.id,
                }
                if(data.id){
                    // idx = this.priceList.findIndex(item=>item.id === data.id)
                    this.operateResult(deleteParams,'delete')
                }else{
                    this.priceList.splice(i,1)
                }          
                break;
            default:
                return;
        }
    }
}
