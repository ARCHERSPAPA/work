import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Messages} from "../../../../model/msg";
import {RequestService} from "../../../../service/request.service";
import {Default} from "../../../../model/constant";
import {WarningService} from "../../../../service/warning.service";
import {btoa} from "../../../../model/methods";

@Component({
    selector: 'rev-article-notice-list',
    templateUrl: './article-notice-list.component.html',
    styleUrls: ['./../../article.component.scss', './../../../detail/detail.scss', './../../../detail/list.scss','./article-notice-list.component.scss']
})
export class ArticleNoticeListComponent implements OnInit {


    public title: string;

    /**查询条件**/
    public pageNo: number = Default.PAGE.PAGE_NO;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    // public name:string;
    // public phone:string;
    // public type:number = 1;
    public searchForm: FormGroup;
    public searchInfo: string;

    public departmentId: string;

    public noticeList: any;

    constructor(private request: RequestService,
                private warn: WarningService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.title = "内部通知";

        // this.searchForm = this.fb.group({
        //     name:[this.name,[]],
        //     phone:[this.phone,[]]
        // });
        this.searchForm = this.fb.group({
            searchInfo: [this.searchInfo, []]
        })
    }

    // 判断显示的严重程度状态
    color(type: number) {
        switch (type) {
            case 1:
                return 'green'
            case 2:
                return 'gold'
            case 3:
                return 'red'
            default:
                break;
        }

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.changeData();
        }, 100);
    }


    // changeType(){
    //     if(this.type === 1){
    //         this.phone = "";
    //     }else{
    //         this.name = "";
    //     }
    // }

    changeData(...args) {
        let that = this;
        // console.log(args[0]);
        if (args[0]) {
            that.pageNo = Default.PAGE.PAGE_NO;
        }
        if (this.searchForm.valid) {
            let params = {
                pageNo: that.pageNo,
                pageSize: that.pageSize,
            };
            // if(that.name){
            //     params["name"] = that.name;
            // }
            // else if(that.phone){
            //     params["phone"] = that.phone;
            // }
            if (that.searchInfo) {
                params["searchInfo"] = that.searchInfo;
            }

            that.request.doPost({
                url: "listNotice",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.noticeList = res.data.pageSet;
                        that.total = res.data.total;

                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }


    }

    getTypeName(type) {
        switch (type) {
            case 1:
                return "基装";
            case 2:
                return "套装";
            case 3:
                return "整装";
            default:
                return "未定";
        }
    }


    getUrgent(level) {
        switch (level) {
            case 1:
                return "一般紧急";
            case 2:
                return "比较紧急";
            case 3:
                return "非常紧急";
            default:
                return "其它紧急";
        }
    }

    getState(st) {
        switch (st) {
            case 0:
                return "未处理";
            case 1:
                return "已处理";
            default:
                return "其它";
        }
    }

    /**
     * 加密url
     * @param {string} id
     * @returns {any}
     */
    btoa(id:string){
        return btoa(id);
    }

}
