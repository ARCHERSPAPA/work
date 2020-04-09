import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as UserValidate from "../../../validate/user-validate";
import { UserService } from "../../../service/user.service";
import { RequestService } from "../../../service/request.service";
import { WarningService } from "../../../service/warning.service";
import { Messages } from "../../../model/msg";

@Component({
  selector: 'rev-warranty-setting',
  templateUrl: './warranty-setting.component.html',
  styleUrls: ['./../../detail/detail.scss', './../warranty.component.scss',
    '../warranty-audit/warranty-audit-edit/warranty-audit-edit.component.scss',
    'warranty-setting.component.scss']
})
export class WarrantySettingComponent implements OnInit {

  public title: string;

  public warrantyForm: FormGroup;
  public warrantyYears: number = 2;
  public hydWarrantyYears: number = 5;
  public warrantyStart: number = 0;
  public settingOption: Array<any> = [];
  public defaultRemark='1.自工程竣工日期起，整体保修2 年，供水水路、防水保修10年，电路、排水保修5年，涂改无效。\
  2.保修项目包括本公司计入工程结算费用的计费项目。\
      3.凡公司代购主材保修，公司只负责协调，不承担保修责任。\
      4.超过工程保修期的工程维修，本公司收取必要的人工费、材料费等成本费用，不再另外收取其他费用。\
      5.在未结算工程款期间，由于使用、维护不当造成的工程损坏不在保修范围内。\
      6.厂家、商家承诺的质保期、保修期超出本卡约定的保修期，由厂家、商家自行承担责任。';
  public remarks: string= this.defaultRemark;
  // public index;


  constructor(private fb: FormBuilder,
    private user: UserService,
    private req: RequestService,
    private warn: WarningService) { }

  ngOnInit() {
    this.title = "设置默认保修";

    // this.settingOption=[{content:'整理保修',year:2},{content:'水电保修和全屋防护',year:5}]
    this.loadConfig();

    // this.warrantyForm = this.fb.group({
    //   warrantyStart: [this.warrantyStart, [
    //     Validators.required,
    //   ]],
    //   remarks: [this.remarks, [
    //     Validators.required,
    //   ]]
    // })


  }

  back() {
    window.history.back();
  }
  renderList(i = 5, e = 0) {
    this.settingOption = []
    this.settingOption[0] = { 'customWarrantyName': '', 'customYears': 1 }
    for (e; e < i - 1; e++) {
      this.settingOption.push({ 'customWarrantyName': '', 'customYears': 1 })
    }

  }
  warrantyType(type) {
    this.warrantyStart = type;
  }
  getOptionControl() {
    this.settingOption.forEach((option, index) => {
      // this.warrantyForm.addControl('customWarrantyName' + index, this.fb.control(option.customWarrantyName,
      //   [
      //     Validators.required,
      //     Validators.maxLength(10),
      //   ])
      // );
      // this.warrantyForm.addControl('customYears' + index, this.fb.control(option.customYears,
      //   [
      //     Validators.required,
      //     Validators.maxLength(2),
      //   ])
      // );
    })
  }

  addOptions() {
    // this.index += 1;
    if (this.settingOption.length >= 5) {
      this.warn.onWarn("添加设置最多5个");
      return;
    }
    this.settingOption.push({
      customWarrantyName: '保修名称',
      customYears: 1
    });
    // let i = this.index ;
    // this.warrantyForm.addControl('customYears' + i, this.fb.control(
    //   this.settingOption[i].customWarrantyName, [
    //   Validators.required,
    //   Validators.maxLength(2),
    // ])
    // );
    // this.warrantyForm.addControl('customWarrantyName' + i, this.fb.control(
    //   this.settingOption[i].customWarrantyName, [
    //   Validators.required,
    //   Validators.maxLength(10),
    // ])
    // );
  }
  hiddenEdit(item) {
    this.settingOption.forEach(items => {
      items['checked'] = false
    })
    item.checked = true;
  }
  hiddenAll(name,i) {
    this.settingOption.forEach(items => {
      items['checked'] = false
    })
    if (!name) {
      this.settingOption[i].customWarrantyName='保修名称';
    }
  }
  submit() {

    let params = {};
    params["customs"] = this.settingOption;
    params["warrantyStart"] = this.warrantyStart;
    params["warrantyExplain"] = this.remarks;
  
    params["companyId"] = this.user.getCompanyId();
    this.req.doPost({
      url: "modifyCompany",
      data: params,
      success: (res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      })
    })

  }
  remarkCheck(remarks){
    if (!remarks) {
      this.remarks=this.defaultRemark;
    }
  }

  numberCheck(year,i) {
    if (!year) {
      this.settingOption[i].customYears=0;
    }else{
      this.settingOption[i].customYears=Number(year.toFixed(2));
    }
 
  }

  loadConfig() {
    if (this.user.getCompanyId()) {
      this.req.doPost({
        url: "configCompany",
        data: {
          companyId: this.user.getCompanyId()
        },
        success: (res => {
          if (res && res.code == 200) {
            if (res.data) {
              this.setDefaultConfig(res.data);


            }
          } else {
            this.warn.onError(res.msg || Messages.FAIL.DATA);
          }
        })
      })
    }
  }
  removeOptions(i) {
    this.settingOption.splice(i, 1);
    // console.log(i)
    // this.warrantyForm.removeControl("customYears" + i);
    // this.warrantyForm.removeControl("customWarrantyName" + i);
  }

  setDefaultConfig(config) {
    config.customs.forEach((item, i) => {
      this.settingOption.splice(i, 1, { customWarrantyName: item['customWarrantyName'], customYears: item['customYears'], checked: false })
    })
    // this.index = this.settingOption.length;
    // this.settingOption=this.settingOption.filter(i=>i['customWarrantyName']!='')
    // this.settingOption=config.customs;
    this.getOptionControl()
    if (config.warrantyExplain) {
      this.remarks = config.warrantyExplain;
    }
    this.warrantyStart = config.warrantyStart;
    this.warrantyYears = config.warrantyYears;
    this.hydWarrantyYears = config.hydWarrantyYears;
  }
}
