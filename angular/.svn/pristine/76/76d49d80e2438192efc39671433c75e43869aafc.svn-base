import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { RequestService } from './request.service';
import { UserService } from './user.service';

export function CheckProvider(check:CheckService){
    return () => check.check();
}


@Injectable()
export class CheckService{

    public isLogin:boolean;
    public type:number;

    constructor(private request:RequestService,
                private userInfo:UserService) {
    }


    check() {
        let that = this;
        that.request.doPost({
            url: "checkLogin",
            data: {},
            success: function (res) {
                if (res && res.code == 200) {
                    that.isLogin = Boolean(res.data.isLogin);
                    if (res.data.isLogin) {
                        // that.userInfo.add(res.data.key,res.data.departmentQueryType,res.data.user);
                        // that.userInfo.setCompanyState(res.data.companyState);
                        that.userInfo.add(res.data);
                        that.type = res.data.user.type;
                    }
                }
            }
        });
        // this.temp-base.loadCompany();
    }

}
