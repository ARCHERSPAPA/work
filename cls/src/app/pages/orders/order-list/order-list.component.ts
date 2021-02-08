import {Component, OnInit} from '@angular/core';
import {States} from "../../../configs/states";
import {OrdersService} from "../orders.service";
import {WarningService} from "../../../services/warning.service";
import {Router, ActivatedRoute} from '@angular/router';
import {
  equalZero,
  getNameByKey,
  renderName,
  combineSimilarItems, isToday,
} from "../../../configs/methods";

import {IRadio} from "../../../components/switch-tab/switch-tab.component";
import {EPage} from "../../../enums/e-page.enum";
import {SwitchTabService} from "../../../components/switch-tab/switch-tab.service";


interface IOrderParams {
  companyId: number | null;
  serchInfo: string | null;
  startTime: any;
  endTime: any;
  state: string; //查询状态
  states: any; //订单状态，多为数组
  pageNo: number;
  pageSize: number;
}


enum EOrderKeys {
  all = "0",
  carriage = "1",
  shipments = "3",
  receive = "4",
  signed = "7"
}

enum EOrderNames {
  all = "全部",
  carriage = "待填写",
  shipments = "待发货",
  receive = "待送达",
  signed = "已签收"
}

enum EOrderFormKeys {
  status = "status",
  date = "date",
  company = "company",
  search = "search",
  reset = "reset"
}

class COrderParams implements IOrderParams {
  companyId: number | null = null;
  serchInfo: string | null = null;
  state: string = '0';
  states: any;
  pageNo: number = EPage.page_no;
  pageSize: number = EPage.page_size_20;
  startTime: any;
  endTime: any;
}

const allStateNames = combineSimilarItems();
allStateNames.shift();

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

  public loading: boolean = false;
  //合并标准单和定制单同一状态（便于查询使用）
  public stateNames: any = allStateNames;
  //显示状态值
  public showStateNames: Array<any> = States.itemState.concat(States.customizedState);

  //查询条件内容（页码+条件）
  public orderParams: IOrderParams = new COrderParams();
  //为兼容多个state,设置分隔符号
  public splitMark = "@";
  //总条数
  public total: number = EPage.page_total;
  //定制化订单查询
  public customerForm = {
    type: "select",
    name: EOrderFormKeys.status,
    cols: 2,
    placeholder: "请选择订单状态",
    mode: "multiple",
    data: this.stateNames,
    value: null,
    clear: true
  };
  //条件查询配制
  public forms: Array<any> = [
    {
      type: "dateRange",
      name: EOrderFormKeys.date,
      cols: 4,
      placeholder: "请选择",
      data: null,
      value: null,
      clear: true
    },
    {
      type: "select",
      name: EOrderFormKeys.company,
      cols: 2,
      placeholder: "请选择装修公司",
      mode: "default",
      data: null,
      value: null,
      clear: true
    },
    {
      type: "textGroup",
      name: EOrderFormKeys.search,
      cols: 6,
      placeholder: "请输入订单编号/工长/房户/手机号/地址",
    },
    {
      type: "button",
      name: EOrderFormKeys.reset,
      text: "重置",
      theme: "default"
    }
  ];
  //switch tab切换时
  public switches: Array<IRadio> = [
    {
      key: EOrderKeys.all,
      label: EOrderNames.all,
      selected: true
    },
    {
      key: EOrderKeys.carriage,
      label: EOrderNames.carriage,
      selected: false
    },
    {
      key: EOrderKeys.shipments,
      label: EOrderNames.shipments,
      selected: false
    },
    {
      key: EOrderKeys.receive,
      label: EOrderNames.receive,
      selected: false
    },
    {
      key: EOrderKeys.signed,
      label: EOrderNames.signed,
      selected: false
    }
  ];

  //渲染所得数据
  public orders: any = [];
  //原始数据
  public origins: any = [];
  //材料商所有数据
  public supplier: any;

  public statesOfFilter: any = [];

  constructor(private ordersService: OrdersService,
              private warn: WarningService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private switchTabService:SwitchTabService) {
  }

  ngOnInit(): void {
    this.getSuppliers();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.orderParams.pageNo = params["pageNo"] ? params["pageNo"] : EPage.page_no;
        this.orderParams.companyId = params["companyId"] ? Number(params["companyId"]) : null;
        this.orderParams.state = params["state"] ? params["state"] : '0';
        this.orderParams.startTime = params["startTime"] ? Number(params["startTime"]) : null;
        this.orderParams.endTime = params["endTime"] ? Number(params["endTime"]) : null;
        this.orderParams.states = params["states"] ? this.getParamStates(params["states"]) : null;

        this.resetSwitch(this.orderParams.state);

        this.orderParams.serchInfo = params["serchInfo"] ? params["serchInfo"] : null;
        if (this.orderParams.companyId) {
          const formIndex = this.orderParams.state === EOrderKeys.all ? 2 : 1;
          if (this.forms[formIndex].data && this.forms[formIndex].data.length > 0) {
            this.forms[formIndex].value = this.forms[formIndex].data.filter((d: any) => d.id === this.orderParams.companyId)[0];
          } else {
            this.getSuppliers();
          }
        }

        if (this.orderParams.serchInfo) {
          const serchIndex = this.orderParams.state === EOrderKeys.all ? 3 : 2;
          this.forms[serchIndex].value = this.orderParams.serchInfo.trim();
          this.orderParams.serchInfo = this.orderParams.serchInfo.trim();
        }
      }
      this.changeData();
    });

  }


  getParamStates(states: any) {
    if (states && states.length > 0) {
      const s = states.split(this.splitMark);
      let forms: any = [];
      if (s && s.length > 0) {
        s.map((item: any) => {
          let find = this.stateNames.filter((st: any) => st.state.toString() === item.toString());
          if (find && find.length === 1) {
            forms.push(find[0]);
          }
        })
      }
      if (this.orderParams.state === EOrderKeys.all) {
        if (this.forms[1].name === EOrderFormKeys.status) {
          this.forms[1].value = forms;
        } else {
          this.forms.splice(1, 0, this.customerForm);
          this.forms[1].value = forms;
        }
      }
    }

    return states;
  }


  /**
   * 拉取对应的材料公司
   */
  getSuppliers() {
    this.ordersService.getSuppliers().then(data => {
      if (data && data.length > 0) {
        data.forEach((d: any) => d["content"] = d.abbreviation);
        const formIndex = this.orderParams.state === EOrderKeys.all ? 2 : 1;
        this.forms[formIndex].data = data;
        this.supplier = data;
        if (this.orderParams.companyId) {
          this.forms[formIndex].value = this.forms[formIndex].data.filter((d: any) => d.id === this.orderParams.companyId)[0];
        }
      }
    }).catch(err => {
      this.warn.onError(err);
    })
  }


  /**
   * 单项选择切换重置
   * @param {string} key
   */
  resetSwitch(key: string) {
    if (key !== EOrderKeys.all) {
      this.customerForm.value = null;
      this.orderParams.states = null;
      if (this.forms.length === 5) {
        this.forms.splice(1, 1);
        this.forms[this.forms.length - 2].cols += 2;
        this.orderParams.states = null;
      }
    } else {
      if (this.forms.length === 4) {
        this.forms.splice(1, 0, this.customerForm);
        this.forms[this.forms.length - 2].cols -= 2;
      }
    }
    this.switches = this.switchTabService.resetSwitch(this.switches,key);
  }


  /**
   * tab切换时的回调
   * @param key 回调时返回的key值
   */
  handleSwitch(sch: any) {
    this.orderParams.state = sch.key;
    this.resetData();
  }


  /**
   * 文本输入回调或者按钮
   * @param e
   */
  handleForm(e: any) {
    if (this.orderParams.state === EOrderKeys.all) {
      if (e && e.name === this.forms[3].name) {
        if (e.value) {
          let maps = e.value;
          if (maps && maps.size > 0) {
            maps.forEach((value: any, key: string) => {
              if (key === this.forms[3].name) {
                this.orderParams.serchInfo = value;
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
    } else {
      if (e && e.name === this.forms[2].name) {
        if (e.value) {
          let maps = e.value;
          if (maps && maps.size > 0) {
            maps.forEach((value: any, key: string) => {
              if (key === this.forms[2].name) {
                this.orderParams.serchInfo = value;
              }
            })
          }
        }
      }
      else if (e && e.name === this.forms[3].name) {
        this.forms.forEach(form => {
          if (form.type !== "button") {
            form.value = null;
          }
        });
        this.clearAll();
      }
    }
    this.resetData();
  }


  clearAll() {
    this.orderParams.serchInfo = null;
    this.orderParams.companyId = null;
    this.orderParams.startTime = null;
    this.orderParams.endTime = null;
    if (this.orderParams.state === EOrderKeys.all) {
      this.orderParams.states = null;
    }
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
    else {
      if (this.orderParams.state === EOrderKeys.all) {
        if (e && e.name === this.forms[1].name) { //状态t
          this.orderParams.states = e.value ? this.getStatesInArray(e.value).join(this.splitMark) : null;
        } else if (e && e.name === this.forms[2].name) {
          this.orderParams.companyId = e.value ? e.value.id : null;
        }
      } else {
        if (e && e.name === this.forms[1].name) {
          this.orderParams.companyId = e.value ? e.value.id : null;
        }
      }
    }
    this.resetData();
  }

  //获取状态码数组
  getStatesInArray(array: Array<any>) {
    let ids: any = [];
    if (array && array.length > 0) {
      array.map((a: any) => {
        ids.push(a.state);
      })
    }
    return ids;
  }


  //重新查询
  resetData() {
    this.orderParams.pageNo = EPage.page_no;
    this.changePage();
  }

  changePage() {
    this.router.navigate(["./../list"], {
      queryParams: {
        serchInfo: this.orderParams.serchInfo,
        companyId: this.orderParams.companyId,
        pageNo: this.orderParams.pageNo,
        timestamp: new Date().getTime(),
        startTime: this.orderParams.startTime,
        endTime: this.orderParams.endTime,
        state: this.orderParams.state,
        states: this.escapseState(this.orderParams.states)
      },
      relativeTo: this.activatedRoute
    })
  }

  escapseState(states: any) {
    if (states && states.length > 0) {
      return states instanceof Array ? states.join(",") : states;
    }
    return states;
  }


  changePageIndex(num: number) {
    this.orderParams.pageNo = num;
    this.changePage();
  }

  /**
   * 拉取数据接口信息
   */
  changeData() {
    let orderParams: IOrderParams = this.orderParams;
    this.loading = true;
    const params = this.reduceEmptyObj(orderParams);
    this.ordersService.getOrderList({
      url: "orderList",
      data: params
    }).then(data => {
      this.loading = false;
      this.orders = data && data.page && data.page.pageSet
      this.origins = data && data.page && data.page.pageSet;
      this.renderCount(data && data.count);
      this.total = data && data.page && data.page.total ? data.page.total : 0;
      this.statesOfFilter = this.getFiltersByState(this.origins);
    }).catch(err => {
      this.loading = false;
      this.warn.onError(err);
    })
  }


  /**
   * 渲染数量
   * @param data
   */
  renderCount(data: any) {
    if (data) {
      for (let i in data) {
        switch (i) {
          case "receive":
            this.modifySwitchLabel(EOrderKeys.receive, EOrderNames.receive, data[i]);
            break;
          case "carriage":
            this.modifySwitchLabel(EOrderKeys.carriage, EOrderNames.carriage, data[i]);
            break;
          case "shipments":
            this.modifySwitchLabel(EOrderKeys.shipments, EOrderNames.shipments, data[i]);
            break;
        }
      }
    }
  }

  //同步更新到切换栏里面
  modifySwitchLabel(key: string, name: string, count: number = 0) {
    const find = this.switches.find(sch => sch.key === key);
    if (find && find.key) {
      find.label = `${name}${count ? count : ''}`;
    }
  }


  //本地过滤所需要的字段名称
  getFiltersByState(orders: any) {
    let states: any = new Set(), filters: any = [];
    const that = this;
    orders.forEach((o: any) => {
      states.add(that.getStateName(o.state));
    });

    if (states && states.size > 0) {
      states.forEach((s: any) => {
        filters.push({
          text: s,
          value: s
        })
      });
    }
    return filters;
  }

  //本地过滤函数
  stateFilterFn = (value: any) => {
    const that = this;
    if (value) {
      that.orders = that.origins.filter((o: any) => {
        return that.getStateName(o.state) == value
      });
    } else {
      that.orders = that.origins;
    }
  }

  /**
   * 组装查询参数
   * @param obj
   * @returns {any}
   */
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
            obj[key] = obj[key] && obj[key].split(this.splitMark);
            if(obj[key] && obj[key].length > 0){
              obj[key] = obj[key].reduce((prev:any,current:any) =>{
                if(current.includes(",")){
                  return prev.concat(current.split(","));
                }
                return prev.concat(current);
              },[]);
            }
          }
        }
      }
    }
    return obj;
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
    const name = getNameByKey(state, this.showStateNames);
    return renderName(name);
  }

  /**
   * 渲染文本
   * @param data
   * @returns {string}
   */
  renderName(data: any, mark: string = "--") {
    return renderName(data, mark);
  }


  todo(data: any) {
    this.router.navigate(["./../detail"], {
      queryParams: {
        orderId: data.id,
        quoteId: data.quoteId,
        ...this.activatedRoute.snapshot.queryParams
      },
      relativeTo: this.activatedRoute
    });
  }
}
