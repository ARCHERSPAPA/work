import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import {environment} from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QiNiuService {

  private token: string = '';
  private dataUrl: string = '';

  constructor(private http: HttpClient) {

  }

  doPostImg(requestObj: any) {
    const that = this;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    });
    let params: any = {
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

    // console.log(param);
    that.http.post(`${environment.config.appUrl}/clouds/uptoken/typeId`, param, {
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


  setToken(token: string) {
    this.token = token;
  }

  setDataUrl(url: string) {
    this.dataUrl = url;
  }

  getToken() {
    return this.token;
  }

  getDataUrl() {
    return this.dataUrl;
  }


}
