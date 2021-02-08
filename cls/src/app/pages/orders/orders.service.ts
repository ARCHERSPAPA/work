import { Injectable } from '@angular/core';
import { RequestService } from "../../services/request.service";
import { Messages } from "../../configs/messages";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private req: RequestService) {
  }


  /**
   * 获取订单数据（列表）
   * @param params
   * @returns {Promise<any>}
   */
  getOrderList(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost(params).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      })
    })
  }

  /**
   * 拉取当前材料商数据
   * @returns {Promise<any>}
   */
  getSuppliers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "supplierList",
        data: {},
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      })
    })
  }

  /**
   * 加载打印数据
   * @param params
   * @returns {Promise<any>}
   */
  getPrintSuppliers(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "supplierPrintList",
        data: params,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      })
    })
  }

}
