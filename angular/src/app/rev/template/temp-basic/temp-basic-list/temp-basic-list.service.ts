import { Injectable } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class TempBasicListService {

  constructor(private req:RequestService) { }

    /**
     * 创建基装
     * @param params
     * @returns {Promise<any>}
     */
    modifyTitle(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"addVersion",
                data: params,
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.msg);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }
    /**
     * 基装列表信息
     * @param params
     * @returns {Promise<any>}
     */
    getVersionMouldList(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"versionMouldList",
                data: params,
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

    /**
     * 表格操作
     * @param url params
     * @returns {Promise<any>}
     */
    tableOperate(url:string,params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:url,
                data: params,
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.msg);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }


}
