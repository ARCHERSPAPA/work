import { Component, OnInit } from '@angular/core';
import { atob, setStyleBg } from "../../../../model/methods";
import { Messages } from "../../../../model/msg";
import { ItemPublishComponent } from "../../../../plugins/item-publish/item-publish.component";
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { QuoteService } from "../../../../service/quote.service";
import { UserService } from "../../../../service/user.service";
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'rev-cost-detail-annotate',
    templateUrl: './cost-detail-annotate.component.html',
    styleUrls: ['./../../cost.component.scss', './../../../detail/detail.scss', './../cost-detail.component.scss']
})
export class CostDetailAnnotateComponent implements OnInit {

    public msg: string;
    public cid: string;
    //成本id
    public pid: string;
    //上传状态
    public state: number = 0;

    /**
     * 批注列表信息
     */
    public notices: Array<any>;

    /**
     * 图片放大
     * @type {boolean}
     */
    public visibleImg: boolean = false;
    public largeImg: string;
    public _albums


    constructor(private quote: QuoteService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _lightbox: Lightbox,
        private req: RequestService,
        private warn: WarningService,
        private user: UserService,
        private modal: NgbModal) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
            }
            if (params && params["pid"]) {
                this.pid = atob(params["pid"]);
                this.renderDetail(this.pid);
                this.loadNotice(this.pid);
            }
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.msg = Messages.LOADING;
            } else if (event instanceof NavigationEnd) {
                setTimeout(() => {
                    this.msg = null;
                }, 1000);
            } else if (event instanceof NavigationCancel) {
                this.msg = null;
            }
        });

    }







    /**
     * 渲染chart 拉取详情
     * @param pid
     */
    renderDetail(pid) {
        this.loadDetail(pid).then(res => {
            this.setCost(res);
        }).catch(err => {
            this.warn.onMsgError(err);
        });
    }

    /**
     * v2.1.6去除工长异议改为批注发布
     * @param cost
     */
    loadDetail(pid): Promise<any> {
        return new Promise((resolve, reject) => {
            if (pid) {
                this.req.doPost({
                    url: "detailCost",
                    data: { id: pid },
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(res.data.cost);
                        } else {
                            reject(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            } else {
                reject(Messages.PARAM_EMPTY);
            }
        })

    }


    setCost(cost) {
        this.state = cost.state;
    }

    /**
     * 是否显示预览
     * @returns {number}
     */
    showViewByState() {
        return this.state !== 0 && this.user.getChild();
    }

    /**
     * 是否显示导入
     * @returns {number}
     */
    showImportByState() {
        return (this.state === 0 || this.state === 1 || this.state === 2) && this.user.getChild();
    }

    /**
     * 与导入成本表状态保持一致 2019-08-30(原來是state === 1:只有未提交時)
     * 2019-09-20 修改为在未确认合同之前均可修改
     * @returns {number}
     */
    showSendByState() {
        return (this.state === 1 || this.state === 2) && this.user.getChild();
    }

    /**
     * 是否显示保存
     * @returns {number}
     */
    showSaveByState() {
        return (this.state === 0 || this.state === 1) && this.user.getChild();
    }

    /**
     * 发布
     */
    publish() {
        let p = this.modal.open(ItemPublishComponent, {
            centered: true,
            keyboard: true,
            backdrop: "static"
        });

        p.componentInstance.type = 1;
        p.componentInstance.content = "";
        p.componentInstance.cid = this.pid;
        p.result.then((res) => {
            if (res) {
                this.req.doPost({
                    url: "publishNoticeCost",
                    data: {
                        costId: this.pid,
                        empIds: res.empIds,
                        content: res.content
                    },
                    success: (result => {
                        if (result && result.code == 200) {
                            this.warn.onMsgSuccess(result.msg || Messages.SUCCESS.DATA);
                            this.loadNotice(this.pid);
                        } else {
                            this.warn.onMsgError(result.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }


        }, (rea) => {
            console.log(rea);
        })
    }

    /** 
    *2.2.4版本替换成新的图片放大
    */
    showLargeImg(src, index) {
        this._albums=[]
        JSON.parse(src).forEach((i) => {
            this._albums.push({ src: i, thumb: i })
        })
        console.log(this._albums, index)
        // this._albums=[]
        this._lightbox.open(this._albums, index);
    }

    handleCancel() {
        this.visibleImg = false;
        this.largeImg = null;
    }

    /**
     * 拉取批注通知列表
     * @param id
     */
    loadNotice(id) {
        if (id) {
            this.req.doPost({
                url: "viewNoticeCost",
                data: { costId: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.notices = res.data;
                        // this.notices['imgUrls']=[{src:'http://img5.imgtn.bdimg.com/it/u=3302407625,2204157742&fm=26&gp=0.jpg'}]
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 转义img urls成一个array
     */
    transImgUrls(urls) {
        if (urls) {
            return JSON.parse(urls)
        }
        return false;
    }

    /**
     * 获取通知人员名单
     * @param ps 人员
     * @returns {any}
     */
    getNoticeInfo(ps) {
        let item = [];
        if (ps && ps.length > 0) {
            ps.forEach(p => {
                item.push(p.positionName ? p.realName + '（' + p.positionName + '）' : p.realName);
            });
        }
        return item.join("、");
    }

    /**
     * 判定是否为自建
     */
    justBuildBySelf(id) {
        return this.user.getId() === id;
    }

    delNotice(id) {
        if (id && this.pid) {
            this.req.doPost({
                url: "delNoticeCost",
                data: {
                    costId: this.pid,
                    modifyId: id
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadNotice(this.pid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    hiddenNotice(notices) {
        let flag = false;
        if (notices && notices.length > 0) {
            notices.forEach(n => {
                if (!n.state) {
                    flag = true;
                    return;
                }
            });
        }
        return flag;
    }



    /**
     * 图片渲染
     * @param src
     * @returns {{"background-image": string; "background-size": string; "background-repeat": string}}
     */
    showNoticeImgBg(src) {
        return setStyleBg(src, 96, 96);
    }

}
