import {Component, OnInit} from '@angular/core';
import * as UserValidate from "../../../validate/user-validate";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {RandomService} from "../../../service/random.service";
import {Router, ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {Messages} from "../../../model/msg";

@Component({
    selector: 'rev-find',
    templateUrl: './find.component.html',
    styleUrls: ['./../user-info.component.scss']
})
export class FindComponent implements OnInit {

    public breads: Array<any>;
    public title: string;
    public randCode: string;


    public findForm: FormGroup;

    //弹框
    public msg: string = "";

    constructor(private fb: FormBuilder,
                private rand: RandomService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private modal: NzModalService,
                private req: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {
        this.breads = [
            {
                name: "登录页",
                url: "/user/login"
            },
            {
                name: "填写帐号"
            }
        ]
        this.randCode = this.rand.create(4);

        this.findForm = this.fb.group({
            account: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UserValidate.ValidateAccount
            ]
            ],
            code: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(6),
                UserValidate.ValidateCode
            ]
            ]
        });
    }

    ngAfterViewInit() {

    }

    changeCode(e) {
        e.preventDefault();
        e.stopPropagation();
        this.randCode = this.rand.create(4);
    }

    submitForm(){
        for (const i in this.findForm.controls) {
            this.findForm.controls[i].markAsDirty();
            this.findForm.controls[i].updateValueAndValidity();
        }
        if (this.findForm.valid) {
            let values = this.findForm.value;
            if ((values.code).toLowerCase() !== this.randCode.toLowerCase()) {
                this.warn.onWarn(Messages.ERROR.CODE);
            } else {
                this.req.doPost({
                    url: "findAccount",
                    data: {account: values.account},
                    success: (res => {
                        if (res && res.code == 200) {
                            if (res.data) {
                                this.router.navigate(["./../forget"], {
                                    relativeTo: this.activatedRoute,
                                    skipLocationChange: true,
                                    queryParams: {mobile: res.data,account: values.account}
                                });
                            }
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                            this.randCode = this.rand.create(4);
                        }
                    })
                })
            }
        }

    }


    next(e) {
        e.stopPropagation();
        e.preventDefault();
        this.submitForm();
    }

    cancel() {
        window.history.go(-1);
    }

}
