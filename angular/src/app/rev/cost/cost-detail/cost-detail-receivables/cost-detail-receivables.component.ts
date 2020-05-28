import { Component, OnInit } from '@angular/core';
import {  Default } from "../../../../model/constant";
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import {  ActivatedRoute } from '@angular/router';
import { Messages } from "../../../../model/msg";
@Component({
  selector: 'rev-cost-detail-receivables',
  templateUrl: './cost-detail-receivables.component.html',
  styleUrls: ['./cost-detail-receivables.component.scss']
})
export class CostDetailReceivablesComponent implements OnInit {
  public pageNo: number = Default.PAGE.PAGE_NO;
  public pageSize: number = Default.PAGE.PAGE_SIZE;
  public total: number = Default.PAGE.PAGE_TOTAL;
  public cid;//项目ID

  public receivablesList;
  constructor(private req: RequestService,
    private activatedRoute: ActivatedRoute,
    private warn: WarningService, ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params["cid"]) {
        this.cid = atob(params["cid"]);
      }
    });
    this.changeData();
  }
  changeData() {
    this.req.doPost({
      url: "listReceivables",
      data: {
        id: this.cid
      },
      success: res => {
        if (res && res.code == 200) {
          this.receivablesList=res.data;
          // this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
      } else {
          this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
      }
      }
    }
    )
  }
}
