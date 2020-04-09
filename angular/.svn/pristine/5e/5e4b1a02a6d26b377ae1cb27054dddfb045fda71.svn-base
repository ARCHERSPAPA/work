import { Component, OnInit, Pipe, PipeTransform, DoCheck } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Default} from "../../../../model/constant";
import {Messages} from "../../../../model/msg";
import {DepartService} from "../../../../service/depart.service";
import {Router, ActivatedRoute} from '@angular/router';
import * as UserValidate from "../../../../validate/user-validate";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../../../../service/user.service";
import {
    btoa,
    deleteUserByState,
    editUserByState,
    getStateName,
    transformQuickDepartType
} from "../../../../model/methods";


@Component({
  selector: 'rev-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./../client-detail.component.scss']
})
export class DetailListComponent implements OnInit {

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;


    public departmentId: string
    //快速查询部门配制
    public departType:number;

    public demandList: any;

    public searchForm:FormGroup;
    public customerPhone: string;
    public customerName: string;
    public type:string = '2';

    public isChild:number = 0;

    constructor(private request: RequestService,
                private warn: WarningService,
                private user:UserService,
                private depart: DepartService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb:FormBuilder) {
    }

    ngOnInit() {
        this.searchForm = this.fb.group({
            name:[this.customerName,[
                UserValidate.ValidateAccount
            ]],
            phone:[this.customerPhone,[
                Validators.maxLength(16)
            ]]
        });
        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());
        this.isChild = this.user.getChild();
        // this.activatedRoute.queryParams.subscribe(params =>{
        //     if(params){
        //         if(params["page"]){
        //             this.pageNo = params["page"] > 0?params["page"]:Default.PAGE.PAGE_NO;
        //         }
        //         if(params["name"]){
        //             this.customerName = decodeURI(params["name"]);
        //         }
        //         if(params["phone"]){
        //             this.customerPhone = params["phone"];
        //         }
        //         if(params["did"]){
        //             this.departmentId = params["did"];
        //         }
        //     }
        // })
    }

    changeType(){
        if(this.type === "1"){
            this.customerPhone = "";
        }else{
            this.customerName = "";
        }
        this.changeData(true);
    }

    changeDepart(e:any){
        this.departmentId = e;
        this.customerName = "";
        this.customerPhone = "";
        this.changeData(true);
    }

    changeData(...args) {
   
        let that = this;
        if(args && args.length > 0){
            this.pageNo = Default.PAGE.PAGE_NO;
        }

        let params = {
            pageNo: that.pageNo,
            pageSize: that.pageSize
        };
        if(that.customerName){
            params["customerName"] = that.customerName;
            delete params["departmentId"];
        }
        else if(that.customerPhone){
            params["customerPhone"] = that.customerPhone;
            delete params["departmentId"];
        }
        else{
            params["departmentId"] = that.departmentId;

        }

        that.request.doPost({
            url: "listDemand",
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.demandList = res.data.pageSet;
                    that.total = res.data.total;
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }


    // editDemand(id) {
    //     if (id) {
    //         this.router.navigate(["./../add"], {
    //             queryParams:{id:id},
    //             relativeTo: this.activatedRoute
    //         });
    //     }
    // }

    getStateName(state){
        return getStateName(state);
    }

    stateDemand(id, state) {
        let that = this;
        if (id) {
            that.request.doPost({
                url: "upDemandState",
                data: {
                    id: id,
                    state: state
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    offerDetail(id) {
        let that = this;
        that.request.doPost({
            url:"reqQuote",
            data:{customerId:id},
            success:(res =>{
                if(res && res.code == 200){
                    that.router.navigate(["/rev/offer/item/detail/price",1],{queryParams:{cid:btoa(res.data["quoteBase"].id)}});
                }else{
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
        // this.router.navigate(["/rev/offer/detail"],{queryParams:{cid:id}});
    }

    deleteUserByState(state){
        return deleteUserByState(state);
    }

    editUserByState(state){
        return editUserByState(state);
    }

    /**
     * url加密
     * @param {string} id
     * @returns {any}
     */
    btoa(id:string){
        return btoa(id);
    }
}

