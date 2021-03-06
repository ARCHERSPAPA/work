import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../../service/request.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { ActivatedRoute } from '@angular/router';
import { atob } from '../../../../model/methods';
@Component({
  selector: 'rev-warranty-audit-edit',
  templateUrl: './warranty-audit-edit.component.html',
  styleUrls: ['../../../detail/detail.scss', './../../warranty.component.scss', './warranty-audit-edit.component.scss']
})
export class WarrantyAuditEditComponent implements OnInit {

  public title: string;
  public warranty: any;

  public aid: string;
  public type: number ; //0是尾款时间，1是竣工，2其他
  public diyDate: any;
  public remarks: string;

  constructor(private req: RequestService,
    private warn: WarningService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.title = '审核编辑';
    this.warranty = {
      warrantyYears: 2,
      fixEndTime: new Date().getTime(),
      hydWarrantyYears: 5,
      utilitiesEndTime: new Date().getTime(),
      warrantyStartTime: null
    };
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['aid']) {
        this.aid = atob(params['aid']);
        this.loadInfo(this.aid);
      }
    });
    // this.diyDate = new Date()
  }

  changeyear(year, i) {
    if (year) {
      this.warranty.warrantyYears = Number(year.toFixed(2));
      this.warranty.customs[i].customYears = Number(year.toFixed(2));
    } else {
      this.warranty.warrantyYears = 0;
      this.warranty.customs[i].customYears = 0;
    }

  }
  onChange($event) {
    this.warranty.warrantyStartTime = Date.parse($event);
  }

  ngAfterContentChecked() {
    if (this.type === 1) {
      this.warranty.warrantyStartTime = this.warranty.finalPayment;
    } else if (this.type === 0) {
      this.warranty.warrantyStartTime = this.warranty.finishTime;
    }

  }

  getYearTime(year: number, start: any) {
    // let y, m, d;
    // let date = new Date(start);
    const date = (Math.ceil(year * 365) * 24 * 60 * 60 * 1000) + start;
    // y = date.getFullYear() + parseInt(year ? year : '0');
    // m = date.getMonth() + 1;
    // d = date.getDate();

    return new Date(date).getTime();
  }

  back() {
    window.history.back();
  }

  submit() {
    if (this.aid) {
      const params = {
        id: this.aid
      };
      if (this.warranty.finishTime) {
        params['finishTime'] = this.warranty.finishTime;
      }
      if (this.warranty.finalPayment) {
        params['finalPayment'] = this.warranty.finalPayment;
      }
      if (!this.warranty.warrantyYears) {
        this.warn.onWarn('输入不能为空或者零');
        return false;
      } else {
        params['warrantyYears'] = this.warranty.warrantyYears;
      }

      if (!this.warranty.hydWarrantyYears) {
        this.warn.onWarn('输入不能为空或者零');
        return false;
      } else {
        params['hydWarrantyYears'] = this.warranty.hydWarrantyYears;
      }

      if (this.warranty.warrantyStartTime) {
        params['warrantyStartTime'] = this.warranty.warrantyStartTime;
      }
      if (this.warranty.warrantyExplain) {
        params['warrantyExplain'] = this.warranty.warrantyExplain;
      }
      params['customs'] = this.warranty.customs;
      params['customTime'] = this.warranty.warrantyStartTime;
      params['warrantyStart'] = this.type ;

      this.req.doPost({
        url: 'modifyCard',
        data: params,
        success: (res => {
          if (res && res.code == 200) {
            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
            window.history.back();
          } else {
            this.warn.onError(res.msg || Messages.FAIL.DATA);
          }
        })
      });
    }
  }

  loadInfo(aid) {
    if (aid) {
      this.req.doPost({
        url: 'infoCard',
        data: { id: aid },
        success: (res => {
          if (res && res.code == 200) {
            // this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
            this.warranty = Object.assign(this.warranty, res.data);
            this.type = this.warranty.warrantyStart ;
            if (this.type === 1 && this.warranty.status == 0 && !this.warranty.finalPayment) {
              this.type = 0;
            }
            if (this.type === 2) {
              this.warranty.warrantyStartTime = this.warranty.customTime;
              this.diyDate = new Date(this.warranty.customTime);
            }
            if (this.warranty.warrantyExplain) {
              this.warranty.warrantyExplain = this.warranty.warrantyExplain;
            } else {
              this.warranty.warrantyExplain = '1.自工程竣工日期起，整体保修2 年，供水水路、防水保修10年，电路、排水保修5年，涂改无效。\
              2.保修项目包括本公司计入工程结算费用的计费项目。\
              3.凡公司代购主材保修，公司只负责协调，不承担保修责任。\
              4.超过工程保修期的工程维修，本公司收取必要的人工费、材料费等成本费用，不再另外收取其他费用。\
              5.在未结算工程款期间，由于使用、维护不当造成的工程损坏不在保修范围内。\
              6.厂家、商家承诺的质保期、保修期超出本卡约定的保修期，由厂家、商家自行承担责任。';
            }
          } else {
            this.warn.onError(res.msg || Messages.FAIL.DATA);
          }
        })

      });
    }
  }

  warrantyType(type) {
    this.type = type;
    if (type === 2 ) {
      this.diyDate = new Date();
      this.warranty.warrantyStartTime = Date.now();
    }
  }

}
