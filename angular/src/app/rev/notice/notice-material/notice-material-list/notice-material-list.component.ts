import {Component, OnInit} from '@angular/core';
import {WarningService} from "../../../../service/warning.service";
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";
import {Default} from "../../../../model/constant";
import {  btoa } from "../../../../model/methods";
@Component({
    selector: 'rev-notice-material-list',
    templateUrl: './notice-material-list.component.html',
    styleUrls: ['./../notice-material.component.scss','./notice-material-list.component.scss']
})
export class NoticeMaterialListComponent implements OnInit {

    constructor(private request: RequestService,
                private warn: WarningService) {
    }

    public materialQuery: string = "";
    public materialList: Array<any> = [];
    public title: string;

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    ngOnInit() {
        this.title = "通知素材库";
        this.loadSourceList()
    }

    // 素材列表
    loadSourceList(...args) {
        let params = {};
        if(args && args.length > 0){
            this.pageNo = Default.PAGE.PAGE_NO;
            params["title"] = this.materialQuery;
        }

        params["pageNum"] = this.pageNo;
        params["pageSize"] = this.pageSize;

        this.request.doPost({
            url: "noticeSourceList",
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.materialList = res.data.list;
                    this.total = res.data.total;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    deleteMaterial(sourceId) {
        this.request.doPost({
            url: "noticeSourceDel",
            data: {
                id: sourceId
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.loadSourceList()
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    cancelMaterial(): void {
        // this.nzMessageService.info('click cancel');
    }
    btoa(id:string) {
        return btoa(id)
    }

}
