import {Component, OnInit} from '@angular/core';
import {Messages} from '../../../model/msg';
import {WarningService} from '../../../service/warning.service';
import * as UserValidate from '../../../validate/user-validate';
import {RequestService} from '../../../service/request.service';
import {QuoteService} from '../../../service/quote.service';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BsLocaleService, defineLocale, zhCnLocale} from 'ngx-bootstrap';
import {qtTypes, drawingTypes, disputeTypes, contractTypes, Default} from '../../../model/constant';
import {UserService} from '../../../service/user.service';
import {
    atob,
    btoa,
    editContractByState,
    equalToSame,
    getIntByTotal,
    getPayType,
    editContractPageByState, saveTempContractByState
} from '../../../model/methods';
import {fadeAnimate} from '../../../animation/transform.component';
import {HeaderService} from '../../../service/header.service';
import {NzModalService} from 'ng-zorro-antd';


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
    // 合同总额 v2.2.5
    public agreementPrice: string;
    public theEmployer: string;
    // 统一社会信用代码号 v2.2.4
    public companyCode: any;
    public representative: string;
    public officeArea: string;
    public phoneNumber: string;
    public contactNumber = '';
    public engineeringSurvey: string;
    public engineeringArea: number;
    public engineeringTimeLimit: string;

    public engineeringStartTime: Date;
    public engineeringStartTimeRemark = '';


    public representativeCardNo: string;
    // 0代表对私合同 1代表对公合同 v2.2.4
    public agreementType: string = '0';
    // 展示废除合同 v2.2.4
    public abolish = false;
    // 客户签单时间 v2.2.4
    public billTime: any;
    // 合同提交时间 v2.2.4
    public pushTime: any;
    // 重签后的附件信息 v2.2.4
    public reSginInfo: any;
    // 合同状态 v2.2.4
    public confirmState: any;
    // 模板名 v2.2.4
    public templateName = '选择模板';
    // 保存的模板 v2.2.4
    public savePayList: any;

    // 选择模板 v2.2.4
    public selectAllTemplate: Array<any> = [];
    // 选中的索引v2.2.4
    public selectIndex = -1;

    //控制可选项目展示
    // public toggleSetting: boolean = false;
    public toggle: any = {
        setting: false,
        item: false
    };

    //可选选项
    // public append:any = {content:""};
    // public appends: Array<any> = [];
    /**
     * 补充说明
     * @type {string}
     */
    public appends = '';
    /**
     * 补充优惠和条款
     * @type {number}
     */
    public preferential = '';
    public clause = '';

    public penalty = 10;
    public liquidated: number;
    public clearSite = 2;

    //清运费设置(无论价格或者汉字均可)
    public clearPrice = '详见预算';

    //初始化时间参数
    public minTime = this.getDateToZero();

    /**
     * 选择时间长度
     * @type {Date}
     */
        //上午9：00
    public startTime = new Date(this.minTime.getTime() + 32400000);
    //上午12：00
    public divisionTime = new Date(this.minTime.getTime() + 43200000);

    public endTime = new Date(this.minTime.getTime() + 50400000);
    //下午18：00
    public maxTime = new Date(this.minTime.getTime() + 64800000);

    public constructAmBeginTime: Date = this.startTime;
    public constructAmEndTime: Date = this.divisionTime;
    public constructPmBeginTime: Date = this.endTime;
    public constructPmEndTime: Date = this.maxTime;

    // public constructAmBeginTime: Date;
    // public constructAmEndTime: Date;
    // public constructPmBeginTime: Date;
    // public constructPmEndTime: Date;

    public contractTypes: Array<any> = contractTypes;
    public contractType = '2';


    public disputeTypes: Array<any> = disputeTypes;
    public disputeType = '2';
    public disputeDetail: string;

    public drawingTypes: Array<any> = drawingTypes;
    public drawingType = '3';
    public drawingDetail: Date;

    public qtTypes: Array<any> = qtTypes;
    public qtType = '2';
    public qtDetail: string;

    public contractId: number;

    // public engineeringContactNumber:string;
    //是否为当次修改或者提交判定标准
    public isModify = false;


    public pays: any;
    //预算总金额
    public totalPay = 0;
    //增减项
    public pauses: any;
    //定制化金额
    public customizationPrice: number;
    public beforePausePrice: number;
    public afterPausePrice: number;

    public item = -1;

    public minDate: Date = new Date();


    //修改付款方式
    // public isModifyPayType: boolean = false;
    public modifyForm: FormGroup;
    public payTypes: any = contractTypes;
    public payType = 0;


    //修改付款金额
    public isModifyPayCount = false;
    public modifyCountForm: FormGroup;
    public pid: number;

    public amount: number;

    //v2.1.7新增收款时间说是、收据编号
    public customerPayTime = '';
    public receipt = '';
    public editReceiveCache: { [key: string]: any } = {};

    public remark: string;
    public payList: Array<any> = null;

    //修改收款金额
    // public isModifyReceiveCount: boolean = false;
    // public modifyReceiveForm: FormGroup;

    //完成时间
    public overTime: Date;
    public finishBool = false;

    public state: number = Default.STATE.ITEM_1;
    public baseQuote: any;
    public designQuote: any;
    public finalPrice: number;


    //是否查看合同权限
    public loadContract = true;

    //合同地址拉取
    // public browseContractState: boolean = false;
    public contractUrl: string = null;
    //合同未取得pdf时的数据存取
    public contractData: any;


    // //合同校验身份证
    // public isVisible: boolean=false;

    constructor(private request: RequestService,
                private warn: WarningService,
                private quote: QuoteService,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private modal: NzModalService,
                private modalService: NgbModal,
                private user: UserService,
                private router: Router,
                private header: HeaderService) {
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
                this.loadFinanceData();
            }
        });
        /**
         * 表单验证
         */
        this.contractForm = this.fb.group({
            agreementPrice: [this.agreementPrice, [
                Validators.required,
                UserValidate.ValidatePrice,
                Validators.minLength(1),
                Validators.maxLength(10)
            ]],
            agreementType: [this.agreementType, [
                Validators.required
            ]],
            /*  companyCode: [this.companyCode, [
                 this.startCompanyValidator,
                 Validators.maxLength(18)
             ]], */
            theEmployer: [this.theEmployer, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]],
            representative: [this.representative, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]],
            officeArea: [this.officeArea, [
                Validators.required,
                Validators.minLength(2),
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
            engineeringArea: [{value: this.engineeringArea, disabled: true}, [
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
            reAppends: [this.appends, [
                Validators.maxLength(280),
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

        //读取模板信息
        this.loadTemplate();
        //查看合同中的pdf文件
        if (!this.showContractByState()) {
            this.browseContract();
        }
    }


    ngDoCheck() {
        if (this.quote.getTypeByParam('contract')) {
            this.contractForm.reset();
            this.quote.setTypeByParam('contract', false);
            this.loadFinanceData();
            // this.reloadPrice();
        }
        if (this.header.getHeaderInfo() && this.header.getHeadBool()) {
            // this.header.setHeadBool(false);
            this.baseQuote = this.header.getHeaderInfo()['quoteBase'];

            this.designQuote = this.header.getHeaderInfo()['designers'];

            if (!this.showBtnByState() || this.state === Default.STATE.ITEM_6 || this.baseQuote.state === 3 && !this.abolish) {
                // console.log("check disabled");
                this.checkFormDisabled();
            } else {
                this.checkFormEnabled();
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
                    const pay = this.pays.filter(item => {
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

    loadTemplate() {
        this.request.doPost({
            url: 'selectPayTemplate',
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    console.log(res);
                    this.selectAllTemplate = res.data;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * 检查选项(兼容成本核算详情中合同v2.2.4)
     * 兼容无查看权限人员时数据添写被禁用v2.2.5
     */
    checkFormDisabled() {
        if (this.state !== 6 && this.showBtnByState()) {
            if (this.contractForm && this.contractForm.valid) {
                const controls = this.contractForm.controls;
                for (const key of Object.keys(controls)) {
                    if (!key.includes('receive')) {
                        controls[key].disable();
                    }
                }

            }
        } else {
            const controls = this.contractForm.controls;
            for (const key of Object.keys(controls)) {
                if (!key.includes('receive')) {
                    controls[key].disable();
                }
            }
        }
    }

    /**
     * 启用检查选项
     */
    checkFormEnabled() {
        const controls = this.contractForm.controls;
        for (const key of Object.keys(controls)) {
            if (!key.includes('receive')) {
                controls[key].enable();
                controls["engineeringArea"].disable()
            }
        }
    }

    /**
     * 放开验证
     */
    checkFormEnable() {
        const controls = this.contractForm.controls;
        for (const key of Object.keys(controls)) {
            controls[key].enable();
        }
    }

    /**
     * 监听输入变化
     * @param type
     */
    modelChangeValidatorByType(type): void {
        this.contractForm.controls[type].updateValueAndValidity();
    }

    /**
     * 初始化输入
     * @param type
     */
    checkValidatorByType(type): void {
        if (this.showBtnByState()) {
            if (this.contractForm.controls[type] && this.state !== Default.STATE.ITEM_6) {
                this.contractForm.controls[type].updateValueAndValidity();
                this.contractForm.controls[type].markAsDirty();
            }
        }
    }

    /* startCompanyValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value && this.contractForm && this.contractForm.controls['agreementType'].value == '1') {
            return {required: true}
        }
        return {};
    } */

    startTimeValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value && this.contractForm && !this.contractForm.controls['engineeringStartTimeRemark'].value) {
            return {required: true};
        }
        return {};
    }

    startTimeRemarkValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value && this.contractForm && !this.contractForm.controls['engineeringStartTime'].value) {
            return {required: true};
        }
        return {};
    }

    drawValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.drawingType.value === '1' && !control.value) {
            return {required: true};
        }
        return {};
    }

    disputeValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.disputeType.value === '1' && !control.value) {
            return {required: true};
        }
        return {};
    }

    qtValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.contractForm && this.contractForm.controls.qtType.value === '3' && !control.value) {
            return {required: true};
        }
        return {};
    }

    /**
     * 渲染时的数据
     * @param data
     */
    renderContract(data) {
        try {
            if (data) {
                this.agreementType = data.agreementType ? String(data.agreementType) : '0';
                this.theEmployer = data.theEmployer;
                this.companyCode = data.companyCode;
                this.representative = data.representative;
                this.officeArea = data.officeArea;
                this.phoneNumber = data.phoneNumber;
                this.contactNumber = data.contactNumber;
                this.engineeringSurvey = data.engineeringSurvey;
                this.engineeringArea = data.engineeringArea;
                this.engineeringTimeLimit = data.engineeringTimeLimit;
                this.engineeringStartTime = data.engineeringStartTime ? new Date(data.engineeringStartTime) : null;
                this.engineeringStartTimeRemark = data.engineeringStartTimeRemark ? data.engineeringStartTimeRemark : '';

                this.representativeCardNo = data.representativeCardNo;
                this.penalty = data.penalty ? data.penalty : 10;

                this.clearSite = data.clearSite ? data.clearSite : 2;
                this.clearPrice = data.clearPrice ? data.clearPrice : '详见预算';

                this.constructAmBeginTime = data.constructAmBeginTime ? new Date(data.constructAmBeginTime) : new Date(this.startTime);
                this.constructAmEndTime = data.constructAmEndTime ? new Date(data.constructAmEndTime) : new Date(this.divisionTime);
                this.constructPmBeginTime = data.constructPmBeginTime ? new Date(data.constructPmBeginTime) : new Date(this.endTime);
                this.constructPmEndTime = data.constructPmEndTime ? new Date(data.constructPmEndTime) : new Date(this.maxTime);
                this.contractType = data.contractType ? String(data.contractType) : '2';

                this.disputeType = data.disputeType ? String(data.disputeType) : '2';

                this.disputeDetail = data.disputeDetail ? data.disputeDetail : null;
                this.drawingType = data.drawingType ? String(data.drawingType) : '3';
                this.drawingDetail = data.drawingDetail ? new Date(data.drawingDetail) : null;
                this.liquidated = data.liquidated;

                this.qtType = data.qtType ? String(data.qtType) : '2';
                this.qtDetail = data.qtDetail ? data.qtDetail : null;
                this.contractId = data.id;
                this.pushTime = data.pushTime;
                this.confirmState = data.confirmState;
                if (this.showBtnByState()) {
                    this.modelChangeValidatorByType('engineeringStartTimeRemark');
                    this.modelChangeValidatorByType('engineeringStartTime');
                    this.checkValidatorByType('representativeCardNo');
                }

                if (this.agreementType == '1') {
                    this.checkValidatorByType('companyCode');
                }
            }

            this.isModify = this.representativeCardNo ? true : false;
        } catch (e) {
            console.error(e);
        }

    }

    renderPays(pays) {
        this.pays = pays;
        this.savePayList = this.getPays(pays);
        setTimeout(() => {
            const templateName = this.selectAllTemplate.filter(item => {
                return item.details[0].templateId == pays[0].templateId;
            });
            if (templateName && templateName.length > 0) {
                this.templateName = templateName[0].name;
                const index = this.selectAllTemplate.findIndex(item => {
                    return item.id == templateName[0].id;
                });
                this.selectIndex = index;
            } else {
                this.templateName = '选择模板';
                this.selectIndex = -1;
            }
        }, 500);
        this.updateReceive();
    }

    doContractSubmit(type = false) {

        const that = this;
        if (that.contractForm.valid && that.cid) {
            const params = that.contractForm.value;

            params['quoteId'] = that.cid;
            //不校验直接提交
            if (type) {
                params['isPass'] = 1;
            }
            if (params['contractType'] === '0') {
                delete params['contractType'];
            }
            if (params['disputeType'] === '0') {
                delete params['disputeType'];
            }
            if (params['drawingType'] === '0') {
                delete params['drawingType'];
            }
            if (params['qtType'] === '0') {
                delete params['qtType'];
            }
            if (!params['disputeDetail']) {
                delete params['disputeDetail'];
            }
            if (!params['qteDetail']) {
                delete params['qteDetail'];
            }
            if (!params['drawingDetail']) {
                delete params['drawingDetail'];
            }
            params['constructAmBeginTime'] = that.setParamTime(params['constructAmBeginTime']);
            params['constructAmEndTime'] = that.setParamTime(params['constructAmEndTime']);
            params['constructPmBeginTime'] = that.setParamTime(params['constructPmBeginTime']);
            params['constructPmEndTime'] = that.setParamTime(params['constructPmEndTime']);

            if (params['engineeringStartTime']) {
                params['engineeringStartTime'] = that.setParamTime(params['engineeringStartTime']);
            } else {
                delete params['engineeringStartTime'];
            }

            if (!params['contactNumber']) {
                delete params['contactNumber'];
            }

            params['drawingDetail'] = params['drawingDetail'] ? that.setParamTime(params['drawingDetail']) : '';
            if (this.reSginInfo && this.reSginInfo.length > 0) {
                params['appends'] = that.setItemReAppends(params['reAppends']);
            } else {
                params['appends'] = that.setItemAppends(params['appends']);
            }
            params['preferential'] = that.setItemAppends(params['preferential']);
            params['clause'] = that.setItemAppends(params['clause']);
            params['representativeCardNo'] = that.representativeCardNo;
            params['penalty'] = that.penalty;
            params['liquidated'] = that.liquidated;
            params['clearSite'] = that.clearSite;
            params['agreementType'] = that.agreementType;
            params['companyCode'] = that.companyCode;
            // params['agreementPrice'] = that.agreementPrice;
            params['payForm'] = {},
                params['payForm'].quoteId = that.cid;
            params['payForm'].pays = that.coverPays(that.savePayList);
            delete params['agreementPrice'];
            this.request.doPost({
                url: 'submitContractQuote',
                data: params,
                success: res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam('head', true);
                        this.quote.setTypeByParam('contract', true);
                    } else if (res && res.code == 202) {
                        this.idCardProcess(res.msg);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            });
        }
    }

    renderData(data) {
        //合同内容部分：
        if (data && data['agreement']) {
            this.renderContract(data.agreement);
        }
        if (data && data['pays']) {
            this.renderPays(data.pays);
        }
        if (data && data['appends']) {
            this.appends = this.getItemAppends(data['appends']);
        }
        if (data && data['preferential']) {
            this.preferential = this.getItemAppends(data['preferential']);
        }
        if (data && data['clause']) {
            this.clause = this.getItemAppends(data['clause']);
        }
        this.finalPrice = data['finalPrice'];
        this.totalPay = (data && data['finalPrice']) ? data['finalPrice'] : 0;
        this.agreementPrice = (data && data['finalPrice']) ? data['finalPrice'] : 0;
        if (this.agreementPrice == '0') {
            this.agreementPrice = ''
        }
        this.billTime = data['billTime'];

        this.reSginInfo = data['reSginInfo'];

        if (data && data['pauses']) {
            this.pauses = data.pauses;
        }

        //定制化价格v2.3.2
        this.customizationPrice = data["customizationPrice"];
        this.afterPausePrice = data["afterPrice"];
        this.beforePausePrice = data["beforePrice"];
    }

    // 合同总额
    changePrice() {
        const that = this;
        const params = that.contractForm.value;
        params['quoteId'] = that.cid;
        params['representativeCardNo'] = that.representativeCardNo;
        if (params['contractType'] === '0') {
            delete params['contractType'];
        }
        if (params['disputeType'] === '0') {
            delete params['disputeType'];
        }
        if (params['drawingType'] === '0') {
            delete params['drawingType'];
        }
        if (params['qtType'] === '0') {
            delete params['qtType'];
        }
        if (!params['disputeDetail']) {
            delete params['disputeDetail'];
        }
        if (!params['qteDetail']) {
            delete params['qteDetail'];
        }
        if (!params['drawingDetail']) {
            delete params['drawingDetail'];
        }
        params['constructAmBeginTime'] = that.setParamTime(params['constructAmBeginTime']);
        params['constructAmEndTime'] = that.setParamTime(params['constructAmEndTime']);
        params['constructPmBeginTime'] = that.setParamTime(params['constructPmBeginTime']);
        params['constructPmEndTime'] = that.setParamTime(params['constructPmEndTime']);

        if (params['engineeringStartTime']) {
            params['engineeringStartTime'] = that.setParamTime(params['engineeringStartTime']);
        } else {
            delete params['engineeringStartTime'];
        }

        if (!params['contactNumber']) {
            delete params['contactNumber'];
        }
        params['drawingDetail'] = params['drawingDetail'] ? that.setParamTime(params['drawingDetail']) : '';
        if (this.reSginInfo && this.reSginInfo.length > 0) {
            params['appends'] = that.setItemReAppends(params['reAppends']);
        } else {
            params['appends'] = that.setItemAppends(params['appends']);
        }
        params['preferential'] = that.setItemAppends(params['preferential']);
        params['clause'] = that.setItemAppends(params['clause']);
        params['penalty'] = that.penalty;
        params['liquidated'] = that.liquidated;
        params['clearSite'] = that.clearSite;
        params['agreementType'] = that.agreementType;
        params['companyCode'] = that.companyCode;
        if (that.agreementPrice && that.contractForm.get('agreementPrice').valid) {
            that.request.doPost({
                url: 'getModifyPrice',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        // this.quote.setTypeByParam('contract', true);
                        that.loadFinanceData();
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    enterPrice(e) {
        if (e.keyCode == "13" || e.key === 'Enter') {
            this.changePrice();
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
        // if (this.pauses && this.pauses.length > 0) {
        //     for (const pay of this.pauses) {
        //         p += this.toDecimal(pay.applyActualPrice);
        //     }
        // }
        //定制金额 v.2.3.3(2020.11.14)
        p += this.toDecimal(this.beforePausePrice);
        p += this.toDecimal(this.afterPausePrice);
        p += this.toDecimal(this.customizationPrice);
        p += this.toDecimal(this.totalPay);
        return p;
    }

    confirmSubmitToCustomer(type) {
        if (this.contractForm.valid) {
            if (type == 1) {
                if (this.baseQuote.customerName) {
                    if (this.baseQuote.quoteDepartmentName) {
                        if (this.contractForm.valid) {
                            this.doContractSubmit();
                        } else {
                            this.warn.onError('提交失败，请先核对信息格式及必填项');
                        }
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
        } else {
            this.warn.onMsgWarn(Messages.ERROR.INPUT);
        }

    }

    //2.2.3新增提交合同流程
    idCardProcess(msg) {
        this.modal.confirm({
            nzTitle: '提示',
            nzContent: `<b style="color: red;">${msg}</b>`,
            nzOkText: '继续',
            // nzOkType    : 'danger',
            nzOnOk: () => this.doContractSubmit(true),
            nzCancelText: '取消',
            // nzOnCancel: () => console.log('Cancel')
        });
    }

    //
    submit() {
        const that = this;
        //  && that.contractForm.get("agreementPrice").valid
        if (that.cid && that.contractForm.valid) {
            const params = that.contractForm.value;
            params['quoteId'] = that.cid;
            params['representativeCardNo'] = that.representativeCardNo;
            delete params['agreementPrice'];
            if (params['contractType'] === '0') {
                delete params['contractType'];
            }
            if (params['disputeType'] === '0') {
                delete params['disputeType'];
            }
            if (params['drawingType'] === '0') {
                delete params['drawingType'];
            }
            if (params['qtType'] === '0') {
                delete params['qtType'];
            }
            if (!params['disputeDetail']) {
                delete params['disputeDetail'];
            }
            if (!params['qteDetail']) {
                delete params['qteDetail'];
            }
            if (!params['drawingDetail']) {
                delete params['drawingDetail'];
            }
            params['constructAmBeginTime'] = that.setParamTime(params['constructAmBeginTime']);
            params['constructAmEndTime'] = that.setParamTime(params['constructAmEndTime']);
            params['constructPmBeginTime'] = that.setParamTime(params['constructPmBeginTime']);
            params['constructPmEndTime'] = that.setParamTime(params['constructPmEndTime']);

            if (params['engineeringStartTime']) {
                params['engineeringStartTime'] = that.setParamTime(params['engineeringStartTime']);
            } else {
                delete params['engineeringStartTime'];
            }

            if (!params['contactNumber']) {
                delete params['contactNumber'];
            }

            params['drawingDetail'] = params['drawingDetail'] ? that.setParamTime(params['drawingDetail']) : '';
            if (this.reSginInfo && this.reSginInfo.length > 0) {
                params['appends'] = that.setItemReAppends(params['reAppends']);
            } else {
                params['appends'] = that.setItemAppends(params['appends']);
            }
            params['preferential'] = that.setItemAppends(params['preferential']);
            params['clause'] = that.setItemAppends(params['clause']);

            params['penalty'] = that.penalty;
            params['liquidated'] = that.liquidated;
            params['clearSite'] = that.clearSite;
            params['agreementType'] = that.agreementType;
            params['companyCode'] = that.companyCode;
            // params['agreementPrice'] = that.agreementPrice;
            // params["constructAmEndTime"] = that.engineeringArea;
            params['payForm'] = {},
                params['payForm'].quoteId = that.cid;
            params['payForm'].pays = that.coverPays(that.savePayList);

            that.request.doPost({
                url: 'saveContractQuote',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.renderData(res.data['agreement']);
                        // that.renderData(res.data);
                        that.loadFinanceData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    confirm() {
        const that = this;
        that.request.doPost({
            url: 'signQuote',
            data: {id: that.cid},
            success: (res => {
                if (res && res.code == 200) {
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.quote.setTypeByParam('head', true);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
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
        let content = '';
        if (items && items.length > 0) {
            items.map(item => {
                content += item.content ? item.content : item;
            });
        }
        return content;
    }

    /**
     * 设置或者渲染条款
     * @param appends
     * @returns {any[]}
     */
    setItemAppends(appends) {
        const items = [];
        if (typeof appends === 'string' && appends && appends.length > 0) {
            if (appends.length <= 175) {
                const num = Math.ceil(appends.length / 35);
                for (let i = 0; i < num; i++) {
                    items.push(appends.substring(i * 35, (i + 1) * 35));
                }
            } else {
                //判断是否整除5
                const odd = appends.length % 5;
                //均分处理基数
                const base = Math.floor(appends.length / 5);
                for (let j = 0; j < 5; j++) {
                    const start = j * base + (j ? odd : 0);
                    const end = (j + 1) * base + odd;
                    items.push(appends.substring(start, end));
                }
            }
            return items;
        } else {
            return appends.length > 0 ? appends : items;
        }
    }

    /**
     * 设置重签后的条款
     * @param appends
     * @returns {any[]}
     */
    setItemReAppends(appends) {
        console.log(appends);
        if (appends && appends.length > 280) {
            appends = appends.slice(0, 280);
        }
        const items = [];
        if (typeof appends === 'string' && appends && appends.length > 0) {
            if (appends.length <= 140) {
                const num = Math.ceil(appends.length / 70);
                for (let i = 0; i < num; i++) {
                    items.push(appends.substring(i * 70, (i + 1) * 70));
                }
            } else {
                //判断是否整除4
                const odd = appends.length % 4;
                //均分处理基数
                const base = Math.floor(appends.length / 4);
                for (let j = 0; j < 4; j++) {
                    const start = j * base + (j ? odd : 0);
                    const end = (j + 1) * base + odd;
                    items.push(appends.substring(start, end));
                }
            }
            return items;
        } else {
            return appends.length > 0 ? appends : items;
        }
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
        const obj = {};
        if (pays && pays.length > 0) {
            for (let i = 0; i < pays.length; i++) {
                obj['pay' + i] = ['', [
                    Validators.required,
                    UserValidate.ValidatePrice
                ]];
                if (i > 0) {
                    obj['percentage' + i] = ['', [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(100),
                        // UserValidate.ValidateNumDecimal
                        UserValidate.ValidateNumToInt
                    ]];
                }
                obj['payTime' + i] = ['', [
                    Validators.maxLength(50)
                ]];
                obj['remark' + i] = ['', [
                    Validators.maxLength(120)
                ]];
            }
        }
        return obj;
    }

    modifyPayBalance() {
        let removeId;
        this.payList.forEach(item => {
            if (item.amount == '0.00') {
                item.amount = 0;
            }
        });
        for (let i = this.payList.length - 1; i >= 0; i--) {
            if (this.payList[i].amount !== 0) {
                removeId = this.payList[i].id;
                break;
            }
        }
        let total = 0, totalPercentage = 0;
        this.payList.forEach(item => {
            if (item.id !== removeId) {
                total = Number(this.accAdd(total, Number(item && item['amount'] ? item['amount'] : 0)));
                totalPercentage += Number(item && item['percentage'] ? item['percentage'] : 0);
            }
        });
        for (let i = this.payList.length - 1; i >= 0; i--) {
            if (this.payList[i].amount !== 0) {
                this.payList[i].amount = Number(this.accSub(this.totalPay, total));
                this.payList[i].percentage = 100 - totalPercentage;
                break;
            }

        }
    }


    modifyPayCountOk() {
        const that = this;
        const params = {
            quoteId: this.cid
        };
        params['pays'] = this.changePays(this.payList);
        if (this.modifyCountForm.valid) {
            if (this.getTotal() !== this.totalPay) {
                that.warn.onError(Messages.ERROR.PAY);
            } else {
                that.request.doPost({
                    url: 'changePayAmount',
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            // that.quote.setPayType(res.data);
                            that.modifyPayCountCancel();
                            // that.quote.setTypeByParam("contract", true);
                            that.pays = res.data;
                            this.templateName = '选择模板';
                            this.selectIndex = -1;
                            that.savePayList = that.getPays(that.pays);

                        } else {
                            that.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            }
        } else {
            this.warn.onWarn(Messages.ERROR.SUBMIT_VALIDATE);
        }

    }

    modifyPayCountCancel() {
        this.pid = null;
        this.payList = null;
        this.isModifyPayCount = false;
        // this.quote.loadContract(this.cid);
    }

    trims(e) {
        return e ? (e + '').trim() : null;
    }

    getPays(paylist) {
        const pays = [];
        if (paylist && paylist.length > 0) {
            for (const pay of paylist) {
                pays.push({
                    type: pay.type,
                    id: pay.id,
                    amount: pay.totalPrice,
                    remark: pay.remark ? pay.remark : '',
                    payTime: pay.payTime ? pay.payTime : '',
                    // percentage: Number((pay.percentage / 100).toFixed(4)),
                    percentage: pay.percentage ? Number(pay.percentage) : 0,
                    templateId: pay.templateId
                });
            }
        }
        return pays;
    }

    coverPays(list) {
        const pays = [];
        console.log(list);
        if (list && list.length > 0) {
            for (const pay of list) {
                pays.push({
                    type: pay.type,
                    id: pay.id,
                    amount: Number(pay.amount) ? Number(pay.amount) : Number(pay.totalPrice) ? Number(pay.totalPrice) : 0,
                    remark: pay.remark ? pay.remark : '',
                    payTime: pay.payTime ? pay.payTime : '',
                    percentage: pay.percentage ? Number(pay.percentage) : 0,
                    templateId: pay.templateId ? pay.templateId : ''
                });
            }
        }
        return pays;
    }

    changePays(list) {
        const pays = [];
        if (list && list.length > 0) {
            for (const pay of list) {
                pays.push({
                    type: pay.type,
                    id: pay.id,
                    amount: Number(pay.amount) ? Number(pay.amount) : Number(pay.totalPrice) ? Number(pay.totalPrice) : 0,
                    remark: pay.remark ? pay.remark : '',
                    payTime: pay.payTime ? pay.payTime : '',
                    percentage: Number(pay.percentage),
                });
            }
        }
        return pays;
    }

    getTotal() {
        let totalMount = 0;
        if (this.payList && this.payList.length > 0) {
            for (const pay of this.payList) {
                totalMount += Number(pay.amount);
            }

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
                    // .toFixed(4)
                    this.payList[1].percentage = Math.round(Number((total / this.totalPay)) * 100);
                }
            } else {
                // .toFixed(4)
                if (this.totalPay !== 0) {
                    this.payList[index].percentage = Math.round(Number((this.payList[index].amount / this.totalPay)) * 100);
                }
            }

        }
    }

    /**
     * 监听百分比输入同时修改金额
     *  v2.2.4.1 2020-06-19 dh
     * @param e
     * @param {number} index
     */
    payPercentage(e: any, index: number) {
        e.stopPropagation();
        e.preventDefault();
        if (e.keyCode === 9 || e.key === 'Tab') {
            return;
        }
        if (this.payList && this.payList.length > index) {
            this.payList[index].percentage = e.target.value;
            let amount;
            // key = this.getPayKey(index,this.payList);
            if (index <= 1) {
                amount = String(Number(this.payList[index].percentage / 100) * this.totalPay - this.payList[0].amount);
                if (amount.lastIndexOf('.') > 0) {
                    this.payList[index].amount = Number(amount.substring(0, amount.lastIndexOf('.') + 3));
                } else {
                    this.payList[index].amount = Number(amount);
                }

            } else {
                amount = String(Number(this.payList[index].percentage / 100) * this.totalPay);
                if (amount.lastIndexOf('.') > 0) {
                    this.payList[index].amount = Number(amount.substring(0, amount.lastIndexOf('.') + 3));
                } else {
                    this.payList[index].amount = Number(amount);
                }
                // this.payList[index].amount = Number(amount.substring(0,amount.lastIndexOf(".")+3));
            }
            // console.log(this.payList);

        }
    }

    /**
     * 获得数据常量
     * @param {number} index 当前输入索引
     * @param {Array<any>} pays
     */
    // getPayKey(index:number,pays:Array<any>){
    //     let partAmount = 0,partPercent = 0;
    //
    //     if(pays && pays.length > 0){
    //          pays.forEach((pay,idx) =>{
    //              if(idx !== index){
    //                  console.log(pay);
    //                  partAmount += Number(pay["amount"]);
    //                  partPercent += Number(pay["percentage"]);
    //              }
    //          })
    //     }
    //     if(partPercent < 100)
    //         return Number(this.totalPay - Number(partAmount))/(100 - Number(partPercent));
    //     else
    //         return Number(this.totalPay - Number(partAmount));
    // }

    getPayKey(index: number, pays: Array<any>) {
        let partAmount = 0, partPercent = 0;
        if (pays && pays.length > 0) {
            pays.forEach((pay, idx) => {
                if (idx !== index) {
                    // console.log(pay);
                    partAmount += Number(pay["amount"]);
                    partPercent += Number(pay["percentage"]);
                }
            })
        }
        if (partPercent < 100)
            return Number(this.totalPay - Number(partAmount)) / (100 - Number(partPercent));
        else
            return Number(this.totalPay - Number(partAmount));
    }


    toDecimal(price) {
        if (price) {
            let f = Number(price);
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
                url: 'delReceipt',
                data: {
                    quoteId: this.cid,
                    receiptId: id
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        const index = this.pays.findIndex(item => item.id == id);
                        this.pays.splice(index, 1);
                        this.loadFinanceData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
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
        const index = this.pays.findIndex(item => item.id == id);

        if (id && this.cid) {
            const receive = this.editReceiveCache[id + ''].data;
            const params = {
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
                url: 'modifyReceipt',
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
            });
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
                    data: {...pay}
                };
            });
        }
    }

    /**
     * 组装验证规则
     * @param pay
     */
    receiveForm(pay: any) {
        this.contractForm.addControl('receiveType' + pay.id, new FormControl(pay.payType, [Validators.maxLength(10)]));
        this.contractForm.addControl('receiveTotalPrice' + pay.id, new FormControl(pay.totalPrice, [Validators.maxLength(10)]));
        this.contractForm.addControl('receiveDiscountPrice' + pay.id, new FormControl(pay.discountPrice, [Validators.maxLength(10)]));
        this.contractForm.addControl('receiveCustomerPayTime' + pay.id, new FormControl(pay.customerPayTime, [Validators.maxLength(20)]));
        this.contractForm.addControl('receiveReceipt' + pay.id, new FormControl(pay.receipt, [Validators.maxLength(20)]));
        this.contractForm.addControl('receiveRemark' + pay.id, new FormControl(pay.remark, [Validators.maxLength(500)]));
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
                url: 'addReceipt',
                data: {quoteId: this.cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.loadFinanceData(res.data);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
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
            });
        }
        return total;
    }

    /**
     * 完成时间
     */
    finishShow() {
        this.finishBool = true;
        this.contractForm.addControl('receiveFinishTime', new FormControl(''));
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
                url: 'finishReceipt',
                data: {
                    quoteId: this.cid,
                    overTime: new Date(overTime).getTime()
                },
                success: (res => {
                    this.finishBool = false;
                    this.contractForm.removeControl('receiveFinishTime');
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    computedPercentage(total, all) {
        const t = Number(total),
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

    //保存临时合同
    showTempSaveBtn() {
        return saveTempContractByState(this.baseQuote) && (this.confirmState === 0 || !this.confirmState);
    }

    //是否显示重签按钮
    resignByState() {
        return this.baseQuote && this.baseQuote.state === 3 && this.state === Default.STATE.ITEM_1;
    }


    // 是否可以下拉模板 v2.2.4
    showTemplate() {
        const temFlag = editContractPageByState(this.state) && editContractByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designQuote) && this.baseQuote.retreat === 0 && this.baseQuote.state !== 3;
        return !temFlag;
    }


    //是否可以查看合同
    showContractByState() {
        return editContractByState(this.baseQuote);
    }

    //浏览合同（pdf生成）
    browseContract() {
        const that = this;
        if (that.cid) {
            that.request.doPostApp({
                url: 'viewQuoteContract',
                data: {
                    quoteId: that.cid,
                    makebaCompanyId: that.user.getCompanyId(),
                    concractType: that.agreementType === '0' ? 1 : 2
                },
                success: (res => {
                    if (res && res.code == 200) {
                        if (res.data && res.data['contractUrl']) {
                            this.contractUrl = res.data['contractUrl'];
                        }
                    } else {
                        this.contractData = res;

                    }
                })
            });
        }
    }

    viewContract() {
        if (!this.contractUrl) {
            if (this.contractData) {
                if (this.contractData.code == 120) {
                    this.warn.onMsgError(Messages.ERROR.SUBMIT_FREQUENTLY);
                } else {
                    this.warn.onMsgError(this.contractData.msg || Messages.FAIL.DATA);
                }
            } else {
                this.warn.onMsgError(Messages.ERROR_TEXT);
            }
            this.router.navigate(['/view/contract'], {
                queryParams: {cid: this.btoa(this.cid)},
                relativeTo: this.activatedRoute
            });
        }
    }


    getDateToZero() {
        const d = new Date();
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const s = d.getDate();
        return new Date(y + '/' + m + '/' + s);
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
        if (!st) {
            return false;
        }
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
            const c = new Date(e);
            if (c.getHours() === 12) {
                c.setMinutes(0);
                this.constructAmBeginTime = c;
            }
        }
    }

    disabledAmEndTime = (): boolean => {
        if (!this.constructAmBeginTime) {
            return true;
        }
        return !this.showBtnByState();
    }

    disabledAmEndHours = (): Array<number> => {
        if (this.constructAmBeginTime) {
            const h = new Date(this.constructAmBeginTime).getHours();
            return this.getTotalByTs(24, 0, 1).filter(t => {
                return (t > 12 || t < h);
            });
        }
        return this.getTotalByTs(24, 0, 1);
    }

    disabledAmEndMinutes = (hour: number): Array<number> => {
        if (this.constructAmBeginTime) {
            const h = new Date(this.constructAmBeginTime).getHours();
            if (h === hour) {
                const m = new Date(this.constructAmBeginTime).getMinutes();
                return this.getTotalByTs(6, 0, 10).filter(t => {
                    return t <= m;
                });
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
        if (!this.constructPmBeginTime) {
            return true;
        }
        return !this.showBtnByState();
    }

    disabledPmEndHours = (): Array<number> => {
        if (this.constructPmBeginTime) {
            const h = new Date(this.constructPmBeginTime).getHours();
            return this.getTotalByTs(24, 0, 1).filter(t => {
                return (t < h);
            });
        }
        return this.getTotalByTs(12, 0, 1);
    }

    disabledPmEndMinutes = (hour: number): Array<number> => {
        if (this.constructPmBeginTime) {
            const h = new Date(this.constructPmBeginTime).getHours();
            if (h === hour) {
                const m = new Date(this.constructPmBeginTime).getMinutes();
                return this.getTotalByTs(6, 0, 10).filter(t => {
                    return t < m;
                });
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

    /**
     * 获取项目状态
     */
    showBudgetByState() {
        if (this.confirmState == 0 || !this.confirmState) {
            return '合同尚未提交至客户';
        } else {
            if (this.reSginInfo) {
                if (this.billTime) {
                    return '合同重签' + this.getNowFormatDate(this.pushTime) + '，客户已签单' + this.getNowFormatDate(this.billTime);
                } else {
                    return '合同重签' + this.getNowFormatDate(this.pushTime) + '，客户尚未确认';
                }
            } else {
                if (this.billTime) {
                    return '合同已提交' + this.getNowFormatDate(this.pushTime) + '，客户已签单' + this.getNowFormatDate(this.billTime);
                } else {
                    return '合同已提交' + this.getNowFormatDate(this.pushTime) + '，客户尚未确认';
                }
            }
        }
    }

    add(m) {
        return m < 10 ? '0' + m : m;
    }

    //转化时间戳为时间
    getNowFormatDate(time: Date) {
        if (time) {
            const date = new Date(time);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const h = date.getHours();
            const mm = date.getMinutes();
            // var s = time.getSeconds();
            return '（' + y + '-' + this.add(m) + '-' + this.add(d) + ' ' + this.add(h) + ':' + this.add(mm) + '）';
        } else {
            return '';
        }
    }

    /*
     * 改变对公、对私合同
     */
    changeAgreementType() {
        if (this.agreementType == '0') {
            this.contractForm.removeControl('companyCode');
        } else {
            this.contractForm.addControl('companyCode', new FormControl(this.companyCode, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]));
            this.checkValidatorByType('companyCode');
        }
    }

    /*
     * 重签合同
     */
    resetContract() {
        this.request.doPost({
            url: 'reSignQuote',
            data: {
                quoteId: this.cid
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.abolish = true;
                    this.quote.setTypeByParam('contract', true);
                    this.quote.setTypeByParam('head', true);
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /*
     * 选择模板
     */
    selectTemplate(id, idx) {
        this.selectIndex = idx;
        const template = this.selectAllTemplate.filter(item => {
            return item.id == id;
        });
        this.templateName = template[0].name;
        this.pays = template[0].details;
        this.pays.map(item => {
            item.totalPrice = (item.percentage / 100 * this.totalPay).toFixed(2);
        });
        if (this.getTotalReceive('totalPrice') !== this.totalPay) {
            const addNum = Number(this.accSub(this.totalPay, this.getTotalReceive('totalPrice')));
            this.pays.forEach(item => {
                if (item.totalPrice == 0) {
                    item.totalPrice = '0.00';
                }
            });
            for (let i = this.pays.length - 1; i >= 0; i--) {
                if (this.pays[i].totalPrice !== '0.00') {
                    this.pays[i].totalPrice = this.accAdd(this.pays[i].totalPrice, addNum);
                    break;
                }
            }
        }
        this.savePayList = this.getPays(this.pays);
    }

    // 两个浮点数相加解决精度丢失问题
    accAdd(num1, num2) {
        let r1, r2, m;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        // return (num1*m+num2*m)/m;
        return Math.round(num1 * m + num2 * m) / m;
    }

    // 两个浮点数相减解决精度丢失问题
    accSub(num1, num2) {
        let r1, r2, m, n;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
    }

    /**
     * 根据金额正负号显示标识符号
     * @param {number} price
     * @returns {string}
     */
    showMark(price:number){
        if(price && price > 0) return "+";
        else if(price && price < 0) return "-";
        else return "";
    }

    /**
     * 获取当前数据的绝对值
     * @param {number} price
     * @returns {any}
     * @constructor
     */
    AbsValue(price:number){
        return Math.abs(price);
    }


    ngOnDestroy() {
        this.pays = null;
    }


}
