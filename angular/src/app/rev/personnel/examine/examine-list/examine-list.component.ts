import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../../../service/request.service';

@Component({
  selector: 'app-examine-list',
  templateUrl: './examine-list.component.html',
  styleUrls: ['./../../personnel.component.scss', './examine-list.component.scss']
})
export class ExamineListComponent implements OnInit {
  public title: string;
  public examineList: Array<any>;

  constructor(
    private request: RequestService
  ) { }

  ngOnInit() {
    this.title = '审批流程';

    this.loadExamineList();
    // this.examineList = [{
    //   name: '设计师增项',
    //   id: 1
    // }, {
    //   name: '设计师减项',
    //   id: 22
    // }, {
    //   name: '工长增项',
    //   id: 33
    // }, {
    //   name: '工长减项',
    //   id: 332
    // }];
  }

  loadExamineList() {
    const self = this;

    this.request.doPost({
      url: 'examineList',
      data: {
      }, success: res => {
        // self.examineList = res.data;
        self.examineList = [{
          name: '设计师增项',
          id: 1
        }, {
          name: '设计师减项',
          id: 22
        }, {
          name: '工长增项',
          id: 33
        }, {
          name: '工长减项',
          id: 332
        }];
      }
    });
  }
}
