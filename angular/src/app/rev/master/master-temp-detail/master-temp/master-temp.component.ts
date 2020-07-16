import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { btoa } from '../../../../model/methods';
import { RequestService } from '../../../../service/request.service';
import { Messages } from '../../../../model/msg';
import { WarningService } from '../../../../service/warning.service';
@Component({
  selector: 'rev-master-temp',
  templateUrl: './master-temp.component.html',
  styleUrls: ['./master-temp.component.scss', '../../master.component.scss']
})
export class MasterTempComponent implements OnInit {

  public departTempList;
  public title: string;
  public buttons;
  constructor(
    private router: Router,
    private req: RequestService,
    private warn: WarningService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.title = '主材模板';
    this.buttons = [{
      color: 'btn-primary',
      name: '新建'
    }];
    this.changeData();
  }
  changeData() {
    this.req.doPost({
      url: 'masterTempList',
      success: res => {
        if (res && res.code == 200) {
          this.departTempList = res.data;
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  handleName($event) {
    this.router.navigate(['./../add'], { relativeTo: this.activatedRoute });

  }

  delTemp(id) {
    this.req.doPost({
      url: 'masterTempDel',
      data: {
        id: id
      },
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS);
          this.changeData();
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  btoa(id: string) {
    return btoa(id);
  }
  default(id) {
    console.log(id)
    this.req.doPost({
      url: 'masterTempDefault',
      data: {
        id: id
      },
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS);
          this.changeData();
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
}

