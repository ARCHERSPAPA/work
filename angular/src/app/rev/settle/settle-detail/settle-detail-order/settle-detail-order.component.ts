import { Component, OnInit } from '@angular/core';
import { Default } from './../../../../model/constant';
import { RequestService } from '../../../../service/request.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettleService } from '../../../../service/settle.service';
import { atob } from '../../../../model/methods';
import { SettleMaterialWageService } from '../../settle-material/settle-material-wage/settle-material-wage.service'
import { SettleMaterialOrderService } from '../../settle-material/settle-material-order/settle-material-order.service'
@Component({
  selector: 'rev-settle-detail-order',
  templateUrl: './settle-detail-order.component.html',
  styleUrls: ['./settle-detail-order.component.scss']
})
export class SettleDetailOrderComponent implements OnInit {
  public pageNo: number = Default.PAGE.PAGE_NO;
  public pageSize: number = Default.PAGE.PAGE_SIZE;
  public total: number = Default.PAGE.PAGE_TOTAL;
  //弹窗
  public wageForm;
  public auditVisible;
  public isVisible;
  public msg;
  //结算的参数
  public account;
  public accountStatus;
  public auditForm;
  //订单列表和相关状态
  public orderId;//订单ID
  public materialId;//材料ID只有结算需要
  public isPass;//0不通过，1通过
  public state; //审核状态
  public type;//1为材料订单点进来的详情，2为结算列表/3为异常页面的详情
  public materialList;
  public materialType;//判断是否定制
  public totalPrice;
  public isError;//1异常，2运费异常,3提交
  constructor(private req: RequestService,
    private warn: WarningService,
    private SettleMaterialWageService: SettleMaterialWageService,
    private orderServer: SettleMaterialOrderService,
    private settle: SettleService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['type']) {
        this.type = params['type'];
        this.materialId = atob(params['materialId']);
        this.materialType = params['materialType'];
        this.orderId = atob(params['id']);
      }
    });
    this.changePage();
    this.wageForm = this.fb.group({
      account: ['', [
        Validators.required,
        Validators.maxLength(30)
      ]]
    });
    this.auditForm = this.fb.group({
      msg: ['', [
        Validators.maxLength(300)
      ]]
    });

  }
  ngDoCheck() {
    if (!this.state && this.settle.getOrderData()) {
      this.state = this.settle.getOrderData().quote.state;
      this.checkError();
    }
    this.state =  this.state ;
  }

  showButton() {
    if ((this.isError == 1 || this.isError == 2) && this.type==3) {
      return true;
    } else {
      return false;
    }
  }
  checkError() {
    if ([14, 57].includes(this.state)) {
      this.isError = 1;
    } else if ([16].includes(this.state)) {
      this.isError = 2;
    }
  }
  //套餐的合并
  renderRegular(current, next) {
    if (next && next.materialPlanId) {
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
  //判断是定制还是普通
  checkType(data) {
    if (this.totalPrice && !data.iscost) {
      return data.rows + 1;
    } else {
      return data.rows;
    }

  }
  //拉去列表
  changePage() {
    this.req.doPost({
      url: 'orderMaterialDetail', data: {
        orderId: this.orderId
      },
      success: res => {
        if (res && res.code === 200) {
          if (res.data.unExist && res.data.unExist.length > 0) {
            // res.data.unExist=res.data.unExist.concat(TestData)
            res.data.unExist.forEach(v => {             //渲染第一列的合并
              v['rows'] = 0;
              v['iscost'] = false; //判断在还是不在
              v['rowName'] = '不在成本核算内的材料';
              if (this.materialType == 2) {
                v['rowName'] = '预算包含外';
              }
            });
            res.data.unExist[0]['rows'] = res.data.unExist.length;
            res.data.unExist.reverse().forEach((v, i) => {           //套餐的合并
              this.renderRegular(v, res.data.unExist[i + 1]);
            })
            res.data.unExist.reverse();
            if (this.materialType == 2) {                           //增加费用
              this.totalPrice = res.data.totalPrice + '';
              res.data.unExist.push({ addPrice: this.totalPrice });
            }
          } else {
            res.data.unExist = [];
          }
          if (res.data.exist && res.data.exist.length > 0) {
            res.data.exist.forEach(v => {
              v['rows'] = 0;
              v['iscost'] = true;
              v['rowName'] = '在成本核算内的材料';
              if (this.materialType == 2) {
                v['rowName'] = '预算包含内';
              }
            });
            res.data.exist[0]['rows'] = res.data.exist.length;
            res.data.exist.reverse().forEach((v, i) => {
              this.renderRegular(v, res.data.exist[i + 1]);
            })
            res.data.exist.reverse();
          } else {
            res.data.exist = [];
          }                                                      //合并数据
          if (res.data.exist && res.data.unExist) { this.materialList = res.data.exist.concat(res.data.unExist) }
          // console.log(this.materialList)
        } else {
          this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  // 展示结算弹窗
  showModal() {
    this.wageForm.reset();
    this.isVisible = true;
    let params = {};
    params["materialId"] = this.materialId;
    this.loadAccountList(params);
  }

  handleCancel() {
    this.isVisible = false;
    this.auditVisible = false;
  }
  //判断是否显示红色
  checkShowRed(material) {
    if (material.iscost && material.costNum) {
      if (((material.passNum ? material.passNum : 0) + (material.count ? material.count : 0)) >= (material.costNum ? material.costNum : 0)) {
        return 'red';
      } else {
        return 'inherit';
      }
    }
  }

  // 结算弹窗
  handleOk(type) {
    const that = this;
    const params = that.wageForm.value;
    params.state = type;
    if (this.orderId) {
      params.orderIds = Array.of(this.orderId);
    }
    if (this.msg) {
      params["remark"] = this.msg;
    }
    params.accountId = this.account;
    this.SettleMaterialWageService.operateSettle(params).then(data => {
      that.changePage();
      this.refreshHead();
      that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
      that.handleCancel();
    }).catch(err => {
      this.warn.onMsgError(err);
    })
  }

  // 展示不通过弹窗
  showAudit(type) {
    this.isPass = type;
    this.auditForm.reset();
    this.auditVisible = true;
  }
  //结算取消
  auditCancel() {
    this.auditVisible = false;
    this.auditForm.reset();
    this.msg = "";
  }

  //刷新head
  refreshHead() {
    this.settle.loadMaterialHead(this.orderId).then(res => {
      this.settle.setOrderData(res);
      this.state = this.settle.getOrderData().quote.state;

      this.checkError();
    }).catch(err => {
      this.warn.onError(err);
    });
  }
  //获取公司账号
  loadAccountList(params) {
    this.SettleMaterialWageService.getAccountList(params).then(data => {
      this.accountStatus = data;
    }).catch(err => {
      this.warn.onMsgError(err);
    })
  }
//多个按钮的弹窗判断
  checkpass() {
    if (this.type == 1 || this.type == 3) {
      let param = {
        orderId: this.orderId,
        remarkInfo: this.msg
      };
      if (this.isError == 1 ) {
        param['state'] = this.isPass;     //异常审核
        this.orderServer.errorExecption(param).then(res => {
          this.refreshHead();
          this.handleCancel();
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
        }).catch(err => {
          this.warn.onMsgError(err || Messages.FAIL.DATA);
        });

      } else if (this.isError == 2) {         //运费异常审核
        param['state'] = this.isPass == 0 ? 3 : 5;
        this.orderServer.errorFreightExecption(param).then(res => {
          this.refreshHead();
          this.handleCancel();
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
        }).catch(err => {
          this.warn.onMsgError(err || Messages.FAIL.DATA);
        });
      } else if (this.isPass==2) {
        this.orderError(); //异常提交
      } else {
        this.pass(0); //审核
      }
    } else {
      let params = {};
      params["materialId"] = this.orderId; //结算按钮
      this.loadAccountList(params);
      this.handleOk(0)
    }
  }
  //判断审核的title
  checkAuidtTitle() {
    if (this.type == 1 ||this.type==3) {
      if (this.isPass == 1) {
        return "审核通过"
      } else if (this.isPass == 0) {
        return "审核不通过"
      } else if (this.isError == 2 || this.isError == 1||this.isPass==2 ) {
        return "订单异常"
      }
    } else {
      return "结算不通过"
    }
  }
  //通过不通过
  pass(state) {
    let param = {
      orderId: this.orderId,
      state: this.isPass
    };
    if (this.msg) {
      param["remark"] = this.msg;
    }
    this.req.doPost({
      url: "orderMateriallDetailAudit",
      data: param,
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          this.refreshHead();
          if (state == 0) {
            this.auditVisible = false;
          }
        } else {
          this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  ngOnDestroy() {
    this.settle.setOrderData("");
  }
  //订单异常
  orderError() {
    this.orderServer.errorSubmit({ orderId: this.orderId , remarkInfo:this.msg}).then(res => {
      this.refreshHead();
      this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
      this.handleCancel()
    }).catch(err => {
      this.warn.onMsgError(err || Messages.FAIL.DATA);
    })

  }
  //订单详情的操作展示
  showOrder() {
    if (((this.type == 1 || this.type == 3) && [43, 1, 14, 57, 16].indexOf(this.state) > -1)) {
      if(this.type==1 && [ 14, 57, 16].indexOf(this.state) > -1){ //区别异常情况
        return false;
      }else{
        return true;
      }
    } else {
      return false;
    }
  }
  //结算详情的操作展示
  showWage() {
    if (this.type == 2 && [51, 9].indexOf(this.state) > -1) {
      return true
    } else {
      return false;
    }
  }
  showOrderErr() {
    return [1, 43, 14, 57, 16].includes(this.state);
  }
}
