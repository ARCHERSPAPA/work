import {Component, OnInit} from '@angular/core';
import * as UserValidate from "../../../validate/user-validate";
import {UserService} from "../../../service/user.service";
import {WarningService} from "../../../service/warning.service";
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {bounceAnimate} from "../../../animation/transform.component";

@Component({
    selector: 'rev-forget',
    templateUrl: './forget.component.html',
    styleUrls: ['./../user-info.component.scss'],
    animations: [
        bounceAnimate
    ]
})
export class ForgetComponent implements OnInit {

    public breads: Array<any>;

    public mobile: string;
    public account:string;

    public isOpen: boolean = false;

    public forgetForm: FormGroup;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private userInfo: UserService,
                private request: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {

        this.breads = [
            {
                name: "登录页",
                url:"/user/login"
            },
            {
                name:"短信手机"
            }
        ];

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["mobile"]) {
                this.mobile = params["mobile"];
            }
            if(params && params["account"]){
                this.account = params["account"];
            }
        })


        this.forgetForm = this.fb.group({
            mobile: ['', [
                Validators.required
            ]],
            code: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(6),
                UserValidate.ValidateCode
            ]]
        });
        this.forgetForm.controls.mobile.reset({value:this.mobile,disabled:true});
    }


    openTimer($e) {
        // console.log($e);
    }

    closeTimer($e) {
        // console.log($e);
        if (!$e) {
            this.isOpen = false;
        }
    }


    send() {
        this.isOpen = true;
        this.request.doPost({
            url: "phoneCaptcha",
            data: {
                phone: this.mobile,
                type: 2
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    cancel() {
        window.history.go(-1);
    }

    next(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.forgetForm.valid) {
            this.request.doPost({
                url: "codeMatching",
                data: {
                    code: this.forgetForm.value["code"],
                    type: 2
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.router.navigate(["./../reset"], {
                            relativeTo: this.activatedRoute,
                            skipLocationChange: true,
                            queryParams: {mobile: this.mobile,account: this.account}
                        });
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

}
