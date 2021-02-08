import {Component, OnInit} from '@angular/core';
import {States} from "../../../configs/states";
import {OrdersService} from "../orders.service";
import {WarningService} from "../../../services/warning.service";
import {Router, ActivatedRoute} from '@angular/router';

import {
  addition, combineSimilarItems,
  computedTotal,
  equalZero,
  getNameByKey, isToday,
  renderName
} from "../../../configs/methods";
import {ItemOrder} from "../itemsOrder";
import {EPage} from "../../../enums/e-page.enum";


interface IOrderParams {
  companyId: any;
  condition: any;
  startTime: any;
  endTime: any;
  states: any;
  pageNum: number;
  pageSize: number
}

class COrderParams implements IOrderParams {
  companyId: any;
  condition: any;
  endTime: any;
  pageNum: number = EPage.page_no;
  pageSize: number = EPage.page_size_20;
  startTime: any;
  states: any;
}


@Component({
  selector: 'app-item-orders',
  templateUrl: './item-orders.component.html',
  styleUrls: ['./item-orders.component.less']
})
export class ItemOrdersComponent implements OnInit {

  public loading: boolean = false;
  //合并标准单和定制单同一状态（便于查询使用）
  public stateNames: any = combineSimilarItems();
  //原始各状态值
  public showStateNames: Array<any> = States.itemState.concat(States.customizedState);

  //查询条件内容（页码+条件）
  public orderParams: IOrderParams = new COrderParams();
  public total:number = EPage.page_total;
  //全选
  public allChecked: boolean = false;
  public indeterminate: boolean = false;

  //条件查询配制
  public forms: Array<any> = [
    {
      type: "dateRange",
      name: "range",
      cols: 6,
      placeholder: "请选择",
      data: null,
      value: null,
      clear: true,
      ranges: [new Date('2020-09-30'), new Date()]
    },
    {
      type: "select",
      name: "orderStatus",
      cols: 4,
      placeholder: "请选择材料订单状态",
      mode: "default",
      data: this.stateNames,
      value: null,
      clear: true
    },
    {
      type: "select",
      name: "company",
      cols: 4,
      placeholder: "请选择装修公司",
      mode: "default",
      data: null,
      value: null,
      clear: true
    },
    {
      type: "textGroup",
      name: "search",
      cols: 7,
      placeholder: "请输入工长/客户/楼盘房号",
    },
    {
      type: "button",
      name: "clear",
      text: "重置",
      theme: "default"
    }
  ];

  //所得数据
  public orders: any;
  //选中数据
  public selectItems: Array<ItemOrder> = [];
  //选中数据所得总和
  public selectTotal: number = 0;
  //材料商所有数据
  public supplier: any;

  constructor(private ordersService: OrdersService,
              private warn: WarningService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getSuppliers();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.orderParams.pageNum = params["pageNo"] ? params["pageNo"] : EPage.page_no;
        this.orderParams.companyId = params["companyId"] ? Number(params["companyId"]) : null;
        this.orderParams.states = params["states"] ? params["states"] : null;
        this.orderParams.condition = params["condition"] ? params["condition"] : null;
        this.orderParams.startTime = params["startTime"] ? Number(params["startTime"]) : null;
        this.orderParams.endTime = params["endTime"] ? Number(params["endTime"]) : null;

        if (this.equalZero(this.orderParams.states) !== "无") {
          this.forms[1].value = this.forms[1].data.filter((d: any) => d.state === this.orderParams.states)[0];
        }

        if (this.orderParams.companyId) {
          if (this.forms[2].data && this.forms[2].data.length > 0) {
            this.forms[2].value = this.forms[2].data.filter((d: any) => d.id === this.orderParams.companyId)[0];
          } else {
            this.getSuppliers();
          }
        }

        if (this.orderParams.condition) {
          this.forms[3].value = this.orderParams.condition.trim();
          this.orderParams.condition = this.orderParams.condition.trim();
        }

        if (this.orderParams.startTime && this.orderParams.endTime) {
          this.forms[0].value = [new Date(this.orderParams.startTime), new Date(this.orderParams.endTime)];
        }
      }
      this.changeData();
    });


  }


  /**
   * 拉取对应的材料公司
   */
  getSuppliers() {
    this.ordersService.getSuppliers().then(data => {
      if (data && data.length > 0) {
        data.forEach((d: any) => d["content"] = d.abbreviation);
        this.forms[2].data = data;
        this.supplier = data;
        if (this.orderParams.companyId) {
          this.forms[2].value = this.forms[2].data.filter((d: any) => d.id === this.orderParams.companyId)[0];
        }
      }
    }).catch(err => {
      this.warn.onError(err);
    })
  }


  /**
   * 文本输入回调或者按钮
   * @param e
   */
  handleForm(e: any) {
    if (e && e.name === this.forms[3].name) {
      if (e.value) {
        let maps = e.value;
        if (maps && maps.size > 0) {
          maps.forEach((value: any, key: string) => {
            if (key === this.forms[3].name) {
              this.orderParams.condition = value;
            }
          })
        }

      }
    }
    else if (e && e.name === this.forms[4].name) {
      this.forms.forEach(form => {
        if (form.type !== "button") {
          form.value = null;
        }
      });
      this.clearAll();
    }
    this.resetData();
  }

  clearAll() {
    this.orderParams.condition = null;
    this.orderParams.endTime = null;
    this.orderParams.startTime = null;
    this.orderParams.states = null;
    this.orderParams.companyId = null;
  }

  handleSelect(e: any) {
    if (e && e.name === this.forms[0].name) {
      if (e.value && e.value.length === 2) {
        const start = new Date(e.value[0]).getTime();
        const end = new Date(e.value[1]).getTime();
        this.orderParams.startTime = new Date(new Date(start).toLocaleDateString()).getTime();
        //查询当天时
        if (isToday(end)) {
          this.orderParams.endTime = new Date(end).getTime();
        } else {
          this.orderParams.endTime = new Date(new Date(end).toLocaleDateString()).getTime() + 86399000;
        }
      } else {
        this.orderParams.startTime = null;
        this.orderParams.endTime = null;
      }
    }
    else if (e && e.name === this.forms[1].name) {
      this.orderParams.states = e.value ? e.value.state : null;
    } else if (e && e.name === this.forms[2].name) {
      this.orderParams.companyId = e.value ? e.value.id : null;
    }
    this.resetData();
  }

  resetData() {
    this.orderParams.pageNum = EPage.page_no;
    this.changePage();
  }

  changePage() {
    this.selectItems = [];
    this.checkAll(false);

    if (this.orderParams.states && this.orderParams.states instanceof Array) {
      this.orderParams.states = this.orderParams.states.join(",");
    }
    this.router.navigate(["./"], {
      queryParams: {
        condition: this.orderParams.condition,
        startTime: this.orderParams.startTime,
        endTime: this.orderParams.endTime,
        states: this.orderParams.states,
        companyId: this.orderParams.companyId,
        pageNo: this.orderParams.pageNum,
        timestamp: new Date().getTime()
      },
      relativeTo: this.activatedRoute
    })
  }


  changePageIndex(num: number) {
    this.orderParams.pageNum = num;
    this.changePage();
  }


  changeData() {
    let orderParams: IOrderParams = this.orderParams;
    this.loading = true;
    const params = this.reduceEmptyObj(orderParams);
    this.ordersService.getOrderList({
      url: "orderPrintList",
      data: params
    }).then(data => {
      this.loading = false;
      if (data && data.list && data.list.length > 0) {
        data.list.forEach((item: any) => {
          item["expand"] = false;
          item["checked"] = false;
        });
        this.orders = data.list;
      } else {
        this.orders = []
      }
      this.total = data && data.total ? data.total : 0;

    }).catch(err => {
      this.loading = false;
      this.warn.onError(err);
    })

  }


  reduceEmptyObj(obj: any) {
    for (var key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      }
      //状态转成数组
      if (obj[key] && key === "states") {
        if (obj[key] === this.stateNames[0].state) {
          delete obj[key];
        } else {
          if (obj[key] && typeof obj[key] === "string") {
            obj[key] = obj[key] && obj[key].split(",");
          }
        }
      }
    }
    return obj;
  }

  //全选
  checkAll(e: any) {
    this.allChecked = e;
    this.orders.forEach((order: any) => {
      order["checked"] = this.allChecked;
    });
    this.refreshStatus();
  }

  refreshStatus() {
    let allChecked = false,
      allUnChecked = false;

    if (this.orders && this.orders.length > 0) {
      allChecked = this.orders.every((orders: any) => orders.checked === true);
      allUnChecked = this.orders.every((order: any) => !order.checked);
      this.allChecked = allChecked;
      this.indeterminate = (!allChecked) && (!allUnChecked);
      this.selectItems = this.orders.filter((order: any) => order.checked === true);
    } else {
      this.allChecked = allUnChecked;
    }

    if (this.selectItems && this.selectItems.length > 0) {
      this.selectTotal = computedTotal(this.selectItems, 'totalPrice');
    }
  }

  /**
   * 所选id集合
   * @returns {any}
   */
  getOrderIds() {
    let ids = [];
    if (this.selectItems && this.selectItems.length > 0) {
      ids = this.selectItems.map((item: any) => item.orderId);
    }
    return ids.join(",");
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
    let name = getNameByKey(state, this.showStateNames);
    return name ? name : '--';
  }

  /**
   * 计算小计
   * @param {number} num
   * @param {number} price
   * @returns {number}
   */
  getSmallTotal(num: number, price: number) {
    num = num ? num : 0;
    price = price ? price : 0;
    return addition(num, price);
  }

  /**
   * 计算订单合计
   * @param {number} freight
   * @param {number} total
   * @returns {number}
   */
  // getTotal(freight:number,total:number){
  //   freight = freight?freight:0;
  //   total = total?total:0;
  //   return plus(freight,total);
  // }


  /**
   * 渲染文本
   * @param data
   * @returns {string}
   */
  renderName(data: any, mark: string = "--") {
    return renderName(data, mark);
  }


}
