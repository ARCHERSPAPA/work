import { Component, OnInit } from '@angular/core';
import { Default } from "../../../../model/constant";
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { ActivatedRoute } from '@angular/router';
import { Messages } from "../../../../model/msg";
import { Lightbox } from 'ngx-lightbox';
import {atob} from "../../../../model/methods";

@Component({
  selector: 'rev-case-tabs-real',
  templateUrl: './case-tabs-real.component.html',
  styleUrls: ['./case-tabs-real.component.scss','./../../../detail/dynamics/dynamics.component.scss']
})
export class CaseTabsRealComponent implements OnInit {

 
    //放大图片
    public isVisible: boolean = false;
    public src: string;
    public _albums=[];
    public dynamics: Array<any>;

    //查询
    public cid: string;
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    constructor(private req: RequestService,
        private _lightbox: Lightbox,
        private warn: WarningService,
        private activatedRoute: ActivatedRoute,
    ) {
    }


    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["aid"]) {
                this.cid = atob(params["aid"]);
            }
        });
        this.changeData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
       
        }, 1000);
    }

    openModal(src,index) {
        this._albums=[]
        // this.isVisible = true;
        // this.src = src;
        src.forEach((i)=>{
            this._albums.push({src: i.imgUrl})
        })
        this._lightbox.open(this._albums, index);
    }

    handleCancel() {
        this.isVisible = false;
        this.src = null;
    }

    changeData() {
        let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            quoteId: this.cid
        };
        this.req.doPost({
            url: "listDynamic",
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.dynamics = this.renderDynamic(res.data.pageSet);
                    this.total = res.data.pageCount;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    renderDynamic(data) {
        if (data && data.length > 0) {
            data = data.filter(d => {
                if (d.imgList && d.imgList.length > 0) {
                    d.imgList.forEach(img => {
                        if (img.verifyState === 0) {
                            img["state"] = false;
                            img.verifyState = 1;
                        }
                    })
                }
                return d;
            })
        }
        return data;
    }

    submitItem(dynamic) {
        let params = {
            id: dynamic.id,
            imgList: dynamic.imgList
        };
        this.req.doPost({
            url: "examineDynamic",
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })

    }

    IsAudit(Audit: number) {
        console.log(this.dynamics)
        if (Audit === 1) {
            return true;
        } else {
            return false;
        }
    }

    combineParams(imgs) {
        if (imgs && imgs.length > 0) {
            for (let img of imgs) {
                if (img["verifyState"] === 0) {
                    img["verifyState"] = 1;
                } else {
                    img["verifyState"] = img["verifyState"] === true ? 1 : 2;
                }
            }
            return imgs;
        }
        return null;
    }

    delItem(id, state, userId) {
        let URL;
        if (state === 0) {
            URL = 'delDynamic';
        } else if (state === 1) {
            URL = 'delDynamicComment';
        }
        if (id) {
            this.req.doPost({
                url: URL,
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.changeData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    showImgMark(img, bool) {
        img.state = bool;
    }

    auditImg(img, i) {
        img.verifyState = i;
        img.state = false;
    }
}
