
import { Component, OnInit } from '@angular/core';
import { Default } from "../../../model/constant";
import { Messages } from "../../../model/msg";
import { RequestService } from "../../../service/request.service";
import { WarningService } from "../../../service/warning.service";
import { btoa, getCaseName } from "../../../model/methods";

@Component({
  selector: 'rev-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {


  public title: string;
  public radioSwitch = [{
      key: 0,
      text: '未发布'
  }, {
      key: 1,
      text: '已发布'
  }];
  //审核状态(auditState:1->待审，0->全部)
  public caseState: number = 0;
  public searchType: any;

  //分页
  public pageNo: number = Default.PAGE.PAGE_NO;
  public pageSize: number = Default.PAGE.PAGE_SIZE;
  public total: number = Default.PAGE.PAGE_TOTAL;


  public caseList: any;

  constructor(private request: RequestService,
      private warn: WarningService) {
  }

  ngOnInit() {

      this.title = "案例列表";
      this.changeData();
  }


  handleSwitch(status: number) {
      this.selectAudit(status);
  }


  changeData(type = false) {
      let pageNo
      if (type) {
          pageNo = 1
      } else {
          pageNo = this.pageNo
      }
      this.request.doPost({
          url: "smallProgramList",
          data: {
              page: pageNo,
              pageSize: this.pageSize,
              isDown: this.caseState,
              name: this.searchType
          },
          success: (res => {
              if (res && res.code == 200) {
                  this.caseList = res.data.list;
                  this.total = res.data.total;
              } else {
                  this.warn.onError(res.msg || Messages.FAIL.DATA);
              }
          })
      })
  }


  selectAudit(state: number) {
      this.caseState = state;
      this.pageNo = Default.PAGE.PAGE_NO;
      this.pageSize = Default.PAGE.PAGE_SIZE;
      this.changeData();
  }

  /**
   * url中加密
   * @param {string} id
   * @returns {any}
   */
  btoa(id: string) {
      return btoa(id);
  }
getcaseName(state){
return getCaseName(state)
}
}
