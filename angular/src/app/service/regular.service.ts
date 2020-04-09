import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {WarningService} from "./warning.service";
import {Messages} from "../model/msg";

@Injectable({
    providedIn: 'root'
})
export class RegularService {

    private changeData: object = {
        //拉取详情(当前操作)
        detail: false,
        //拉取历史数据
        history:false,
        //数据联动变化
        change:false
    };

    constructor(private req: RequestService) {
    }

    loadDetail(aid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "detailPause",
                data: {pauseId: aid},
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        });

    }

    setTypeByParam(type: string, bool: boolean) {
        this.changeData[type] = bool;
    }

    getTypeByParam(type: string) {
        return this.changeData[type];
    }

}
