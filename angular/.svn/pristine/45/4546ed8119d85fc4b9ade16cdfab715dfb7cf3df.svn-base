import { Injectable } from '@angular/core';
import { RequestService } from '../../../../service/request.service';
@Injectable({
  providedIn: 'root'
})
export class TempLibListService {

  constructor(private req: RequestService) { }

  /**
   * 基础库的类别拉取
   */
  getCategory(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'baseGetCategory',
        success: res => {
          if (res && res.code == 200) {
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        }
      })
    })
  }
}
