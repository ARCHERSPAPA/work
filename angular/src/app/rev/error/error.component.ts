import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Messages} from '../../model/msg';
import {CheckService} from '../..//service/check.service';

@Component({
  selector: 'rev-error',
  // templateUrl: './error.component.html',
  template: `
      <dl class="error_msg">
        <dt class="title">{{text}}</dt>
        <dd class="msg">将<span>{{seconds > 9?seconds:'0'+seconds}}</span>秒后返回首页</dd>
        <dd class="msg">
            <a href="javascript:void(0)" (click)="home()">返回首页</a>
            <a href="javascript:void(0)" (click)="refresh()">刷新</a>
        </dd>
    </dl>
  `,
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public text: string = Messages.LOADING;
  public seconds = 60;

  private tick: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private check: CheckService) { }

  ngOnInit() {
     this.activatedRoute.queryParams.subscribe((params) => {
         if (params && params['keyword']) {
             this.text = params['keyword'];
         } else {
             this.text = Messages.ERROR_TEXT;
         }
     });
     this.start();
  }

  start() {
     this.tick = setInterval(() => {
         this.seconds --;
         if (this.seconds <= 0) {
             this.router.navigate(['/']);
            clearInterval(this.tick);
         }
      }, 1000);
  }

  home() {
      clearInterval(this.tick);
      this.check.isLogin = false;
      this.router.navigateByUrl('/');
  }

  refresh() {
      window.location.href = window.location.href;
  }

}
