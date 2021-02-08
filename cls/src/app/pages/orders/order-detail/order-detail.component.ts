import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { OrderDetialService } from '../order-detail/order-detial.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.less']
})
export class OrderDetailComponent implements OnInit {

  public tabs: any;
  public orderId: any;
  public index: number = 0;
  constructor
    (private headDetailServe: OrderDetialService,
      private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['orderId']) {
        this.orderId = params['orderId']
      }
    });

  }
}
