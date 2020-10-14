import { Injectable } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class TempPackListService {

  constructor(private req:RequestService) { }
    /**
     * 整装创建
     * @param params
     * @returns {Promise<any>}
     */
    createVersion(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"addPackageByReady",
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
     * 获取整装列表
     * @param params
     * @returns {Promise<any>}
     */
    getVersionPackageList(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"packageListByReady",
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
     * 整装上、下架、删除、复制
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
