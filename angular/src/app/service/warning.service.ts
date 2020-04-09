import {Injectable} from '@angular/core';
import {NzNotificationService, NzMessageService} from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class WarningService {
    private duration: number = 2000;

    constructor(private warn: NzNotificationService,
                private message: NzMessageService) {
    }

    onSuccess(msg: string,duration = this.duration) {
        this.warn.success("友情提示", msg, {nzDuration: duration})
    }

    onError(msg: string,duration = this.duration) {
        this.warn.error("错误提示", msg, {nzDuration: duration})
    }

    onWarn(msg: string,duration = this.duration) {
        this.warn.warning("温馨提示", msg, {nzDuration: duration})
    }

    onInfo(msg: string,duration = this.duration) {
        this.warn.success("信息提示", msg, {nzDuration: duration})
    }

    onMsgSuccess(msg: string,duration = this.duration) {
        this.message.success(msg, {nzDuration: duration});
    }

    onMsgError(msg: string,duration = this.duration) {
        this.message.error(msg, {nzDuration: duration});
    }

    onMsgInfo(msg: string,duration = this.duration) {
        this.message.info(msg, {nzDuration: duration});
    }

    onMsgWarn(msg: string,duration = this.duration) {
        this.message.warning(msg, {nzDuration: duration});
    }


}
