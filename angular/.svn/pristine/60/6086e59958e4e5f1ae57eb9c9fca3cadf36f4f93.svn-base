import { Component, OnInit } from '@angular/core';
import {InfoComponent} from '../../../../plugins/info/info.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from '../../../../service/request.service';
@Component({
  selector: 'app-examine-add',
  templateUrl: './examine-add.component.html',
  styleUrls: ['./examine-add.component.scss']
})
export class ExamineAddComponent implements OnInit {
  public title: string;
  public personList: Array<any>;

  public radioValue = 'A';
  style = {
    display   : 'block',
    height    : '30px',
    lineHeight: '30px'
  };

  constructor(
      private modal: NgbModal,
      private request: RequestService
  ) { }

  ngOnInit(): void {
    this.title = '编辑';

    this.loadExamineSelect();

  }

  handleClose(index) {
    this.personList.splice(index, 1);
  }

  handleAddPerson() {
    const that = this;
    const info = that.modal.open(InfoComponent, {
      centered: true,
      keyboard: true,
      backdrop: 'static'
    });
    info.componentInstance.type = 2;
  }

  loadExamineSelect() {
    const self = this;

    this.request.doPost({
      url: 'examineSelect',
      data: {
      }, success: res => {
        self.personList = [{
          name: '找地方',
          job: '设计总监',
          img: 'http://pic4.zhimg.com/50/v2-823f52256c4db5dd8ba72bca329e31be_hd.jpg'
        }, {
          name: '经济',
          job: '技术总监',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589435984587&di=c18152d4565b6' +
              '05e953021d99e349044&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fupload%2F20170731%2F4c79a1758' +
              'a3a4c0c92c26f8e21dbd888_th.jpg'
        }];
      }
    });
  }

  handleExamineSave() {
    const self = this;

    this.request.doPost({
      url: 'examineSave',
      data: {
      }, success: res => {
        self.personList = [{
          name: '找地方111',
          job: '设计总监',
          img: 'http://pic4.zhimg.com/50/v2-823f52256c4db5dd8ba72bca329e31be_hd.jpg'
        }];
      }
    });
  }

}
