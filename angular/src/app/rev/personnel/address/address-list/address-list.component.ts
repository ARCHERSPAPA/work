import {Component, OnInit} from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Default} from '../../../../model/constant';
import {Messages} from '../../../../model/msg';
import {  btoa } from '../../../../model/methods';
@Component({
    selector: 'rev-address-list',
    templateUrl: './address-list.component.html',
    styleUrls: ['./../../personnel.component.scss', './address-list.component.scss']
})
export class AddressListComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;
    public addressList: any;


    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    //查询部门
    public departmentId: string;
    //初始化部门数据
    public initialId: string;

    constructor(private req: RequestService,
                private warn: WarningService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.title = '企业通讯录';
        this.buttons = [{
            name: '设置权限'
        }];

        this.activatedRoute.queryParams.subscribe(params => {
            if (params) {
                this.departmentId = params['did'];
                this.pageNo = params['page'] ? params['page'] : Default.PAGE.PAGE_NO;
                if (this.departmentId && this.departmentId !== '-1') {
                    this.changeData();
                }
            }
        });
    }

    /**
     * 权限按钮
     * @param {string} name
     */
    handleName(name: string) {
        this.router.navigate(['./../role'], {relativeTo: this.activatedRoute});
    }

    /**
     * 选择部门
     * @param e
     */
    changeDepart(e: any) {
        if (e.selected) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                }, relativeTo: this.activatedRoute
            });
        } else if (e.initial) {
            this.departmentId = e.id;
        }
        if (!this.initialId) {
            this.initialId = e.id;
        }
    }

    changePage() {
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId
            }, relativeTo: this.activatedRoute
        });
    }

    changeData() {
        const params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            departmentId: this.departmentId
        };

        this.req.doPost({
            url: 'listEmployee',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.addressList = res.data.pageSet;
                    this.total = res.data.total;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });

    }

    btoa(id: string) {
        return btoa(id);
    }



}
