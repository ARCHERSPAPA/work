import { Component, OnInit } from '@angular/core';
import { getIndexByUrl } from '../../../../configs/methods';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from "../../../../services/storage.service";
import { EMenuKeys } from '../../../../enums/e-menus.enum'
import { EStorage } from '../../../../enums/e-storage.enum'
import {
  equalZero,
  getNameByKey
} from "../../../../configs/methods";
import {
  orderStates,
} from "../../../../configs/states";
import { WarningService } from "../../../../services/warning.service";
import { OrderDetialService } from '../../order-detail/order-detial.service';
import { IMaterial } from './order-head'

@Component({
  selector: 'app-order-detail-head',
  templateUrl: './order-detail-head.component.html',
  styleUrls: ['./order-detail-head.component.less']
})
export class OrderDetailHeadComponent implements OnInit {
  public tabs: any;
  public index: number = 0;
  public editPriceisVisible: boolean = false;
  public state: any;

  public editPrice: number = 0;
  public orderId: number = 0;
  public remark: string = '';
  public defaultRadioSwitch: any;
  public showPriceInput: any;
  public stateName: any;
  public lockingBudget: any;
  public switches: Array<any> = [
    {
      key: "0",
      label: "材料商配送",
      selected: true
    },
    {
      key: "1",
      label: "自提",
      selected: false
    },
  ];
  public orderType: number = 2;
  public headDetails: IMaterial = {
    abbreviation: '',
    address: '',
    consigneeName: '',
    consigneePhone: '',
    freight: 0,
    createTime: 0,
    materialOrderNo: '',
    quoteNo: '',
    state: 0,
    freightRemark: '',
    customerGpsAddress: '',
  };
  public showStateNames: Array<any> = orderStates.itemState.concat(orderStates.customizedState);

  //返回或保留时的参数
  public queryParams: any;

  constructor(private router: Router,
    private warn: WarningService,
    private headDetailServe: OrderDetialService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService) {
  }

  ngOnInit(): void {


    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = JSON.parse(JSON.stringify(params));

      delete this.queryParams['orderId'];
      delete this.queryParams["quoteId"];

      if (params && params['orderId']) {
        this.orderId = params['orderId']
      }

      this.tabs = [
        {
          name: '材料',
          url: 'materials',
          params: params
        },
        {
          name: '进度',
          url: 'schedules',
          params: params
        },
        {
          name: '查看图纸',
          url: 'graph',
          params: params
        }
      ];
    });
    this.renderHead();

  }

  ngDoCheck() {
    if (this.headDetailServe.getCaseData() && this.headDetails.quoteNo) {
      let data = this.headDetailServe.getCaseData()
      this.headDetails = data;
      this.headDetails.freight = this.headDetails.freight ? this.headDetails.freight : 0;
      this.state = data.state;
      this.stateName = this.getStateName(this.state)
      if (!this.showPriceInput) {
        this.showPriceInput = data.selfExtraction
      }
      if (this.state != 3) {
        this.lockingBudget = data.lockingBudget
      }
      if (this.orderType == 1 && this.tabs.length == 3) {
        this.tabs.pop();
      }
    }
  }

  renderHead() {
    this.headDetailServe.loadOrderHead(this.orderId).then(res => {
      this.headDetails = res;
      this.headDetails.freight = this.headDetails.freight ? this.headDetails.freight : 0;
      this.orderType = res.type;
      this.state = res.state;
      this.state != 3 ? (this.lockingBudget = res.lockingBudget) : this.lockingBudget = 0
      this.showPriceInput = res.selfExtraction
      this.resetSwitch();
    });
  }

  tab(e: any) {
    this.renderHead();
  }

  canEdit() {
    return this.lockingBudget ? false : [47, 5, 48, 6, 7, 49, 4, 3, 42, 41].includes(this.state);
  }

  handleSwitch(e: any) {
    this.showPriceInput = e.key;
    this.resetSwitch();
  }

  equalZero(num: any) {
    return equalZero(num, "无");
  }

  back() {
    if (this.storageService.getStorage(EStorage.CLICK_MENU) === EMenuKeys.ORDER_LIST) {
      this.router.navigate(['../'], {
        queryParams: {
          ...this.queryParams
        },
        relativeTo: this.activatedRoute
      });
    } else {
      this.router.navigate(['../../settle'], {
        queryParams: {
          ...this.queryParams
        },
        relativeTo: this.activatedRoute
      });
    }
  }


  getIndex() {
    setTimeout(() => {
      const urls = this.router.url.split('detail');
      this.index = getIndexByUrl(urls[1], this.tabs);
    }, 200)
  }

  handleCancel() {
    this.editPriceisVisible = false;
    this.renderHead();
  }

  handleOk() {
    let param: any = {
      materialOrderId: this.orderId,
      freight: this.headDetails.freight,
      freightRemark: this.headDetails.freightRemark,
      selfExtraction: this.showPriceInput
    };
    if (this.orderType == 1) {
      this.headDetailServe.upFreight(param).then(res => {
        this.editPriceisVisible = false;
        this.renderHead();
      }).catch(err => {
        this.warn.onError(err);
      })
    } else {
      this.headDetailServe.upFreightByCustomization(param).then(res => {
        this.editPriceisVisible = false;
        this.renderHead();
      }).catch(err => {
        this.warn.onError(err);
      })
    }

  }

  //回显tab自提功能
  resetSwitch() {
    const key = this.showPriceInput.toString();
    this.switches.map((s: any) => {
      s.selected = false;
      if (s.key === key) {
        s.selected = true;
      }
      return s;
    })

  }

  getStateName(state: number) {
    let name = getNameByKey(state, this.showStateNames);
    return name ? name : '--';
  }

  openModal() {
    this.resetSwitch();
    this.editPriceisVisible = true;
  }

  trimStr(value: string, type: number = 1) {
    if (value) {
      const str = value.toString();
      if (value && type == 1) {
        if (str.length > 12) {
          return "..." + str.substr(3, 12) + "..."
        } else {
          return str;
        }
      } else if (value && type == 2) {
        if (str.length > 15) {
          return str.substr(3, 15) + '...'
        } else {
          return str;
        }
      }
    }

    return '--';
  }

}
