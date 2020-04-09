import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { Messages } from "../../../../model/msg";
import { NzModalService } from 'ng-zorro-antd';
import { Default } from "../../../../model/constant";
import { atob } from "../../../../model/methods";
@Component({
    selector: 'rev-wechat',
    templateUrl: './wechat.component.html',
    styleUrls: ['./wechat.component.scss']
})
export class WechatComponent implements OnInit {

    // 员工ID
    public id: string;

    // 通知事项的参数
    public pdNotice: boolean = false;
    public shNotice: boolean = false;
    //通知设计师
    public desNotice: boolean = false;
    //通知客户
    public cusNotice: boolean = false;
    //通知客户
    public infoNotice: boolean = false;
    //二维码信息
    public qrInfo: any;
    //二维码定时器
    private qrTimer: any;

    //用户信息
    public userInfo: any;
    //微信信息
    public wxInfo: any;
    private wxTimer: any;



    constructor(private req: RequestService,
        private warn: WarningService,
        private activateRoute: ActivatedRoute,
        private modalService: NzModalService) { }

    ngOnInit() {
        this.activateRoute.queryParams.subscribe(params => {
            if (params && params["id"]) {
                this.id = atob((params["id"]));
                this.getUserInfo().then(res => {
                    if (res && res.wx && res.wx.bindState === 0) {
                        this.wxInfo = res.wx;
                        this.pdNotice = this.wxInfo.pdNotice ? true : false;
                        this.shNotice = this.wxInfo.shNotice ? true : false;
                        this.desNotice = this.wxInfo.saveYsNotice ? true : false;
                        this.cusNotice = this.wxInfo.confirmYsNotice ? true : false;
                    } else {
                        this.renderQrcode();
                    }
                    if (res && res.employee) {
                        this.userInfo = res.employee;
                    }
                }).catch(err => {
                    this.warn.onMsgError(err);
                })

            }
        });
    }

    ngDoCheck() {
        // console.log("wx-TIMER==="+this.wxTimer);
        // console.log("QR-TIMER==="+this.qrTimer);
    }


    renderQrcode() {
        if (!this.wxTimer) {
            this.renderUserInfo();
        }
        this.getQrcode().then(qr => {
            if (qr) {
                this.qrInfo = qr;
                if (!this.wxInfo || (this.wxInfo && this.wxInfo.bindState === 1)) {
                    this.qrTimer = setTimeout(() => {
                        if (this.qrInfo && this.qrInfo.ticket) {
                            this.renderQrcode();
                        }
                    }, this.qrInfo && this.qrInfo.expire_seconds ? this.qrInfo.expire_seconds : Default.EXPIRE.TIMER);
                }
            }
            if (qr && !qr.ticket) {
                if (this.wxTimer) {
                    clearTimeout(this.wxTimer);
                    this.wxTimer = null;
                }
            }
        }).catch(err => {
            this.warn.onMsgError(err);
            if (this.wxTimer) {
                clearTimeout(this.wxTimer);
                this.wxTimer = null;
            }
            if (this.qrTimer) {
                clearTimeout(this.qrTimer);
                this.qrTimer = null;
            }
        })
    }

    renderUserInfo() {
        this.getUserInfo().then(res => {
            if ((res && !res.wx) || (res && res.wx && res.wx.bindState === 1)) {
                this.wxInfo = res.wx;
                if (this.wxInfo) {
                    this.pdNotice = this.wxInfo.pdNotice ? true : false;
                    this.shNotice = this.wxInfo.shNotice ? true : false;
                    this.desNotice = this.wxInfo.saveYsNotice ? true : false;
                    this.cusNotice = this.wxInfo.confirmYsNotice ? true : false;
                }
                this.wxTimer = setTimeout(() => {
                    this.renderUserInfo();
                }, Default.EXPIRE.TIMER);

            } else {
                this.wxInfo = res.wx;
                if (this.wxTimer) {
                    clearTimeout(this.wxTimer);
                    this.wxTimer = null;
                }
                if (this.qrTimer) {
                    clearTimeout(this.qrTimer);
                    this.qrTimer = null;
                }
            }
        }).catch(err => {
            this.warn.onMsgError(err);
            if (this.wxTimer) {
                clearTimeout(this.wxTimer);
                this.wxTimer = null;
            }
            if (this.qrTimer) {
                clearTimeout(this.qrTimer);
                this.qrTimer = null;
            }
        })
    }

    /**
     * 获取二维码
     * @param {number} type
     * @returns {Promise<any>}
     */
    getQrcode(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPostApp({
                url: "getQrcode",
                data: { employeeId: this.id },
                success: (res => {
                    if (res && res.code == 200) resolve(res.data);
                    else reject(res.msg || Messages.FAIL.DATA);
                })
            })
        })
    }

    /**
     * 获取当前用户相关信息
     * @returns {Promise<any>}
     */
    getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "getWxInfo",
                data: { employeeId: this.id },
                success: (res => {
                    if (res && res.code == 200) resolve(res.data);
                    else reject(res.msg || Messages.FAIL.DATA);
                })
            })
        })
    }


    back(e: any) {
        e.stopPropagation();
        e.preventDefault();
        window.history.go(-1);
    }

    // 提交通知
    submit(e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.id) {
            this.req.doPost({
                url: "submitWx",
                data: {
                    pdNotice: this.pdNotice ? 1 : 0,
                    shNotice: this.shNotice ? 1 : 0,
                    saveYsNotice: this.desNotice ? 1 : 0,
                    confirmYsNotice: this.cusNotice ? 1 : 0,
                    employeeId: this.id
                },
                success: (res => {
                    if (res && res.code === 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        this.modalService.confirm({
                            nzTitle: '<i>未绑定微信</i>',
                            nzContent: '<b>你还未绑定微信，无法接收到微信通知</b>',
                            nzCancelText: null,
                        })
                    }
                })
            })
        }
    }

    //解绑
    unbind(e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.id) {
            this.req.doPost({
                url: 'WxUnbundle',
                data: {
                    employeeId: this.id
                },
                success: (res => {
                    if (res && res.code === 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.shNotice = false;
                        this.pdNotice = false;
                        this.desNotice = false;
                        this.cusNotice = false;
                        this.renderQrcode();
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    ngOnDestroy() {
        if (this.wxTimer) {
            clearTimeout(this.wxTimer);
            this.wxTimer = null;
        }
        if (this.qrTimer) {
            clearTimeout(this.qrTimer);
            this.qrTimer = null;
        }
    }


}
