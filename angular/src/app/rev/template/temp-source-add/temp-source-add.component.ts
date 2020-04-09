import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from "../../../service/user.service";
import {Default} from "../../../model/constant";
import {Messages} from "../../../model/msg";
import {atob, btoa, compiledTplId} from "../../../model/methods";

@Component({
    selector: 'rev-temp-source-add',
    templateUrl: './temp-source-add.component.html',
    styleUrls: ['./temp-source-add.component.scss']
})
export class TempSourceAddComponent implements OnInit {

    public versionName: string;
    public versionId: number;
    public pid: number;
    //上一面编辑的sid
    public sid:string;

    //分页
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public dataSource: Array<any> = [];
    public categoryList:Array<any> = [];

    //选择
    public indeterminate:boolean = false;
    public allChecked:boolean = false;
    public dataSet:Array<any> = [];

    //查询内容
    public projectName: string;
    public category: string;



    constructor(private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private router:Router,
                private user: UserService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params) {
                if (params["versionName"]) {
                    this.versionName = params["versionName"];
                }
                if (params["versionId"]) {
                    this.versionId = params["versionId"];
                    this.changeData();
                    this.getCategoryList();
                }
                if (params["parentId"]) {
                    this.pid = params["parentId"];
                }
                if(params["sid"]){
                    this.sid = params["sid"];
                }
            }
        });
    }


    changeData(...args) {
        let that = this;
        if (args && args.length > 0) {
            that.pageNo = Default.PAGE.PAGE_NO;
        }
        if (that.versionId) {
            let params = {
                pageNo: that.pageNo,
                pageSize: that.pageSize,
                versionId: that.versionId,
                companyId: that.user.getCompanyId()
            };
            if (that.projectName) {
                params["projectName"] = that.projectName;
            }
            if (that.category) {
                params["category"] = that.category;
            }

            that.req.doPost({
                url: "mouldInfoList",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.dataSource = res.data.pageSet;
                        that.total = res.data.total;
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getCategoryList() {
        let that = this;
        this.req.doPost({
            url: 'categoryList',
            data: {versionId: this.versionId},
            success:(res =>{
                if(res && res.code == 200){
                    that.categoryList = res.data;
                }else{
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    refreshStatus(): void {
        const allChecked = this.dataSource.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.dataSource.filter(value => !value.disabled).every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

        this.dataSet = this.dataSource.filter(data => {return data.checked === true});
    }

    checkAll(value: boolean): void {
        this.dataSource.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }

    getCompileId(id:number){
        return compiledTplId(id);
    }

    back(e:any){
        e.stopPropagation();
        e.preventDefault();
        this.router.navigate(["./../edit"],{queryParams:{sid:btoa(this.sid)},relativeTo:this.activatedRoute});
    }

    submit(e:any){
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        if(that.dataSet.length > 0){
            that.req.doPost({
                url: "packageInfoItemAdd",
                data: {
                    praentId: that.pid,
                    infoIds: that.getParamIds(that.dataSet),
                },
                success:(res =>{
                    that.back(e);
                    if (res && res.code === 200) {
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getParamIds(data){
        let ids = [];
        if(data && data.length > 0){
            data.forEach(d =>{
                ids.push(d.id);
            });
        }
        return ids;
    }
}
