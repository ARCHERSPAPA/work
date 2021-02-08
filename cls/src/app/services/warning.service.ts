import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class WarningService {

  constructor(private message: NzMessageService) { }

  //警告（主要用于前端自定义信息）
  onWarn(msg:string,duration:number = 2000){
    const id = this.message.warning(msg,{ nzDuration: 0 }).messageId;
    setTimeout(() =>{
      this.message.remove(id);
    },duration);
  }

  //错误（用于后端反馈错误信息）
  onError(msg:string,duration:number = 2000){
    const id = this.message.error(msg,{ nzDuration: 0 }).messageId;
    setTimeout(() =>{
      this.message.remove(id);
    },duration);
  }

  //成功（用于后端反馈的成功信息）
  onSuccess(msg:string,duration:number = 2000){
    const id = this.message.success(msg,{ nzDuration: 0 }).messageId;
    setTimeout(() =>{
      this.message.remove(id);
    },duration);
  }

  //一般信息提示（用于前端自定义的信息）
  onInfo(msg:string,duration:number = 2000){
    const id = this.message.info(msg,{ nzDuration: 0 }).messageId;
    setTimeout(() =>{
      this.message.remove(id);
    },duration);
  }

}
