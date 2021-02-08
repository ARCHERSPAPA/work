import {Injectable} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {Messages} from "../../configs/messages";

@Injectable({
  providedIn: 'root'
})
export class SettlesService {

  constructor(private req: RequestService) {
  }

  /**
   * 申请结算
   * @param {Array<any>} orderIds
   * @returns {Promise<any>}
   */
  settleApplyByIds(orderIds: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "settleApply",
        data: {orderIds: orderIds},
      }).subscribe(data => {
        if(data.body && data.body.code === 200){
          resolve(data.body.msg || Messages.success);
        }else{
          reject(data.body && data.body.msg || Messages.fail);
        }
      })
    })
  }


}
