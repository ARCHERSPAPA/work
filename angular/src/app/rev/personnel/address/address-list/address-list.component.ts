import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Router, ActivatedRoute} from '@angular/router';
import {Default} from "../../../../model/constant";
import {Messages} from "../../../../model/msg";
import {  btoa } from "../../../../model/methods";
@Component({
    selector: 'rev-address-list',
    templateUrl: './address-list.component.html',
    styleUrls: ['./../../personnel.component.scss','./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;
    public addressList:any;


    public pageNo:number = Default.PAGE.PAGE_NO;
    public pageSize:number = Default.PAGE.PAGE_SIZE;
    public total:number = Default.PAGE.PAGE_TOTAL;
    public departmentId:number;

    constructor(private req:RequestService,
                private warn:WarningService,
                private router:Router,
                private activatedRoute:ActivatedRoute) {
    }

    ngOnInit() {
        this.title = "企业通讯录";
        this.buttons = [{
            name: "设置权限"
        }];

        // this.addressList = [{
        //     account: "link191001",
        //     companyId: null,
        //     completeCount: 0,
        //     coordinates: null,
        //     departmentName: "监察一部",
        //     empNo: null,
        //     headImg: null,
        //     id: 252,
        //     identicalCount: 0,
        //     meanDistance: null,
        //     name: "红英",
        //     phone: "17019101903",
        //     positionName: "天龙三部",
        //     projectCount: 0,
        //     remarks: "枯萎无可奈何花落去",
        //     sex: 1,
        //     state: 1,
        //     sysUserId: 468,
        //     userId: null
        // }]
    }

    /**
     * 权限按钮
     * @param {string} name
     */
    handleName(name: string) {
        this.router.navigate(["./../role"],{relativeTo: this.activatedRoute});
    }

    /**
     * 选择部门
     * @param depart
     */
    selectDepart(departId:any){
        this.pageNo = Default.PAGE.PAGE_NO;
        this.departmentId = departId;
        this.changeData();
    }

    changeData(){

        let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            departmentId: this.departmentId
        };

        this.req.doPost({
            url: "listEmployee",
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.addressList = res.data.pageSet;
                    this.total = res.data.total;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })

    }

    btoa(id:string) {
        return btoa(id)
    }



}
