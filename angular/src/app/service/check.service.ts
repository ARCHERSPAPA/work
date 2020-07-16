import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { SESSION_STORAGE } from './../model/constant';


export function CheckProvider(check: CheckService) {
    return () => check.check();
}


@Injectable()
export class CheckService {

    public isLogin: boolean;
    public type: number;

    constructor(private request: RequestService,
        private cookie: CookieService,
        private userInfo: UserService) {
    }


    login() {
        this.request.doPost({
            url: 'checkLogin',
            data: {},
            success: (res) => {
                if (res && res.code == 200) {
                    this.isLogin = Boolean(res.data.isLogin);
                    if (res.data.isLogin) {
                        this.userInfo.add(res.data);
                        this.type = res.data.user.type;
                    }

                }
            }
        });
    }

    logout() {
        this.request.doPost({
            url: 'logout',
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.userInfo.clearCookie();
                    this.isLogin = false;
                }
                window.sessionStorage.setItem(SESSION_STORAGE.IS_LOGIN, SESSION_STORAGE.IS_LOGIN_VALUE);
                window.location.href = window.location.protocol + '//' + window.location.host;
            })
        });
    }

    check() {
        let session;
        let Browser = window.navigator.userAgent;
        let versions = Number(Browser.split('/').splice(-1)[0]);

        if (Browser.match('Firefox') && Browser.match('Firefox').length > 0 && versions >= 78) {
            session = this.cookie.get('SESSION_IS_LOGIN');
        } else {
            session = window.sessionStorage.getItem(SESSION_STORAGE.IS_LOGIN);
        }
        if (session || typeof session=='string') {
            this.login();
            window.sessionStorage.setItem(SESSION_STORAGE.IS_LOGIN, SESSION_STORAGE.IS_LOGIN_VALUE);
        } else {
            this.logout();
        }
    }
}

