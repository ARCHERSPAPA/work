import { Component, OnInit } from '@angular/core';
import { WarningService } from '../../../../service/warning.service';
import { RequestService } from '../../../../service/request.service';
import { Default } from '../../../../model/constant';
import { Messages } from '../../../../model/msg';
import { btoa } from '../../../../model/methods';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'rev-notice-inform-list',
    templateUrl: './notice-inform-list.component.html',
    styleUrls: ['./notice-inform-list.component.scss']
})
export class NoticeInformListComponent implements OnInit {

    public dataSet: Array<any> = [];
    public noticeTitle: string;
    public title = '通知列表';

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number;
    public forms = [{
        type: "text",
        name: "name",
        value: null,
        placeholder: "通知标题",
        cols: 2
    },
    {
        type: "button",
        name: "search",
        text: "查询"
    },
    {
        type: "button",
        name: "newInfo",
        text: "新建通知"
    }]
    constructor(private request: RequestService,
        private warn: WarningService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.loadNoticeList();
    }
    handleForm(e: any) {
        console.log(e)
        if(e.name==this.forms[2].name){
            this.newInfo();
        }else{
            let maps = e.value;
            if (maps && maps.size > 0) {
                this.noticeTitle = maps.get('name');
            }
            this.loadNoticeList(true);
        }
    }
    // 通知列表
    loadNoticeList(...args) {
        const params = {};
        if (args && args.length > 0) {
            this.pageNo = Default.PAGE.PAGE_NO;
            params['title'] = this.noticeTitle;
        }
        params['pageNum'] = this.pageNo;
        params['pageSize'] = this.pageSize;

        // if (this.noticeTitle) {
        //     param['title'] = this.noticeTitle;
        //     param['pageNum'] = Default.PAGE.PAGE_NO;
        // }


        this.request.doPost({
            url: 'noticeList',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.dataSet = res.data.list;
                    this.total = res.data.total;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }
    newInfo() {
        window.open(window.location.href.replace(/list/g, `add`), '_blank');
    }
    deleteNotice(noticeId): void {
        this.request.doPost({
            url: 'noticeDel',
            data: {
                id: noticeId
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.loadNoticeList();
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    // self._notification.create('error', '温馨提示', res.msg, {nzDuration: 2000});
                }
            })
        });
    }

    cancelNotice(): void {
        // this.nzMessageService.info('click cancel');
    }
    btoa(id: string) {
        return btoa(id);
    }
}
