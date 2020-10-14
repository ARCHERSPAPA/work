import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../model/msg';
import { FormBuilder, Validators } from '@angular/forms';
import * as UserValidate from '../../../../validate/user-validate';
import { WarningService } from '../../../../service/warning.service';
import { RequestService } from '../../../../service/request.service';
import { ActivatedRoute } from '@angular/router';
import { atob } from '../../../../model/methods';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemBasicComponent } from '../../../../plugins/item-basic/item-basic.component';
import { TempLibListService } from '../../temp-lib/temp-lib-list/temp-lib-list.service';

@Component({
  selector: 'rev-temp-lib-edit',
  templateUrl: './temp-lib-edit.component.html',
  styleUrls: ['./temp-lib-edit.component.scss']
})
export class TempLibEditComponent implements OnInit {

  public title;
  public baseForm;
  public category;
  public categoryLsit = [];
  public Units;
  public univalence; //材料单价
  public remark;
  public name;
  public Acessorial = '';//关联辅材
  public AcessorialId = [];//关联辅材ID
  public brand;
  public spec;
  public model;
  public wastage = '';//损耗
  public woodworking;//木工
  public plasterer;//泥工
  public lacquering;//漆工
  public sellprice;
  public hydroelectric;//水电
  public baseId;
  formatterPercent = (value: number) => { if (value) { return `${value} %` } };
  parserPercent = (value: string) => value.replace(' %', '');
  constructor(
    private fb: FormBuilder,
    private req: RequestService,
    private warn: WarningService,
    private modal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private baseMaterial: TempLibListService
  ) {
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['id']) {
        this.baseId = atob(params['id']);
        this.getData();
      }
    });
    this.title = this.baseId ? '编辑材料' : '创建材料';
    this.baseForm = this.fb.group({
      category: [this.category, [
        Validators.required,
      ]],
      Units: [this.Units, [
        Validators.maxLength(10),
      ]],
      univalence: [this.univalence, [
        Validators.maxLength(10),
      ]],
      remark: [this.remark, [
        Validators.maxLength(100),
      ]],
      name: [this.name, [
        Validators.required,
        Validators.maxLength(30),
      ]],
      Acessorial: [this.Acessorial, [

      ]],
      brand: [this.brand, [
        Validators.maxLength(10),
      ]],
      spec: [this.spec, [
        Validators.maxLength(30),
      ]],
      model: [this.model, [
        Validators.maxLength(30),
      ]],
      wastage: [this.wastage, [
        Validators.maxLength(2),
      ]],
      woodworking: [this.remark, [
        Validators.maxLength(10),
      ]],
      plasterer: [this.plasterer, [
        Validators.maxLength(10),
      ]],
      lacquering: [this.lacquering, [
        Validators.maxLength(10),
      ]],
      hydroelectric: [this.hydroelectric, [
        Validators.maxLength(10),
      ]],
      sellprice: [this.sellprice, [
        Validators.maxLength(10),
      ]],
    });
    this.baseMaterial.getCategory().then(res => {
      this.categoryLsit = res;
    }).catch(error => {
      this.warn.onError(error || Messages.FAIL.DATA);
    })
  }

  handleCancel() {
    history.back();
  }
  //判断按钮状态
  checkAdd() {
    if (this.baseForm.controls.category.valid && this.baseForm.controls.name.valid) {
      return true;
    } else {
      return false;
    }
  }
  getData() {
    this.req.doPost({
      url: 'baseGetDetailById',
      data: {
        id: this.baseId
      },
      success: res => {
        if (res && res.code == 200) {
          console.log(res)
          this.brand = res.data.brand;
          this.spec = res.data.spec;
          this.name = res.data.name;
          this.model = res.data.model;
          this.remark = res.data.remark;
          this.Units = res.data.unit;
          this.univalence = res.data.unitPrice;
          this.plasterer = res.data.masonPrice;
          this.wastage = res.data.wastageRate;
          this.lacquering = res.data.japannerPrice;
          this.sellprice = res.data.sellPrice;
          this.hydroelectric = res.data.utilityCharge;
          this.woodworking = res.data.carpenterPrice;
          if (res.data.auxiliaryList.length > 0) {
            res.data.auxiliaryList.forEach((v, i) => {
              this.AcessorialId.push(v['auxiliaryId'])
              this.Acessorial += v['auxiliaryName'] + '(' + v['sku'] + ')'
              if (res.data.auxiliaryList.length - 1 != i) {
                this.Acessorial += '、';
              }
            });
          }
          setTimeout(() => {
            this.category = res.data.categoryId;
          }, 300);
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }

  openModel() {
    let that = this;
    const info = this.modal.open(ItemBasicComponent, {
      centered: true,
      keyboard: false,
      backdrop: 'static',
      size: "lg"
    });
    info.componentInstance.type = 3;
    info.componentInstance.maxLength = 5;
    info.componentInstance.multiple = 'singel';
    info.result.then(res => {
      that.AcessorialId = [];
      that.Acessorial = '';
      if (res && res.length > 0) {                      //判断如果选择多个和单个的情况（单个要回显其他数据）
        res.forEach((v, i) => {
          that.AcessorialId.push(v['id'])
          that.Acessorial += v['name'] + '(' + v['sku'] + ')';
          if (res.length - 1 != i) {
            that.Acessorial += '、';
          }
        });
      }
      if (res.length == 1) {
        that.brand = res[0].brand;
        that.spec = res[0].spec;
        that.model = res[0].model;
        that.Units = res[0].unit;
        that.univalence = res[0].supplyPrice;
      }
    }, reason => {
      console.log(reason);
    });
  }
  handleOk() {
    let url;
    if (this.baseId) {
      url = 'baseUpdateMaterial';
    } else {
      url = 'baseSaveMaterial';
    }
    console.log(this.baseForm)
    this.req.doPost({
      url: url,
      data: this.renderParam(),
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          history.back();
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  //渲染提交的数据
  renderParam() {
    let param = {
      categoryId: this.category,
      id: this.baseId,
      name: this.name,
      brand: this.brand ? this.brand : '',
      spec: this.spec ? this.spec : '',
      model: this.model ? this.model : '',
      unit: this.Units ? this.Units : '',
      unitPrice: this.univalence + '' ? this.univalence : '',
      wastageRate: this.wastage + '' ? this.wastage : '',
      carpenterPrice: this.woodworking + '' ? this.woodworking : '',
      masonPrice: this.plasterer + '' ? this.plasterer : '',
      japannerPrice: this.lacquering + '' ? this.lacquering : '',
      utilityCharge: this.hydroelectric + '' ? this.hydroelectric : '',
      sellPrice: this.sellprice + '' ? this.sellprice : '',
      remark: this.remark ? this.remark : ''
    }
    param['auxiliaryList'] = [{ auxiliaryId: '' }];
    if (this.AcessorialId && this.AcessorialId.length > 0) {
      this.AcessorialId.forEach(v => {
        param['auxiliaryList'].push({ auxiliaryId: v });
      })
    }

    return param
  }

}
