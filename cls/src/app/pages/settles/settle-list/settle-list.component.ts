import {Component, OnInit} from '@angular/core';
import {
  equalZero,
  isToday, plus, reloadChange,
  renderArrayName,
  renderName,
  renderParams, stateInArray
} from "../../../configs/methods";
import {ESettleState, ESettleStateName, ESettleStatusName, ISettle} from "../settles";
import {IRadio} from "../../../components/switch-tab/switch-tab.component";
import {EPage} from "../../../enums/e-page.enum";
import {Router, ActivatedRoute} from '@angular/router';
import {OrdersService} from "../../orders/orders.service";
import {WarningService} from "../../../services/warning.service";
import {SettlesService} from "../settles.service";
import {SwitchTabService} from "../../../components/switch-tab/switch-tab.service";

interface ISettleParams {
  companyId: number | null;
  serchInfo: string | null;
  startTime: any;
  endTime: any;
  state: string;
  pageNo: number;
  pageSize: number;
}

class CSettleParams implements ISettleParams {
  companyId: number | null = null;
  serchInfo: string | null = null;
  startTime: any;
  endTime: any;
  state: string = ESettleState.STAY_SETTLED.toString();
  pageNo: number = EPage.page_no;
  pageSize: number = EPage.page_size_20;
}


@Component({
  selector: 'app-settle-list',
  templateUrl: './settle-list.component.html',
  styleUrls: ['./settle-list.component.less']
})
export class SettleListComponent implements OnInit {

  public loading: boolean = false;

  //结算列表数据
  public settles: ISettle[] = [];

  //查询条件内容（页码+条件）
  public settleParams: ISettleParams = new CSettleParams();
  public total: number = EPage.page_total;

  //状态栏选项
  public switches: Array<IRadio> = [
    {
      key: (ESettleState.STAY_SETTLED).toString(),
      label: ESettleStateName.STAY_SETTLED,
      selected: true
    },
    {
      key: (ESettleState.REVIEW_SETTLED).toString(),
      label: ESettleStateName.REVIEW_SETTLED,
      selected: false
    },
    {
      key: (ESettleState.FINISH_SETTLED).toString(),
      label: ESettleStateName.FINISH_SETTLED,
      selected: false
    }
  ];

  //搜索栏
  //条件查询配制
  public forms: Array<any> = [
    {
      type: "dateRange",
      name: "date",
      cols: 6,
      placeholder: "请选择",
      data: null,
      value: null,
      clear: true,
      ranges: [new Date('2020-09-30'), new Date()]
    },
    {
      type: "select",
      name: "company",
      cols: 2,
      placeholder: "请选择装修公司",
      mode: "default",
      data: null,
      value: null,
      clear: true
    },
    {
      type: "textGroup",
      name: "search",
      cols: 8,
      placeholder: "请输入订单编号/楼盘名称",
    },
    {
      type: "button",
      name: "clear",
      text: "重置",
      theme: "default"
    }
  ];

  //材料商所有数据
  public supplier: any;

  //全选
  public allChecked: boolean = false;
  public indeterminate: boolean = false;
  public selectItems: Array<ISettle> = [];

  //结算提交判断重
  public confirmLoading: boolean = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private ordersService: OrdersService,
              private settlesService: SettlesService,
              private warn: WarningService,
              private switchTabService: SwitchTabService) {
  }

  ngOnInit(): void {
    //加载装修公司名称
    this.getSuppliers();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.settleParams.pageNo = params["pageNo"] ? params["pageNo"] : EPage.page_no;
        this.settleParams.companyId = params["companyId"] ? Number(params["companyId"]) : null;
        this.settleParams.state = params["state"] ? params["state"] : ESettleState.STAY_SETTLED.toString();
        this.settleParams.startTime = params["startTime"] ? Number(params["startTime"]) : null;
        this.settleParams.endTime = params["endTime"] ? Number(params["endTime"]) : null;

        this.switches = this.switchTabService.resetSwitch(this.switches, this.settleParams.state);

        this.settleParams.serchInfo = params["serchInfo"] ? params["serchInfo"] : null;
        if (this.settleParams.companyId) {
          if (this.forms[1].data && this.forms[1].data.length > 0) {
            this.forms[1].value = this.forms[1].data.filter((d: any) => d.id === this.settleParams.companyId)[0];
          } else {
            this.getSuppliers();
          }
        }

        if (this.settleParams.serchInfo) {
          this.forms[2].value = this.settleParams.serchInfo.trim();
          this.settleParams.serchInfo = this.settleParams.serchInfo.trim();
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
        this.forms[1].data = data;
        this.supplier = data;
        if (this.settleParams.companyId) {
          this.forms[1].value = this.forms[1].data.filter((d: any) => d.id === this.settleParams.companyId)[0];
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
  // resetSwitch(key: string) {
  //   this.switches.find((s: any) => {
  //     s.selected = s.key === key;
  //     return s;
  //   });
  // }


  //按页码查询
  changePageIndex(num: number) {
    this.settleParams.pageNo = num;
    this.changePage();
  }


  //全选
  checkAll(e: any) {
    this.allChecked = e;
    this.settles.filter((s: ISettle) => s.accountingPeriod === 1)
      .forEach((settle: ISettle) => {
        if (settle.accountingPeriod) {
          settle["checked"] = this.allChecked;
        }
      });
    this.refreshStatus();
  }

  //更新选择时
  refreshStatus() {
    let allChecked = false,
      allUnChecked = false;

    if (this.settles && this.settles.length > 0) {
      const expectFilter = this.settles.filter((s: ISettle) => s.accountingPeriod === 1);
      allChecked = expectFilter.every((settle: ISettle) => settle.checked === true);
      allUnChecked = expectFilter.every((settle: ISettle) => !settle.checked);
      this.allChecked = expectFilter.length > 0 && allChecked;
      this.indeterminate = expectFilter.length > 0 && (!allChecked) && (!allUnChecked);
      this.selectItems = expectFilter.filter((settle: ISettle) => settle.checked === true);
    } else {
      this.allChecked = allUnChecked;
    }
  }

  //结算列表时间渲染
  renderTime(state: string, data: ISettle) {
    switch (state) {
      case ESettleState.STAY_SETTLED.toString():
        return data && data.signingTime;
      case ESettleState.REVIEW_SETTLED.toString():
        return data && data.submitSettlementTime;
      case ESettleState.FINISH_SETTLED.toString():
        return data && data.auditSettlementTime;
    }
    return null;
  }

  /**
   * 渲染文本
   * @param data
   * @returns {string}
   */
  renderName(data: any, mark: string = "--") {
    return renderName(data, mark);
  }

  /**
   * 根据数组渲染文本
   * @param data
   * @param {string} mark
   * @returns {any | string}
   */
  renderArrayName(data: any, mark: string = "--") {
    return renderArrayName(data, mark, "，");
  }


  /**
   * 结算状态根据订单状态显示除（待结算时），待结算先判断是否过期后再判断
   * @param {number} state
   * @param {string} type
   * @param {number} period
   * @returns {any}
   */
  getSettleName(state: number, type: string, period: number = 0) {
    if (type === ESettleState.STAY_SETTLED.toString()) {
      return period ? ESettleStatusName.settleable : ESettleStatusName.unsettled;
    } else {
      if (stateInArray(state, [10, 52])) return ESettleStatusName.settled;
      if (stateInArray(state, [11, 53])) return ESettleStatusName.settled_fail;
      if (stateInArray(state, [1, 9, 43, 51])) return ESettleStatusName.settle_audit;
      return "--";
    }

  }


  /**
   * 判断传入的值是否为数值型
   * @param num
   * @returns {any}
   */
  equalZero(num: any) {
    return equalZero(num, "无");
  }


  changePage() {
    this.selectItems = [];
    this.checkAll(false);
    this.router.navigate(["./"], {
      queryParams: {
        serchInfo: this.settleParams.serchInfo,
        companyId: this.settleParams.companyId,
        pageNo: this.settleParams.pageNo,
        timestamp: new Date().getTime(),
        startTime: this.settleParams.startTime,
        endTime: this.settleParams.endTime,
        state: this.settleParams.state
      },
      relativeTo: this.activatedRoute
    })
  }


  resetData() {
    this.settleParams.pageNo = EPage.page_no;
    this.changePage();
  }

  changeData() {
    const settleParams: ISettleParams = renderParams(this.settleParams);
    this.loading = true;
    this.ordersService.getOrderList({
      url: "settleList",
      data: settleParams
    }).then(data => {
      this.loading = false;
      this.settles = data && data.pageSet;

      this.settles && this.settles.map(s => {
        s["checked"] = false;
      });

      this.total = data && data.total ? data.total : 0;
    }).catch(err => {
      this.loading = false;
      this.warn.onError(err);
    })
  }


  /**
   * tab切换时的回调
   * @param key 回调时返回的key值
   */
  handleSwitch(sch: any) {
    this.settleParams.state = sch.key;
    this.resetData();
  }


  /**
   * 文本输入回调或者按钮
   * @param e
   */
  handleForm(e: any) {
    if (e && e.name === this.forms[2].name) {
      if (e.value) {
        let maps = e.value;
        if (maps && maps.size > 0) {
          maps.forEach((value: any, key: string) => {
            if (key === this.forms[2].name) {
              this.settleParams.serchInfo = value;
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
      this.settleParams.companyId = null;
      this.settleParams.serchInfo = null;
      this.settleParams.startTime = null;
      this.settleParams.endTime = null;
    }
    this.resetData();
  }

  /**
   * 条件查询选项框
   * @param e
   */
  handleSelect(e: any) {
    if (e && e.name === this.forms[0].name) {
      if (e.value && e.value.length === 2) {
        const start = new Date(e.value[0]).getTime();
        const end = new Date(e.value[1]).getTime();
        this.settleParams.startTime = new Date(new Date(start).toLocaleDateString()).getTime();
        //查询当天时
        if (isToday(end)) {
          this.settleParams.endTime = new Date(end).getTime();
        } else {
          this.settleParams.endTime = new Date(new Date(end).toLocaleDateString()).getTime() + 86399000;
        }
      } else {
        this.settleParams.startTime = null;
        this.settleParams.endTime = null;
      }
    }
    else if (e && e.name === this.forms[1].name) {
      this.settleParams.companyId = e.value ? e.value.id : null;
    }
    this.resetData();
  }

  /**
   * 结算二次弹框中确认按钮执行操作
   */
  confirmSettle() {
    let ids: Array<number> = [];
    this.selectItems.map((s: any) => {
      ids.push(s.id);
    })
    this.handleSettle(ids);
  }

  /**
   * 单个结算
   * @param {number} id
   */
  doSettle(id: number) {
    this.handleSettle([id]);
  }


  //处理申请结算
  handleSettle(ids: Array<number>) {
    if (ids && ids.length > 0) {
      this.confirmLoading = true;
      this.settlesService.settleApplyByIds(ids)
        .then((msg: any) => {
          this.warn.onSuccess(msg);
          //是否在当前页面刷新使用
          reloadChange(ids, this.settles)
            .then((bool: boolean) => {
              if (bool) {
                if (this.settleParams.pageNo > 1) {
                  this.settleParams.pageNo--;
                } else {
                  this.settleParams.pageNo = EPage.page_no;
                }
              }
              this.changePage();
            })
        })
        .catch(err => {
          this.confirmLoading = false;
          this.warn.onError(err);
        })
    }
  }

  showCheckboxByState() {
    return this.settleParams.state === ESettleState.STAY_SETTLED.toString();
  }

  /**
   * 计算结算项目合计
   * @returns {any}
   */
  getSettleTotal() {
    return this.selectItems.reduce((prev: any, current: ISettle) => {
      return plus(current.totalPrice ? current.totalPrice : 0, prev);
    }, 0)
  }

  todo(data: ISettle) {
    this.router.navigate(["./../../order/detail"], {
      queryParams: {
        orderId: data.id,
        quoteId: data.quoteId,
        ...this.activatedRoute.snapshot.queryParams
      },
      relativeTo: this.activatedRoute
    });
  }

}
