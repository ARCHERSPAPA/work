import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

export enum ErrorCodeEnum {
  EMPTY = 0,
  NOT_FIND = 404,
  INTERVAL_SERVER = 500
}

export const ErrorMessages = new Map()
  .set(ErrorCodeEnum.EMPTY, "抱歉，未找到相关码提示语")
  .set(ErrorCodeEnum.NOT_FIND, "抱歉，您访问的页面未找到")
  .set(ErrorCodeEnum.INTERVAL_SERVER, "抱歉，服务器发生了错误");


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnInit {

  public errorCode: any;
  public errorMsg: any;
  public errorSrc: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router:Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.errorCode = params && params["code"] ? Number(params["code"]) : 0;
      this.errorMsg = this.getErrorMsg(this.errorCode);
      this.errorSrc = this.getErrorSrc(this.errorCode);
    });
  }


  getErrorMsg(code: number): any {
    switch (code) {
      case ErrorCodeEnum.NOT_FIND:
        return ErrorMessages.get(code);
      case ErrorCodeEnum.INTERVAL_SERVER:
        return ErrorMessages.get(code);
      default:
        return ErrorMessages.get(ErrorCodeEnum.EMPTY);
    }
  }

  getErrorSrc(code:number){
    switch (code) {
      case ErrorCodeEnum.NOT_FIND:
        return "./../assets/views/error_"+code+".png";
      case ErrorCodeEnum.INTERVAL_SERVER:
        return "./../assets/views/error_"+code+".png";
      default:
        return "./../assets/views/error_404.png";
    }
  }

  refresh(){
    window.location.href = window.location.href;
  }

  back(){
    this.router.navigate(["./"])
  }



}
