import {Injectable} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Messages} from "../configs/messages";
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private req: RequestService) {
  }

  /**
   * 登录
   * @param params
   * @returns {Promise<any>}
   */
  login(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost(params)
        .subscribe(data => {
          if (data && data.status == 200) {
            if (data.body && data.body.code === 200) {
              resolve(data.body.data);
            } else {
              reject(data.body);
            }
          } else {
            reject(Messages.fail);
          }

        })
    })
  }

  /**
   * 获取唯一验证码
   * @returns {Promise<any>}
   */
  getQRcode(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "qrCode",
        data: {}
      }).subscribe(data => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail)
        }
      })
    });
  }

  /**
   * 退出时调用
   * @returns {Promise<any>}
   */
  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "logout",
        data: {}
      }).subscribe(data => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.msg || Messages.logout_success);
        } else {
          reject(data.body.msg || Messages.logout_fail);
        }
      })
    })
  }


  /**
   * 设置用户的默认值
   * @param userInfo 用户信息
   * @param def 默认值
   */
  setDefaultUserInfo(userInfo:any,def:any){
    return userInfo?userInfo:def;
  }

}
