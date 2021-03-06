import {Component, OnInit} from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Default} from '../../../../model/constant';
import {Messages} from '../../../../model/msg';
import {Router, ActivatedRoute} from '@angular/router';
import {btoa, transformQuickDepartType} from '../../../../model/methods';
import {UserService} from '../../../../service/user.service';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
    selector: 'rev-staff-list',
    templateUrl: './worker-list.component.html',
    styleUrls: ['./../../personnel.component.scss', './../worker.component.scss']
})
export class WorkerListComponent implements OnInit {

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;

    public total: number = Default.PAGE.PAGE_TOTAL;

    public searchForm: FormGroup;

    public searchInfo = '';
    public workerList: any;
    public departmentId: string;
    //初始化部门id
    public initialId: string;

    // 查询部门显示数据
    public departType: number;

    public forms:Array<any> = [
        {
            type: "text",
            name: "searchInfo",
            placeholder: "请输入工人姓名/手机号",
            data: null,
            cols: 6,
            value: null,
        },
        {
            type: "button",
            name: "search",
            text: "查询"
        }
    ]


    constructor(private request: RequestService,
                private warn: WarningService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private user: UserService,
                private fb: FormBuilder) {}

    ngOnInit() {
        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());

        this.searchForm = this.fb.group({
            searchInfo: [this.searchInfo, []]
        });


        this.activatedRoute.queryParams.subscribe((params) => {
            if (params) {
                // if (params["page"]) {
                    this.pageNo = params['page'] > 0 ? Number(params['page']) : Default.PAGE.PAGE_NO;
                // }
                if (params['did']) {
                    this.departmentId = params['did'];
                }
                if (params['searchInfo']) {
                    this.searchInfo = params['searchInfo'];
                    this.forms[0].value = this.searchInfo
                }
                if ((this.departmentId && this.departmentId !== '-1') || this.searchInfo) {
                    this.changeData();
                }
            }
        });
    }

    /**
     * 部门切换
     * @param e
     */
    changeDepart(e: any) {
        if (e.selected) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.searchInfo = '';
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    searchInfo: this.searchInfo,
                }, relativeTo: this.activatedRoute
            });
        } else if (e.initial) {
            this.departmentId = e.id;
            this.searchInfo = '';
        }
        if (!this.initialId) {
            this.initialId = e.id;
        }
    }

    /**
     * 搜索框查询
     */
    searchData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        if (this.searchInfo) {
            this.departmentId = '-1';
        } else {
            this.departmentId = this.initialId;
        }
        this.changePage();
    }

    changePage() {
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                searchInfo: this.searchInfo
            }, relativeTo: this.activatedRoute
        });
    }


    changeData() {
        const that = this;
        // if (args && args.length > 0) {
        //     this.pageNo = Default.PAGE.PAGE_NO;
        // }
        const params = {
            pageNo: that.pageNo,
            pageSize: that.pageSize,
        };
        // if(this.isDepartFlag){
        //     let addressBar = {
        //         page:this.pageNo,
        //         did:this.departmentId,
        //         workInfo:this.searchInfo
        //     };
        //     sessionStorage.setItem('params',JSON.stringify(addressBar));
        // }
        if (that.searchInfo) {
            params['searchInfo'] = that.searchInfo.trim();
        } else {
            params['departmentId'] = that.departmentId;
        }
        this.request.doPost({
            url: 'workerList',
            data: params,
            success: (res => {
                if (res && res.code === 200) {
                    that.workerList = res.data.pageSet;
                    that.total = res.data.total;
                    // this.router.navigate(['./'], {
                    //     queryParams: {
                    //         page: this.pageNo,
                    //         did: this.departmentId,
                    //         workInfo:this.searchInfo
                    //     }, relativeTo: this.activatedRoute
                    // })
                    if (that.workerList && that.workerList.length == 0 && that.pageNo !== 1) {
                        that.pageNo -= 1;
                        that.changeData();
                    }
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // 列表操作
    quitWorker(id) {
        const that = this;
        if (id) {
            this.request.doPost({
                url: 'quitWorker',
                data: {id: id},
                success: (res => {
                    if (res && res.code === 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onError(res.msg || Messages.SUCCESS.DATA);
                    }
                })
            });
        }
    }

    delWorker(id) {
        const that = this;
        if (id) {
            this.request.doPost({
                url: 'delWorker',
                data: {id: id},
                success: (res => {
                    if (res && res.code === 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    editWorker(id) {
        if (id) {
            this.router.navigate(['./../add'], {
                queryParams: {id: btoa(id)},
                relativeTo: this.activatedRoute
            });
        }
    }

    handleForm(e){
        if (e.value) {
            let maps = e.value;
            if (maps && maps.size > 0) {
                maps.forEach((map, key) => {
                    this.searchInfo = map
                }); 
                this.searchData();
            }
        }
    }
}
