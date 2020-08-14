import {Injectable} from '@angular/core';
import {NzNotificationService, NzMessageService, NzModalService} from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class WarningService {
    private duration = 2000;

    private title = '提示';

    constructor(private warn: NzNotificationService,
                private message: NzMessageService,
                private modal: NzModalService) {
    }

    onSuccess(msg: string, duration = this.duration) {
        this.warn.success('友情提示', msg, {nzDuration: duration});
    }

    onError(msg: string, duration = this.duration) {
        this.warn.error('错误提示', msg, {nzDuration: duration});
    }

    onWarn(msg: string, duration = this.duration) {
        this.warn.warning('温馨提示', msg, {nzDuration: duration});
    }

    onInfo(msg: string, duration = this.duration) {
        this.warn.success('信息提示', msg, {nzDuration: duration});
    }

    onMsgSuccess(msg: string, duration = this.duration) {
        this.message.success(msg, {nzDuration: duration});
    }

    onMsgError(msg: string, duration = this.duration) {
        this.message.error(msg, {nzDuration: duration});
    }

    onMsgInfo(msg: string, duration = this.duration) {
        this.message.info(msg, {nzDuration: duration});
    }

    onMsgWarn(msg: string, duration = this.duration) {
        this.message.warning(msg, {nzDuration: duration});
    }

    onModalInfo(obj: any) {
        this.modal.info({
            nzTitle: obj.title?obj.title:'温馨提示',
            nzContent: obj.content,
            nzOnOk: () => {
                obj.ok();
            },
            nzOnCancel: () => {
                obj.cancel();
            }
        });
    }


}
