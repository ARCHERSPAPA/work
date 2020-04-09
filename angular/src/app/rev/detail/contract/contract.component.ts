import { Component, OnInit } from '@angular/core';
import { Messages } from "../../../model/msg";
import { WarningService } from "../../../service/warning.service";
import * as UserValidate from "../../../validate/user-validate";
import { RequestService } from "../../../service/request.service";
import { QuoteService } from "../../../service/quote.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsLocaleService, defineLocale, zhCnLocale } from 'ngx-bootstrap';
import { qtTypes, drawingTypes, disputeTypes, contractTypes, Default } from "../../../model/constant";
import { UserService } from "../../../service/user.service";
import { atob, btoa, editContractByState, equalToSame, getIntByTotal, getPayType, editContractPageByState } from "../../../model/methods";
import { fadeAnimate } from "../../../animation/transform.component";
import { HeaderService } from "../../../service/header.service";



defineLocale('zhcn', zhCnLocale);

@Component({
    selector: 'rev-detail-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./../detail.scss', './contract.component.scss'],
    animations: [fadeAnimate]
})
export class ContractComponent implements OnInit {

    public cid: string;

    public contractForm: FormGroup;

    public theEmployer: string;
    public representative: string;
    public officeArea: string;
    public phoneNumber: string;
    public contactNumber: string = "";
    public engineeringSurvey: string;
    public engineeringArea: number;
    public engineeringTimeLimit: string;

    public engineeringStartTime: Date;
    public engineeringStartTimeRemark: string = "";


    public representativeCardNo: string;

    //控制可选项目展示
    // public toggleSetting: boolean = false;
    public toggle: any = {
        setting: false,
        item: false
    }

    //可选选项
    // public append:any = {content:""};
    // public appends: Array<any> = [];
    /**
     * 补充说明
     * @type {string}
     */
    public appends: string = "";

    /**
     * 补充优惠和条款
     * @type {number}
     */
    public preferential: string = "";
    public clause: string = "";

    public penalty: number = 10;
    public liquidated: number;
    public clearSite: number = 2;

    //清运费设置(无论价格或者汉字均可)
    public clearPrice: string = "详见预算";

    //初始化时间参数
    public minTime = this.getDateToZero();

    /**
     * 选择时间长度
     * @type {Date}
     */
    public startTime = new Date(this.minTime.getTime() + 1800000);
    public divisionTime = new Date(this.minTime.getTime() + 43200000);
    public maxTime = new Date(this.minTime.getTime() + 84600000);

    public constructAmBeginTime: Date = this.startTime;
    public constructAmEndTime: Date = this.divisionTime;
    public constructPmBeginTime: Date = this.divisionTime;
    public constructPmEndTime: Date = this.maxTime;

    // public constructAmBeginTime: Date;
    // public constructAmEndTime: Date;
    // public constructPmBeginTime: Date;
    // public constructPmEndTime: Date;

    public contractTypes: Array<any> = contractTypes;
    public contractType: string = "2";


    public disputeTypes: Array<any> = disputeTypes;
    public disputeType: string = "2";
    public disputeDetail: string;

    public drawingTypes: Array<any> = drawingTypes;
    public drawingType: string = "3";
    public drawingDetail: Date;

    public qtTypes: Array<any> = qtTypes;
    public qtType: string = "2";
    public qtDetail: string;

    public contractId: number;

    // public engineeringContactNumber:string;
    //是否为当次修改或者提交判定标准
    public isModify: boolean = false;


    public pays: any;
    //预算总金额
    public totalPay: number = 0;
    //增减项
    public pauses: any;

    public item: number = -1;

    public minDate: Date = new Date();


    //修改付款方式
    // public isModifyPayType: boolean = false;
    public modifyForm: FormGroup;
    public payTypes: any = contractTypes;
    public payType: number = 0;


    //修改付款金额
    public isModifyPayCount: boolean = false;
    public modifyCountForm: FormGroup;
    public pid: number;

    public amount: number;

    //v2.1.7新增收款时间说是、收据编号
    public customerPayTime: string = "";
    public receipt: string = "";
    public editReceiveCache: { [key: string]: any } = {};

    public remark: string;
    public payList: Array<any> = null;

    //修改收款金额
    // public isModifyReceiveCount: boolean = false;
    // public modifyReceiveForm: FormGroup;

    //完成时间
    public overTime: Date;
    public finishBool: boolean = false;

    public state: number = Default.STATE.ITEM_1;
    public baseQuote: any;
    public designQuote: any;
    public finalPrice: number;


    //是否查看合同权限
    public loadContract: boolean = true;

    //合同地址拉取
    // public browseContractState: boolean = false;
    public contractUrl: string;

    constructor(private request: RequestService,
        private warn: WarningService,
        private quote: QuoteService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private user: UserService,
        private router: Router,
        private header: HeaderService) {
    }

    ngOnInit() {

        try {
            this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));
        } catch (e) {
            this.state = Default.STATE.ITEM_1;
        }
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
                this.loadFinanceData();
            }
        });

        /**
         * 表单验证
         */
        this.contractForm = this.fb.group({
            theEmployer: [this.theEmployer, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50)
            ]],
            representative: [this.representative, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]],
            officeArea: [this.officeArea, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30)
            ]],
            phoneNumber: [this.phoneNumber, [
                Validators.required,
                UserValidate.ValidatePhone
            ]],
            contactNumber: [this.contactNumber, [
                UserValidate.ValidateCommunicate
            ]],
            engineeringSurvey: [this.engineeringSurvey, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50)
            ]],
            //2.1.9暂时取消
            engineeringArea: [{ value: this.engineeringArea, disabled: true }, [
                // Validators.required
            ]],
            engineeringTimeLimit: [this.engineeringTimeLimit, [
                Validators.required,
                Validators.min(1),
                Validators.max(180),
                UserValidate.ValidateMinNum
            ]],
            engineeringStartTime: [this.engineeringStartTime, [
                this.startTimeValidator
            ]],
            engineeringStartTimeRemark: [this.engineeringStartTimeRemark, [
                this.startTimeRemarkValidator
            ]],
            // append:[this.append,[]],
            appends: [this.appends, [
                Validators.maxLength(350),
                UserValidate.ValidateAnxinSign
            ]],
            representativeCardNo: [this.representativeCardNo, [
                Validators.required,
                Validators.minLength(15),
                Validators.maxLength(18),
                UserValidate.ValidateIdCard
            ]],
            penalty: [this.penalty, [
                Validators.max(20),
                UserValidate.ValidatePrice
            ]],
            liquidated: [this.liquidated, [
                UserValidate.ValidatePrice
            ]],
            clearSite: [this.clearSite, [
                Validators.max(100),
                UserValidate.ValidateMinNum
            ]],
            clearPrice: [this.clearPrice, []],
            constructAmBeginTime: [this.constructAmBeginTime, []],
            constructAmEndTime: [this.constructAmEndTime, []],
            constructPmBeginTime: [this.constructPmBeginTime, []],
            constructPmEndTime: [this.constructPmEndTime, []],

            contractType: [this.contractType, []],
            disputeType: [this.disputeType, []],
            disputeDetail: [this.disputeDetail, [
                this.disputeValidator
            ]],
            drawingType: [this.drawingType, []],
            drawingDetail: [this.drawingDetail, [
                this.drawValidator
            ]],
            qtType: [this.qtType, []],
            qtDetail: [this.qtDetail, [
                this.qtValidator
            ]],
            preferential: [this.preferential, [
                Validators.maxLength(350),
                UserValidate.ValidateAnxinSign
            ]],
            clause: [this.clause, [
                Validators.maxLength(350),
                UserValidate.ValidateAnxinSign
            ]]
            // engineeringContactNumber:[this.engineeringContactNumber,[
            //     UserValidate.ValidateCommunicate
            // ]],
        });

        //修改付款方式
        // this.modifyForm = this.fb.group({
        //     quoteId: [this.cid, [
        //         Validators.required
        //     ]],
        //     type: ['', [
        //         Validators.required
        //     ]]
        // });

        this.modifyCountForm = this.fb.group({});

        // this.modifyReceiveForm = this.fb.group({
        //     quoteId: [this.cid, [
        //         Validators.required
        //     ]],
        //     id: ['', [
        //         Validators.required
        //     ]],
        //     amount: [this.amount, [
        //         UserValidate.ValidatePrice,
        //         Validators.maxLength(10)
        //     ]],
        //     customerPayTime: [this.customerPayTime, [
        //         Validators.maxLength(20)
        //     ]],
        //     receipt: [this.receipt, [
        //         Validators.maxLength(20)
        //     ]]
        // });

    }


    ngDoCheck() {
        if (this.quote.getTypeByParam("contract")) {
            this.contractForm.reset();
            this.quote.setTypeByParam("contract", false);
            this.loadFinanceData();
        }
        if (this.header.getHeaderInfo() && this.header.getHeadBool()) {
            // this.header.setHeadBool(false);
            this.baseQuote = this.header.getHeaderInfo()["quoteBase"];
            // console.log(this.baseQuote)
            this.designQuote = this.header.getHeaderInfo()["designers"];
            if (!this.showBtnByState()) {
                this.checkFormDisabled();
            }
        }

        // console.log(this.baseQuote);
        // console.log(this.designQuote);
        // console.log(this.user.getPhone());
        // console.log(!this.showBtnByState());
    }


    loadFinanceData(...args) {
        let p;
        if (this.state === Default.STATE.ITEM_2) {
            p = this.quote.loadFinanceContract(this.cid);
        } else {
            p = this.quote.loadQuoteContract(this.cid);
        }

        p.then(res => {
            this.renderData(res);
            if (args && args.length > 0) {
                if (this.pays && this.pays.length > 0) {
                    let pay = this.pays.filter(item => {
                        return item.id == args[0];
                    });
                    if (pay && pay[0].id) {
                        this.startEditReceive(pay[0]);
                    }

                }
            }
        }).catch(err => {
            this.warn.onError(err);
        });
    }

    /**
     * 检查选项
     */
    checkFormDisabled() {
        if (this.contractForm && this.contractForm.valid) {
            let controls = this.contractForm.controls;
            for (let key of Object.keys(controls)) {
                if (!key.includes("receive")) {
                    controls[key].disable();
                }
            }

        }
    }

    checkValidatorByType(type): void {
        this.contractForm.controls[type].updateValueAndValidity();
    }

    startTimeValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value && this.contractForm && !this.contractForm.controls['engineeringStartTimeRemark'].value) {
            return { required: true }
        }
        return {};
    }

    startTimeRemarkValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value && this.contractForm && !this.contractForm.controls['engineeringStartTime'].value) {
            return { required: true }
        }
        return {};
    }

    drawValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.drawingType.value === "1" && !control.value) {
            return { required: true };
        }
        return {};
    };

    disputeValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.disputeType.value === "1" && !control.value) {
            return { required: true };
        }
        return {};
    };

    qtValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.qtType.value === "3" && !control.value) {
            return { required: true };
        }
        return {};
    };

    /**
     * 渲染时的数据
     * @param data
     */
    renderContract(data) {
        try {
            if (data) {
                this.theEmployer = data.theEmployer;
                this.representative = data.representative;
                this.officeArea = data.officeArea;
                this.phoneNumber = data.phoneNumber;
                this.contactNumber = data.contactNumber;
                this.engineeringSurvey = data.engineeringSurvey;
                this.engineeringArea = data.engineeringArea;
                this.engineeringTimeLimit = data.engineeringTimeLimit;
                this.engineeringStartTime = data.engineeringStartTime ? new Date(data.engineeringStartTime) : null;
                this.engineeringStartTimeRemark = data.engineeringStartTimeRemark ? data.engineeringStartTimeRemark : "";

                this.representativeCardNo = data.representativeCardNo;
                this.penalty = data.penalty ? data.penalty : 10;

                this.clearSite = data.clearSite ? data.clearSite : 2;
                this.clearPrice = data.clearPrice ? data.clearPrice : "详见预算";

                this.constructAmBeginTime = data.constructAmBeginTime ? new Date(data.constructAmBeginTime) : new Date(this.startTime);
                this.constructAmEndTime = data.constructAmEndTime ? new Date(data.constructAmEndTime) : new Date(this.divisionTime);
                this.constructPmBeginTime = data.constructPmBeginTime ? new Date(data.constructPmBeginTime) : new Date(this.divisionTime);
                this.constructPmEndTime = data.constructPmEndTime ? new Date(data.constructPmEndTime) : new Date(this.maxTime);
                this.contractType = data.contractType ? String(data.contractType) : "2";

                this.disputeType = data.disputeType ? String(data.disputeType) : "2";

                this.disputeDetail = data.disputeDetail ? data.disputeDetail : null;
                this.drawingType = data.drawingType ? String(data.drawingType) : "3";
                this.drawingDetail = data.drawingDetail ? new Date(data.drawingDetail) : null;
                this.liquidated = data.liquidated;

                this.qtType = data.qtType ? String(data.qtType) : "2";
                this.qtDetail = data.qtDetail ? data.qtDetail : null;
                this.contractId = data.id;

                this.checkValidatorByType("engineeringStartTimeRemark");
                this.checkValidatorByType("engineeringStartTime");
            }

            this.isModify = this.representativeCardNo ? true : false;
        } catch (e) {
            console.error(e);
        }

    }

    renderPays(pays) {
        this.pays = pays;
        this.updateReceive();
    }

    doContractSubmit() {
        let that = this;
        if (that.contractForm.valid && that.cid) {
            let params = that.contractForm.value;

            params["quoteId"] = that.cid;

            if (params["contractType"] === "0") {
                delete params["contractType"];
            }
            if (params["disputeType"] === "0") {
                delete params["disputeType"];
            }
            if (params["drawingType"] === "0") {
                delete params["drawingType"];
            }
            if (params["qtType"] === "0") {
                delete params["qtType"];
            }
            if (!params["disputeDetail"]) {
                delete params["disputeDetail"];
            }
            if (!params["qteDetail"]) {
                delete params["qteDetail"];
            }
            if (!params["drawingDetail"]) {
                delete params["drawingDetail"];
            }


            params["constructAmBeginTime"] = that.setParamTime(params["constructAmBeginTime"]);
            params["constructAmEndTime"] = that.setParamTime(params["constructAmEndTime"]);
            params["constructPmBeginTime"] = that.setParamTime(params["constructPmBeginTime"]);
            params["constructPmEndTime"] = that.setParamTime(params["constructPmEndTime"]);

            if (params["engineeringStartTime"]) {
                params["engineeringStartTime"] = that.setParamTime(params["engineeringStartTime"]);
            } else {
                delete params["engineeringStartTime"];
            }

            if (!params["contactNumber"]) {
                delete params["contactNumber"];
            }

            params["drawingDetail"] = params["drawingDetail"] ? that.setParamTime(params["drawingDetail"]) : "";
            params["appends"] = that.setItemAppends(params["appends"]);
            params["preferential"] = that.setItemAppends(params["preferential"]);
            params["clause"] = that.setItemAppends(params["clause"]);
            params["representativeCardNo"] = that.representativeCardNo;
            params["penalty"] = that.penalty;
            params["liquidated"] = that.liquidated;
            params["clearSite"] = that.clearSite;

            this.request.doPost({
                url: "submitContractQuote",
                data: params,
                success: res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam("head", true);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        }
    }

    renderData(data) {
        //合同内容部分：
        if (data && data["agreement"]) {
            this.renderContract(data.agreement);
        }
        if (data && data["pays"]) {
            this.renderPays(data.pays);
        }
        if (data && data["appends"]) {
            this.appends = this.getItemAppends(data["appends"]);
        }
        if (data && data["preferential"]) {
            this.preferential = this.getItemAppends(data["preferential"]);
        }
        if (data && data["clause"]) {
            this.clause = this.getItemAppends(data["clause"]);
        }
        this.finalPrice = data["finalPrice"];
        this.totalPay = (data && data["finalPrice"]) ? data["finalPrice"] : 0;

        if (data && data["pauses"]) {
            this.pauses = data.pauses;
        }
    }


    /**
     * 支付类型
     * @param type
     * @returns {string}
     */
    getPayType(type) {
        return getPayType(type);
    }

    // getPayItem(item) {
    //     return getPayItem(item);
    // }

    /**
     * 总待收金额
     * @returns {number}
     */
    // getSurplus() {
    //     let discount = 0;
    //     if (this.pays && this.pays.length > 0) {
    //         for (let pay of this.pays) {
    //             discount += this.toDecimal(pay.discountPrice);
    //         }
    //     }
    //     return (this.totalPay - discount);
    // }

    /**
     * 增减项目后的总计
     * @returns {any | number}
     */
    getPauses() {
        let p = 0;
        if (this.pauses && this.pauses.length > 0) {
            for (let pay of this.pauses) {
                p += this.toDecimal(pay.applyActualPrice);
            }
        }
        return this.toDecimal(this.totalPay + p);
    }
    confirmSubmitToCustomer(type) {
        if (type == 1) {
            if (this.baseQuote.customerName) {
                if (this.baseQuote.quoteDepartmentName) {
                    this.doContractSubmit()
                } else {
                    this.warn.onError('请先选择所属部门');
                }

            } else {
                this.warn.onError('请先填写客户资料');
            }

        } else {
            if (this.baseQuote.customerName) {
                if (this.baseQuote.quoteDepartmentName) {
                    this.submit()
                } else {
                    this.warn.onError('请先选择所属部门');
                }

            } else {
                this.warn.onError('请先填写客户资料');
            }
        }
    }


    submit() {
        let that = this;

        if (that.cid) {
            let params = that.contractForm.value;
            params["quoteId"] = that.cid;
            //校验身份证非法时，不保存
            if (that.contractForm.controls.representativeCardNo.valid) {
                params["representativeCardNo"] = that.representativeCardNo;
            }else{
                delete params["representativeCardNo"];
            }
            if (params["contractType"] === "0") {
                delete params["contractType"];
            }
            if (params["disputeType"] === "0") {
                delete params["disputeType"];
            }
            if (params["drawingType"] === "0") {
                delete params["drawingType"];
            }
            if (params["qtType"] === "0") {
                delete params["qtType"];
            }
            if (!params["disputeDetail"]) {
                delete params["disputeDetail"];
            }
            if (!params["qteDetail"]) {
                delete params["qteDetail"];
            }
            if (!params["drawingDetail"]) {
                delete params["drawingDetail"];
            }

            params["constructAmBeginTime"] = that.setParamTime(params["constructAmBeginTime"]);
            params["constructAmEndTime"] = that.setParamTime(params["constructAmEndTime"]);
            params["constructPmBeginTime"] = that.setParamTime(params["constructPmBeginTime"]);
            params["constructPmEndTime"] = that.setParamTime(params["constructPmEndTime"]);

            if (params["engineeringStartTime"]) {
                params["engineeringStartTime"] = that.setParamTime(params["engineeringStartTime"]);
            } else {
                delete params["engineeringStartTime"];
            }

            if (!params["contactNumber"]) {
                delete params["contactNumber"];
            }

            params["drawingDetail"] = params["drawingDetail"] ? that.setParamTime(params["drawingDetail"]) : "";
            params["appends"] = that.setItemAppends(params["appends"]);
            params["preferential"] = that.setItemAppends(params["preferential"]);
            params["clause"] = that.setItemAppends(params["clause"]);

            params["penalty"] = that.penalty;
            params["liquidated"] = that.liquidated;
            params["clearSite"] = that.clearSite;
            // params["constructAmEndTime"] = that.engineeringArea;

            that.request.doPost({
                url: "saveContractQuote",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.renderData(res.data["agreement"]);
                        that.loadFinanceData();


                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    confirm() {
        let that = this;
        that.request.doPost({
            url: "signQuote",
            data: { id: that.cid },
            success: (res => {
                if (res && res.code == 200) {
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.quote.setTypeByParam("head", true);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    setParamTime(time: Date) {
        return new Date(time).getTime();
    }

    /**
     * 合并条款目录
     * @param items
     * @returns {string}
     */
    getItemAppends(items) {
        let content = "";
        if (items && items.length > 0) {
            items.map(item => {
                content += item.content ? item.content : item;
            })
        }
        return content;
    }

    /**
     * 设置或者渲染条款
     * @param appends
     * @returns {any[]}
     */
    setItemAppends(appends) {
        let items = [];
        if (typeof appends === "string" && appends && appends.length > 0) {
            if (appends.length <= 175) {
                let num = Math.ceil(appends.length / 35);
                for (let i = 0; i < num; i++) {
                    items.push(appends.substring(i * 35, (i + 1) * 35));
                }
            } else {
                //判断是否整除5
                let odd = appends.length % 5;
                //均分处理基数
                let base = Math.floor(appends.length / 5);
                for (let j = 0; j < 5; j++) {
                    let start = j * base + (j ? odd : 0);
                    let end = (j + 1) * base + odd;
                    items.push(appends.substring(start, end));
                }
            }
            return items;
        } else
            return appends.length > 0 ? appends : items;
    }


    isNaN(totalPrice) {
        return isNaN(totalPrice);
    }

    modifyPayListOpen() {
        this.payList = this.getPays(this.pays);
        this.isModifyPayCount = true;
        this.modifyCountForm = this.fb.group(this.dramaticForm(this.payList));
    }

    dramaticForm(pays) {
        let obj = {};
        if (pays && pays.length > 0) {
            for (let i = 0; i < pays.length; i++) {
                obj["pay" + i] = ['', [
                    Validators.required,
                    UserValidate.ValidatePrice
                ]];
                if (i > 0) {
                    obj["percentage" + i] = ['', [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(1),
                        UserValidate.ValidateNumDecimal
                    ]];
                }
                obj["payTime" + i] = ['', [
                    Validators.maxLength(50)
                ]]
                obj["remark" + i] = ['', [
                    Validators.maxLength(120)
                ]]
            }
        }
        return obj;
    }

    modifyPayCountOk() {
        let that = this;
        let params = {
            quoteId: this.cid
        };
        params["pays"] = this.coverPays(this.payList);
        if (this.modifyCountForm.valid) {
            if (this.getTotal() !== this.totalPay) {
                that.warn.onError(Messages.ERROR.PAY);
            } else {
                that.request.doPost({
                    url: "changePayAmount",
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            // that.quote.setPayType(res.data);
                            that.modifyPayCountCancel();
                            // that.quote.setTypeByParam("contract", true);
                            that.pays = res.data;

                        } else {
                            that.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }
        }
        else {
            this.warn.onWarn(Messages.ERROR.SUBMIT_VALIDATE);
        }

    }

    modifyPayCountCancel() {
        this.pid = null;
        this.payList = null;
        this.isModifyPayCount = false;
        // this.quote.loadContract(this.cid);
    }

    getPays(paylist) {
        let pays = [];
        if (paylist && paylist.length > 0) {
            for (let pay of paylist) {
                pays.push({
                    type: pay.type,
                    id: pay.id,
                    amount: pay.totalPrice,
                    remark: pay.remark ? pay.remark : "",
                    payTime: pay.payTime ? pay.payTime : "",
                    percentage: Number((pay.percentage / 100).toFixed(4))
                });
            }
        }
        return pays;
    }

    coverPays(list) {
        let pays = []
        if (list && list.length > 0) {
            for (let pay of list) {
                pays.push({
                    type: pay.type,
                    id: pay.id,
                    amount: Number(pay.amount),
                    remark: pay.remark ? pay.remark : "",
                    payTime: pay.payTime ? pay.payTime : "",
                    percentage: Number(pay.percentage)
                });
            }
        }
        return pays;
    }

    getTotal() {
        let totalMount = 0;
        if (this.payList && this.payList.length > 0) {
            for (let pay of this.payList) {
                totalMount += Number(pay.amount);
            }
            ;
        }
        return Number(totalMount.toFixed(2));
    }

    /**
     * 监听金额后同步百分比
     * @param e
     * @param index
     */
    payAmount(e: any, index: number) {
        e.stopPropagation();
        e.preventDefault();
        if (this.payList && this.payList.length > index) {
            this.payList[index].amount = e.target.value;
            if (index <= 1) {
                let total = 0;
                if (index === 0) {
                    total = Number(this.payList[index].amount) + Number(this.payList[1].amount);
                } else {
                    total = Number(this.payList[index].amount) + Number(this.payList[0].amount);
                }
                if (this.totalPay !== 0) {
                    this.payList[1].percentage = Number((total / this.totalPay).toFixed(4));
                }
            } else {
                if (this.totalPay !== 0) {
                    this.payList[index].percentage = Number((this.payList[index].amount / this.totalPay).toFixed(4));
                }
            }

        }
    }

    /**
     * 监听百分比输入同时修改金额
     * @param e
     * @param {number} index
     */
    payPercentage(e: any, index: number) {
        e.stopPropagation();
        e.preventDefault();
        if (this.payList && this.payList.length > index) {
            this.payList[index].percentage = e.target.value;
            let amount;
            if (index <= 1) {
                amount = String(Number(this.payList[index].percentage) * this.totalPay - this.payList[0].amount);
                if (amount.lastIndexOf(".") > 0) {
                    this.payList[index].amount = Number(amount.substring(0, amount.lastIndexOf(".") + 3));
                } else {
                    this.payList[index].amount = Number(amount);
                }

            } else {
                amount = String(Number(this.payList[index].percentage) * this.totalPay);
                if (amount.lastIndexOf(".") > 0) {
                    this.payList[index].amount = Number(amount.substring(0, amount.lastIndexOf(".") + 3));
                } else {
                    this.payList[index].amount = Number(amount);
                }
                // this.payList[index].amount = Number(amount.substring(0,amount.lastIndexOf(".")+3));
            }
        }

    }

    toDecimal(price) {
        if (price) {
            var f = Number(price);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(price * 100) / 100;
            return f;
        }
        return 0;
    }

    /**
     * 删除收款项
     */
    delReceiveCount(id) {
        if (id && this.cid) {
            this.request.doPost({
                url: "delReceipt",
                data: {
                    quoteId: this.cid,
                    receiptId: id
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        let index = this.pays.findIndex(item => item.id == id);
                        this.pays.splice(index, 1);
                        this.loadFinanceData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 编辑收款项目
     * @param id
     */
    startEditReceive(pay: any) {
        this.editReceiveCache[pay.id + ''].edit = true;
        this.receiveForm(pay);
        // for (const item of Array) {
        //     this.form.addControl('formControlName' + this.i,
        //         new FormControl(null, [Validators.required]));
        //     i ++;}
    }

    /**
     * 保存收款项目
     **/
    saveEditReceive(id) {
        let index = this.pays.findIndex(item => item.id == id);

        if (id && this.cid) {
            let receive = this.editReceiveCache[id + ''].data;
            let params = {
                quoteId: this.cid,
                receiptId: receive.id,
                payType: receive.payType ? receive.payType : '',
                remark: receive.remark ? receive.remark : '',
                totalPrice: Number(receive.totalPrice ? receive.totalPrice : 0).toFixed(2),
                discountPrice: Number(receive.discountPrice ? receive.discountPrice : 0).toFixed(2),
                payTime: receive.payTime ? receive.payTime : '',
                customerPayTime: receive.customerPayTime ? receive.customerPayTime : '',
                receipt: receive.receipt ? receive.receipt : ''
            };
            this.request.doPost({
                url: "modifyReceipt",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        Object.assign(this.pays[index], receive);
                        this.editReceiveCache[id + ''].edit = false;
                        this.loadFinanceData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 取消保存收款项目
     * @param id
     */
    cancelEditReceive(id) {
        this.editReceiveCache[id + ''].edit = false;
    }

    /**
     * 复制当前的收款项目
     */
    updateReceive() {
        if (this.pays && this.pays.length > 0) {
            this.pays.forEach(pay => {
                this.editReceiveCache[pay.id + ''] = {
                    edit: false,
                    data: { ...pay }
                }
            });
        }
    }

    /**
     * 组装验证规则
     * @param pay
     */
    receiveForm(pay: any) {
        this.contractForm.addControl("receiveType" + pay.id, new FormControl(pay.payType, [Validators.maxLength(10)]))
        this.contractForm.addControl("receiveTotalPrice" + pay.id, new FormControl(pay.totalPrice, [Validators.maxLength(10)]))
        this.contractForm.addControl("receiveDiscountPrice" + pay.id, new FormControl(pay.discountPrice, [Validators.maxLength(10)]))
        this.contractForm.addControl("receiveCustomerPayTime" + pay.id, new FormControl(pay.customerPayTime, [Validators.maxLength(20)]))
        this.contractForm.addControl("receiveReceipt" + pay.id, new FormControl(pay.receipt, [Validators.maxLength(20)]))
        this.contractForm.addControl("receiveRemark" + pay.id, new FormControl(pay.remark, [Validators.maxLength(500)]))
    }

    /**
     * 添加收款项目
     * @param e
     */
    addReceive(e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.cid) {
            this.request.doPost({
                url: "addReceipt",
                data: { quoteId: this.cid },
                success: (res => {
                    if (res && res.code == 200) {
                        this.loadFinanceData(res.data);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 合计计算
     * @param {string} name
     * @returns {number}
     */
    getTotalReceive(name: string) {
        let total = 0;
        if (this.pays && this.pays.length > 0) {
            this.pays.forEach(item => {
                total += Number(item && item[name] ? item[name] : 0);
            })
        }
        return total;
    }

    /**
     * 完成时间
     */
    finishShow() {
        this.finishBool = true;
        this.contractForm.addControl("receiveFinishTime", new FormControl(''));
    }

    changeOverTime(e: any) {
        this.finishReceive(this.overTime);
    }

    /**
     * 完成收款
     */
    finishReceive(overTime) {
        if (this.cid && overTime) {
            this.request.doPost({
                url: "finishReceipt",
                data: {
                    quoteId: this.cid,
                    overTime: new Date(overTime).getTime()
                },
                success: (res => {
                    this.finishBool = false;
                    this.contractForm.removeControl("receiveFinishTime");
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    computedPercentage(total, all) {
        let t = Number(total),
            a = Number(all);
        if (a && a > 0) {
            return this.toDecimal(t / a) * 100;
        }
        return 0;
    }

    isValid(name: string, event: boolean): void {
        this[name] = event;
    }

    showBtnByState() {
        return editContractByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designQuote) && this.baseQuote.retreat === 0;
    }

    showBtnPageState() {
        return editContractPageByState(this.state);
    }

    //是否可以查看合同
    showContractByState() {
        return editContractByState(this.baseQuote);
    }

    browseContract() {
        let that = this;
        if (that.cid) {
            that.request.doPostApp({
                url: "viewQuoteContract",
                data: {
                    quoteId: that.cid,
                    makebaCompanyId: that.user.getCompanyId(),
                    concractType: 1
                },
                success: (res => {
                    if (res && res.code == 200) {
                        if (res.data && res.data["contractUrl"]) {
                            this.contractUrl = res.data["contractUrl"];
                            // let win = window.open("_blank");
                            // win.location.href = contractUrl;
                            window.open(res.data["contractUrl"], '_blank');
                        }
                        else {
                            that.router.navigate(['/view/contract'], { queryParams: { cid: btoa(that.cid) } });
                        }

                    } else {
                        if (res.code == 120) {
                            that.warn.onError(Messages.ERROR.SUBMIT_FREQUENTLY);
                        } else {
                            that.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    }
                })
            });
        }

    }

    getDateToZero() {
        let d = new Date();
        let y = d.getFullYear();
        let m = d.getMonth() + 1;
        let s = d.getDate();
        return new Date(y + "/" + m + "/" + s);
    }

    toggleItem(type) {
        this.toggle[type] = !this.toggle[type];
    }


    /**
     * 禁用日期
     * @param {Date} st
     * @returns {boolean}
     */
    disabledDate = (st: Date): boolean => {
        if (!st) return false;
        return (st.getTime() <= this.minDate.getTime());
    }

    disabledAmBeginHours = (): Array<number> => {
        return this.getTotalByTs(24, 13, 1);
    }

    disabledAmBeginMinutes = (hour: number): Array<number> => {
        if (hour >= 12) {
            return this.getTotalByTs(6, 1, 10);
        }
        return [];
    }

    changeAmBeginTime(e) {
        if (e) {
            let c = new Date(e);
            if (c.getHours() === 12) {
                c.setMinutes(0);
                this.constructAmBeginTime = c;
            }
        }
    }

    disabledAmEndTime = (): boolean => {
        if (!this.constructAmBeginTime) return true;
        return !this.showBtnByState();
    }

    disabledAmEndHours = (): Array<number> => {
        if (this.constructAmBeginTime) {
            let h = new Date(this.constructAmBeginTime).getHours();
            return this.getTotalByTs(24, 0, 1).filter(t => {
                return (t > 12 || t < h)
            });
        }
        return this.getTotalByTs(24, 0, 1);
    }

    disabledAmEndMinutes = (hour: number): Array<number> => {
        if (this.constructAmBeginTime) {
            let h = new Date(this.constructAmBeginTime).getHours();
            if (h === hour) {
                let m = new Date(this.constructAmBeginTime).getMinutes();
                return this.getTotalByTs(6, 0, 10).filter(t => {
                    return t <= m;
                })
            }
        }
        if (hour >= 12) {
            return this.getTotalByTs(6, 1, 10);
        }
        return [];
    }

    //下午选择时刻
    disabledPmBeginHours = (): Array<number> => {
        return this.getTotalByTs(12, 0, 1);
    }

    disabledPmBeginMinutes = (hour: number): Array<number> => {
        if (hour < 12) {
            return this.getTotalByTs(6, 1, 10);
        }
        return [];
    }

    disabledPmEndTime = (): boolean => {
        if (!this.constructPmBeginTime) return true;
        return !this.showBtnByState();
    }

    disabledPmEndHours = (): Array<number> => {
        if (this.constructPmBeginTime) {
            let h = new Date(this.constructPmBeginTime).getHours();
            return this.getTotalByTs(24, 0, 1).filter(t => {
                return (t < h)
            });
        }
        return this.getTotalByTs(12, 0, 1);
    }

    disabledPmEndMinutes = (hour: number): Array<number> => {
        if (this.constructPmBeginTime) {
            let h = new Date(this.constructPmBeginTime).getHours();
            if (h === hour) {
                let m = new Date(this.constructPmBeginTime).getMinutes();
                return this.getTotalByTs(6, 0, 10).filter(t => {
                    return t < m;
                })
            }
        }
        if (hour < 12) {
            return this.getTotalByTs(6, 1, 10);
        }
        return [];
    }

    changeTime(e, t, bool) {
        if (e && t) {
            let start, end;
            if (bool) {
                start = new Date(e);
                end = new Date(t);
            } else {
                start = new Date(t);
                end = new Date(e);
            }
            start.setSeconds(0);
            end.setSeconds(0);
            if (start.getTime() > end.getTime()) {
                end.setHours(start.getHours());
                end.setMinutes(start.getMinutes());
            }
        }
    }

    getTotalByTs(t, s, r) {
        return getIntByTotal(t, s, r);
    }

    btoa(id: string) {
        return btoa(id);
    }

    ngOnDestroy() {
        this.pays = null;
    }


}
