import { Component, OnInit } from '@angular/core';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { ActivatedRoute } from '@angular/router';
import { Messages } from "../../../../model/msg";
@Component({
  selector: 'rev-cost-detail-disclose',
  templateUrl: './cost-detail-disclose.component.html',
  styleUrls: ['./cost-detail-disclose.component.scss']
})
export class CostDetailDiscloseComponent implements OnInit {
  public _albums = [];
  public cid;//主键ID
  public discloseList;
  constructor(
    private _lightbox: Lightbox,
    private req: RequestService,
    private activatedRoute: ActivatedRoute,
    private warn: WarningService,
  ) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params["cid"]) {
        this.cid = atob(params["cid"]);
      }
    });
    this.changeData();
  }
  styleLicense(src:string) {
    return { 'background-image': 'url(' + src + ')' };
  }

  changeData() {
    this.req.doPost({
      url: "listGetRecord",
      data: {
        quoteId: this.cid
      },
      success: res => {
        if (res && res.code == 200) {
          this.discloseList = res.data;
        } else {
          this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        }
      }
    }
    )
  }
  /**
   * 
   * @param time   计算出交底的天数
   */

  getDiscloseTime(time: number) {
    return Math.round((Date.now() - time) / 1000 / 60 / 60 / 24)
  }

  openModal(src: Array<any>, index) {
    this._albums = []
    src.forEach((i) => {
      this._albums.push({ src: i.imageAddress })
    })
    this._lightbox.open(this._albums, index);
  }
}
