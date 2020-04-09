import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestService } from "../../../../service/request.service";
import { Default } from "../../../../model/constant";
import { WarningService } from "../../../../service/warning.service";
import { Messages } from "../../../../model/msg";
import { btoa, getStateName, getTypeName, getCostStateName } from "../../../../model/methods";
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from "../../../../service/user.service";


@Component({
    selector: 'rev-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./../../article.component.scss', './../../../detail/list.scss'],
})
export class ArticleListComponent implements OnInit {

    public title: string;
    public switch: string;
    public buttons: any;

    /**查询条件**/
    public pageNo: number = Default.PAGE.PAGE_NO;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    //查询条件
    // public name:string;
    // public phone:string;
    public type: string = "";
    public searchForm: FormGroup;
    public info: string = "";

    public departmentId: string;

    public articleList: any;

    constructor(private request: RequestService,
        private warn: WarningService,
        private fb: FormBuilder,
        private router: Router,
        private user: UserService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.title = "项目列表";
        this.buttons = [
            {
                name: "新建项目",
                type: "click",
                color: "btn-primary",
                load: true,
            }
        ];
        this.searchForm = this.fb.group({
            // name:[this.name,[]],
            // phone:[this.phone,[]]
            info: [this.info, []]
        });
        // this.activatedRoute.queryParams.subscribe((params) => {
        //     if (params && params["page"]) {
        //         this.pageNo = params["page"];
        //     }
        //     if (params["type"]) {
        //         this.type = params["type"];
        //     }
        //     if (params["name"]) {
        //         this.info = params["name"] ? decodeURI(params["name"]) : "";
        //     }
        //
        // })
        this.changeData();
    }


    changeData(...args) {
        let that = this;
        if (args && args.length > 0) {
            that.pageNo = Default.PAGE.PAGE_NO;
        }

        if (this.searchForm.valid) {
            let params = {
                page: that.pageNo,
                pageSize: that.pageSize
            };
            if (that.type) {
                params["type"] = that.type;
            }

            if (that.info) {
                params["name"] = that.info;
            }

            // if(that.name){
            //     params["name"] = that.name;
            // }
            // else if(that.phone){
            //     params["phone"] = that.phone;
            // }

            that.request.doPost({
                url: "listProject",
                data: params,
                success: (res => {
                    this.switch = "right";
                    if (res && res.code == 200) {
                        // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.articleList = res.data.list;
                        that.total = res.data.total;
                        // that.router.navigate(['./'], {
                        //     queryParams: {
                        //         page: that.pageNo,
                        //         type: that.type,
                        //         name: encodeURI(that.info)
                        //     }, relativeTo: that.activatedRoute
                        // })
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }

    }

    getTypeName(type) {
        return getTypeName(type);
    }

    getStateName(state) {
        return getStateName(state);
    }
    getCostState(state) {
        return getCostStateName(state)
    }
    handleName(e: any) {
        this.request.doPost({
            url: "buildProject",
            data: {
                userId: this.user.getId()
            },
            success: (res => {
                if (res && res.code == 200) {
                    let base = res.data.quoteBase;
                    this.router.navigate(["./../detail/dispatch", 4], {
                        queryParams: { cid: btoa(base.id) },
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    btoa(id: string) {
        return btoa(id);
    }

}
