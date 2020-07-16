import { Component, OnInit } from '@angular/core';
import {Default} from '../../../../model/constant';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Messages} from '../../../../model/msg';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {btoa, getTypeName} from '../../../../model/methods';


@Component({
  selector: 'rev-finance-list',
  templateUrl: './finance-list.component.html',
  styleUrls: ['./../../finance.component.scss', './../../../detail/list.scss']
})
export class FinanceListComponent implements OnInit {

  public title: string;

  public pageNo: number = Default.PAGE.PAGE_NO;
  public pageSize: number = Default.PAGE.PAGE_SIZE;
  public total: number = Default.PAGE.PAGE_TOTAL;

  public searchName: string;
  public phone: string;
//   public designerName:string;
//   public name:string;

  public financeList: any;

  public departmentId: string;
  public searchForm: FormGroup;
  // public type:number = 1;

  constructor(private request: RequestService,
              private warn: WarningService,
              private fb: FormBuilder) { }

    ngOnInit() {
        this.title = '收款列表';
        this.searchForm = this.fb.group({
            searchName: [this.searchName, [
                // UserValidate.ValidateAccount
            ]],
            // name:[this. name,[
            //     // UserValidate.ValidateAccount
            // ]],
            // phone:[this.phone,[
            //     // UserValidate.ValidateAccount
            // ]],





        });


        // this.changeData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.changeData();
        }, 100);
    }

    // ngAfterViewChecked(){
    //     if(this.departmentId && this.depart-tree.getQuickDepartId()){
    //         if(this.departmentId != this.depart-tree.getQuickDepartId()){
    //             this.departmentId = this.depart-tree.getQuickDepartId();
    //             this.changeData();
    //         }
    //     }
    // }

    // findDepartFirstId(){
    //     let that = this;
    //     if(!that.departmentId){
    //         setTimeout(()=>{
    //             that.departmentId = that.depart-tree.getDepartFirstId();
    //             if(that.departmentId){
    //                 that.changeData();
    //             }
    //         },300);
    //     }else{
    //         that.findDepartFirstId();
    //     }
    // }

//   changeType(){
//       switch (this.type) {
//           case '1':
//             this.phone = "";
//               break;
//               case '2':
//                 this.name = "";

//           default:
//               break;
//       }
//     }

  changeData(...args) {

     const that = this;
     if (args &&　args.length > 0) {
         this.pageNo = Default.PAGE.PAGE_NO;
     }

     const params = {
         page: that.pageNo,
         pageSize: that.pageSize
     };
     if (that.searchName) {
         params['searchName'] = that.searchName;
     }

    //  if(that.phone){
    //      params["phone"] = that.phone;
    //  }
    //  if(that.name){
    //      params["name"] = that.name;
    //  }
    //  if(that.designerName){
    //     params["designerName"] = that.designerName;
    //  }
    //  if(that.foremanName){
    //     params["foremanName"] = that.foremanName;
    //  }

     that.request.doPost({
         url: 'listFinance',
         data: params,
         success: (res => {
             if (res && res.code == 200) {
                 // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                 that.financeList = res.data.list;
                 that.total = res.data.total;
             } else {
                 that.warn.onError(res.msg || Messages.FAIL.DATA);
             }
         })
     });
  }

  getTypeName(type) {
    return getTypeName(type);
  }

  btoa(id: string) {
      return btoa(id);
  }


}
