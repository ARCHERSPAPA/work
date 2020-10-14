import { Injectable } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class TempSuitEditService {

  constructor(private req:RequestService) { }
    /**
     * 套装头部数据
     * @param sid
     * @returns {Promise<any>}
     */
    getHeadInfo(sid):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"packageInfoListBySuit",
                data: {id: sid},
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
     * 套装头部数据修改
     * @param params
     * @returns {Promise<any>}
     */
    modifyTitle(params):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"addPackageByReady",
                data:params,
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
     * 套装新增或修改大类
     * @param url params
     * @returns {Promise<any>}
     */
    operatePackageInfo(url:string,params:any):Promise<any>{
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

    /**
     * 套装删除大类或小类
     * @param id
     * @returns {Promise<any>}
     */
    delOperate(id:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:'deletePackageInfoBySuit',
                data: {id},
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
     * 套装添加添加小类
     * @param params
     * @returns {Promise<any>}
     */
    addOperate(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:'addsuiteBaseBySuit',
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
     * 整装价格范围列表
     * @param id
     * @returns {Promise<any>}
     */
    getPriceList(id:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:'packagePriceList',
                data: {id},
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
     * 整装价格列表新增或编辑
     * @param url params
     * @returns {Promise<any>}
     */
    addPriceData(url:string,params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url,
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
     * 整装价格列表操作
     * @param url params
     * @returns {Promise<any>}
     */
    handleOperate(url:string,params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url,
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

    

}
