import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../service/request.service';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
// import { RandomService } from "../../service/random.service";
import * as UserValidate from '../../validate/user-validate';
import { WarningService } from '../../service/warning.service';
import { Md5 } from 'ts-md5';
import { Messages } from './../../model/msg';
import { CheckService } from '../../service/check.service';
import { UserService } from '../../service/user.service';
declare var jigsaw: any;
// import {SliderComponent} from "../../component/slider/slider.component"

@Component({
    selector: 'rev-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
    public title: string;
    public loginForm: FormGroup;
    // public randCode: string;
    public passState = false;
    //slider的图片
    public sliderImg = 'https://qiniu.madrock.com.cn/rev/imgs/b828deb8-5218-1e50-8a50-210c203b7fa8.png';
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private request: RequestService,
        private fb: FormBuilder,
        // private rand: RandomService,
        private warn: WarningService,
        private check: CheckService,
        private userInfo: UserService) { }

    ngDoCheck(): void {

    }
    ngOnInit() {
        const that = this;
        that.title = '装修Top';
        // that.changeCode();
        that.loginForm = that.fb.group({
            account: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UserValidate.ValidateNumAlphaUnderline
            ]
            ],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(32),
            ]
            ],
            // code: ['', [
            //     Validators.required,
            //     Validators.minLength(4),
            //     Validators.maxLength(6),
            //     UserValidate.ValidateCode
            // ]
            // ]
        });

        if (that.check.isLogin) {
            if (that.userInfo.getKey()) {
                if (that.userInfo.getCompanyId()) {
                    // that.router.navigateByUrl("/rev/schedule");
                    that.router.navigate(['/rev/schedule']);
                    // that.router.navigateByUrl("/rev/merchant");
                } else {
                    // that.router.navigateByUrl("/rev/steps");
                    that.router.navigate(['/rev/steps']);
                }
            } else {
                // that.router.navigateByUrl("/user/login");
                that.router.navigate(['/user/login']);
            }
        } else {
            // that.router.navigateByUrl("/user/login");
            that.router.navigate(['/user/login']);
        }
    }

    // changeCode() {
    //     this.randCode = this.rand.create(4);
    // }

    //2.2.4使用新的验证方式
    login() {
            // console.log(this.passState)
        const that = this;
        if (that.loginForm.valid && this.passState) {
            const loginValues = that.loginForm.value;
            const account = loginValues['account'],
                password = loginValues['password'];
                // code = loginValues["code"].toLocaleLowerCase();
            if (this.passState) {
                that.request.doPost({
                    url: 'login',
                    data: {
                        account: account,
                        password: Md5.hashStr(password)
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            that.userInfo.add(res.data);
                            that.userInfo.clearCookie();
                            // that.redirect();
                            if (that.userInfo.getKey()) {
                                if (that.userInfo.getCompanyId()) {
                                    // that.router.navigateByUrl("/rev/schedule");
                                    that.router.navigate(['/rev/schedule']);
                                    // that.router.navigateByUrl("/rev/merchant");
                                } else {
                                    // that.router.navigateByUrl("/rev/steps");
                                    that.router.navigate(['/rev/steps']);
                                }
                            } else {
                                // that.router.navigateByUrl("/user/login");
                                that.router.navigate(['/user/login']);
                            }
                        } else {
                            that.warn.onError(res.msg || Messages.FAIL.LOGIN);
                            this.passState = false;
                            //密码错误时重置验证
                            jigsaw.check(true);
                            // that.changeCode();
                        }
                    })
                });

            } else {
                that.warn.onError(Messages.ERROR.CODE);
            }

            // this.warn.onSuccess("验证成功");

        }

    }


    checkVerify(e) {
        // console.log(e)
        if (e == 'success') {
            this.passState = true;
        } else {
            this.passState = false;
        }
        // console.log(this.passState)
    }

    forget() {
        this.router.navigate(['./../info/find'], { relativeTo: this.activatedRoute });
    }

}
