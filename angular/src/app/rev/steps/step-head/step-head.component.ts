import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rev-step-head',
  templateUrl: './step-head.component.html',
  styleUrls: ['../steps.component.scss']
})
export class StepHeadComponent implements OnInit {
  @Input() step:number;
  public title:string;
  public desc:Array<any>;
  constructor() { }

  ngOnInit() {
    this.title = "我要开店";
    this.desc = [
      {
        headline:"阅读开店须知",
        subtitle:"确定商家相关规定"
      },
      {
        headline:"填写基础资料",
        subtitle:"填写企业相关必要资料"
      },
      {
        headline:"申请开店认证",
        subtitle:"需提供相关资料，等待审核通过"
      }
    ]
  }

}
