import {Injectable} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {Messages} from "../../../model/msg";

@Injectable({
    providedIn: 'root'
})
export class PersonnelExamineService {

    constructor(private req: RequestService) {
    }

    /**
     * 保存或者编辑审核流程
     * @param params
     * @returns {Promise<any>}
     */
    saveExamineAudit(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "examineSave",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })

            })
        })
    }

    /**
     * 拉取当前选中的审核项目详情
     * @param {number} eid
     * @returns {Promise<any>}
     */
    getExamineSelected(eid:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"examineSelect",
                data:{id: eid},
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.data);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }



}
