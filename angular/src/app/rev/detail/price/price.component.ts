import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { ItemComponent } from '../../../plugins/item/item.component';
import { Messages } from '../../../model/msg';
import { WarningService } from '../../../service/warning.service';
import * as UserValidate from '../../../validate/user-validate';
import { RequestService } from '../../../service/request.service';
import { QuoteService } from '../../../service/quote.service';
import { ConfigService } from '../../../service/config.service';
import { InfoComponent } from '../../../plugins/info/info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Default, OFFER_DEFAULT_DATA } from '../../../model/constant';
import {
    showAddOrDelByState,
    showBtnByState,
    showRegularByState,
    equalToSame,
    showExpressByState,
    getSortIds,
    toInteger,
    ObjToArrByImg,
    changeToDecimal,
    getUrlName,
    setStyleBg,
    compiledTplId,
    getBudgetByState,
    showConfirmByState,
    showMakeBtnByState,
    btoa,
    showAddOrDelSubmitByState,
    showDetailByState, getAddAndDelByStatus, showCustomerByState
} from '../../../model/methods';
import { RegularService } from '../../../service/regular.service';
import { UserService } from '../../../service/user.service';
import { EngineesComponent } from '../../../plugins/enginees/enginees.component';
import { ItemCartComponent } from '../../../plugins/item-cart/item-cart.component';
import { UploaderMultisComponent } from '../../../plugins/uploader-multis/uploader-multis.component';
import {ItemBasicComponent} from "../../../plugins/item-basic/item-basic.component";

import { HeaderService } from '../../../service/header.service';
import { findColorReset, renderColors } from '../../../model/budget-method';
import { BufferService } from '../../../service/buffer.service';
import { Reg } from '../../../model/reg';
import { downloadFiles } from '../../../model/download-method';


@Component({
    selector: 'rev-detail-price',
    templateUrl: './price.component.html',
    styleUrls: ['./../detail.scss', './price.component.scss']
})
export class PriceComponent implements OnInit {

    //修改大项
    // public branchModify: boolean = false;
    // public branchModifyForm: FormGroup;


    //系列选择基装版本id
    public seriesType: number;
    public seriesVersionId: number;

    //添加大项
    public branchVisible = false;
    public branchTitle: string;
    //大项是否可编辑
    public branchEdit = false;

    public branchForm: FormGroup;
    //单个项目名称
    public branchInfo: string;
    //生成单个项目的id
    public branchId: number;
    //修改单个大项时用
    public oldName: string;



    public branchItem: any;

    //加载数据时loading
    public loading = false;
    //body拉取data数据
    public data: any;


    //增减项目提示框
    public changeForm: FormGroup;
    public changeVisible = false;
    public changeNumber: number;
    public changeTitle: string;
    public changeItem: any;
    public changeType: number;
    public changeList: Array<any>;

    //备注信息
    public remarks = '';
    public discount = 0;
    // public modify: any = {
    //     remark: false,
    //     discount: false
    // };
    public isModify = false;
    public modifyTitle = '';
    public currentNumber = '';
    public currentId = 0;
    public currentType = 0;
    public modifyForm: FormGroup;

    public baseQuote: any;
    public designers: any;
    public pauseState: string;

    public cid: string;
    public aid: string;


    //成本总计
    public primetPrice: number;
    //成交价
    public finalPrice: number;
    //最低价
    public limitPrice: number;
    //计算的总价
    public totalPrice: number;
    //优惠金额
    public preferentialPrice: number;

    public state: number = Default.STATE.ITEM_1;

    //图片广大
    public _albums = [];
    public imgIndex;
    //工程管理费用
    public engineerFee = -1;
    public ratio = 0.08;

    //设计费
    public designs: any;
    public selectDesignId = 0;

    //判定是否移动了原来的个性化项目标识
    public drag = false;
    // public dragMaterial: string = "material";
    // public dragMain: string = "main";
    // public dragSerise: string = "series";

    //单项备注信息添加和修改
    public isRemark = false;
    public remarkForm: FormGroup;
    public remarkId: string;
    public remarkString = '';
    public remarkItems: any;
    public remarkDo: any;
    public remarkImgs: Array<any> = [];
    //查看图片大图
    public isVisible = false;
    public largeImg: string;

    //增减项目中的操作项目（正在进行时）
    public pauseList: any;
    public showAddOrDelTitle: string;

    public pageSize: number = Default.PAGE.PAGE_SIZE;


    constructor(private request: RequestService,
        private warn: WarningService,
        private quote: QuoteService,
        private header: HeaderService,
        private modalService: NgbModal,
        private config: ConfigService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private reg: RegularService,
        private user: UserService,
        private dragulaService: DragulaService,
        private buffer: BufferService) {
    }


    ngOnInit() {
        try {
            this.state = parseInt(this.activatedRoute.snapshot.paramMap.get('state'));
        } catch (e) {
            this.state = Default.STATE.ITEM_1;
        }

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
                if (this.state === Default.STATE.ITEM_2) {
                    this.loadFinance(this.cid);
                } else {
                    // this.quote.loadData(this.cid);
                }
            }
            if (params && params['aid']) {
                this.aid = atob(params['aid']);
            }
        });

        this.modifyForm = this.fb.group({
            id: [this.currentId, [
                Validators.required
            ]],
            num: [this.currentNumber, [
                Validators.required,
                UserValidate.ValidatePrice
            ]]
        });

        this.branchForm = this.fb.group({
            branchInfo: [this.branchInfo, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                UserValidate.ValidateAccount
            ]]
        });

        this.changeForm = this.fb.group({
            changeNumber: [this.changeNumber, [
                Validators.required,
                UserValidate.ValidateNumDecimal
            ]]
        });

        this.remarkForm = this.fb.group({
            remarkId: [this.remarkId, [
                Validators.required
            ]],
            remarkString: [this.remarkString, [
                Validators.maxLength(500)
            ]]
        });

        this.quote.setTypeByParam('data', true);
        this.quote.setTypeByParam('price', true);
    }

    // ngAfterViewInit() {
    // setTimeout(() => {
    //     if (this.cid) {
    //         this.remarks = this.quote.getQuoteInfo() ? this.quote.getQuoteInfo()["quoteBase"]["remark"] : "";
    //
    //         this.remarkImgs = this.quote.getQuoteInfo() ? this.combineImgs(this.quote.getQuoteInfo()["remarkPhotos"]) : [];
    //
    //         this.preferentialPrice = this.quote.getQuoteInfo() ? this.quote.getQuoteInfo()["quoteBase"]["preferentialPrice"] : 0;
    //         this.baseQuote = this.quote.getQuoteInfo() ? this.quote.getQuoteInfo()["quoteBase"] : null;
    //
    //         if (this.state === Default.STATE.ITEM_2) {
    //             this.limitPrice = this.quote.getFinanceInfo() ? (this.quote.getFinanceInfo()["quoteBase"]["limitPrice"] ? this.quote.getFinanceInfo()["quoteBase"]["limitPrice"] : 0) : 0;
    //             this.primetPrice = this.quote.getFinanceInfo() ? (this.quote.getFinanceInfo()["quoteBase"]["primetotalPrice"] ? this.quote.getFinanceInfo()["quoteBase"]["primetotalPrice"] : 0) : 0;
    //         }
    //
    //     }
    // }, 1000)
    // }

    renderData(data) {
        const that = this;
        let dataSource;
        // if(that.data && that.data.length > 0){
        //     dataSource = that.componentData(that.data, data);
        //     // dataSource = that.componentData(OFFER_DEFAULT_DATA,dataSource);
        // }else{
        dataSource = that.componentData(OFFER_DEFAULT_DATA, data);
        // }


        if (that.showBtnByState()) {
            dataSource.forEach(d => {
                // if (d.type === 1) {
                if (d.infoMaps && d.infoMaps.length > 0) {
                    d.infoMaps.forEach((info, index) => {
                        that.dragItem('dragInfo' + index, d.type, index);
                    });
                }
                // } else {
                //     if (this.showSubByType1(d.type)) {
                //         that.dragItem("dragModule" + d.type, d.type);
                //     }
                // }
            });
        }
        that.data = dataSource;

        const design = that.data.filter(d => {
            return d.type === Default.OFFER_ITEM.ITEM_7;
        });
        if (design && design.length > 0) {
            this.getSelectDesignId(design[0]['infos']);
        }
    }

    /**
     * 组装初始化数据
     * @param dfs
     * @param data
     * @returns {any}
     */
    componentData(dfs, data) {
        if (data && data.length > 0) {
            const defs = dfs.map(df => {
                df['expand'] = typeof df['expand'] != 'undefined' ? df['expand'] : true;
                const d = data.filter(d => {
                    if (d.infoMaps && d.infoMaps.length > 0) {
                        d.infoMaps.forEach(info => {
                            info['expand'] = true;
                        });
                    }
                    if (d && d.type == df.type) {
                        d['expand'] = df['expand'];
                    }
                    return d && d.type === df.type;
                });
                return df = d && d.length > 0 ? d[0] : df;
            });
            return defs;
        }
        return dfs;
    }


    /**
     * 只联动工程管理费
     */
    renderEngineering(data) {
        if (data) {
            for (const i of data) {
                if (i.type === 6) {
                    this.engineerFee = i.infos[0]['totalPrice'];
                    this.ratio = i.infos[0]['num'];
                }
            }
        }
    }


    loadFinance(id) {
        const that = this;
        that.request.doPost({
            url: 'bodyFinance',
            data: { id: id },
            success: (res => {
                if (res && res.code == 200) {
                    that.data = res.data;
                    if (that.data) {
                        that.quote.setQuoteData(that.data);
                    }
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    ngDoCheck() {
        if (this.header && this.header.getHeaderInfo() && this.header.getHeadBool()) {
            this.header.setHeadBool(false);
            this.baseQuote = this.header.getHeaderInfo()['quoteBase'];
            this.pauseState = this.header.getHeaderInfo()['pauseState'];
            this.designers = this.header.getHeaderInfo()['designers'];
            this.remarkImgs = this.combineImgs(this.header.getHeaderInfo()['remarkPhotos']);
            this.remarks = this.baseQuote['remark'];
        }
        if (this.quote && this.quote.getTypeByParam('price')) {
            this.quote.setTypeByParam('price', false);
            this.reloadPrice();
        }
        if (this.quote && this.quote.getTypeByParam('data')) {
            this.quote.setTypeByParam('data', false);
            this.reloadData();
        }

        if (this.quote && this.quote.getTypeByParam('manage')) {
            this.quote.setTypeByParam('manage', false);
            this.reloadData(6);
        }

        if (this.quote && this.quote.getTypeByParam('design')) {
            this.quote.setTypeByParam('design', false);
            this.reloadData(7);
        }

    }

    /**
     * 拖动
     * @param args
     */
    dragItem(...args) {
        this.dragulaService.drag(args[0]).subscribe(arg => {
            arg.el.className = 'drag-move';
            this.drag = true;
        });

        this.dragulaService.out(args[0]).subscribe(arg => {
            arg.el.className = '';
        });
        this.dragulaService.cancel(args[0]).subscribe(arg => {
            arg.el.className = '';
        });

        this.dragulaService.dropModel(args[0]).subscribe(arg => {
            if (this.drag) {
                this.drag = false;
                this.sortMaterials(arg.targetModel);
                // if (args[1] == 1) {
                //     this.quote.setMultipleDataByType(arg.targetModel, args[1], args[2]);
                // } else {
                //     this.quote.setMultipleDataByType(arg.targetModel, args[1]);
                // }
            }
        });
    }


    //重新整理
    sortMaterials(materials) {
        if (this.cid) {
            this.request.doPost({
                url: 'sortQuote',
                data: {
                    quoteId: this.cid,
                    ids: getSortIds(materials)
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })

            });
        }
    }

    /**
     * 获取设计费选择的id
     * @param designs
     */
    getSelectDesignId(designs) {
        if (designs && designs.length > 0) {
            for (const d of designs) {
                if (d.yn) {
                    this.selectDesignId = d.id;
                }
            }
        }
    }

    /**
     * 总计部分(分支计算)
     * @param source
     * @param type
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
     * 计算（主干计算）
     * @param source
     * @param type
     * @returns {number}
     */
    getMainColumn(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const so of source) {
                if (so && so['infos'] && so['infos'].length > 0) {
                    for (const s of so['infos']) {
                        total += this.changeToInt(s[type] ? s[type] : 0, 2) * this.changeToInt(s['num'] ? s['num'] : 0, 2);
                    }
                }
            }
        }
        return (Number(total) / Math.pow(10, 4));
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

    // getSmallTotal(series) {
    //     let sum = 0;
    //     if (series && series.length > 0) {
    //         for (let s of series) {
    //             sum += this.converseToDecimal(s['univalent'], s['num']);
    //         }
    //     }
    //     return sum;
    // }

    /**
     * 工种费用总计
     * @param source
     * @param type
     * @returns {number}
     */
    getTotalByEng(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const s of source) {
                if (s.engineerYn) {
                    total += this.changeToInt((s[type] ? s[type] : 0), 2);
                }
            }
        }
        return (Number(total) / Math.pow(10, 2));
    }


    /**
     * 删除细项
     * @param {number} id
     */
    delItem(id: number) {
        // let that = this;
        if (id) {
            this.request.doPost({
                url: 'delQuote',
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        // this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam('data', true);
                        this.quote.setTypeByParam('price', true);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    //添加项目(类型)
    selectVersion(...args) {
        const that = this;
        const item = that.modalService.open(ItemComponent, {
            centered: true,
            keyboard: true
        });
        item.componentInstance.type = args[0];
        item.componentInstance.hasEmptyData = args[1];
        item.componentInstance.id = that.cid;
        item.componentInstance.dataVersion = that.baseQuote.dataVersion;
        if (that.aid) {
            item.componentInstance.aid = that.aid;
        }
        if (args && args[2] && args[3]) {
            item.componentInstance.versionId = args[2];
            item.componentInstance.versionType = args[3];
        }

        item.result.then((res) => {
            if (args[0] === 1) {
                const params = JSON.parse(res);
                params['id'] = that.cid;
                params['type'] = args[0];
                that.request.doPost({
                    url: 'choiceVersion',
                    data: params,
                    success: (result => {
                        if (result && result.code == 200) {
                            if (result.data && result.data[0]) {
                                that.buffer.clearBuffer(that.buffer.getRandKey(that.cid, args[0]));
                                that.quote.setTypeByParam('data', true);
                                that.quote.setTypeByParam('price', true);
                            }
                        } else {
                            that.warn.onError(result.msg || Messages.FAIL.DATA);
                        }
                    })
                });
                // }
            } else {
                // if (!that.aid) {
                //     that.quote.setMultipleDataByType(JSON.parse(res), args[0]);
                // } else {
                if (that.aid) {
                    this.reg.setTypeByParam('detail', true);
                }
                // }
                // that.reloadData();
                // that.reloadPrice();
                that.quote.setTypeByParam('data', true);
                that.quote.setTypeByParam('price', true);
            }
        }, (rea) => {
            console.log(rea);
        });
    }

    /**
     * 增减项目中添加细项
     * @param args
     */
    addItemCart(data: any, aid: number) {
        const that = this;
        // else {
        if (that.showBranchByType(data.type)) {
            const branch = that.modalService.open(ItemCartComponent, {
                centered: true,
                keyboard: true,
                backdrop: 'static',
                size: 'lg'
            });
            branch.componentInstance.type = data.type;
            branch.componentInstance.id = that.cid;
            branch.componentInstance.aid = aid;
            branch.componentInstance.title = data.name;
            branch.result.then((res) => {
                if (res) {
                    this.reg.setTypeByParam('detail', true);
                }
            },
                (rea) => {
                    // console.log(rea);
                    that.quote.setTypeByParam('data', true);
                });
        } else {
            const branch = that.modalService.open(ItemComponent, {
                centered: true,
                keyboard: true,
                backdrop: 'static',
            });
            //类型
            branch.componentInstance.type = data.type;
            //报价id
            branch.componentInstance.id = that.cid;
            //增减项目id
            branch.componentInstance.aid = aid;

            branch.componentInstance.title = data.name;

            branch.result.then((res) => {
                if (res) {
                    this.reg.setTypeByParam('detail', true);
                    // that.quote.setTypeByParam("data", true);
                    // that.quote.setTypeByParam("price", true);
                }
            },
                (rea) => {
                    // console.log(rea);
                });
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


    //新增小项到订单
    // addData(...args) {
    //     let that = this;
    //     let branch = that.modalService.open(ChoiceComponent, {
    //         centered: true,
    //         keyboard: true
    //     });
    //     branch.componentInstance.type = args[0];
    //     // branch.componentInstance.visible = true;
    //     branch.componentInstance.id = that.cid;
    //     branch.componentInstance.versionId = args[1];
    //     branch.componentInstance.versionType = args[2];
    //     branch.result.then((res) => {
    //         if (res) {
    //             that.quote.setMultipleDataByType(JSON.parse(res), args[0]);
    //             // that.quote.loadPrice(that.cid);
    //             that.reloadPrice();
    //         }
    //     }, (rea) => {
    //         console.log(rea);
    //     })
    // }

    //增减项到订单
    // buildData(...args) {
    //     let that = this;
    //     if (args[0] !== 4) {
    //         let choice = that.modalService.open(ItemCartComponent, {
    //             centered: true,
    //             keyboard: true,
    //             backdrop: "static",
    //             size: "lg"
    //         });
    //         choice.componentInstance.type = args[0];
    //         choice.componentInstance.pauseId = that.aid;
    //         choice.componentInstance.versionId = args[1];
    //         choice.componentInstance.versionType = args[2];
    //
    //         choice.result.then((res) => {
    //             if (res.code == 200) {
    //
    //             }
    //         }, (rea) => {
    //             console.log(rea);
    //         });
    //     } else {
    //         let item = that.modalService.open(ItemComponent, {
    //             centered: true,
    //             keyboard: true
    //         });
    //         item.componentInstance.type = args[0];
    //         item.componentInstance.aid = that.aid;
    //         item.result.then((res) => {
    //             if (res.code == 200) {
    //                 that.reg.setTypeByParam("detail",true);
    //             } else {
    //                 that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
    //             }
    //         }, (rea) => {
    //             console.log(rea);
    //         });
    //     }
    // }

    /**
     *工程管理费的调用
     * @param {number} ratio
     */
    editEngineer(ratio: number) {
        const that = this;
        const engineer = this.modalService.open(EngineesComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
            size: 'lg'
        });
        engineer.componentInstance.data = that.data;
        engineer.componentInstance.radio = ratio;

        engineer.result.then(res => {
            if (res) {
                this.request.doPost({
                    url: 'cancelEngineer',
                    data: {
                        quoteId: that.cid,
                        ids: res
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            // if (that.state === Default.STATE.ITEM_2) {
                            //     that.loadFinance(that.cid);
                            // }
                            this.quote.setTypeByParam('data', true);
                            this.quote.setTypeByParam('price', true);
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            }
        }, err => {
            console.log(err);
            // this.quote.loadData(this.cid);
        });
    }

    getData(data) {
        return !(data && data.length > 0);
    }

    modifyOk() {
        // let that = this;
        if (this.modifyForm.valid) {
            const params = this.modifyForm.value;
            this.request.doPost({
                url: 'upQuote',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        if (this.currentType !== 1) {
                            this.quote.updateQuoteData(params['id'], this.currentType, params['num']);
                        } else {
                            this.quote.updateQuoteDataForColumn(params['id'], this.currentType, params['num']);
                        }
                        this.quote.setTypeByParam('price', true);
                        this.modifyCancel();
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        if (res.data) {
                            this.warn.onError(res.data);
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    }
                })
            });
        }
    }

    modifyCancel() {
        this.isModify = false;
        this.modifyTitle = '';
        this.currentNumber = '';
        this.currentId = 0;
        this.currentType = 0;
        this.modifyForm.reset();
    }

    /**
     * 修改备注和优惠价格
     * @param type
     * @param data
     */
    modifyNotes(type, data) {
        const that = this;
        // debugger
        // that.modify[type] = !that.modify[type];
        const params = { id: that.cid };
        if (type === 'remark') {
            params['remark'] = data;
        }
        // if (!that.modify[type]) {
        this.loading = true;
        that.request.doPost({
            url: 'savePriceOrRemark',
            data: params,
            success: (res => {
                this.loading = false;
                if (res && res.code == 200) {
                    if (type === 'remark') {
                        that.quote.setTypeByParam('head', true);
                    } else {
                        that.quote.setTypeByParam('data', true);
                        that.quote.setTypeByParam('price', true);
                    }
                    // that.setDefaultToFalse();
                    // that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
        // }
    }

    /**
     * 上传备注时添加图片
     */
    uploadRemark(e: any) {
        e.stopPropagation();
        e.preventDefault();
        let that = this, upLoading = false;
        const upload = that.modalService.open(UploaderMultisComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static'
        });
        const originImgs = that.remarkImgs;

        upload.componentInstance.title = '上传备注图片';
        upload.componentInstance.cid = that.cid;
        upload.componentInstance.open = true;
        upload.componentInstance.num = originImgs.length;
        upload.componentInstance.total = 11;
        upload.componentInstance.split = 'remark';


        upload.result.then(res => {
            upLoading = true;
            if (res && res.length > 0 && upLoading) {
                const userAgent = navigator.userAgent;
                //判断是否IE<11浏览器
                const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
                //判断是否IE的Edge浏览器
                const isEdge = userAgent.indexOf('Edge') > -1 && !isIE;
                //判断是否为IE11
                const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
                if (isEdge) {
                    console.log('isEdge');
                } else if (isIE11) {
                    res = res.filter((v, index) => index % 2 == 0);
                    upLoading = false;
                    const imgs = originImgs.concat(res);
                    that.saveRemarkImgs(imgs);
                } else {
                    upLoading = false;
                    const imgs = originImgs.concat(res);
                    // alert("imgs==========================\n"+JSON.stringify(imgs));
                    that.saveRemarkImgs(imgs);
                }
            }
        }, (rea) => {
            console.log(rea);
        });
    }

    /**
     * 删除备注图片
     * @param index
     */
    removeRemarkImg(e, index) {
        e.stopPropagation();
        e.preventDefault();
        this.remarkImgs.splice(index, 1);
        this.saveRemarkImgs(this.remarkImgs);
    }

    // openLarge(e, src) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     this.isVisible = true;
    //     this.largeImg = src;
    // }

    handleCancel() {
        this.isVisible = false;
        this.largeImg = null;
    }

    saveRemarkImgs(urls) {
        this.remarkImgs = [];
        this.request.doPost({
            url: 'saveRemarkPhotos',
            data: {
                id: this.cid,
                urls: urls
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.remarkImgs = urls;
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
                // if (this.state === Default.STATE.ITEM_2) {
                //     this.quote.loadFinanceHeadById(this.cid);
                // } else {
                //     this.quote.loadQuoteHeadById(this.cid);
                // }
                this.quote.setTypeByParam('head', true);
            })
        });
        // }
    }

    /**
     * 显示添加大项
     * @param data
     */
    addBranchItem(data) {
        this.branchVisible = true;
        this.branchTitle = '添加大项名称';
        this.branchInfo = null;
        this.branchItem = data;
    }

    /**
     * 修改类型项目中名称 取消
     */
    modifyBranchItem(e: any, data: any) {
        e.stopPropagation();
        e.preventDefault();
        this.branchVisible = true;
        this.branchTitle = '修改大项名称';
        this.branchEdit = true;
        this.branchInfo = data.name;
        this.branchId = data.infoBranchId;
    }

    /**
     * 添加大项 确定
     */
    branchOk() {
        const that = this;
        if (that.branchForm.valid) {
            that.request.doPost({
                url: 'addQuoteBranchItem',
                data: {
                    quoteId: that.cid,
                    infoBranchName: that.branchForm.value.branchInfo,
                    type: that.branchItem.type
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.branchInfo = res.data.infoBranchName;
                        that.branchId = res.data.infoBranchId;
                        that.bubbleModalByBranch();
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    /**
     * 修改大项信息
     */
    modifyBranchOk() {
        const that = this;
        // console.log(this.branchId);
        if (that.branchEdit && that.branchId) {
            const params = { id: that.cid };
            // params["oldName"] = that.oldName;
            params['infoBranchId'] = that.branchId;
            params['newName'] = that.branchInfo;
            this.request.doPost({
                url: 'modifyBasicQuote',
                data: params,
                success: (res => {
                    that.branchCancel();
                    if (res && res.code == 200) {
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.quote.setTypeByParam('data', true);
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
            that.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    /**
     * 添加大项后的回调
     */
    bubbleModalByBranch() {
        const that = this;
        if(that.baseQuote.dataVersion == 1){
            const modal =  that.modalService.open(ItemBasicComponent,
                {
                    centered: true,
                    keyboard: true,
                    size:"lg"
                });
            modal.componentInstance.type = 1;
            let params = {};
            params['type'] = that.branchItem.type;
            params['infoBranchName'] = that.branchInfo? that.branchInfo: '';
            if (that.branchId) {
                params['infoBranchId'] = that.branchId;
            }
            params['id'] = that.cid;
            that.branchCancel();
            modal.result.then(res =>{
                let ids = [];
                res.forEach(item=>{
                    ids.push(item.id)
                })
                params['infoIds'] = ids;
                that.request.doPost({
                    url: 'addBasicQuote',
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                            that.quote.setTypeByParam('data', true);
                            that.quote.setTypeByParam('price', true);
                        } else {
                            that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
                
                
            },(err) =>{
                console.log(err);
            })
        } else{
            if (that.showBranchByType(that.branchItem.type)) {
                const branch = that.modalService.open(ItemCartComponent, {
                    centered: true,
                    keyboard: true,
                    backdrop: 'static',
                    size: 'lg'
                });
                branch.componentInstance.type = that.branchItem.type;
                branch.componentInstance.id = that.cid;
                branch.componentInstance.versionId = that.branchItem.versionId;
                branch.componentInstance.versionType = that.branchItem.versionType;
                branch.componentInstance.infoName = that.branchInfo;
                branch.componentInstance.infoId = that.branchId;
                branch.componentInstance.title = that.branchItem.name;
                that.branchCancel();
                branch.result.then((res) => {
                    if (res) {
                        that.quote.setTypeByParam('data', true);
                        that.quote.setTypeByParam('price', true);
                    }
                },
                    (rea) => {
                        // console.log(rea);
                        that.quote.setTypeByParam('data', true);
                    });
            } else {
                const branch = that.modalService.open(ItemComponent, {
                    centered: true,
                    keyboard: true,
                    backdrop: 'static',
                });
                //类型
                branch.componentInstance.type = that.branchItem.type;
                //大项id
                branch.componentInstance.infoId = that.branchId;
                //报价id
                branch.componentInstance.id = that.cid;
                //内容
                branch.componentInstance.content = null;
                that.branchCancel();
                branch.result.then((res) => {
                    if (res) {
                        that.quote.setTypeByParam('data', true);
                        that.quote.setTypeByParam('price', true);
                    }
                },
                    (rea) => {
                        // console.log(rea);
                    });
            }
        }   
        

        // }
    }

    /**
     * 添加大项 取消
     */
    branchCancel() {
        this.branchVisible = false;
        this.branchInfo = null;
        this.branchEdit = false;
        this.branchItem = null;
        this.branchId = null;
        this.branchTitle = '';
        this.branchForm.reset();
    }

    //显示添加项目大项后选择小项目
    showBranchByType(type: number) {
        switch (type) {
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                return true;
            default:
                return false;
        }
    }

    /**
     * 添加细项目（装修类型、主材、个性化项目）
     * @param
     */
    addItem(data, item) {
        const that = this;
        const branch = that.modalService.open(ItemCartComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
            size: 'lg'
        });
        branch.componentInstance.type = data.type;
        branch.componentInstance.id = that.cid;
        branch.componentInstance.versionId = data.versionId;
        branch.componentInstance.versionType = data.versionType;
        branch.componentInstance.infoName = item.name;
        branch.componentInstance.infoId = item.infoBranchId;
        branch.componentInstance.title = data.name;

        branch.result.then((res) => {
            if (res) {
                that.quote.setTypeByParam('data', true);
                that.quote.setTypeByParam('price', true);
            }
        }, (rea) => {
            // console.log(rea);
        });
    }

    addOther(data, item) {
        const that = this;
        const branch = that.modalService.open(ItemComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
        });
        //类型
        branch.componentInstance.type = data.type;
        //大项id
        branch.componentInstance.infoId = item.infoBranchId;
        //报价id
        branch.componentInstance.id = that.cid;
        //内容
        branch.componentInstance.content = null;
        branch.result.then((res) => {
            if (res) {
                that.quote.setTypeByParam('data', true);
                that.quote.setTypeByParam('price', true);
            }
        },
            (rea) => {
                console.log(rea);
            });
    }


    /**
     * 修改其它项目
     * @param type
     * @param items
     */
    editItem(type, items) {
        const that = this;
        const item = that.modalService.open(ItemComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static'
        });
        item.componentInstance.type = type;
        item.componentInstance.content = items;
        item.componentInstance.id = that.cid;
        item.result.then((res) => {
            if (res) {
                that.quote.setTypeByParam('data', true);
                that.quote.setTypeByParam('price', true);
            }
        }, (rea) => {
            console.log(rea);
        });
    }

    /**
     * 修改类型项目中的名称
     * @param name
     */
    // openModifyBranch(name) {
    //     this.branchModify = true;
    //     this.oldName = name;
    //     this.infoBranchName = name;
    // }

    /**
     * 修改类型项目中名称 确定
     */
    // branchModifyOk() {
    //     // let that = this;
    //     if (this.branchModifyForm.valid) {
    //         let params = {id: this.quote.getDataId()};
    //         params = Object.assign(params, this.branchModifyForm.value);
    //         this.request.doPost({
    //             url: "modifyBasicQuote",
    //             data: params,
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     this.branchModifyCancel();
    //                     this.reloadData();
    //                     // that.quote.setMultipleDataByType(res.data[0], 1);
    //                     // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
    //                 } else {
    //                     this.warn.onError(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     }
    //
    // }

    /**
     * 删除大项
     * @param id 大项id
     */
    delModifyBranch(id: number) {
        const that = this;
        if (id) {
            this.request.doPost({
                url: 'delBasicQuote',
                data: {
                    id: that.cid,
                    // name: name
                    infoBranchId: id
                },
                success: (res => {
                    if (res && res.code == 200) {
                        // this.quote.setMultipleDataByType(res.data[0], 1);
                        // that.quote.loadPrice(that.cid);
                        // this.reloadData();
                        // this.reloadPrice();
                        // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.quote.setTypeByParam('data', true);
                        that.quote.setTypeByParam('price', true);
                    } else {
                        that.warn.onError(res.smg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    /**
     * 复制项目
     * @param {number} id 当前复制项目id
     * @param {number} diff 区别大小项目（1：大项，2：小项）
     */
    copyItem(e: any, id: number, diff: number) {
        e.stopPropagation();
        e.preventDefault();
        if (id && diff) {
            this.request.doPost({
                url: 'copyQuoteBranchItem',
                data: {
                    quoteId: this.cid,
                    copyId: id,
                    type: diff
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam('data', true);
                        this.quote.setTypeByParam('price', true);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }

    }

    /**
     * 工式数量变换
     * @param e
     * @param data
     */
    changeValue(e: any, data: any) {
        data.num = e.num;
        data.formula = e.formula;
    }


    /**
     * 设计费总和
     * @param designs
     * @param type
     * @returns {number}
     */
    getDesignTotal(designs, type) {
        let total = 0;
        if (designs && designs.length > 0) {
            for (const des of designs) {
                if (des.id === this.selectDesignId) {
                    total += this.changeToInt(des[type], 2);
                }
            }
        }
        return (Number(total) / Math.pow(10, 2));
    }


    submitAll() {
        const that = this;
        // that.lower = false;
        that.request.doPost({
            url: 'submitQuote',
            data: {
                id: that.cid,
                price: this.discount,
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    // that.quote.loadQuoteHeadById(that.cid);
                    this.quote.setTypeByParam('head', true);
                    // that.setDefaultToFalse();
                } else {
                    if (res.data) {
                        that.warn.onError(res.data);
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        });
    }
    // 预算已确认时改为修改并提交 v2.2.5
    confirmSubmitToModify(){
        const that = this;
        that.request.doPost({
            url: 'withdrawalConfirmation',
            data: {
                quoteId: that.cid
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.quote.setTypeByParam('head', true);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // switchShow(sm) {
    //     sm.isShow = !sm.isShow;
    //     return;
    // }

    submit(e) {
        e.stopPropagation();
        e.preventDefault();
        /**
         * 去除最低成本时lower的判定
         */
        this.submitAll();
        // let that = this;
        // that.request.doPost({
        //     url: "savePriceOrRemark",
        //     data: {id: that.quote.getDataId()},
        //     success: (res => {
        //         if (res && res.code == 200) {
        //             that.lower = res.data["lower"];
        //             that.quote.loadPrice(that.cid);
        //             that.setDefaultToFalse();
        //             if (!that.lower) {
        //                 that.submitAll();
        //             }
        //             // that.lower = true;
        //         } else {
        //             that.warn.onError(res.msg || Messages.FAIL.DATA);
        //         }
        //     })
        // })
    }

    // lowerClose() {
    //     this.lower = false;
    // }



    //显示修改最终实付价格
    showFinalPriceBtn() {
        return showBtnByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && this.baseQuote.retreat === 0;
    }


    //显示每栏的提示按钮
    //锁定后预算不可编辑 v2.2.5
    showBtnByState() {
        return (showMakeBtnByState(this.baseQuote) && showConfirmByState(this.baseQuote)) && equalToSame(this.user.getPhone(), this.designers) && (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && this.baseQuote.retreat === 0 && !this.aid && (this.baseQuote.lockingBudget === 0 || !this.baseQuote.lockingBudget);
    }

    /**
     * 控制保存按钮
     * @returns {boolean}
     */
    // 待确认展示保存 v2.2.4
    // 已确认合同展示修改且预算未锁定 v2.2.5
    showSubmitByState() {
        return (showBtnByState(this.baseQuote)) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0 && this.baseQuote && !this.aid && this.baseQuote.confirmState === 0
    }
    /*
     * 展示头部预算状态时间 v2.2.4
     */
    showBudgetTime() {
        return this.baseQuote;
    }
    /**
     * 导出
     * @returns {boolean}
     */
    showExpressByState() {
        return showExpressByState(this.baseQuote);
    }

    //显示提交到客户（新增撤回2019-08-12）
    //客户提交 2020-01-07 v2.1.9新增
    //预算未锁定展示按钮，已锁定不展示按钮 v2.2.5
    showBtnByStateToCustomer() {
        return showCustomerByState(this.baseQuote) &&
            equalToSame(this.user.getPhone(), this.designers) &&
            this.baseQuote.retreat === 0 &&
            (this.state === Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) &&
            !this.aid && showConfirmByState(this.baseQuote) && (this.baseQuote.lockingBudget === 0 || !this.baseQuote.lockingBudget);
    }

    /**
     * 提交附件
     * @param accessIds
     * @returns {Promise}
     */
    submitToAnnex(accessIds) {
        return new Promise((resolve, reject) => {
            if (this.cid) {
                this.request.doPost({
                    url: 'submitOfferContractListFirst',
                    data: {
                        ids: accessIds,
                        quoteId: this.cid
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(true);
                        } else {
                            reject(res.msg || Messages.FAIL.DATA);
                        }
                    })

                });
            }
        });
    }

    /**
     * 查询附件
     * @returns {Promise}
     */
    annexDetail() {
        return new Promise((resolve, reject) => {
            if (this.cid) {
                this.request.doPost({
                    url: 'getOfferContractList',
                    data: {
                        quoteId: this.cid,
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(res.data);
                        } else {
                            reject(res.msg);
                        }
                    })
                });
            }
        });
    }

    /**
     * 提交客户并附件(v2.1.8去除附件后的提交客户)
     */
    confirmSubmitToCustomer() {
        this.submitToCustomer(this.cid)
            .then(res => {
                this.warn.onMsgSuccess(res);
            }).catch(err => {
                this.warn.onMsgError(err);
            });
    }

    /**
     * 提交客户
     */
    submitToCustomer(cid): Promise<any> {
        return new Promise((resolve, reject) => {
            if (cid) {
                this.request.doPost({
                    url: 'pushQuote',
                    data: { id: cid },
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(res.msg || Messages.SUCCESS.DATA);
                            this.quote.setTypeByParam('head', true);
                        } else {
                            reject(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            }
        });
    }

    /**
     * 订单状态为已签单且预算状态已确认 v2.1.9
     * @returns {boolean}
     */
    showBtnByStateToTransmit() {
        return this.baseQuote && this.baseQuote.state === 3 && this.baseQuote.confirmState === 2
            && equalToSame(this.user.getPhone(), this.designers) && !this.aid
            && this.baseQuote.retreat === 0 && (this.state == Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10);
    }

    /**
     * 预算状态已确认且预算未锁定展示提交成本审核 v2.2.4
     * 展示修改 v2.2.5
     * @returns {boolean}
     */

    showBtnByStateToAudit() {
        return this.baseQuote && this.baseQuote.confirmState === 2
            && equalToSame(this.user.getPhone(), this.designers) && !this.aid
            && this.baseQuote.retreat === 0 && (this.state == Default.STATE.ITEM_1 || this.state === Default.STATE.ITEM_10) && (this.baseQuote.lockingBudget === 0 || !this.baseQuote.lockingBudget);
    }

    /** 
     *  点击提交成本审核 v2.2.4
     */
    submitToCostaudit() {
        if (this.cid) {
            this.request.doPost({
                url: "submitCostReview",
                data: { id: this.cid },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam("head", true);
                    } else if (res && res.code == 1235) {
                        this.warn.onModalInfo({
                            title: "提示",
                            content: res.msg,
                            ok: () => {
                                console.log("tips");
                            }
                        })
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        } else {
            this.warn.onWarn(Messages.ERROR.QUOTE_ID);
        }
    }

    submitToTransmit() {
        if (this.pauseState == '1') {
            this.warn.onWarn('当前有未完成的增减项，不能派单');
        } else {
            if (this.cid) {
                this.request.doPost({
                    url: 'sendQuote',
                    data: { id: this.cid },
                    success: (res => {
                        if (res && res.code == 200) {
                            // this.quote.loadQuoteHeadById(this.cid);
                            this.quote.setTypeByParam('head', true);
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        } else if (res && res.code == 9007) {
                            this.warn.onModalInfo({
                                title: "提示",
                                content: "客户尚未全部确认图纸",
                                ok: () => {
                                    console.log("tips");
                                }
                            })
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            } else {
                this.warn.onWarn(Messages.ERROR.QUOTE_ID);
            }
        }
    }

    //是否可以修改当前数据
    showAddOrDelByState() {
        return showAddOrDelByState(this.baseQuote) && this.aid && this.state !== 5;
    }

    //是否显示下面的增减项目
    showRegular() {
        return showRegularByState(this.baseQuote);
    }

    //是否显示保存
    // showSaveByState(){
    //     return showSaveByState(this.baseQuote) && equalToSame(this.user.getPhone(),this.designers);
    // }

    converseToDecimal(unit, num) {
        const result = this.changeToInt(unit, 2) * this.changeToInt(num, 2) / Math.pow(10, 4);
        return changeToDecimal(result);
    }

    // setDefaultToFalse() {
    //     this.modify = {
    //         discount: false,
    //         remark: false
    //     }
    // }

    combineImgs(o) {
        return ObjToArrByImg(o);
    }

    //增减项目的提示框
    changeModify(accept, type, e) {
        e.stopPropagation();
        e.preventDefault();
        this.changeVisible = true;
        this.changeNumber = null;
        const item = JSON.stringify(accept);
        this.changeItem = JSON.parse(item);
        this.changeType = type;
        this.changeTitle = type === 1 ? '增加项目' : '减少项目';
    }

    changeModifyOk() {
        if (this.changeNumber > 0) {
            if (this.changeType === 1) {
                this.changeItem.num = this.changeNumber ? this.changeNumber : 0;
            } else {
                this.changeItem.num = this.changeNumber ? '-' + this.changeNumber : 0;
            }

            // if (this.changeList && this.changeList[0]) {
            //     this.changeList[0].infos.push(this.changeItem);
            // }
            // console.log(this.changeItem);
            this.modifyPause(this.aid, this.changeItem);
            // this.changeModifyCancel();
        } else {
            this.warn.onError(Messages.ERROR.INPUT);
        }

    }

    changeModifyCancel() {
        this.changeVisible = false;
        this.changeItem = null;
        this.changeNumber = null;
        this.changeTitle = null;
        this.changeForm.reset();
    }

    changeModifyAll() {
        this.changeNumber = this.changeItem.num ? this.changeItem.num : null;
    }

    /**自动补充说明**/
    fillModify(type) {
        if (type === 1) { return; } else {
            this.changeNumber = Number(this.changeNumber) > Number(this.changeItem.num) ? this.changeItem.num : this.changeNumber;
        }
    }

    /**
     * 备选回调增减项目
     * @param aid
     * @param item
     */
    // changeRegulars($e) {
    //     console.log($e);
    // (regularsEmitter)="changeRegulars($event)"
    // }

    modifyPause(aid, item) {
        if (aid) {
            this.request.doPost({
                url: 'modifyPause',
                data: {
                    pauseId: aid,
                    id: item.id,
                    num: item.num
                },
                success: (res => {
                    this.changeModifyCancel();
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.reg.setTypeByParam('detail', true);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    //修改设计费
    choiceDesign(id) {
        if (!this.showBtnByState()) { return false; }
        this.selectDesignId = id;
        this.request.doPost({
            url: 'choiceDesign',
            data: {
                id: this.cid,
                choiceId: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    // this.reloadPrice();
                    this.quote.setTypeByParam('price', true);
                    this.quote.setTypeByParam('design', true);
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })

        });
    }

    //导出
    exportSheet(cid) {
        this.request.doGetExport({ url: 'export', quoteId: cid });
    }

    /**
     * 整理个性化项目的拖动问题
     * @param infos
     * @returns {any[]}
     */
    // getSortIds(infos) {
    //     let ids = [];
    //     if (infos && infos.length > 0) {
    //         for (let info of infos) {
    //             ids.push(info.id);
    //         }
    //     }
    //     return ids;
    // }

    // arrowUp(index) {
    //     let current = this.materials[index],
    //         fore = this.materials[index - 1];
    //     this.materials[index - 1] = current;
    //     this.materials[index] = fore;
    //     this.drag = true;
    // }
    //
    // arrowDown(index) {
    //     let current = this.materials[index],
    //         back = this.materials[index + 1];
    //     this.materials[index + 1] = current;
    //     this.materials[index] = back;
    //     this.drag = true;
    // }


    remarkItem(m: any, items: any) {
        this.isRemark = true;
        this.remarkId = m.id;
        this.remarkString = m.remark;
        console.log(m);
        console.log(items);
        this.remarkItems = items;
        this.remarkDo = m;
    }

    remarkCancel() {
        this.isRemark = false;
        this.remarkString = '';
        this.remarkId = null;
        this.remarkForm.reset();
    }

    remarkOk() {
        this.isRemark = false;
        if (this.remarkForm.valid) {
            this.request.doPost({
                url: 'saveQuoteRemark',
                data: {
                    quoteId: this.cid,
                    id: this.remarkId,
                    remark: this.remarkString
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        // this.renderRemark(this.remarkDo, this.remarkString, this.remarkItems);
                        this.remarkDo.remark = this.remarkString;
                        console.log(this.remarkDo);
                        this.remarkCancel();

                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }

                })
            });
        }
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

    // editNum(e,id){
    //     console.log(e);
    //     e.stopPropagation();
    //     e.preventDefault();
    //     console.log(id);
    //     let inp = this.el.nativeElement.querySelector("#edit-num-"+id);
    //     console.log(inp);
    //     // console.log(inp);
    //     inp.removeAttribute("disabled");
    //     inp.focus();
    // }

    ngOnDestroy() {
        this.cid = null;
        this.quote.setQuoteData(null);
        // this.quote.resetQuotePrice();
    }

    /**
     * 重新渲染数据（body）
     */
    reloadData(...args) {
        this.loading = true;
        if (this.cid) {
            this.quote.loadData(this.cid, ...args)
                .then(res => {
                    this.loading = false;
                    if (args && args.length > 0) {
                        res[0]['expand'] = true;
                        const index = this.data.findIndex(d => d.type === args[0]);
                        if (index !== undefined) {
                            this.data.splice(index, 1, res[0]);
                        }
                    } else {
                        this.renderData(res);
                    }
                }).catch(err => {
                    this.warn.onError(err);
                });
        } else {
            this.warn.onMsgError(Messages.PARAM_EMPTY);
        }

    }

    /**
     * 加载价格
     */
    reloadPrice() {
        const p = new Promise((resolve, reject) => {
            this.request.doPost({
                url: 'detailPrice',
                data: { id: this.cid },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        });
        p.then(res => {
            this.renderPrice(res);
        }).catch(err => {
            this.warn.onError(err);
        });
    }

    /**
     * 渲染设计费
     */
    // reloadDesign() {
    //     let p = new Promise((resolve, reject) => {
    //         this.quote.loadDesign(this.cid, resolve, reject);
    //     });
    //     p.then(res => {
    //         this.renderPrice(res);
    //     }).catch(err => {
    //         this.warn.onError(err);
    //     })
    // }

    /**
     * 渲染价格
     * @param e
     */
    renderPrice(res) {
        this.totalPrice = res && res['totalPrice'] ? res['totalPrice'] : 0;
        this.finalPrice = res && res['finalPrice'] ? res['finalPrice'] : 0;
        this.preferentialPrice = res && res['preferentialPrice'] ? res['preferentialPrice'] : 0;
    }

    // reloadPause(aid) {
    //     if (aid) {
    //         let p = new Promise((resolve, reject) => {
    //             this.reg.loadDetail(aid, resolve, reject);
    //         });
    //         p.then(res => {
    //             this.pauseList = res;
    //         }).catch(err => {
    //             this.warn.onMsgError(err);
    //         })
    //     }
    // }

    /**
     * 展出图片
     * @param imgs 所有待导出图片信息流
     */
    exportImages(images: Array<any>) {
        // let zip = new JSZip();
        // let ps = [];
        // for (let i = 0; i < imgs.length; i++) {
        //     let p = new Promise((resolve, reject) => {
        //         imageBase64(imgs[i], resolve, reject);
        //     });
        //     ps.push(p);
        // }
        //
        // Promise.all(ps).then(result => {
        //     if (result && result.length > 0) {
        //         for (let i = 0; i < result.length; i++) {
        //             zip.file(getUrlName(imgs[i]), result[i], { base64: true });
        //         }
        //         zip.generateAsync({ type: "blob" })
        //             .then(function (content) {
        //                 saveAs(content, "images.zip");
        //             });
        //     }
        // }).catch(err => {
        //     console.log(err);
        // })
        this.loading = true;
        if (images && images.length > 0) {
            const imgs = [];
            images.forEach(img => {
                console.log(img);
                imgs.push({
                    url: img,
                    name: getUrlName(img)
                });
            });
            downloadFiles(imgs, 'exportImages.zip');
            setTimeout(() => {
                this.loading = false;
            }, 1000 * imgs.length);
        }
    }

    showRemarkImgBg(src) {
        return setStyleBg(src, 72, 72);
    }

    getCompiledId(id: number) {
        return compiledTplId(id);
    }

    /**
     * 重置当前颜色组
     * @param {string} colours
     * @returns {Array<string>}
     */
    renderColors(colours: string): Array<string> {
        return renderColors(colours);
    }

    findColorReset(color: string, colours: string): string {
        return findColorReset(color, colours);
    }

    /**
     * 选择颜色
     * @param {string} color
     */
    selectColorChange(color: string, item: any) {
        if (color && item.id) {
            this.request.doPost({
                url: 'choiceQuoteColor',
                data: {
                    infoId: item.id,
                    colorName: color
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        item.colours = this.findColorReset(color, item.colours);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    /**
     * 获取预算状态
     */
    showBudgetByState() {
        return getBudgetByState(this.baseQuote ? this.baseQuote['confirmState'] : null);
    }

    // /**
    //  * 重新加载工程费用
    //  */
    // reloadQuoteData(...args){
    //     if(this.cid){
    //         this.quote.loadData(this.cid,type)
    //             .then(res =>{
    //                 if(res){
    //                     let eng = this.data.filter(d => d.type === type);
    //
    //                 }
    //             }).catch(err =>{
    //                 this.warn.onMsgError(err);
    //         })
    //     }
    // }

    /**
     * 加密url
     * @param {string} id
     * @returns {any}
     */
    btoa(id: string) {
        return btoa(id);
    }

    /**
     * 监听上传图片后，输入备注框的高度变化
     * @returns {{height: string}}
     */
    remarkStyle() {
        return {
            'height':
                this.remarkImgs && this.remarkImgs.length > 0 ? (this.remarkImgs.length >= 5 ? '152px' : '72px') : '72px'
        };
    }

    /**
     * 监听regular数据变化
     * @param e
     */
    regularListener(e: any) {
        if (e && e.list) {
            this.pauseList = e.list;
            // console.log(this.pauseList);
            /* let bool = this.showTipByPrice(this.pauseList.pause.applyActualPrice, this.pauseList.ratio);
            if(this.baseQuote.lockingBudget == 1){
                this.showAddOrDelTitle = "预算已开始成本审核，请需修改联系成本同事解除锁定"
            }else{
                this.showAddOrDelTitle = bool ? "增项直接提交至客户等待确认" : "减项需提交至公司等待确认";
            }    */
        }
    }
    openLarge(src, index) {
        this.imgIndex = index;
        this._albums = [];
        src.forEach(img => {
            this._albums.push({ src: img });
        });
    }
    //2.2.3增加流程，当减项时需要添加审核人员
    //2.2.4 增项或减项都需要添加审核人员
    addAudit() {
        /*
        if (!this.showTipByPrice(this.pauseList.pause.applyActualPrice, this.pauseList.ratio)) {
            let info = this.modalService.open(InfoComponent, {
                centered: true,
                keyboard: true,
                backdrop: "static"
            });
            info.componentInstance.type = 13;
            info.componentInstance.id = this.cid;
            info.componentInstance.member=this.pauseList.employee?this.pauseList.employee:'';
            info.componentInstance.price = this.pauseList.pause;
            info.result.then((res) => {
                // this. submitItem();
                this.reg.setTypeByParam("history", true);
                this.quote.setTypeByParam("head", true);
            })
        } else {
            this.submitItem();
        } */
        if (this.baseQuote.lockingBudget == 1) {
            this.warn.onModalInfo({
                title: '提示',
                content: '预算已开始成本审核，请需修改联系成本同事解除锁定',
                ok: () => {
                    console.log('tips');
                }
            });
        } else {
            this.submitItem();
        }
    }
    /**
     * 提交增减项目
     */
    submitItem() {
        if (this.aid && this.pauseList) {
            const amount = this.pauseList.pause.applyActualPrice;
            const remark = this.pauseList.pause.remark;
            if (Reg.NUM_DECIMAL_INT.test(amount)) {
                this.request.doPost({
                    url: 'savePause',
                    data: {
                        pauseId: this.aid,
                        amount: amount ? amount : 0,
                        remark: remark ? remark : ''
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            if (JSON.stringify(res.data) == "{}") {
                                this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                                this.reg.setTypeByParam('history', true);
                                this.quote.setTypeByParam('head', true);
                                this.reg.setTypeByParam('detail', true);
                            } else {
                                if (res.data && res.data.isNode == 0) {
                                    this.warn.onModalInfo({
                                        title: '提示',
                                        content: '提交后等待客户确认',
                                        ok: () => {
                                            console.log('tips');
                                        }
                                    });
                                    this.reg.setTypeByParam('history', true);
                                    this.quote.setTypeByParam('head', true);
                                    this.reg.setTypeByParam('detail', true);
                                } else {
                                    if (res.data && res.data.state == 1) {
                                        const info = this.modalService.open(InfoComponent, {
                                            centered: true,
                                            keyboard: true,
                                            backdrop: 'static'
                                        });
                                        info.componentInstance.type = 13;
                                        info.componentInstance.id = this.cid;
                                        info.componentInstance.member = res.data.employee ? res.data.employee : '';
                                        info.componentInstance.price = this.pauseList.pause;
                                        info.result.then((res) => {
                                            this.reg.setTypeByParam('history', true);
                                            this.quote.setTypeByParam('head', true);
                                            this.reg.setTypeByParam('detail', true);
                                        }, (err) => { });
                                    } else {
                                        if(res.data.employee.positionName){
                                            this.warn.onModalInfo({
                                                title: '提示',
                                                content: '提交后需要（' + res.data.employee.positionName + res.data.employee.name + '）审核',
                                                ok: () => {
                                                    console.log('tips');
                                                }
                                            });
                                        }else{
                                            this.warn.onModalInfo({
                                                title: '提示',
                                                content: '提交后需要'+ res.data.employee.name + '审核',
                                                ok: () => {
                                                    console.log('tips');
                                                }
                                            });
                                        }
                                        this.reg.setTypeByParam('history', true);
                                        this.quote.setTypeByParam('head', true);
                                        this.reg.setTypeByParam('detail', true);
                                    }
                                }
                            }

                        } else {
                            this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            } else {
                this.warn.onWarn(Messages.ERROR.INPUT);
            }
        }
    }


    /**
     * 判断显示增减项目的提交按钮
     * @returns {any}
     */
    disableByState() {
        if (this.pauseList && this.pauseList.pause) {
            return showAddOrDelSubmitByState(this.pauseList.pause.state)
                && this.baseQuote && this.baseQuote.retreat === 0
                && getAddAndDelByStatus(this.baseQuote.state)
                && showDetailByState(this.pauseList.pause.state);

        }
        return false;

    }



    /**
     * 判定实付与预设值的情况
     * @param actual 实付金额
     * @param ratio 预设值金额
     * @returns {boolean} true:实付>=预设
     */
    showTipByPrice(actual, ratio) {
        // return (Number(actual) >= Number(ratio))
        //2.2.3修改
        return (actual - ratio) >= 0;
    }
}
