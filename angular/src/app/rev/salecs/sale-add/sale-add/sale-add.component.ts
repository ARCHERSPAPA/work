import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from '../../../../service/request.service';
import { UserService } from '../../../../service/user.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import {  ActivatedRoute } from '@angular/router';
import { atob } from '../../../../model/methods';
import * as UserValidate from '../../../../validate/user-validate';
@Component({
  selector: 'rev-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {
  public salecsPhone: any;
  public inputValue: any;
  public SaleForm: FormGroup;
  public id: string; //客服ID
  public isAdd: number; //是否是添加还是编辑
  public title;
  constructor(
    private fb: FormBuilder,
    private request: RequestService,
    private route: ActivatedRoute,
    private warn: WarningService,
    private userInfo: UserService,
  ) { }

  ngOnInit() {
    this.SaleForm = this.fb.group({
      salecsPhone: [this.salecsPhone, [
        Validators.required,
        UserValidate.ValidatePhone
      ]],
    });
    this.route.queryParams.subscribe(params => {
      if (params && params['customId']) {
        this.id = atob(params['customId']);
        this.salecsPhone = atob(params['phone']);
      }
      this.isAdd = params['isAdd'];
    });
    this.isAdd != 0 ? this.title = '新建客服' : this.title = '编辑客服';
  }

  back() {
    history.go(-1);
  }

  submit() {
    const self = this;
    const param = {};
    let url;
    param['phone'] = this.salecsPhone;
    param['companyId'] = this.userInfo.getCompanyId();
    console.log(this.isAdd);
    //判断是编辑还是添加
    if (this.isAdd != 0) {
      url = 'createCustom';
    } else {
      url = 'editCustom';
      param['id'] = this.id;
    }
    if (this.salecsPhone) {
      this.request.doPost({
        url: url,
        data: param,
        success: (res => {
          if (res && res.code == 200) {
            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          } else {
            this.warn.onError(res.msg || Messages.FAIL.DATA);
          }
        })
      });
    } else {
      self.warn.onError('温馨提示,请填写客服手机号');
    }
  }
}
