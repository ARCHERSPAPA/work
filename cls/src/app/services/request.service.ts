import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { URLs } from "../configs/urls";
import { environment } from './../../environments/environment';
import * as qs from 'qs';
import { Base } from "../configs/base";
import { StorageService } from "./storage.service";
import { Md5 } from 'ts-md5/dist/md5';
import { Base64 } from 'js-base64';
import { UUID } from 'angular2-uuid';
import {EStorage} from "../enums/e-storage.enum";
interface IReq {
  url: string,
  data: any,
  response?: any
}


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient,
    private storageService: StorageService) {
  }

  doPostImg(requestObj: any) {
    const that = this;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    });
    let params:any = {
      timestamp: new Date().getTime().toString(),
      para: requestObj.data ? requestObj.data : 'id=0',
      h5: '0',
      terminal: '2',
      version: '2.3.7',
      sign: '',
      userId: -1
    };

    params['sign'] = Md5.hashStr('userId=' + 65 + '&timestamp' + params['timestamp']) + '';
    params['userId'] = 65;

    const param = new HttpParams({
      fromObject: params
    });

    console.log(param);
    that.http.post('https://testappserver.madrock.com.cn/clouds/uptoken/typeId', param, {
      headers: headers,
      observe: 'body',
      responseType: 'json',
      withCredentials: true
    }).subscribe(
      res => {
        requestObj.success(res);
      },
      err => {
        if (requestObj.error) {
          requestObj.error(err);
        } else {
          // that.onErrorHandler(err);
        }
      });

  }



  doPost(req: IReq): Observable<any> {
    let headers = null;
    if (this.storageService.getStorage(EStorage.ACCESS_TOKEN)) {
      let accessToken = this.storageService.getStorage(EStorage.ACCESS_TOKEN);
      headers = new HttpHeaders()
        .append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
        .append("Access-Token", accessToken)
    } else {
      headers = new HttpHeaders()
        .append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
    }

    let params = {
      timestamp: new Date().getTime().toString(),
      h5: 0,
      large: 1,
      version: Base.version,
      para: JSON.stringify(req.data)
    };
    return this.http.post(this.getUrlByName(req.url), qs.stringify(params), {
      headers: headers,
      observe: "response" as "body",
      responseType: 'json',
      withCredentials: true
    });
  }

  /**
   * 根据键值来获取拼接请求地址
   * @param key
   * @returns {any}
   */
  getUrlByName(key: any): any {
    if (!URLs.hasOwnProperty(key)) {
      return null;
    }
    return this.getApiUrl() + URLs[key];
  }

  /**
   * 根据环境获取请求域名
   * @returns {string}
   */
  getApiUrl() {
    if (environment.production) {
      return environment.config.apiUrl;
    } else {
      return environment.config.apiUrl;
    }
  }


}
