import { Injectable } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class TempSuitListService {

  constructor(private req:RequestService) { }
    /**
     * 套装创建
     * @param params
     * @returns {Promise<any>}
     */
    createVersion(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"addPackageBySuit",
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
     * 获取套装列表
     * @param params
     * @returns {Promise<any>}
     */
    getVersionPackageList(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"packageListBySuit",
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
     * 套装上、下架、删除、复制
     * @param url,params
     * @returns {Promise<any>}
     */
    operatePackage(url:string,params:any):Promise<any>{
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
