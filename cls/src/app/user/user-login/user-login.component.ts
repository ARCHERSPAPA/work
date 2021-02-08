import {Component, OnInit} from '@angular/core';

import {WarningService} from "../../services/warning.service";
import {UserService} from "../user.service";
import {Router} from '@angular/router';
import {StorageService} from "../../services/storage.service";
import {Base} from "../../configs/base";
import {EStorage} from "../../enums/e-storage.enum";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.less']
})
export class UserLoginComponent implements OnInit {
  //首页名称
  public title: string;
  //二维码
  public qrCode: string = Base.user.qrCode;
  //定时器
  public dsq: any;
  //定时器的时间（用于轮询）
  public interval: number = Base.user.interval;
  //二维码是否过期
  public isExpire:boolean = false;


  constructor(private warn: WarningService,
              private userService: UserService,
              private router: Router,
              private storageService: StorageService) {
    this.title = "登录装修TOP材料商";
  }

  ngOnInit(): void {
    this.changeQrCode();
  }

  //登录
  login() {
    if (this.qrCode) {
      if (this.dsq) clearTimeout(this.dsq);
      this.userService.login({
        url: "checkLoginStatus",
        data: {identification: this.qrCode}
      })
        .then(data => {
          if (data && data.loginStatus === 3) {
            this.storageService.setStorage(EStorage.USER_INFO, data);
            this.storageService.clearStorage(EStorage.CLICK_MENU);
            this.router.navigateByUrl("/pages/schedule")
          } else {
            this.dsq = setTimeout(() => {
              this.login();
            }, this.interval);
          }
        }).catch(data => {
         if(data && data.code === 120){
           this.isExpire = true;
           if(this.dsq) clearTimeout(this.dsq);
         }else{
           if(data){
             this.isExpire = true;
             if(this.dsq) clearTimeout(this.dsq);
             this.warn.onError(data.msg || "拉取失败");
           }
         }
      })
    } else {
      this.dsq = setTimeout(() => {
        this.login();
      }, this.interval);
    }
  }

  //获取二维码的标识
  changeQrCode() {
    this.isExpire = false;
    this.userService.getQRcode().then(data => {
      this.storageService.clearAll();
      if (data) {
        this.qrCode = data;
        this.login();
      }
    }).catch(err => {
      this.warn.onError(err);
    })
  }

}
