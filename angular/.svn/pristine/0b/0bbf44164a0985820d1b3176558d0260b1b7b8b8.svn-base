import { Component, OnInit } from '@angular/core';
import {sideAnimate} from "../../../animation/transform.component";
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Messages} from "../../../model/msg";
import * as UserValidate from "../../../validate/user-validate";

@Component({
  selector: 'rev-offer-setting',
  templateUrl: './offer-setting.component.html',
  styleUrls: ['./../offer.component.scss','./offer-setting.component.scss'],
  animations: [
      sideAnimate
  ]
})
export class OfferSettingComponent implements OnInit {
  public title:string;
  public switch:string;

  public modify:boolean = false;

  public modifyForm:FormGroup;
  public percentage:number;

  constructor(private request:RequestService,
              private warn:WarningService,
              private fb:FormBuilder) { }

  ngOnInit() {
      this.title = "报价设置";
      this.switch = "left";
      this.modifyForm = this.fb.group({
        percentage:[this.percentage,[
            Validators.required,
            Validators.max(1000),
            UserValidate.ValidateMinNum
        ]]
      });
      this.request.doGet({
          url:"settingQuote",
          data:{},
          success:(res =>{
              if(res && res.code == 200){
                  this.percentage = res.data;
              }else{
                  this.warn.onError(res.msg || Messages.FAIL.DATA);
              }
          })
      })
  }

  ngAfterViewInit(){
      setTimeout(()=>{
          this.switch = "right";
      },1000);
  }

  modifySetting(){
      let that = this;
      that.modify = !that.modify;
      if(!that.modify && that.modifyForm.valid){
          console.log(that.modifyForm);
        let params = that.modifyForm.value;
        that.request.doPost({
            url:"settingQuote",
            data:params,
            success:(res =>{
                if(res && res.code == 200){
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                }else{
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
      }
  }

}
