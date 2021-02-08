import { Injectable } from '@angular/core';
import { RequestService } from "../../../services/request.service";
import { Messages } from "../../../configs/messages";

@Injectable({
  providedIn: 'root'
})
export class OrderDetialService {
  private orderData: any;

  constructor(private req: RequestService) {
  }

  setCaseData(data: Array<any>) {
    this.orderData = data;
  }

  getCaseData() {
    return this.orderData;
  }
  //加载头部
  loadOrderHead(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'orderDetailHead',
        data: { id: id },
      }).subscribe((data: any) => {
        console.log(data)
        if (data.body && data.body.code == 200) {
          this.setCaseData(data.body.data);
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  //加载详情标单
  loadOrderDetail(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'orderDetailList',
        data: { id: id },
      }).subscribe((data: any) => {
        console.log(data)
        if (data.body && data.body.code == 200) {
          resolve(data.body);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  //加载详情定制
  loadOrderDetailSpe(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'orderDetailListSpe',
        data: { id: id },
      }).subscribe((data: any) => {
        console.log(data)
        if (data.body && data.body.code == 200) {
          resolve(data.body);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  //详情进度展示
  getMaterialOrderNode(materialOrderId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'getMaterialOrderNode',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        console.log(data)
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  //添加材料列表
  getSelectionList(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'materialSelectionList',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 修改配送费
   * @param param
   * @returns {Promise<any>}
   */
  upFreight(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upFreight',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 修改订制单数量
   * @param 获取图纸信息
   * @returns {Promise<any>}
   */
  withdraw(materialOrderId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'withdraw',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 解锁
   * @param param
   * @returns {Promise<any>}
   */
  setLockingBudget(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'setLockingBudget',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.msg);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 删除定制单中的详情
   * @param param
   * @returns {Promise<any>}
   */
  deleteDetailByCustomization(materialOrderInfoId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'deleteDetailByCustomization',
        data: { materialOrderInfoId: materialOrderInfoId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 删除增减记录
   * @param param
   * @returns {Promise<any>}
   */
  delMaterialOrderPause(materialOrderPauseId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'delMaterialOrderPause',
        data: { materialOrderPauseId: materialOrderPauseId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 修改增减合计
   * @param param
   * @returns {Promise<any>}
   */
  upFreightByCustomization(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upFreightByCustomization',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 客户增加费用
   * @param param
   * @returns {Promise<any>}
   */
  upCustomersIncreasePrice(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upCustomersIncreasePrice',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 修改订制单数量
   * @param param
   * @returns {Promise<any>}
   */
  upDetailCount(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upDetailCount',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 确认接单
   * @param param
   * @returns {Promise<any>}
   */
  receivingOrder(materialOrderId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'receivingOrder',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
  * 确认发货
  * @param materialOrderId 订单ID
  * @returns {Promise<any>}
  */
  deliverGoods(materialOrderId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'deliverGoods',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
  * 派单
  * @param param
  * @returns {Promise<any>}
  */
  saveMaterialOrderDeliveryInfo(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'saveMaterialOrderDeliveryInfo',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 修改合计
    * @param param
    * @returns {Promise<any>}
    */
  upTotalPrice(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upTotalPrice',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 提交工长确认
    * @param param
    * @returns {Promise<any>}
    */
  submitFreightForWorder(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'submitFreightForWorder',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 提交材料
    * @param param
    * @returns {Promise<any>}
    */
  addDetailByCustomization(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'addDetailByCustomization',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 获取下拉类别
    * @param param
    * @returns {Promise<any>}
    */
  getCategoryList(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'getCategoryList',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 获取图纸详情信息
    * @param materialOrderId 订单ID
    * @returns {Promise<any>}
    */
  getMaterialImgDetails(materialOrderId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'getMaterialImgDetails',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 定制单修改图片
    * @param param
    * @returns {Promise<any>}
    */
  upMaterialImgByCustomization(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upMaterialImgByCustomization',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.msg || Messages.success);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
    * 提交至工长-定制单
    * @param param
    * @returns {Promise<any>}
    */
  submitCustomizationOrderByMaterialSupplier(materialOrderId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'submitCustomizationOrderByMaterialSupplier',
        data: { materialOrderId: materialOrderId },
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.msg || Messages.success);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }
  /**
     * 修改数量-标准单
     * @param param
     * @returns {Promise<any>}
     */
  upMaterialDetailCount(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: 'upMaterialDetailCount',
        data: param,
      }).subscribe((data: any) => {
        if (data.body && data.body.code == 200) {
          resolve(data.body.msg || Messages.success);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      });
    });
  }

  /**
   * 获取当前订单派送员的手机号码
   * @param params
   * @returns {Promise<any>}
   */
  getDeliveryPhone(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.req.doPost({
        url: "getDeliveryPhone",
        data: params
      }).subscribe(data => {
        if (data.body && data.body.code === 200) {
          resolve(data.body.data);
        } else {
          reject(data.body.msg || Messages.fail);
        }
      })
    })
  }
}
