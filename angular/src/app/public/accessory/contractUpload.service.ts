import {Injectable} from '@angular/core';
import {RequestService} from "../../service/request.service";
import {Messages} from "../../model/msg";

@Injectable({
    providedIn: 'root'
})
export class ContractUploadService {

    constructor(private req: RequestService) {
    }


    /**
     * 拉取套餐管理的数据列表
     * @param pramas
     * @returns {Promise<any>}
     */
    getAccessoryList(params: any): Promise<any> {
        console.log(params)
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "accessoryList",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

 

}
