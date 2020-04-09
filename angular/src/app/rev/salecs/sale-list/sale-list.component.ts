import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../service/request.service";
import { UserService } from "../../../service/user.service";
import { NzNotificationService } from 'ng-zorro-antd';
import { btoa } from "../../../model/methods";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-sale-list',
    templateUrl: './sale-list.component.html',
    styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {

    public isVisibleCustom = false;
    public salecsPhone: any;
    public title = '在线客服'
    public salecsList = [];
    constructor(
        private request: RequestService,
        private userInfo: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _notification: NzNotificationService
    ) { }

    ngOnInit() {
        this.loadCustomList()
    }

    // 客服列表
    loadCustomList(): void {
        let self = this;
        this.request.doPost({
            url: "customList",
            data: {
                companyId: this.userInfo.getCompanyId()
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.salecsList = res.data;
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 创建客服
    createCustom(): void {
        this.salecsPhone = ''
        this.isVisibleCustom = true;
    }

    handleCancel(): void {
        this.isVisibleCustom = false;
    }

    // 删除客服
    delCustom(id): void {
        let self = this;
        this.request.doPost({
            url: "delCustom",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadCustomList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    addCustom() {
        this.router.navigate(['../add'], {
            queryParams: { isAdd: 1, phone: btoa(this.salecsList["phone"]) },
            relativeTo: this.activatedRoute
        });
    }

    topCustom(id) {
        let self = this;
        this.request.doPost({
            url: "udpOrderCustom",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadCustomList()
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 客服排序修改
    udpOrderCustom(id, toId) {
        let self = this;
        this.request.doPost({
            url: "udpOrderCustom",
            data: {
                id: id,
                toId: toId
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadCustomList()
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }
    btoa(param: any) {
        return btoa(param);
    }
}
