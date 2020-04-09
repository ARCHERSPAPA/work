import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {bounceAnimate} from "../../../animation/transform.component"
import * as UserValidate from '../../../validate/user-validate';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {UserService} from "../../../service/user.service";
import {Md5} from "ts-md5";
import {Messages} from "../../../model/msg";

@Component({
  selector: 'rev-pwd',
  templateUrl: './pwd.component.html',
  styleUrls: ['./../account.component.scss'],
  animations: [
    bounceAnimate
  ]
})
export class PwdComponent implements OnInit {

  public title:string;

  public switch:string;

  public pwdForm:FormGroup;

  constructor(private fb:FormBuilder,
              private request:RequestService,
              private warn:WarningService,
              private userInfo:UserService) {
  }

  ngOnInit() {
    this.title = "修改密码";
    this.switch = "up";
    this.pwdForm = this.fb.group({
      old: ['', [
        Validators.required
      ]],
      pwdGroup: this.fb.group({
        pwd: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          UserValidate.ValidatePassword
        ]],
        repwd: ['', [
          Validators.required
        ]]
      }, {
        validator: UserValidate.ValidatePasswordGroup
      })
    })
  }

  ngAfterViewInit() {
    setTimeout(()=> {
      this.switch = "down";
    })
  }


  cancel() {
    window.history.go(-1);
  }

  submit() {
    let that = this;
    if (that.pwdForm.valid) {
      // console.log(that.pwdForm);
      that.request.doPost({
        url: "upUser",
        data: {
          id: that.userInfo.getId(),
          oldPassword: Md5.hashStr(that.pwdForm.value["old"]),
          password: Md5.hashStr(that.pwdForm.value["pwdGroup"]["repwd"]),
          phone: that.userInfo.getPhone()
        },
        success: (res => {
          if (res && res.code == 200) {
            that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
            window.history.go(-1);
          } else {
            that.warn.onError(res.msg || Messages.FAIL.DATA);
          }
        })
      })

    }

  }
}
