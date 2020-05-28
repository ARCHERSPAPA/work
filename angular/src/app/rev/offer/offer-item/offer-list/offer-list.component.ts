import {Component, OnInit, DoCheck} from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Default} from "../../../../model/constant";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Messages} from "../../../../model/msg";
import {
    btoa,
    editContractByState,
    getAddAndDelByStatus,
    getStateName,
    getTypeName,
    transformQuickDepartType
} from '../../../../model/methods';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from "../../../../service/user.service";
import {QuoteService} from "../../../../service/quote.service";

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
    public type: string = "1";
    public searchForm: FormGroup;
    public departmentId: string;

    //快速查询部门
    public departType: number;

    public offerList: any;

    constructor(private request: RequestService,
                private warn: WarningService,
                private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private user: UserService,
                private quote: QuoteService) {
    }

    ngOnInit() {
        this.title = "报价列表";
        this.buttons = [
            {
                name: "新建",
                type: "click",
                color: "btn-primary",
                load: true,
                method: () => {
                    this.request.doPost({
                        url: "buildQuote",
                        data: {id: ""},
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
                    })
                }
            }
        ];

        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());

        this.searchForm = this.fb.group({
            name: [this.name, [
                // UserValidate.ValidateAccount
            ]],
            phone: [this.phone, [
                // UserValidate.ValidatePhone
            ]]
        });

        // this.activatedRoute.queryParams.subscribe((params) => {
        //     if (params) {
        //         if (params["page"]) {
        //             this.pageNo = params["page"] > 0 ? params["page"] : Default.PAGE.PAGE_NO;
        //         }
        //         if (params["name"]) {
        //             this.name = decodeURI(params["name"]);
        //         }
        //         if (params["phone"]) {
        //             this.phone = params["phone"];
        //         }
        //         if (params["did"]) {
        //             this.departmentId = params["did"];
        //         }
        //         // this.changeData();
        //     }
        // })

    }

    handleName(e: any) {
        this.request.doPost({
            url: "buildQuote",
            data: {id: ""},
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
        })
    }

    changeType() {
        if (this.type === "1") {
            this.phone = "";
        } else {
            this.name = "";
        }
    }

    changeData(...args) {
        let that = this;
        if(args && args.length > 0){
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        if (this.searchForm.valid) {
            let params = {
                page: that.pageNo,
                pageSize: that.pageSize
            };
            if (that.name) {
                params["name"] = that.name.trim();
                delete params["departmentId"];
            }
            else if (that.phone) {
                params["phone"] = that.phone.trim();
                delete params["departmentId"];
            }
            else {
                params["departmentId"] = that.departmentId;
            }
            that.request.doPost({
                url: "listQuote",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.offerList = res.data.list;
                        that.total = res.data.total;
                        // that.router.navigate(['./'], {
                        //     queryParams: {
                        //         page: that.pageNo,
                        //         name: encodeURI(that.name ? that.name : ""),
                        //         phone: that.phone,
                        //         did: that.departmentId
                        //     }, relativeTo: that.activatedRoute
                        // })
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
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
            url: "buildQuote",
            data: {id: cid},
            success: (res => {
                if (res && res.code == 200) {
                    this.router.navigate(['./../detail/price', 10], {
                        queryParams: {cid: btoa(res.data)},
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    deleteData(cid) {
        if (cid) {
            this.request.doPost({
                url: "removeQuote",
                data: {id: cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.changeData();
                    } else {
                        this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
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
        if(data.confirmState !== 2){
            this.warn.onWarn('客户尚未确认预算，请直接修改预算项目');
        }else if(data.lockingBudget == 1){
            this.warn.onWarn('预算已进入成本审核状态，若需修改请联系成本同事解除锁定');
        }else{
            this.request.doPost({
                url: "reqPause",
                data: {id: data.id},
                success: (res => {
                    if (res && res.code == 200) {
                        this.router.navigate(["./../detail/price", 1], {
                            queryParams: {cid: btoa(data.id), aid: btoa(res.data)},
                            relativeTo: this.activatedRoute
                        });
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }  
    }

    closeData(cid) {
        if (cid) {
            this.request.doPost({
                url: "closeQuote",
                data: {id: cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.changeData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getAddAndDelByStatus(state) {
        return getAddAndDelByStatus(state);
    }

    retreatData(id, type) {
        this.request.doPost({
            url: "retreatQuote",
            data: {
                id: id,
                type: type
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    changeDepart(e: any) {
        this.departmentId = e;
        this.pageNo = Default.PAGE.PAGE_NO;
        this.name = "";
        this.phone = "";
        this.changeData();
    }

    /**
     * url地址栏加密实现
     * @param param
     * @returns {any}
     */
    btoa(param:any){
        return btoa(param);
    }
}
