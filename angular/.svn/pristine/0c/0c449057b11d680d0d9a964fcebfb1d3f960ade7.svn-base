import {Injectable} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {Messages} from "../../../model/msg";


@Injectable({
    providedIn: 'root'
})
export class ArticleItemService {

    constructor(private req: RequestService) {
    }

    /**
     * 新建项目
     * @param params
     * @returns {Promise<any>}
     */
    createItem(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "buildProject",
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

    /**
     * 拉取项目列表数据
     * @param params
     * @returns {Promise<any>}
     */
    listItem(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url: 'listProject',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        })
    }

    /**
     * 根据项目id，删除
     * @param {number} id
     * @returns {Promise<any>}
     */
    deleteItem(id:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"deleteProject",
                data:{id: id},
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

}
