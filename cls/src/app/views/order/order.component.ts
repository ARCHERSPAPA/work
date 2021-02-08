import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {OrdersService} from "../../pages/orders/orders.service";
import {WarningService} from "../../services/warning.service";
import {addition, computedTotal, equalZero, getNameByKey} from "../../configs/methods";
import {States} from "../../configs/states";

//打印
import  html2canvas from 'html2canvas';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit {

  public stateNames: Array<any> = States.itemState.concat(States.customizedState);
  public orders: any;
  public loading:boolean = false;

  public selectTotal:number = 0;
  //测试html 转成图片时专用
  // @ViewChild('orderView')
  // public orderRef: ElementRef;


  constructor(private ordersService: OrdersService,
              private warn: WarningService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let ids = [];
      if (params && params["ids"]) {
        ids = params["ids"].split(",");
        this.getSuppliers(ids);
      }
    })
  }

  ngAfterContentChecked(){
    // 打印时不需要设置打印的背景
    // let el = this.orderRef && this.orderRef.nativeElement;
    // if(el){
    //   let el_width = el.offsetWidth,el_height = el.offsetHeight;
    //   if(el_width && el_height){
    //     let rows = Math.floor(el_width/200);
    //     let cols = Math.ceil(el_height/200);
    //     this.imgSize = Array.from({length: rows * cols})
    //   }
    // }

  }


  getSuppliers(ids: any) {
    let params = {
      orderId: ids
    };
    this.loading = true;
    this.ordersService.getPrintSuppliers(params).then(data => {
      this.loading = false;
      if (data && data.length > 0) {
        data.forEach((item: any) => {
          item["expand"] = true;
        });
        this.orders = data;
        this.selectTotal = computedTotal(this.orders,'totalPrice');
      }
    }).catch(err => {
      this.loading = false;
      this.warn.onError(err);
    })
  }


  /**
   * 判断传入的值是否为数值型
   * @param num
   * @returns {any}
   */
  equalZero(num: any) {
    return equalZero(num, "无");
  }

  /**
   * 根据状态得到状态名称
   * @param {number} state
   * @returns {any}
   */
  getStateName(state: number) {
    return getNameByKey(state, this.stateNames);
  }

  /**
   * 计算小计
   * @param {number} num
   * @param {number} price
   * @returns {number}
   */
  getSmallTotal(num:number,price:number){
    num = num? num:0;
    price = price? price: 0;
    return addition(num,price);
  }

  /**
   * 打印订单
   */
  printOrders(){
    // const that = this;
    // let dom = this.orderRef.nativeElement;
    // html2canvas(dom,{ allowTaint: true}).then(canvas =>{
    //   let compress = document.createElement("canvas");
    //   console.log("canvas",canvas);
    //   compress.width = canvas.width + 48;
    //   compress.height = canvas.height + 48;
    //   let imageBase64 = canvas.toDataURL("img/png");
    //   let image = new Image();
    //   image.src = imageBase64;
    //   image.onload = function(){
    //     compress.getContext("2d").drawImage(image,0,0,compress.width,compress.height);
    //     var imgString = compress.toDataURL("image/png");
    //
    //     const innerHTML = "<img src='"+imgString+"'/>";
    //     document.body.innerHTML = innerHTML;
    //     window.print();
    //   }
    //
    // })
    window.print();
  }

}
