import {Component, OnInit, DoCheck} from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Default} from '../../../../model/constant';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Messages} from '../../../../model/msg';
import {
    btoa,
    editContractByState,
    getAddAndDelByStatus,
    getStateName,
    getTypeName,
    transformQuickDepartType
} from '../../../../model/methods';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../../service/user.service';
import {QuoteService} from '../../../../service/quote.service';

@Component({
    selector: 'rev-offer-list',
    templateUrl: './offer-list.component.html',
    styleUrls: ['./../../offer.component.scss', './offer-list.component.scss'],

})
export class OfferListComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;

    /**查询条件**/
    public pageNo: number = Default.PAGE.PAGE_NO;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public name: string;
    public phone: string;
    public customerHouseAddress: string;
    public quoteNo: string;
    // public type = '1';
    public searchForm: FormGroup;
    //查询时的部门id
    public departmentId: string;
    public initialId: string;

    //控制加载数据bool
    public loading = false;

    //快速查询部门
    public departType: number;

    public offerList: any;

    public forms: Array<any> = [
        {
            type: "group",
            name: "offer",
            data: [
                {label: "客户姓名", value: 1},
                {label: "手机号码", value: 2},
                {label: "楼盘", value: 3},
                {label: "订单编号", value: 4}
            ],
            placeholder: "请输入",
            cols: 6,
            value: {
                select: 1,
                text: null
            }
        },
        {
            type: "button",
            name: "search",
            text: "查询"
        }
    ]

    constructor(private request: RequestService,
                private warn: WarningService,
                private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private user: UserService,
                private quote: QuoteService) {
    }

    ngOnInit() {
        this.title = '报价列表';
        this.buttons = [
            {
                name: '新建',
                type: 'primary'
            }
        ];


        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());

        this.searchForm = this.fb.group({
            name: [this.name, [
                // UserValidate.ValidateAccount
            ]],
            phone: [this.phone, [
                // UserValidate.ValidatePhone
            ]],
            customerHouseAddress: [this.customerHouseAddress, []],
            quoteNo: [this.quoteNo, []]
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params) {
                if (params['page']) {
                    this.pageNo = params['page'] > 0 ? params['page'] : Default.PAGE.PAGE_NO;
                }
                if (params['did']) {
                    this.departmentId = params['did'];
                }
                /* if (params['type']) {
                    this.type = params['type'] ? params['type'] : '1';
                } */
                if (params['name']) {
                    this.name = params['name'].trim();
                    this.forms[0].value.select = this.forms[0].data[0].value;
                    this.forms[0].value.text = this.name;
                }
                if (params['phone']) {
                    this.phone = params['phone'].trim();
                    this.forms[0].value.select = this.forms[0].data[1].value;
                    this.forms[0].value.text = this.phone;
                }
                if (params['customerHouseAddress']) {
                    this.customerHouseAddress = params['customerHouseAddress'].trim();
                    this.forms[0].value.select = this.forms[0].data[2].value;
                    this.forms[0].value.text = this.customerHouseAddress;
                }
                if (params['quoteNo']) {
                    this.quoteNo = params['quoteNo'].trim();
                    this.forms[0].value.select = this.forms[0].data[3].value;
                    this.forms[0].value.text = this.quoteNo;
                }
                //三选其一，才能加载数据
                if ((this.departmentId && this.departmentId != '-1') || this.name || this.phone || this.customerHouseAddress || this.quoteNo) {
                    // console.log("loading data in first data");
                    this.changeData();
                }
            }
        });

    }

    //新建
    handleName(e: any) {
        this.request.doPost({
            url: 'buildQuote',
            data: {id: ''},
            success: (res => {
                if (res && res.code == 200) {
                    this.quote.setQuoteData(null);
                    this.quote.setQuoteBase(null);
                    this.router.navigate(['./../detail/price', 10], {
                        queryParams: {cid: btoa(res.data)},
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // changeType() {
    //     if (this.type === '1') {
    //         this.phone = '';
    //         this.customerHouseAddress = '';
    //         this.quoteNo = '';
    //     } else if(this.type === '2'){
    //         this.name = '';
    //         this.customerHouseAddress = '';
    //         this.quoteNo = '';
    //     }else if(this.type === '3'){
    //         this.name = '';
    //         this.phone = '';
    //         this.quoteNo = '';
    //     }else{
    //         this.name = '';
    //         this.phone = '';
    //         this.customerHouseAddress = '';
    //     }
    //     // this.router.navigate(['./'], {
    //     //     queryParams: {
    //     //         page: this.pageNo,
    //     //         did: this.departmentId,
    //     //         type: this.type,
    //     //         name: this.name,
    //     //         phone: this.phone,
    //     //         customerHouseAddress: this.customerHouseAddress,
    //     //         quoteNo: this.quoteNo
    //     //     }, relativeTo: this.activatedRoute
    //     // });
    // }

    //翻页
    changePage() {
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                // type: this.type,
                name: this.name,
                phone: this.phone,
                customerHouseAddress: this.customerHouseAddress,
                quoteNo: this.quoteNo
            }, relativeTo: this.activatedRoute
        });
    }

    //拉取数据
    changeData() {
        const that = this;

        if (this.searchForm.valid) {
            that.loading = true;
            const params = {
                page: that.pageNo,
                pageSize: that.pageSize,
            };
            if (that.name) {
                params['name'] = that.name.trim();
                delete params['departmentId'];
            } else if (that.phone) {
                params['phone'] = that.phone.trim();
                delete params['departmentId'];
            } else if (that.customerHouseAddress) {
                params['customerHouseAddress'] = that.customerHouseAddress.trim();
                delete params['departmentId'];
            } else if (that.quoteNo) {
                params['quoteNo'] = that.quoteNo.trim();
                delete params['departmentId'];
            }else {
                params['departmentId'] = that.departmentId;
            }

            that.request.doPost({
                url: 'listQuote',
                data: params,
                success: (res => {
                    that.loading = false;
                    if (res && res.code == 200) {
                        that.offerList = res.data.list;
                        that.total = res.data.total;
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    getTypeName(type) {
        return getTypeName(type);
    }

    getStateName(state) {
        return getStateName(state);
    }

    /**
     * 新建报价（从原来中新建）
     * @param cid
     */
    buildData(cid) {
        this.request.doPost({
            url: 'buildQuote',
            data: {id: cid},
            success: (res => {
                if (res && res.code == 200) {
                    //更新到最新的代码v2.2.9
                    this.router.navigate(['./../detail/price', 10], {
                        queryParams: {cid: btoa(res.data)},
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    deleteData(cid) {
        if (cid) {
            this.request.doPost({
                url: 'removeQuote',
                data: {id: cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.changeData();
                    } else {
                        this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    /**
     * 与编辑合同一致的状态
     * @param item
     * @returns {boolean}
     */
    editContractByState(item) {
        return editContractByState(item);
    }

    addData(data) {
        if (data.confirmState !== 2) {
            this.warn.onModalInfo({
                title: '提示',
                content: '客户尚未确认预算，请直接修改预算项目',
                ok: () => {
                    console.log('tips');
                }
            });
            return ;
        }
        if (data.costState !== 3 && data.costState !== 4 && data.lockingBudget == 1) {
            this.warn.onModalInfo({
                title: '提示',
                content: '预算已进入成本审核状态，若需修改请联系成本同事解除锁定',
                ok: () => {
                    console.log('tips');
                }
            });
            return ;
        }
        this.request.doPost({
            url: 'reqPause',
            data: {id: data.id},
            success: (res => {
                if (res && res.code == 200) {
                    this.router.navigate(['./../detail/price', 1], {
                        queryParams: {cid: btoa(data.id), aid: btoa(res.data)},
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    closeData(cid) {
        if (cid) {
            this.request.doPost({
                url: 'closeQuote',
                data: {id: cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.changeData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    getAddAndDelByStatus(state) {
        return getAddAndDelByStatus(state);
    }

    retreatData(id, type) {
        this.request.doPost({
            url: 'retreatQuote',
            data: {
                id: id,
                type: type
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else if(res && res.code == 1106){
                    this.warn.onModalInfo({
                        title: '提示',
                        content: res.msg || '该项目有开材料订单，请联系工长撤回材料订单后再进行操作',
                        ok: () => {
                            console.log('tips');
                        }
                    });
                }else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * 监听部门回显
     * @param e
     */
    changeDepart(e: any) {
        console.log(e);
        if (e.selected) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.name = '';
            this.phone = '';
            this.customerHouseAddress = '';
            this.quoteNo = '';
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    // type: this.type,
                    name: this.name,
                    phone: this.phone,
                    customerHouseAddress: this.customerHouseAddress,
                    quoteNo: this.quoteNo
                }, relativeTo: this.activatedRoute
            });
        } else if (e.initial) {
            this.departmentId = e.id;
            this.name = '';
            this.phone = '';
            this.customerHouseAddress = '';
            this.quoteNo = ''
        }
        if (!this.initialId) {
            this.initialId = e.id;
        }
    }

    searchData() {
        if (this.searchForm.valid) {
            this.pageNo = Default.PAGE.PAGE_NO;
            if (this.name) {
                this.name = this.name.trim();
                this.departmentId = '-1';
            } else if (this.phone) {
                this.phone = this.phone.trim();
                this.departmentId = '-1';
            } else if(this.customerHouseAddress){
                this.customerHouseAddress = this.customerHouseAddress.trim();
                this.departmentId = '-1';
            }else if(this.quoteNo){
                this.quoteNo = this.quoteNo.trim();
                this.departmentId = '-1';
            }else {
                //重置成当前部门id（首个）
                this.departmentId = this.initialId;
            }
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    // type: this.type,
                    name: this.name,
                    phone: this.phone,
                    customerHouseAddress: this.customerHouseAddress,
                    quoteNo: this.quoteNo
                }, relativeTo: this.activatedRoute
            });
        }
    }

    /**
     * url地址栏加密实现
     * @param param
     * @returns {any}
     */
    btoa(param: any) {
        return btoa(param);
    }

    //清空输入
    cleanInputInfo() {
        this.name = null;
        this.phone = null;
        this.customerHouseAddress = null;
        this.quoteNo = null;
    }

    //form 表单输入查询
    handleForm(e: any) {
        console.log(e)
        if (e && e.name === this.forms[1].name) {
            let maps = e.value;
            if (maps && maps.size > 0) {
                maps.forEach((map, key) => {
                    if (key === this.forms[0].name) {
                        this.cleanInputInfo();
                        switch (map.select) {
                            case this.forms[0].data[0].value:
                                this.name = map.text;
                                break;
                            case this.forms[0].data[1].value:
                                this.phone = map.text;
                                break;
                            case this.forms[0].data[2].value:
                                this.customerHouseAddress = map.text;
                                break;
                            case this.forms[0].data[3].value:
                                this.quoteNo = map.text;
                                break;
                            default:
                                this.forms[0].value.text = null;
                                this.forms[0].value.select = 0;
                                break;
                        }
                    }
                })
            }
        }
        this.changePage();

    }
}
