import { Component, OnInit } from '@angular/core';
import { OrderDetialService } from '../../order-detail/order-detial.service';
interface INode {
  title: string;
  nodeTime: number;
  imgUrls: Array<any> | null;
  remark: string | null;
}
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-detail-schedules',
  templateUrl: './order-detail-schedules.component.html',
  styleUrls: ['./order-detail-schedules.component.less']
})
export class OrderDetailSchedulesComponent implements OnInit {
  public nodeList: Array<any> = []; // 节点列表
  public orderId: any;
  constructor
    (private headDetail: OrderDetialService,
      private activatedRoute: ActivatedRoute,) { }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['orderId']) {
        this.orderId = params['orderId']
      }
    });
    this.headDetail.getMaterialOrderNode(this.orderId).then(res => {
      this.nodeList = res

    })

  }
  /** 
   * 颜色展示
   * @param {number} state  0-未到达节点, 1-当前节点，2-已完成节点
   * @param {number} type  11-撤回
   * @returns {string}
   */
  showColor(state: number, type: number) {
    if (state == 0) {
      return 'gray';
    } else if (state == 1) {
      return 'blue'
    } else {
      if (type == 11) {
        return 'red'
      } else {
        return 'green';
      }
    }
  }

}
