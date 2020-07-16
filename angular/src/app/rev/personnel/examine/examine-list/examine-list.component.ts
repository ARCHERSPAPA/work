import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-examine-list',
  templateUrl: './examine-list.component.html',
  styleUrls: ['./../../personnel.component.scss', './examine-list.component.scss']
})
export class ExamineListComponent implements OnInit {
  public title: string;
  public examineList: Array<any>;

  constructor(private request: RequestService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.title = '审批流程';

    this.loadExamineList();
  }

  loadExamineList() {
    // todo 4.审批流程增加退单
    const self = this;
    this.request.doPost({
      url: 'examineList',
      data: {
      }, success: res => {
        self.examineList = res.data;
      }
    });
  }

    /**
     * 根据不同类和参数渲染文案
     * @param type
     * @param args
     * @returns {string}
     */
  getRenderName(type, ...args) {
    switch (type) {
        case 1:
          return (args.length > 0 && args[0] === 1 ? '设计师' : '工长') + '增项';
        case 2:
          return (args.length > 0 && args[0] === 1 ? '设计师' : '工长') + '减项';
        case 3:
          return '客户退款';
    }
  }

    /**
     *  [routerLink]="['../add']" [queryParams]="{examineId:data.id,examineName:(data.workName === 1?'设计师':'工长') + (data.type === 1?'增项':'减项')}"
     * @param data
     */
  editItem(data) {
      this.router.navigate(['./../add'], {
        queryParams: {
            examineId: data.id,
            examineName: this.getRenderName(data.type, data.workName)
        },
          relativeTo: this.activatedRoute,
          skipLocationChange: true
      });
  }

}
