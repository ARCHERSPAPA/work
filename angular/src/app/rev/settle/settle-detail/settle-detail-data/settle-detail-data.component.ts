import { Component, OnInit } from '@angular/core';
import { SettleService } from '../../../../service/settle.service';
import { WarningService } from '../../../../service/warning.service';
import { ActivatedRoute } from '@angular/router';
import { getMaterialState } from '../../../../model/methods';
import { atob } from '../../../../model/methods';
import {IPay, IQuoteData,IPrice} from "./sette-detail-data";
@Component({
  selector: 'rev-settle-detail-data',
  templateUrl: './settle-detail-data.component.html',
  styleUrls: ['./settle-detail-data.component.scss']
})
export class SettleDetailDataComponent implements OnInit {
  public setterList;
  public type;
  public stateName;
  public materialType;
  public quote:IQuoteData = <IQuoteData>{materialOrderNo:"--",workers: []};
  public pay:IPay = <IPay>{receivePrice:0,ratio:0,totalPrice:0};
  public price:IPrice=<IPrice>{}
  public orderId;//订单ID
  constructor(
    private settle: SettleService,
    private warn: WarningService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['type']) {
        this.type = params['type'];
        this.orderId = atob(params['id']);
        this.materialType=params['materialType'];
      }
    });
    this.loadMaterialDetail();
  }
  ngDoCheck() {
    if (this.settle.getOrderData()) {
      this.setterList = this.settle.getOrderData();
      this.stateName = getMaterialState(this.setterList.quote.state);
      this.getColor();
    }
  }

  //判断是否红色
  checkShowRed() {
    if (Number(this.pay.allPriceRatio) >= this.pay.ratio) {
      return 'red ';
    } else {
      return 'rgba(0, 0, 0, 0.45)';
    }
  }
  checkShowBlank() {
    if (Number(this.pay.allPriceRatio) >= this.pay.ratio) {
      return 'red ';
    } else {
      return 'inherit';
    }
  }
  //获得原工长的名称
  getOldWorkerName(workers) {
    let str = [];
    if (workers.length > 0) {
      workers.forEach(worker => {
        str.push(worker.employeeName);
      });
    }
    return str.join('，')
  }
  getStateName(state) {
    return getMaterialState(state);
  }
  /**
   * 获取颜色
   */
  getColor() {
    if (this.setterList) {
      if ([2, 11, 13].indexOf(this.setterList.quote.state) > -1) {
        return 'red ';
      } else {
        return 'blue';
      }
    }

  }
  getTitle(price) {
    return `材料可用：${this.pay.ratio}%（金额：${price}）`
  }
  /**
   * 刷新head
   */
  loadMaterialDetail() {
    this.settle.loadMaterialHead(this.orderId).then(res => {
      this.setterList = res;
      if (this.setterList) {
        this.quote = this.setterList.quote;
        this.pay = this.setterList.pay;
        this.price = this.setterList.price;
      }
      this.settle.setOrderData(res)
    }).catch(err => {
      this.warn.onError(err);
    });
  }
  /**
   * 渲染价格
   */
  renderPrice(price) {
    if (price || price == 0) {
      return price;
    } else {
      return false;
    }
  }
  /**
   * 计算进度条长度
   */
  getWidth() {
    if (this.setterList) {
      if (this.setterList.pay.receivePriceRatio) {
        if (this.setterList.pay.receivePriceRatio > 100) {
          return 100;
        }
        return this.setterList.pay.receivePriceRatio
      } else {
        return 2
      }
    }
  }
}
