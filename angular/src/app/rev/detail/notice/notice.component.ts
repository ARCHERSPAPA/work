import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {Messages} from "../../../model/msg";
import {QuoteService} from "../../../service/quote.service";
import {atob} from "../../../model/methods";

@Component({
    selector: 'rev-detail-notice',
    templateUrl: './notice.component.html',
    styleUrls: ['./../detail.scss', './notice.component.scss'],
})
export class NoticeComponent implements OnInit {

    // public switch:string;

    public isVisible: boolean = false;
    public src: string;

    public nid: string;
    public cid: string;

    public notices: Array<any>;

    constructor(private activatedRoute: ActivatedRoute,
                private quote: QuoteService,
                private request: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {
        // this.switch = "bottom";
        // this.notices = [
        //     {
        //         extend:1,
        //         time:new Date().getTime(),
        //         state:2,
        //         remark:"我不是黄蓉，我不会武功，我只要靖哥哥，我没有爱情",
        //         imgs:[
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim"
        //         ]
        //     },
        //     {
        //         extend:2,
        //         time:new Date().getTime(),
        //         state:1,
        //         remark:"非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭",
        //         imgs:[
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/fd245d30-c339-ff46-1d16-77b0b3f8d5b4.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim",
        //             "http://tqiniu.madrock.com.cn/rev/imgs/5f1aee96-5338-744d-f6fc-ab003201b314.png?imagelim"
        //         ]
        //     }
        // ]
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["nid"]) {
                this.nid = atob(params["nid"]);
                if (this.nid) {
                    this.loadNotice(this.nid);
                }

            }
        });
    }

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


    openModal(src) {
        this.isVisible = true;
        this.src = src;
    }

    handleCancel() {
        this.isVisible = false;
        this.src = null;
    }

    loadNotice(id) {
        let that = this;
        that.request.doPost({
            url: "detailNotice",
            data: {id: id},
            success: (res => {
                if (res && res.code == 200) {
                    // console.log(res);
                    that.notices = res.data;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    handleNotice(id) {
        let that = this;
        // console.log(id);
        that.request.doPost({
            url: "handleNotice",
            data: {id: id},
            success: (res => {
                if (res && res.code == 200) {
                    // console.log(res);
                    that.loadNotice(that.nid);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    getUrgency(urgent) {
        switch (urgent) {
            case 1:
                return "一般紧急";
            case 2:
                return "比较紧急";
            case 3:
                return "非常紧急";
            default:
                return "一般紧急";
        }
    }

    getState(state) {
        switch (state) {
            case 0:
                return "未处理";
            case 1:
                return "已处理";
            default:
                return "未处理";
        }
    }

}
