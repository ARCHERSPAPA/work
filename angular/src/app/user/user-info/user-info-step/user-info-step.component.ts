import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rev-user-info-step',
  templateUrl: './user-info-step.component.html',
  styles: [`
      .user-step{
         padding:72px 156px;
         background: transparent
      }
  `]
})
export class UserInfoStepComponent implements OnInit {
      @Input() currentIndex: number;

  public steps: Array<any>;

  constructor() { }

  ngOnInit() {
    this.steps = [
        {
          title: '填写帐号'
        },
        {
          title: '验证手机'
        },
        {
          title: '重置密码'
        }
    ];
  }

}
