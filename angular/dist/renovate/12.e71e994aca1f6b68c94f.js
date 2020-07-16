(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"7Uef":function(t,n){t.exports=""},DYCb:function(t,n){t.exports=""},IJWv:function(t,n){t.exports='<div class="warranty">\n  <div class="head">\n    <rev-title [title]="title"></rev-title>\n  </div>\n  <div class="content">\n    <form>\n      <div class="warranty-edit" style="border: none">\n        <ul>\n          <nz-form-item class="info">\n            <nz-form-label [nzSpan]="4">\u4fdd\u4fee\u8d77\u59cb\u65f6\u95f4</nz-form-label>\n            <nz-form-control [nzSpan]="18">\n              <input type="hidden" [(ngModel)]="warrantyStart" name="warrantyStart" />\n              <div class="ant-radio-group ant-radio-group-outline" style="width: 60%;">\n                <label nz-col [nzSpan]="4" [ngClass]="{\'ant-radio-wrapper-checked\':warrantyStart === 1}">\n                  <span class="ant-radio" [ngClass]="{\'ant-radio-checked\':warrantyStart === 1}">\n                    <input type="radio" class="ant-radio-input" checked="{{warrantyStart === 1}}" value="1"\n                      name="warranty" (click)="warrantyType(1)" />\n                    <span class="ant-radio-inner"></span>\n                  </span>\n                  <span>\u5c3e\u6b3e\u65f6\u95f4</span>\n                </label>\n                <label nz-col [nzSpan]="4" [ngClass]="{\'ant-radio-wrapper-checked\':warrantyStart === 0}">\n                  <span class="ant-radio" [ngClass]="{\'ant-radio-checked\':warrantyStart === 0}">\n                    <input type="radio" class="ant-radio-input" checked="{{warrantyStart === 0}}" value="0"\n                      name="warranty" (click)="warrantyType(0)" />\n                    <span class="ant-radio-inner"></span>\n                  </span>\n                  <span>\u7ae3\u5de5\u65f6\u95f4</span>\n                </label>\n              </div>\n            </nz-form-control>\n          </nz-form-item>\n\n          <nz-form-item class="info" *ngFor="let option of settingOption;let i = index;">\n            <nz-form-label [nzSpan]="4"> <i nz-icon type="edit" title="\u4fee\u6539" *ngIf="!option.checked"></i><input maxlength="10"\n                (click)=\'hiddenEdit(option)\' (blur)="hiddenAll(option.customWarrantyName,i)" name="option.customWarrantyName" minlength="1"\n                class="text" class="info-content" [ngModelOptions]="{standalone: true}"\n                [(ngModel)]="option.customWarrantyName">\n            </nz-form-label>\n            <nz-form-control [nzSpan]="15">\n              <nz-input-number placeholder="\u8bf7\u8f93\u5165" class="text" maxlength="4" [(ngModel)]="option.customYears" [nzMin]="0"[nzPrecision]="1" \n               [ngModelOptions]="{standalone: true}" [nzMax]="99" [nzSize]="\'middle\'" [nzStep]="1"(ngModelChange)="numberCheck(option.customYears,i)"\n                [nzPlaceHolder]="\'\u8bf7\u8f93\u5165\'">\n              </nz-input-number>\n              <span class="year">\u5e74</span>\n              <span class="checkbox-inner" style="margin-left: 8px;"></span>\n              <i nz-icon type="minus-circle-o" class="dynamic-delete-button" (click)="removeOptions(i)"></i>\n            </nz-form-control>\n          </nz-form-item>\n          <nz-form-item>\n            <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 20, offset: 4}">\n              <button nz-button nzType="dashed" class="add-button text" (click)="addOptions()">\n                <i nz-icon type="plus" style="vertical-align: top;"></i>\n                \u6dfb\u52a0\u4fdd\u4fee\n              </button>\n            </nz-form-control>\n          </nz-form-item>\n          <nz-form-item>\n            <nz-form-label [nzSpan]="4">\u4fdd\u4fee\u8bf4\u660e</nz-form-label>\n            <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 20, offset: 0}">\n              <textarea nz-input maxlength="500" minlength="10" name="remarks" class="text" rows="11" (blur)="remarkCheck(remarks)"\n                [(ngModel)]="remarks"></textarea>\n              <span class="count" *ngIf="remarks && remarks.length > 0"><span>{{remarks.length}}</span>/500</span>\n            </nz-form-control>\n          </nz-form-item>\n          \x3c!-- <nz-form-item class="info">\n            <nz-form-label [nzSpan]="4">   <a href="javascript:void(0)" style="text-align: right;"><i nz-icon type="edit"\n              title="\u4fee\u6539"></i></a>\u6c34\u7535\u4fdd\u4fee\u548c\u5168\u5c4b\u9632\u62a4</nz-form-label>\n            <nz-form-control [nzSpan]="15">\n              <nz-input-number  placeholder="\u8bf7\u8f93\u5165" class="text" maxlength="4" [(ngModel)]="hydWarrantyYears"\n                onkeyup="this.value=this.value.replace(/\\D/g,\'\')" name="hydWarrantyYears"\n                formControlName="hydWarrantyYears" [nzMin]="1" [nzMax]="10" [nzSize]="\'middle\'" [nzStep]="1"\n                [nzPlaceHolder]="\'\u8bf7\u8f93\u5165\'" name="warrantyYears" >\n              </nz-input-number>\n              <span class="checkbox-inner" style="margin-left: 8px;"></span>\n              <nz-form-explain\n                *ngIf="warrantyForm.get(\'hydWarrantyYears\').dirty && warrantyForm.get(\'hydWarrantyYears\').errors">\n                <ng-container *ngIf="warrantyForm.get(\'hydWarrantyYears\').hasError(\'required\')">\n                  \u5fc5\u586b\u9879\u76ee\n                </ng-container>\n                <ng-container *ngIf="warrantyForm.get(\'hydWarrantyYears\').hasError(\'number\')">\n                  &nbsp;&nbsp;\u8f93\u5165\u683c\u5f0f\u6709\u8bef\n                </ng-container>\n                <ng-container *ngIf="warrantyForm.get(\'hydWarrantyYears\').hasError(\'maxlength\')">\n                  &nbsp;&nbsp;\u6700\u591a\u8f93\u5165\u4e24\u4f4d\u6709\u6548\u6570\u5b57\n                </ng-container>\n              </nz-form-explain>\n            </nz-form-control>\n          </nz-form-item> --\x3e\n        </ul>\n        <nz-form-item>\n          <nz-form-control [nzXs]="{ span: 24, offset: 0 }" [nzSm]="{ span: 20, offset: 4}">\n            <button nz-button [nzType]="\'default\'" (click)="back()" style="margin-right: 24px;">\u53d6\u6d88</button>\n            <button nz-button [nzType]="\'primary\'" (click)="submit()">\u63d0\u4ea4\n            </button>\n          </nz-form-control>\n        </nz-form-item>\n      </div>\n    </form>\n  </div>\n</div>'},Kcn2:function(t,n){t.exports="@charset \"UTF-8\";\n/***\u517c\u5bb9\u6d4f\u89c8\u5668***/\n.wage-render dl {\n  font-family: 'PingFang SC';\n  font-weight: 400;\n  line-height: 22px;\n  margin: 14px 0 0 0;\n  padding-bottom: 14px;\n  border-bottom: 1px solid #E8E8E8;\n  overflow: hidden; }\n.wage-render dl dt, .wage-render dl dd {\n    padding: 0;\n    margin: 0; }\n.wage-render dl .wage-name {\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.45); }\n.wage-render dl .wage-gray {\n    font-size: 14px;\n    color: rgba(0, 0, 0, 0.25); }\n.wage-render dl .wage-time {\n    float: right; }\n.wage-render dl .wage-content {\n    font-size: 14px;\n    word-break: break-all;\n    color: rgba(0, 0, 0, 0.65); }\n.wage-render dl .wage-fix {\n    font-size: 14px;\n    color: #1890ff; }\n.wage-render dl .wage-img > div {\n    width: 150px;\n    height: 110px;\n    margin: 5px 5px 0 5px;\n    -webkit-display: inline-block;\n    -moz-display: inline-block;\n    -ms-display: inline-block;\n    -o-display: inline-block;\n    display: inline-block; }\n"},L612:function(t,n){t.exports='<div class="warranty">\n  <div class="head">\n    <rev-title [title]="title"></rev-title>\n  </div>\n  <div class="content">\n    <div class="warranty_operation">\n      <radio-switch [radioSwitch]="radioSwitch" (handleSwitch)="handleSwitch($event)"></radio-switch>\n    </div>\n    <div class="warranty_table">\n      <nz-table #nzTable [nzData]="records" [nzBordered]="true" [nzFrontPagination]="false"\n                [(nzPageIndex)]=\'pageNo\' [(nzPageSize)]="pageSize" [nzTotal]="total"\n                (nzPageIndexChange)=\'changeData()\' nzSize="middle" [nzShowPagination]=\'true\'\n      >\n        <thead nz-thead>\n        <tr>\n          <th>\u5ba2\u6237\u59d3\u540d</th>\n          <th>\u624b\u673a\u53f7</th>\n          <th>\u5730\u5740</th>\n          <th>\u88c5\u4fee\u7c7b\u578b</th>\n          <th>\u7ae3\u5de5\u65e5\u671f</th>\n          <th>\u4fdd\u4fee\u8d77\u59cb\u65f6\u95f4</th>\n          <th>\u7533\u8bf7\u65f6\u95f4</th>\n          <th>\u64cd\u4f5c</th>\n        </tr>\n        </thead>\n        <tbody nz-tbody>\n        <tr nz-tbody-tr *ngFor="let data of nzTable.data;let i = index">\n          <td title="{{data.customerName?data.customerName:\'--\'}}">{{data.customerName?data.customerName:\'--\'}}</td>\n          <td title="{{data.customerPhone?data.customerPhone:\'--\'}}">{{data.customerPhone?data.customerPhone:\'--\'}}</td>\n          <td title="{{data.customerAddress?data.customerAddress:\'--\'}}">{{data.customerAddress?data.customerAddress:\'--\'}}</td>\n          <td title="{{getTypeName(data.type)}}">{{getTypeName(data.type)}}</td>\n          <td>{{data.completionTime?(data.completionTime | date:\'y-MM-dd\'):\'--\'}}</td>\n          <td>{{data.warrantyStart===2?(data.customTime|date:\'yyyy-MM-dd\'):(data.startTime | date:\'y-MM-dd\')}}</td>\n          <td>{{data.createTime | date:\'y-MM-dd\'}}</td>\n          <td style="text-align: center">\n            <a href="javascript:void(0)" [routerLink]="[\'./../detail\',7]" [queryParams]="{cid:btoa(data.quoteId),rid:btoa(data.id)}">\u8be6\u60c5</a>\n          </td>\n        </tr>\n        </tbody>\n      </nz-table>\n    </div>\n  </div>\n</div>\n'},OXAl:function(t,n,a){"use strict";a.r(n);var e=a("CcnG"),r=a("Ip0R"),i=a("UFnY"),o=a("8BCk"),s=a("ZYCi"),d=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},c=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},l=function(){function t(){}return t.prototype.ngOnInit=function(){},t=d([Object(e.Component)({selector:"rev-warranty-audit",template:"<router-outlet></router-outlet>",styles:[a("DYCb")]}),c("design:paramtypes",[])],t)}(),p=a("Fgki"),y=a("gIcY"),h=a("Ouoq"),u=a("OHOg"),f=a("5aMp"),m=a("f8yE"),g=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},w=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},b=function(){function t(t,n,a,e){this.fb=t,this.user=n,this.req=a,this.warn=e,this.warrantyYears=2,this.hydWarrantyYears=5,this.warrantyStart=0,this.settingOption=[],this.defaultRemark="1.\u81ea\u5de5\u7a0b\u7ae3\u5de5\u65e5\u671f\u8d77\uff0c\u6574\u4f53\u4fdd\u4fee2 \u5e74\uff0c\u4f9b\u6c34\u6c34\u8def\u3001\u9632\u6c34\u4fdd\u4fee10\u5e74\uff0c\u7535\u8def\u3001\u6392\u6c34\u4fdd\u4fee5\u5e74\uff0c\u6d82\u6539\u65e0\u6548\u3002  2.\u4fdd\u4fee\u9879\u76ee\u5305\u62ec\u672c\u516c\u53f8\u8ba1\u5165\u5de5\u7a0b\u7ed3\u7b97\u8d39\u7528\u7684\u8ba1\u8d39\u9879\u76ee\u3002      3.\u51e1\u516c\u53f8\u4ee3\u8d2d\u4e3b\u6750\u4fdd\u4fee\uff0c\u516c\u53f8\u53ea\u8d1f\u8d23\u534f\u8c03\uff0c\u4e0d\u627f\u62c5\u4fdd\u4fee\u8d23\u4efb\u3002      4.\u8d85\u8fc7\u5de5\u7a0b\u4fdd\u4fee\u671f\u7684\u5de5\u7a0b\u7ef4\u4fee\uff0c\u672c\u516c\u53f8\u6536\u53d6\u5fc5\u8981\u7684\u4eba\u5de5\u8d39\u3001\u6750\u6599\u8d39\u7b49\u6210\u672c\u8d39\u7528\uff0c\u4e0d\u518d\u53e6\u5916\u6536\u53d6\u5176\u4ed6\u8d39\u7528\u3002      5.\u5728\u672a\u7ed3\u7b97\u5de5\u7a0b\u6b3e\u671f\u95f4\uff0c\u7531\u4e8e\u4f7f\u7528\u3001\u7ef4\u62a4\u4e0d\u5f53\u9020\u6210\u7684\u5de5\u7a0b\u635f\u574f\u4e0d\u5728\u4fdd\u4fee\u8303\u56f4\u5185\u3002      6.\u5382\u5bb6\u3001\u5546\u5bb6\u627f\u8bfa\u7684\u8d28\u4fdd\u671f\u3001\u4fdd\u4fee\u671f\u8d85\u51fa\u672c\u5361\u7ea6\u5b9a\u7684\u4fdd\u4fee\u671f\uff0c\u7531\u5382\u5bb6\u3001\u5546\u5bb6\u81ea\u884c\u627f\u62c5\u8d23\u4efb\u3002",this.remarks=this.defaultRemark}return t.prototype.ngOnInit=function(){this.title="\u8bbe\u7f6e\u9ed8\u8ba4\u4fdd\u4fee",this.loadConfig()},t.prototype.back=function(){window.history.back()},t.prototype.renderList=function(t,n){for(void 0===t&&(t=5),void 0===n&&(n=0),this.settingOption=[],this.settingOption[0]={customWarrantyName:"",customYears:1};n<t-1;n++)this.settingOption.push({customWarrantyName:"",customYears:1})},t.prototype.warrantyType=function(t){this.warrantyStart=t},t.prototype.getOptionControl=function(){this.settingOption.forEach(function(t,n){})},t.prototype.addOptions=function(){this.settingOption.length>=5?this.warn.onWarn("\u6dfb\u52a0\u8bbe\u7f6e\u6700\u591a5\u4e2a"):this.settingOption.push({customWarrantyName:"\u4fdd\u4fee\u540d\u79f0",customYears:1})},t.prototype.hiddenEdit=function(t){this.settingOption.forEach(function(t){t.checked=!1}),t.checked=!0},t.prototype.hiddenAll=function(t,n){this.settingOption.forEach(function(t){t.checked=!1}),t||(this.settingOption[n].customWarrantyName="\u4fdd\u4fee\u540d\u79f0")},t.prototype.submit=function(){var t=this,n={};n.customs=this.settingOption,n.warrantyStart=this.warrantyStart,n.warrantyExplain=this.remarks,n.companyId=this.user.getCompanyId(),this.req.doPost({url:"modifyCompany",data:n,success:function(n){n&&200==n.code?t.warn.onSuccess(n.msg||m.a.SUCCESS.DATA):t.warn.onError(n.msg||m.a.FAIL.DATA)}})},t.prototype.remarkCheck=function(t){t||(this.remarks=this.defaultRemark)},t.prototype.numberCheck=function(t,n){this.settingOption[n].customYears=t?Number(t.toFixed(2)):0},t.prototype.loadConfig=function(){var t=this;this.user.getCompanyId()&&this.req.doPost({url:"configCompany",data:{companyId:this.user.getCompanyId()},success:function(n){n&&200==n.code?n.data&&t.setDefaultConfig(n.data):t.warn.onError(n.msg||m.a.FAIL.DATA)}})},t.prototype.removeOptions=function(t){this.settingOption.splice(t,1)},t.prototype.setDefaultConfig=function(t){var n=this;t.customs.forEach(function(t,a){n.settingOption.splice(a,1,{customWarrantyName:t.customWarrantyName,customYears:t.customYears,checked:!1})}),this.getOptionControl(),t.warrantyExplain&&(this.remarks=t.warrantyExplain),this.warrantyStart=t.warrantyStart,this.warrantyYears=t.warrantyYears,this.hydWarrantyYears=t.hydWarrantyYears},t=g([Object(e.Component)({selector:"rev-warranty-setting",template:a("IJWv"),styles:[a("eUQR"),a("R9H+"),a("PKc7"),a("PBJw")]}),w("design:paramtypes",[y.a,h.a,u.a,f.a])],t)}(),z=a("lcOY"),v=a("FoyA"),x=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},S=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},P=function(){function t(t,n){this.req=t,this.warn=n,this.title="\u4fdd\u4fee\u8bb0\u5f55",this.radioSwitch=[{key:0,text:"\u7533\u8bf7\u7ef4\u4fee"},{key:1,text:"\u7ef4\u4fee\u4e2d"},{key:3,text:"\u5df2\u5b8c\u6210"}],this.pageNo=z.b.PAGE.PAGE_NO,this.pageSize=z.b.PAGE.PAGE_SIZE,this.total=z.b.PAGE.PAGE_TOTAL}return t.prototype.ngOnInit=function(){this.changeData()},t.prototype.handleSwitch=function(t){this.pageNo=z.b.PAGE.PAGE_NO,this.total=z.b.PAGE.PAGE_TOTAL,this.changeData(t)},t.prototype.changeData=function(t){var n=this;void 0===t&&(t=0),this.req.doPost({url:"recordCard",data:{pageNo:this.pageNo,pageSize:this.pageSize,state:t},success:function(t){t&&200==t.code?(n.records=t.data.pageSet,n.total=t.data.total):n.warn.onError(t.msg||m.a.FAIL.DATA)}})},t.prototype.getTypeName=function(t){return Object(v.K)(t)},t.prototype.btoa=function(t){return Object(v.c)(t)},t=x([Object(e.Component)({selector:"rev-warranty-record-list",template:a("L612"),styles:[a("R9H+"),a("U1wm")]}),S("design:paramtypes",[u.a,f.a])],t)}(),T=a("I3Dz"),k=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},O=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},R=function(){function t(t,n,a,e){this.req=t,this.warn=n,this.quote=a,this.activatedRoute=e,this.records=[],this.isVisible=!1}return t.prototype.ngOnInit=function(){var t=this;this.activatedRoute.queryParams.subscribe(function(n){n&&n.rid&&(t.rid=Object(v.b)(n.rid),t.renderRecord(t.rid))})},t.prototype.loadRecord=function(t){var n=this;return new Promise(function(a,e){n.req.doPost({url:"recordDynamicCard",data:{recordId:t},success:function(t){t&&200==t.code?a(t.data):e(t.msg||m.a.FAIL.DATA)}})})},t.prototype.renderRecord=function(t){var n=this;t?this.loadRecord(t).then(function(t){n.records=t&&t.dynamics&&t.dynamics.length>0?t.dynamics:[],n.quote.setRecords(t)}).catch(function(t){n.warn.onMsgError(t)}):this.warn.onMsgError(m.a.PARAM_EMPTY)},t.prototype.showLargeImg=function(t){this.isVisible=!0,this.src=t},t.prototype.handleCancel=function(){this.isVisible=!1},t.prototype.shoWageImgBg=function(t){return Object(v.S)(t,150,110)},t=k([Object(e.Component)({selector:"rev-warranty-record-detail",template:a("ijib"),styles:[a("eUQR"),a("R9H+"),a("Kcn2")]}),O("design:paramtypes",[u.a,f.a,T.a,s.a])],t)}(),M=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},A=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},E=function(){function t(){}return t.prototype.ngOnInit=function(){},t=M([Object(e.Component)({selector:"rev-warranty-record",template:"<router-outlet></router-outlet>",styles:[a("R9H+")]}),A("design:paramtypes",[])],t)}(),C=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},j=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},I=function(){function t(t,n,a){this.user=t,this.req=n,this.warn=a,this.title="\u4fdd\u4fee\u5361\u5ba1\u6838",this.status=0,this.radioSwitch=[{key:0,text:"\u5f85\u5ba1\u6838"},{key:1,text:"\u5df2\u5ba1\u6838"}],this.pageNo=z.b.PAGE.PAGE_NO,this.pageSize=z.b.PAGE.PAGE_SIZE,this.total=z.b.PAGE.PAGE_TOTAL}return t.prototype.ngOnInit=function(){this.changeData()},t.prototype.changeData=function(){var t=this,n={companyId:this.user.getCompanyId(),status:this.status,pageNo:this.pageNo,pageSize:this.pageSize};this.req.doPost({url:"listCard",data:n,success:function(n){n&&200==n.code?(t.auditList=n.data.pageSet,t.total=n.data.total):t.warn.onError(n.msg||m.a.FAIL.DATA)}})},t.prototype.handleSwitch=function(t){this.pageNo=z.b.PAGE.PAGE_NO,this.pageSize=z.b.PAGE.PAGE_SIZE,this.status=t,this.changeData()},t.prototype.getTypeName=function(t){return Object(v.K)(t)},t.prototype.btoa=function(t){return Object(v.c)(t)},t=C([Object(e.Component)({selector:"rev-warranty-audit-list",template:a("eWch"),styles:[a("R9H+"),a("7Uef")]}),j("design:paramtypes",[h.a,u.a,f.a])],t)}(),Y=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},D=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},N=function(){function t(t,n,a){this.req=t,this.warn=n,this.activatedRoute=a}return t.prototype.ngOnInit=function(){var t=this;this.title="\u5ba1\u6838\u7f16\u8f91",this.warranty={warrantyYears:2,fixEndTime:(new Date).getTime(),hydWarrantyYears:5,utilitiesEndTime:(new Date).getTime(),warrantyStartTime:null},this.activatedRoute.queryParams.subscribe(function(n){n&&n.aid&&(t.aid=Object(v.b)(n.aid),t.loadInfo(t.aid))})},t.prototype.changeyear=function(t,n){t?(this.warranty.warrantyYears=Number(t.toFixed(2)),this.warranty.customs[n].customYears=Number(t.toFixed(2))):(this.warranty.warrantyYears=0,this.warranty.customs[n].customYears=0)},t.prototype.onChange=function(t){this.warranty.warrantyStartTime=Date.parse(t)},t.prototype.ngAfterContentChecked=function(){1===this.type?this.warranty.warrantyStartTime=this.warranty.finalPayment:0===this.type&&(this.warranty.warrantyStartTime=this.warranty.finishTime)},t.prototype.getYearTime=function(t,n){var a=24*Math.ceil(365*t)*60*60*1e3+n;return new Date(a).getTime()},t.prototype.back=function(){window.history.back()},t.prototype.submit=function(){var t=this;if(this.aid){var n={id:this.aid};if(this.warranty.finishTime&&(n.finishTime=this.warranty.finishTime),this.warranty.finalPayment&&(n.finalPayment=this.warranty.finalPayment),!this.warranty.warrantyYears)return this.warn.onWarn("\u8f93\u5165\u4e0d\u80fd\u4e3a\u7a7a\u6216\u8005\u96f6"),!1;if(n.warrantyYears=this.warranty.warrantyYears,!this.warranty.hydWarrantyYears)return this.warn.onWarn("\u8f93\u5165\u4e0d\u80fd\u4e3a\u7a7a\u6216\u8005\u96f6"),!1;n.hydWarrantyYears=this.warranty.hydWarrantyYears,this.warranty.warrantyStartTime&&(n.warrantyStartTime=this.warranty.warrantyStartTime),this.warranty.warrantyExplain&&(n.warrantyExplain=this.warranty.warrantyExplain),n.customs=this.warranty.customs,n.customTime=this.warranty.warrantyStartTime,n.warrantyStart=this.type,this.req.doPost({url:"modifyCard",data:n,success:function(n){n&&200==n.code?(t.warn.onSuccess(n.msg||m.a.SUCCESS.DATA),window.history.back()):t.warn.onError(n.msg||m.a.FAIL.DATA)}})}},t.prototype.loadInfo=function(t){var n=this;t&&this.req.doPost({url:"infoCard",data:{id:t},success:function(t){t&&200==t.code?(n.warranty=Object.assign(n.warranty,t.data),n.type=n.warranty.warrantyStart,1!==n.type||0!=n.warranty.status||n.warranty.finalPayment||(n.type=0),2===n.type&&(n.warranty.warrantyStartTime=n.warranty.customTime,n.diyDate=new Date(n.warranty.customTime)),n.warranty.warrantyExplain?n.warranty.warrantyExplain=n.warranty.warrantyExplain:n.warranty.warrantyExplain="1.\u81ea\u5de5\u7a0b\u7ae3\u5de5\u65e5\u671f\u8d77\uff0c\u6574\u4f53\u4fdd\u4fee2 \u5e74\uff0c\u4f9b\u6c34\u6c34\u8def\u3001\u9632\u6c34\u4fdd\u4fee10\u5e74\uff0c\u7535\u8def\u3001\u6392\u6c34\u4fdd\u4fee5\u5e74\uff0c\u6d82\u6539\u65e0\u6548\u3002              2.\u4fdd\u4fee\u9879\u76ee\u5305\u62ec\u672c\u516c\u53f8\u8ba1\u5165\u5de5\u7a0b\u7ed3\u7b97\u8d39\u7528\u7684\u8ba1\u8d39\u9879\u76ee\u3002              3.\u51e1\u516c\u53f8\u4ee3\u8d2d\u4e3b\u6750\u4fdd\u4fee\uff0c\u516c\u53f8\u53ea\u8d1f\u8d23\u534f\u8c03\uff0c\u4e0d\u627f\u62c5\u4fdd\u4fee\u8d23\u4efb\u3002              4.\u8d85\u8fc7\u5de5\u7a0b\u4fdd\u4fee\u671f\u7684\u5de5\u7a0b\u7ef4\u4fee\uff0c\u672c\u516c\u53f8\u6536\u53d6\u5fc5\u8981\u7684\u4eba\u5de5\u8d39\u3001\u6750\u6599\u8d39\u7b49\u6210\u672c\u8d39\u7528\uff0c\u4e0d\u518d\u53e6\u5916\u6536\u53d6\u5176\u4ed6\u8d39\u7528\u3002              5.\u5728\u672a\u7ed3\u7b97\u5de5\u7a0b\u6b3e\u671f\u95f4\uff0c\u7531\u4e8e\u4f7f\u7528\u3001\u7ef4\u62a4\u4e0d\u5f53\u9020\u6210\u7684\u5de5\u7a0b\u635f\u574f\u4e0d\u5728\u4fdd\u4fee\u8303\u56f4\u5185\u3002              6.\u5382\u5bb6\u3001\u5546\u5bb6\u627f\u8bfa\u7684\u8d28\u4fdd\u671f\u3001\u4fdd\u4fee\u671f\u8d85\u51fa\u672c\u5361\u7ea6\u5b9a\u7684\u4fdd\u4fee\u671f\uff0c\u7531\u5382\u5bb6\u3001\u5546\u5bb6\u81ea\u884c\u627f\u62c5\u8d23\u4efb\u3002"):n.warn.onError(t.msg||m.a.FAIL.DATA)}})},t.prototype.warrantyType=function(t){this.type=t,2===t&&(this.diyDate=new Date,this.warranty.warrantyStartTime=Date.now())},t=Y([Object(e.Component)({selector:"rev-warranty-audit-edit",template:a("bMGh"),styles:[a("eUQR"),a("R9H+"),a("PKc7")]}),D("design:paramtypes",[u.a,f.a,s.a])],t)}(),W=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},F=[{path:"",redirectTo:"audit",pathMatch:"full"},{path:"audit",component:l,data:{breadcrumb:"\u4fdd\u4fee\u5ba1\u6838"},children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:I,canActivate:[p.b]},{path:"edit",component:N,canActivate:[p.b],data:{breadcrumb:"\u8be6\u60c5"}}]},{path:"setting",component:b,canActivate:[p.b],data:{breadcrumb:"\u4fdd\u4fee\u5361\u8bbe\u7f6e"}},{path:"record",component:E,data:{breadcrumb:"\u4fdd\u4fee\u8bb0\u5f55"},children:[{path:"",redirectTo:"list",pathMatch:"full"},{path:"list",component:P,canActivate:[p.b]},{path:"detail/:state",component:R,canActivate:[p.b],data:{breadcrumb:"\u8be6\u60c5"}}]}],G=function(){function t(){}return t=W([Object(e.NgModule)({imports:[r.b,s.h.forChild(F)],exports:[s.h]})],t)}();a.d(n,"WarrantyModule",function(){return L});var q=function(t,n,a,e){var r,i=arguments.length,o=i<3?n:null===e?e=Object.getOwnPropertyDescriptor(n,a):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,n,a,e);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(i<3?r(o):i>3?r(n,a,o):r(n,a))||o);return i>3&&o&&Object.defineProperty(n,a,o),o},L=function(){function t(){}return t=q([Object(e.NgModule)({imports:[r.b,i.a,o.a,G],declarations:[l,N,E,P,R,b,I]})],t)}()},PBJw:function(t,n){t.exports=".warranty-edit .count {\n  position: absolute;\n  bottom: -19px;\n  right: 7px; }\n  .warranty-edit .count span {\n    color: red; }\n  .warranty-edit .dynamic-delete-button {\n  cursor: pointer; }\n  .warranty-edit .text {\n  width: 384px; }\n  .warranty-edit ul .info {\n  margin: 0 !important; }\n  .warranty-edit ul .info .year {\n    position: absolute;\n    right: 49px; }\n  .warranty-edit ul .info .info-content {\n    outline: none;\n    border: none;\n    text-align: right; }\n  .warranty-edit ul .info i {\n    vertical-align: middle !important;\n    padding-bottom: 4px;\n    margin-left: 4px;\n    color: #1890ff; }\n  .warranty-edit ul li {\n  margin-top: 24px; }\n"},PKc7:function(t,n){t.exports='@charset "UTF-8";\n/***\u517c\u5bb9\u6d4f\u89c8\u5668***/\n.warranty-edit .count {\n  position: absolute;\n  bottom: 1px;\n  right: 7px; }\n.warranty-edit .count span {\n    color: red; }\n.warranty-edit .time {\n  color: rgba(0, 0, 0, 0.45); }\n.warranty-edit .date {\n  position: absolute;\n  left: 97px;\n  top: 6px; }\n.warranty-edit .btns {\n  margin-left: 254px;\n  margin-top: 24px !important; }\n.warranty-edit .btns button {\n    margin-right: 24px; }\n.warranty-edit ul li {\n  margin: 5px 0; }\n.warranty-edit ul li > label {\n    text-align: right;\n    margin-right: 24px;\n    font-size: 14px; }\n.warranty-edit ul li .title, .warranty-edit ul li .inp {\n    display: inline-block;\n    font-size: 14px; }\n.warranty-edit ul li .title {\n    width: 10%;\n    padding-right: 24px;\n    text-align: right;\n    color: #000; }\n.warranty-edit ul li .start {\n    vertical-align: top; }\n.warranty-edit ul li .inp {\n    width: 60%;\n    position: relative; }\n.warranty-edit ul li .inp .text {\n      width: 80px;\n      line-height: 22px;\n      outline: none;\n      border: 1px solid #dedede;\n      text-indent: 10px;\n      margin-right: 10px;\n      opacity: 0.8;\n      -webkit-filter: opacity(80);\n              filter: opacity(80);\n      color: #101010; }\n.warranty-edit ul li .inp .text:focus {\n        border-color: #0a8de9;\n        opacity: 1;\n        -webkit-filter: opacity(100);\n                filter: opacity(100);\n        color: #101010; }\n.warranty-edit ul li .inp .year {\n      position: absolute;\n      left: 40px;\n      top: 6px;\n      color: #9d9d9d; }\n.warranty-edit ul li .inp .edit-inp {\n      margin-right: 24px;\n      width: 44%; }\n.warranty-edit ul li:first-child .inp {\n  width: 410px; }\n.warranty-edit ul li:first-child .inp .ant-calendar-picker span:first-child {\n    width: 100%; }\n.warranty-edit ul li:last-child .inp {\n  width: 26.5%; }\n'},"R9H+":function(t,n){t.exports=".warranty {\n  overflow: hidden; }\n  .warranty .content {\n    padding-top: 48px; }\n  .warranty .content .warranty_table {\n      margin-top: 12px; }\n  .warranty tr td {\n    font-size: 14px; }\n  .notice-head {\n  display: flex;\n  justify-content: space-between; }\n  .split {\n  border-bottom: 8px solid #f0f2f5;\n  width: 100%; }\n"},U1wm:function(t,n){t.exports=""},bMGh:function(t,n){t.exports='<div class="warranty">\n  <div class="head">\n    <rev-title [title]="title"></rev-title>\n  </div>\n  <div class="content">\n    <div class="warranty-edit">\n      <ul>\n        <li>\n          <label nz-col nzSpan=\'4\'>\u4fdd\u4fee\u8d77\u59cb\u65f6\u95f4</label>\n          <div class="inp">\n            <label nz-col nzSpan=\'11\' [ngClass]="{\'ant-radio-wrapper-checked\':type === 1}">\n              <span class="ant-radio" [ngClass]="{\'ant-radio-checked\':type === 1}">\n                <input type="radio" class="ant-radio-input" value="1" name="warranty" (click)="warrantyType(1)"\n                  [disabled]="!warranty.finalPayment" />\n                <span class="ant-radio-inner"></span>\n              </span>\n              <span>\u5c3e\u6b3e\u65f6\u95f4\uff1a<span\n                  class="time">{{warranty.finalPayment?(warranty.finalPayment|date:\'yyyy-MM-dd\'):\'--\'}}</span></span>\n            </label>\n            <label nz-col nzSpan=\'12\' nzOffset="1" [ngClass]="{\'ant-radio-wrapper-checked\':type === 0}">\n              <span class="ant-radio" [ngClass]="{\'ant-radio-checked\':type === 0}">\n                <input type="radio" class="ant-radio-input" value="0" name="warranty" (click)="warrantyType(0)" />\n                <span class="ant-radio-inner"></span>\n              </span>\n              <span>\u7ae3\u5de5\u65f6\u95f4\uff1a<span class="time">{{warranty.finishTime|date:\'yyyy-MM-dd\'}}</span></span>\n            </label>\n            <label nz-col nzSpan=\'24\' [ngClass]="{\'ant-radio-wrapper-checked\':type === 2}" style="margin-top: 8px;">\n              <span class="ant-radio" [ngClass]="{\'ant-radio-checked\':type === 2}">\n                <input type="radio" class="ant-radio-input" value="2" name="warranty" (click)="warrantyType(2)" />\n                <span class="ant-radio-inner"></span>\n              </span>\n              <span>\u5176\u4ed6\u65f6\u95f4\uff1a <nz-date-picker [nzShowToday] [(ngModel)]="diyDate" [nzStyle]="{\'width\':\'274px\'}" [nzAllowClear]=false\n                  (click)="warrantyType(2)" (ngModelChange)="onChange($event)"></nz-date-picker></span>\n            </label>\n          </div>\n        </li>\n        <li style="margin-top: 24px;" *ngFor="let date of warranty.customs;let i=index">\n          <label nz-col nzSpan=\'4\'>{{date.customWarrantyName}}</label>\n          <div class="inp">\n            <nz-input-number [(ngModel)]="date.customYears" [nzMin]="0" (ngModelChange)="changeyear($event,i)"\n              [nzPrecision]="1" [nzMax]="99" [nzSize]="\'middle\'" [nzStep]="1" [nzPlaceHolder]="\'\u8bf7\u8f93\u5165\'" class="edit-inp">\n            </nz-input-number>\n            \x3c!-- <input type="text" placeholder="\u8bf7\u8f93\u5165" class="text" maxlength="2" [(ngModel)]="warranty.warrantyYears" onkeyup="this.value=this.value.replace(/\\D/g,\'\')"/> --\x3e\n            <span class="year">\u5e74</span>\n            <span\n              class=" time date">\u4fdd\u4fee\u65f6\u95f4\uff1a{{warranty.warrantyStartTime?(warranty.warrantyStartTime|date:\'yyyy-MM-dd\'):\'--\'}}&nbsp;&nbsp;\u81f3&nbsp;&nbsp;{{warranty.fixEndTime?(getYearTime(date.customYears,warranty.warrantyStartTime)|date:\'yyyy-MM-dd\'):\'--\'}}</span>\n          </div>\n        </li>\n        \x3c!-- <li style="margin-top: 24px;">\n          <label nz-col nzSpan=\'4\'>\u6c34\u7535\u4fdd\u4fee</label>\n          <div class="inp">\n              <nz-input-number [(ngModel)]="warranty.hydWarrantyYears" [nzMin]="1" [nzMax]="10" [nzSize]="\'middle\'" [nzStep]="1" [nzPlaceHolder]="\'\u8bf7\u8f93\u5165\'" class="edit-inp"></nz-input-number> --\x3e\n        \x3c!-- <input type="text" placeholder="\u8bf7\u8f93\u5165" class="text" maxlength="2" [(ngModel)]="warranty.hydWarrantyYears"\n                   onkeyup="this.value=this.value.replace(/\\D/g,\'\')"/> --\x3e\n        \x3c!-- <span class="year">\u5e74</span>\n            <span class=" time date">\u4fdd\u4fee\u65f6\u95f4\uff1a{{warranty.warrantyStartTime?(warranty.warrantyStartTime|date:\'yyyy-MM-dd\'):\'--\'}}&nbsp;&nbsp;\u81f3&nbsp;&nbsp;{{warranty.utilitiesEndTime?(warranty.utilitiesEndTime|date:\'yyyy-MM-dd\'):\'--\'}}</span>\n          </div>\n        </li> --\x3e\n        <li style="margin-top: 24px;">\n          <label nz-col nzSpan=\'4\'>\u4fdd\u4fee\u8bf4\u660e</label>\n          <div class="inp">\n            <textarea nz-input name="warranty.warrantyExplain" [(ngModel)]="warranty.warrantyExplain" cols="15"\n              rows="10" maxlength="500" minlength="10"></textarea>\n            <span class="count"\n              *ngIf="warranty.warrantyExplain && warranty.warrantyExplain.length > 0"><span>{{warranty.warrantyExplain.length}}</span>/500</span>\n            \x3c!-- <input type="text" placeholder="\u8bf7\u8f93\u5165" class="text" maxlength="2" [(ngModel)]="warranty.hydWarrantyYears"\n                   onkeyup="this.value=this.value.replace(/\\D/g,\'\')"/> --\x3e\n          </div>\n        </li>\n      </ul>\n      <div class="btns mt_50 ">\n        <button nz-button nzType="default" (click)="back()">\n          \u53d6\u6d88\n        </button>\n        <button nz-button nzType="primary" (click)="submit()">\n          \u63d0\u4ea4\n        </button>\n        \x3c!-- <a class="btn btn-primary" (click)="back()">\u53d6\u6d88</a>\n        <a class="btn btn-primary" (click)="submit()">\u63d0\u4ea4</a> --\x3e\n      </div>\n    </div>\n  </div>\n</div>'},eWch:function(t,n){t.exports='<div class="warranty">\n  <div class="head">\n    <rev-title [title]="title"></rev-title>\n  </div>\n  <div class="content">\n    <div class="warranty_operation">\n      <radio-switch [radioSwitch]="radioSwitch" (handleSwitch)="handleSwitch($event)"></radio-switch>\n    </div>\n    <div class="warranty_table">\n      <nz-table #nzTable [nzData]="auditList" [nzBordered]="true" [nzFrontPagination]="false"\n                [(nzPageIndex)]=\'pageNo\' [(nzPageSize)]="pageSize" [nzTotal]="total"\n                (nzPageIndexChange)=\'changeData()\' nzSize="middle" [nzShowPagination]="true"\n      >\n        <thead>\n        <tr >\n          <th>\u5ba2\u6237\u59d3\u540d</th>\n          <th>\u624b\u673a\u53f7</th>\n          <th>\u5730\u5740</th>\n          <th>\u88c5\u4fee\u7c7b\u578b</th>\n          <th>\u9762\u79ef</th>\n          <th>\u5b9e\u4ed8\u603b\u989d</th>\n          <th>\u7ae3\u5de5\u65e5\u671f</th>\n          <th>\u5c3e\u6b3e\u65e5\u671f</th>\n          <th>\u4fdd\u4fee\u8d77\u59cb\u65f6\u95f4</th>\n          <th>\u64cd\u4f5c</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr *ngFor="let data of nzTable.data">\n          <td [title]="data.firstRep?data.firstRep:\'\'">\n            <nz-badge [nzDot]="data.agendaCount > 0">{{data.firstRep?data.firstRep:\'--\'}}</nz-badge>\n          </td>\n          <td title="{{data.firstPhone?data.firstPhone:\'--\'}}">{{data.firstPhone?data.firstPhone:\'--\'}}</td>\n          <td [title]="data.address?data.address:\'--\'">{{data.address?data.address:\'--\'}}</td>\n          <td [title]="getTypeName(data.decorationType)">{{getTypeName(data.decorationType)}}</td>\n          <td [title]="data.houseArea?data.houseArea:\'--\'">{{data.houseArea?data.houseArea+\'m\xb2\':\'--\'}}</td>\n          <td>{{data.totlePrice?(data.totlePrice|number:\'1.2\'):\'--\'}}</td>\n          <td>{{data.finishTime?(data.finishTime|date:\'yyyy-MM-dd\'):\'--\'}}</td>\n          <td>{{data.finalPayment?(data.finalPayment|date:\'yyyy-MM-dd\'):\'--\'}}</td>\n          <td>{{data.warrantyStart===2?(data.customTime|date:\'yyyy-MM-dd\'):(!data.warrantyStart?(data.finalPayment?(data.finalPayment|date:\'yyyy-MM-dd\'):(data.finishTime|date:\'yyyy-MM-dd\')):(data.finishTime|date:\'yyyy-MM-dd\'))}}</td>\n\n          <td>\n            <div>\n              <a href="javascript:void(0)" [routerLink]="[\'./../edit\']"\n                 [queryParams]="{aid:btoa(data.id)}">{{data.status === 0?\'\u5ba1\u6838\':\'\u4fee\u6539\'}}</a>\n            </div>\n          </td>\n        </tr>\n        </tbody>\n      </nz-table>\n    </div>\n  </div>\n</div>\n'},ijib:function(t,n){t.exports='<div class="warranty">\r\n    <div class="head">\r\n        <rev-detail-head></rev-detail-head>\r\n    </div>\r\n    <div class="split"></div>\r\n    <div class="content">\r\n        <div class="wage-detail">\r\n            \x3c!---\u8be6\u60c5\u6e32\u67d3---\x3e\r\n            <div nz-row *ngIf="records && records.length > 0" class="wage-render">\r\n                <dl *ngFor="let record of records" [hidden]="record.state">\r\n                    <dt nz-row>\r\n                        <span nz-col nzSpan="16" class="wage-name">{{record.originatorType == 2?\'\u4fdd\u4fee\u7533\u8bf7\':\'\u7ef4\u4fee\u786e\u8ba4\'}}</span>\r\n                        <span nz-col nzSpan="8" class="wage-gray text-right">{{record.modifyTime?(record.modifyTime|date:\'yyyy-MM-dd HH:mm\'):\'\'}}</span>\r\n                    </dt>\r\n                    <dd *ngIf="record.dynamicInfo" class="wage-content">{{record.dynamicInfo}}</dd>\r\n                    <dd *ngIf="record.img && record.img.length > 0" class="wage-img">\r\n                        <div (click)="showLargeImg(img.imgUrl)" *ngFor="let img of record.img"\r\n                             [ngStyle]="shoWageImgBg(img.imgUrl)"></div>\r\n                    </dd>\r\n                </dl>\r\n            </div>\r\n            <div nz-row *ngIf="records && records.length == 0" class="wage-render">\r\n                <dl>\r\n                    <dd class="wage-content">\u6682\u65e0\u6570\u636e\u663e\u793a</dd>\r\n                </dl>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\x3c!--\u653e\u5927\u56fe\u7247--\x3e\r\n<nz-modal [(nzVisible)]="isVisible" nzTitle="\u56fe\u7247\u5c55\u793a" nzWidth="1000px"\r\n          (nzOnCancel)="handleCancel()" [nzFooter]="null">\r\n    <div class="large-img" *ngIf="src">\r\n        <img [src]="src"/>\r\n    </div>\r\n</nz-modal>'}}]);