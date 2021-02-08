import { Component, OnInit } from '@angular/core';
import { WarningService } from "../../../../services/warning.service";
import { StorageService } from "../../../../services/storage.service";
import { OrderDetialService } from '../../order-detail/order-detial.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  addition,
  equalZero,
  renderName
} from "../../../../configs/methods";
import { from } from 'rxjs';
import { EMenuKeys } from '../../../../enums/e-menus.enum'
import { EStorage } from '../../../../enums/e-storage.enum'

@Component({
  selector: 'app-order-detail-materials',
  templateUrl: './order-detail-materials.component.html',
  styleUrls: ['./order-detail-materials.component.less']
})

export class OrderDetailMaterialsComponent implements OnInit {
  //标单
  public materials: Array<any> = [];
  //定制
  public customData: Array<any> = [{ name: "预算包含内", list: [], id: 0 }, { name: "预算包含外", list: [], id: 1 }];
  //页面相关
  public loading: boolean = false;
  public visible: boolean = false;
  public expandSet = new Set<number>()
  //弹窗
  public priceisVisible: boolean = false;
  public editPriceisVisible: boolean = false;
  public payPhoneisVisible: boolean = false;
  public remarkIsVisible: boolean = false;

  public editPrice: number = 0;
  public remark: any = { remark: '' };
  //增加费用
  public addPrice: number = 0;
  public addPriceType: string = '1';
  public symbol: string = '+';

  public phone: any;
  public state: any;//订单状态
  public selfExtraction: any;//是否自提
  public lockingBudget: any;//锁定状态

  public queryParams: any; //返回页面的全部参数
  public currentMaterial: any = { material: [], id: '' }; //当前材料
  public orderId: number = 0;
  public quoteId: number = 0;

  public Price: any = { //当前金额
    totalPrice: 0,
    customersIncreasePrice: 0,
    snapshotPrice: 0,
    freight: 0
  };

  public orderType: number = 0; //1订单类型
  public recordData: Array<any> = [];

  constructor(private headDetail: OrderDetialService,
    private warn: WarningService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService) {
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = JSON.parse(JSON.stringify(params)); //去掉不需要的返回参数
      delete this.queryParams['orderId'];
      delete this.queryParams["quoteId"];

      if (params && params['orderId']) {
        this.orderId = params['orderId']
      }
      this.quoteId = params && params["quoteId"];
    });
    this.loadHead()
  }

  ngDoCheck() {                             //及时更新头部的改动
    if (this.headDetail.getCaseData()) {
      this.Price.freight = this.headDetail.getCaseData().freight
    }
  }
  //初始化头部信息
  loadHead() {
    this.headDetail.loadOrderHead(this.orderId).then(res => {
      this.orderType = res.type;
      this.renderList();
      this.phone = res && res.deliveryPhone;
    })
  }

  //派送
  send() {
    this.headDetail.deliverGoods(this.orderId).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
      this.loadHead()
    }).catch(err => {
      this.warn.onError(err);
    })
  }

  /**
   * 打开备注弹出框
   * @param id
   * @param remark
   */
  openRemark(id: any, remark: any) {
    this.remark.id = id;
    this.remark.remark = remark;
    this.remarkIsVisible = true
  }

  //渲染数据
  renderList() {
    if (this.orderType == 1) {
      this.headDetail.loadOrderDetail(this.orderId).then(res => {
        res.data.orderInfoList.forEach((v: any, i: any) => {           //套餐的合并
          this.renderRegular(v, res.data.orderInfoList[i + 1]);
        })
        this.materials = res.data.orderInfoList.reverse();
        this.IintList(res)
      })
    } else {
      this.headDetail.loadOrderDetailSpe(this.orderId).then(res => {
        if (res.data.listInside) {
          res.data.listInside.reverse().forEach((v: any, i: number) => {           //套餐的合并
            this.renderRegular(v, res.data.listInside[i + 1]);
          })
          this.customData[0].list = res.data.listInside
        } else {
          this.customData[0].list = []
        }
        if (res.data.listOuter) {
          res.data.listOuter.reverse().forEach((v: any, i: number) => {           //套餐的合并
            this.renderRegular(v, res.data.listOuter[i + 1]);
          })
          this.customData[1].list = res.data.listOuter
        } else {
          this.customData[1].list = []
        }
        this.IintList(res)
        if (this.customData[0].name == "预算" || this.customData.length > 2) {
          this.customData.shift()
        }
      }
      )
    }
    this.expandSet.add(1)             //默认全部展开
    this.expandSet.add(0)
  }

  IintList(res: any) {
    this.recordData = res.data.orderPauses ? res.data.orderPauses : [];
    this.Price.totalPrice = res.data.totalPrice;
    this.state = res.data.state;
    this.Price.freight = res.data.freight
    if (this.state != 3) {
      this.lockingBudget = res.data.lockingBudget
    }
    this.quoteId = res.data.quoteId;
    this.selfExtraction = res.data.selfExtraction
    this.Price.snapshotPrice = res.data.snapshotPrice;
    this.Price.customersIncreasePrice = res.data.customersIncreasePrice;
  }
  //根据状态展示提交工长的提示语
  getTitle() {
    if (this.orderType == 2) {
      return '确认发货吗？'
    }
    if (!this.selfExtraction || this.recordData.length > 0) {
      return `配送费${this.Price.freight ? this.Price.freight : 0},需要工长确认`
    } else {
      return '该订单为自提，确认发货？';
    }
  }
  //派单
  phoneOk() {
    const phone = this.phone ? this.phone.trim() : "";
    if ((/^[1][3-9]\d{9}$/).test(phone) || !phone) {
      this.headDetail.saveMaterialOrderDeliveryInfo({
        materialOrderId: this.orderId,
        deliveryPhone: phone
      }).then(res => {
        this.warn.onSuccess("执行成功");
        this.renderList();
        this.handleCancel()
        this.loadHead()
      }).catch(err => {
        this.warn.onError(err);
      })
    } else {
      this.warn.onError('请填写正确的手机号')
    }

  }

  addMaterial(e: any) {
    this.currentMaterial['material'] = []
    e = this.computedPackNumByGroup(e, 'id')
    e.forEach((v: any) => {
      this.currentMaterial['material'].push({ id: v.id, count: v.number })
    });
  }
  //标单的提交工长
  submitWork() {
    this.headDetail.submitFreightForWorder({
      materialOrderId: this.orderId,
      freight: this.headDetail.getCaseData().freight
    }).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
      this.loadHead()
    }).catch(err => {
      this.warn.onError(err);
    })
  }
  //定制提交工长
  submitWorkSpe() {
    this.headDetail.submitCustomizationOrderByMaterialSupplier(this.orderId)
      .then(res => {
        this.warn.onSuccess("执行成功");
        this.renderList();
        this.loadHead()
      }).catch(err => {
        this.warn.onError(err);
      })

  }
  //判断合计的增减
  addTypeChange() {
    this.addPriceType == "1" ? this.symbol = "-" : this.symbol = "+";
  }

  //套餐的合并
  renderRegular(current: any, next: any) {
    if (next && next.materialPlanId && !next.materialPlanSeparable && !current.materialPlanSeparable) {
      if (current.materialPlanId === next.materialPlanId) {
        if (current["ListRows"]) {
          current["ListRows"] = current["ListRows"] + 1;
        } else {
          current["ListRows"] = 2;
        }
        next["ListRows"] = current["ListRows"];
        current["ListRows"] = 0;
      } else {
        if (!current["ListRows"]) {
          current["ListRows"] = 1;
        }
        if (!next["ListRows"]) {
          next["ListRows"] = 1;
        }
      }
    } else {
      if (next) {
        next["ListRows"] = 1;
      }
      if (!current["ListRows"]) {
        current["ListRows"] = 1;
      }
    }
  }

  editAddprice() {
    this.headDetail.upFreightByCustomization({
      materialOrderId: this.orderId,
      customersIncreasePrice: this.Price.customersIncreasePrice
    }).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
      this.handleCancel()
      this.loadHead()
    }).catch(err => {
      this.warn.onError(err);
    })
  }
  //删除增减项
  deletePause(id: any) {
    this.headDetail.delMaterialOrderPause(id).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
    }).catch(err => {
      this.warn.onError(err);
    })
  }
  //确认接单
  receviOrder() {
    this.headDetail.receivingOrder(this.orderId).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
      this.loadHead()
    }).catch(err => {
      this.warn.onError(err);
    })

  }

  /**
   * 定制单修改数量时调用
   * @param id 细项id
   * @param count 修改时的数量
   */
  modelPriceChange(id: any, count: any) {
    this.headDetail.upDetailCount({ orderInfoId: id, count, orderId: this.orderId }).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
    }).catch(err => {
      this.warn.onError(err);
    })
  }

  //标准单
  modelPriceChangeNomal(id: any, count: any) {
    this.headDetail.upMaterialDetailCount({ materialOrderInfoId: id, count }).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
    }).catch(err => {
      this.warn.onError(err);
      this.renderList();
    })
  }

  //页面上的判断展示
  showSend() {
    return ([3].includes(this.state) && !this.Price.freight && this.recordData.length == 0) || [5, 47].includes(this.state);
  }

  showArive() {
    return [17, 59].includes(this.state);
  }

  //已发货后显示送达、派单
  showReach() {
    return [6, 48].includes(this.state);
  }

  showWorkSubmit() {
    return [3].includes(this.state) && (this.Price.freight || this.recordData.length > 0);
  }

  showRecall() {
    return [3, 41, 5, 6, 8, 7, 47, 48, 49, 50].includes(this.state);
  }

  showUnlock() {
    return [4, 42].includes(this.state);
  }

  showEdit() {
    return [3, 42].includes(this.state);
  }

  canEdit() {
    return this.lockingBudget ? false : [47, 5, 48, 6, 7, 49, 3, 4, 42, 41].includes(this.state);
  }

  showTotalEdit() {
    return this.lockingBudget ? false : [41, 42, 4, 3].includes(this.state);

  }


  lockOrder(type: any) {
    this.headDetail.setLockingBudget({ materialOrderId: this.orderId, lockingBudget: type }).then(res => {
      if (type == 1) {
        this.warn.onSuccess("锁定成功");
      } else {
        this.warn.onSuccess(res);
      }
      this.loadHead();
    }).catch(err => {
      this.warn.onError(err);
    })
  }

  //删除
  deleteList(id: any) {
    this.headDetail.deleteDetailByCustomization(id).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
    }).catch(err => {
      this.warn.onError(err);
    })
  }
  //撤回
  Recall() {
    this.headDetail.withdraw(this.orderId).then(res => {
      this.warn.onSuccess("执行成功");
      this.renderList();
    }).catch(err => {
      this.warn.onError(err);
    })
  }

  phoneModal() {
    this.headDetail.getDeliveryPhone({
      materialOrderId: this.orderId
    }).then(data => {
      this.phone = data && data.deliveryPhone;
      this.payPhoneisVisible = true;
    }).catch(err => {
      this.warn.onError(err);
    })
  }
  //是否展开定制单的大项
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openEditModal() {
    this.editPriceisVisible = true;
  }

  openModal(e: any) {
    this.visible = true;
    this.currentMaterial['id'] = e
  }

  renderName(name: any, symbol: string = '--') {
    return renderName(name, symbol)
  }

  equalZero(num: any) {
    return equalZero(num, "无");
  }
  //返回列表的跳转
  reBack() {
    if (this.storageService.getStorage(EStorage.CLICK_MENU) === EMenuKeys.ORDER_LIST) {
      this.router.navigate(['../../'], {
        queryParams: {
          ...this.queryParams
        },
        relativeTo: this.activatedRoute
      });
    } else {
      this.router.navigate(['../../../settle'], {
        queryParams: {
          ...this.queryParams
        },
        relativeTo: this.activatedRoute
      });
    }
  }
  //提交备注
  remarkOk() {
    this.headDetail.upDetailCount({
      orderInfoId: this.remark.id,
      remark: this.remark.remark,
      orderId: this.orderId
    })
      .then(res => {
        this.warn.onSuccess("执行成功");
        this.renderList();
        this.handleCancel()
        this.loadHead()
      })
      .catch(err => {
        this.warn.onError(err);
      })
  }

  close() {
    this.visible = false;
  }

  handleCancel() {
    this.priceisVisible = false;
    this.editPriceisVisible = false;
    this.payPhoneisVisible = false;
    this.addPrice = 0;
    this.visible = false;
    this.remarkIsVisible = false;
    this.remark.remark = ''
  }

  handleOk() {
    this.headDetail.upTotalPrice({
      materialOrderId: this.orderId,
      price: this.addPrice,
      type: this.addPriceType,
      remark: this.remark.remark
    }).then(res => {
      this.warn.onSuccess("执行成功");
      this.handleCancel();
      this.renderList();
      this.loadHead()

    }).catch(err => {
      this.warn.onError(err);
    })
  }

  //合并数据
  computedPackNumByGroup(data: any, key: string, type = false) {
    const packs: any = [];
    if (data && data.length > 0) {
      const groups: any = {};
      data.forEach((d: any) => {
        if (groups[d[key]]) {
          groups[d[key]]['number'] += 1;
        } else {
          groups[d[key]] = { number: type ? Number(d.number) : 1, source: d };
        }
      })

      Object.keys(groups).map(g => {
        groups[g]["source"]['number'] = groups[g]['number'];
        packs.push(groups[g]["source"]);
      })
    }
    return packs;
  }

  //提交材料
  submitMaterial() {
    this.headDetail.addDetailByCustomization({
      materialOrderId: this.orderId,
      addDetailVo: this.currentMaterial['material'],
      budgetType: this.currentMaterial['id']
    })
      .then(res => {
        this.warn.onSuccess("执行成功");
        this.handleCancel();
        this.renderList();
        this.expandSet.add(this.currentMaterial['id'])

      }).catch(err => {
        this.warn.onError(err);
      })
  }

  //当前变更合计
  currentPrice() {
    if (this.addPriceType == "1") {
      return this.Price.totalPrice + this.addPrice
    } else {
      return this.Price.totalPrice - this.addPrice
    }
  }

  openAddModal() {
    this.priceisVisible = true;
  }

  //处理前后省略数据
  trimStr(value: string, type: number = 1) {
    if (value) {
      const str = value.toString();
      if (value && type == 1) {
        if (str.length > 9) {
          return "..." + str.substr(3)
        } else {
          return str;
        }
      } else if (value && type == 2) {
        if (str.length > 60) {
          return str.substr(0, 60) + '...'
        } else {
          return str;
        }
      }
    }
    return '--';
  }

  /**
   * 计算合计
   * @param {number} num 数量
   * @param {number} unit 单价
   * @returns {number}
   */
  getTotal(num: number, unit: number) {
    return addition(num ? num : 0, unit ? unit : 0);
  }

}
