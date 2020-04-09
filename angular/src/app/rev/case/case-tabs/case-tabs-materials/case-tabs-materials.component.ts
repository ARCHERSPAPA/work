import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../../service/request.service";
import {  ActivatedRoute } from '@angular/router';
import { WarningService } from "../../../../service/warning.service";
import { atob } from "../../../../model/methods";
import { Messages } from "../../../../model/msg";
@Component({
  selector: 'rev-case-tabs-materials',
  templateUrl: './case-tabs-materials.component.html',
  styleUrls: ['./case-tabs-materials.component.scss']
})
export class CaseTabsMaterialsComponent implements OnInit {
  public materialsList;
  public quoteNo: string;
  constructor(
    private req: RequestService,
    private warn: WarningService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params["aid"]) {
        this.quoteNo = atob(params["aid"]);
      }
    })
    this.changeData()
  }
  
  changeData() {
    this.req.doPost({
      url: "smallProgramMaterls",
      data: {
        quoteId: this.quoteNo,
      },
      success: res => {
        if (res && res.code == 200) {
          this.materialsList = res.data;
        } else {
          this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
} 
