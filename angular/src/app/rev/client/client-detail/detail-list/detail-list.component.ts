import { Component, OnInit, Pipe, PipeTransform, DoCheck } from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Default} from '../../../../model/constant';
import {Messages} from '../../../../model/msg';
import {DepartService} from '../../../../service/depart.service';
import {Router, ActivatedRoute} from '@angular/router';
import * as UserValidate from '../../../../validate/user-validate';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../service/user.service';
import {
    btoa,
    deleteUserByState,
    editUserByState,
    getStateName,
    transformQuickDepartType
} from '../../../../model/methods';


@Component({
  selector: 'rev-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./../client-detail.component.scss']
})
export class DetailListComponent implements OnInit {

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    //选中的部门id
    public departmentId: string;
    //初始化接收的部门id
    public initialId: string;


    //快速查询部门配制
    public departType: number;
    //数据信息
    public demandList: any;
    //加载数据时
    public loading = false;

    //搜索数据form表单
    public searchForm: FormGroup;
    public phone: string;
    public name: string;
    public type = '2';

    public isChild = 0;

    constructor(private request: RequestService,
                private warn: WarningService,
                private user: UserService,
                private depart: DepartService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.searchForm = this.fb.group({
            name: [this.name, [
                UserValidate.ValidateAccount
            ]],
            phone: [this.phone, [
                Validators.maxLength(16)
            ]]
        });
        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());
        this.isChild = this.user.getChild();
        this.activatedRoute.queryParams.subscribe(params => {
            if (params) {
                if (params['page']) {
                    this.pageNo = params['page'] > 0 ? params['page'] : Default.PAGE.PAGE_NO;
                }
                if (params['name']) {
                    this.name = decodeURI(params['name']);
                }
                if (params['phone']) {
                    this.phone = params['phone'];
                }
                if (params['did']) {
                    this.departmentId = params['did'];
                }

                if ((this.departmentId &&  this.departmentId !== '-1') ||  this.name ||  this.phone) {
                    this.changeData();
                }

            }
        });
    }

    /**
     * 类型切换
     */
    changeType() {
        if (this.type === '1') {
            this.phone = '';
        } else {
            this.name = '';
        }
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                type: this.type,
                name: this.name,
                phone: this.phone
            }, relativeTo: this.activatedRoute
        });
    }

    /**
     * 查询按钮控制
     */
    searchData() {
        if (this.searchForm.valid) {
            this.pageNo = Default.PAGE.PAGE_NO;
            if (this.name) {
                this.name = this.name.trim();
                this.departmentId = '-1';
            } else if (this.phone) {
                this.phone = this.phone.trim();
                this.departmentId = '-1';
            } else {
                //重置成当前部门id（首个）
                this.departmentId = this.initialId;
            }
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    type: this.type,
                    name: this.name,
                    phone: this.phone
                }, relativeTo: this.activatedRoute
            });
        }
    }


    /**
     * 部门联动
     * @param e
     */
    changeDepart(e: any) {
        if (e.selected) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.name = '';
            this.phone = '';
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    type: this.type,
                    name: this.name,
                    phone: this.phone
                }, relativeTo: this.activatedRoute
            });
        } else if (e.initial) {
            this.departmentId = e.id;
            this.name = '';
            this.phone = '';
        }
        if (!this.initialId) {
            this.initialId = e.id;
        }
    }

    //翻页功能
    changePage() {
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                type: this.type,
                name: this.name,
                phone: this.phone
            }, relativeTo: this.activatedRoute
        });
    }

    changeData() {
        const that = this;
        const params = {
            pageNo: that.pageNo,
            pageSize: that.pageSize
        };
        if (that.name) {
            params['customerName'] = that.name;
            delete params['departmentId'];
        } else if (that.phone) {
            params['customerPhone'] = that.phone;
            delete params['departmentId'];
        } else {
            params['departmentId'] = that.departmentId;
        }

        that.request.doPost({
            url: 'listDemand',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    that.demandList = res.data.pageSet;
                    that.total = res.data.total;
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }


    // editDemand(id) {
    //     if (id) {
    //         this.router.navigate(["./../add"], {
    //             queryParams:{id:id},
    //             relativeTo: this.activatedRoute
    //         });
    //     }
    // }

    getStateName(state) {
        return getStateName(state);
    }

    stateDemand(id, state) {
        const that = this;
        if (id) {
            that.request.doPost({
                url: 'upDemandState',
                data: {
                    id: id,
                    state: state
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    offerDetail(id) {
        const that = this;
        that.request.doPost({
            url: 'reqQuote',
            data: {customerId: id},
            success: (res => {
                if (res && res.code == 200) {
                    that.router.navigate(['/rev/offer/item/detail/price', 1], {queryParams: {cid: btoa(res.data['quoteBase'].id)}});
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
        // this.router.navigate(["/rev/offer/detail"],{queryParams:{cid:id}});
    }

    deleteUserByState(state) {
        return deleteUserByState(state);
    }

    editUserByState(state) {
        return editUserByState(state);
    }

    /**
     * url加密
     * @param {string} id
     * @returns {any}
     */
    btoa(id: string) {
        return btoa(id);
    }
}

