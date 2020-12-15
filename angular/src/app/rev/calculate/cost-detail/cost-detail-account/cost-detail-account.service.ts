import { Injectable } from '@angular/core';
import {Messages} from "../../../../model/msg";
import {RequestService} from "../../../../service/request.service";

@Injectable({
  providedIn: 'root'
})
export class CostDetailAccountService {

  constructor(private req:RequestService) { }

    /**
     * 根据参数获取当前成本的信息数据
     * @param qid
     * @returns {Promise<any>}
     */
    getCostDetailAccount(qid:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoList",
                data:{quoteId: qid},
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
     *  删除当前审核成本细项
     * @param params
     * @param {number} type
     * @returns {Promise<any>}
     */
    getCostDetailDelete(params:any,type:number = 0):Promise<any>{
      return new Promise((resolve,reject) =>{
        this.req.doPost({
            url: type === 0?"costInfoDelete":"costInfoCategoryDelete",
            data:params,
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

    /**
     * 根据报价id获取当前详情中成本总计及相关数据
     * @param {number} id 报价id
     * @returns {Promise<any>}
     */
    getCostDetailAmount(id:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoAmount",
                data:{quoteId: id},
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
     * 根据不同的实参来实现对成本审核项目的
     * @param params
     * @returns {Promise<any>}
     */
    getCostDetailUpdate(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoEdit",
                data: params,
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

    /**
     * 新增或者修改大项
     * @param params
     * @returns {Promise<any>}
     */
    setCostDetailBranch(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoBranch",
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
     * 添加项目到大项中去
     * @param params
     * @returns {Promise<any>}
     */
    addCostDetailBranch(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoAdd",
                data: params,
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

    /**
     * 移动细项到相应的模块
     * @param params
     * @returns {Promise<any>}
     */
    setCostDetailMove(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costInfoMove",
                data: params,
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

    /**
     * 提交到工长
     * @param params
     * @returns {Promise<any>}
     */
    sendToForeman(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"sendCost",
                data: params,
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

    /**
     * 更新或者编辑修改套餐信息
     * @param params
     * @returns {Promise<any>}
     */
    getCostDetailUpdatePack(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costPackUpdate",
                data: params,
                success:(res => {
                    if(res && res.code == 200){
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 删除成本详情中的套餐信息
     * @param params
     * @returns {Promise<any>}
     */
    getCostDetailDeletePack(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costPackDelete",
                data: params,
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

    /**
     * 在成本详情中的套餐添加
     * @param params
     * @returns {Promise<any>}
     */
    getCostDetailAddPack(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costPackAdd",
                data: params,
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

    /**
     * 单独修改和更新备注、折扣等
     * @param params
     * @returns {Promise<any>}
     */
    getCostDetailOverview(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costOverview",
                data: params,
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

    /**
     * 重签成本
     * @param cid
     * @returns {Promise<any>}
     */
    getCostDetailResign(cid:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costResign",
                data: {quoteId:cid},
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    }else{
                        reject([res.code,res.msg]);
                    }
                })
            })
        })
    }

    /**
     * 查询材料参与的活动
     * @param mid
     * @returns {Promise<any>}
     */
    getMaterialActivity(mid:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costActivityInfo",
                data: {materialId:mid},
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.data || Messages.SUCCESS.DATA);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 查询不计总额的项目
     * @param id
     * @returns {Promise<any>}
     */
    getExcludeInfo(id:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"costExcludeInfo",
                data: {quoteId:id},
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res.data || Messages.SUCCESS.DATA);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 不计总额的项目操作
     * @param params
     * @param str
     * @returns {Promise<any>}
     */
    operateExcludeInfo(params:any,str:string):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:str === 'save' ? "costExcludeSave":"costExcludeDelete",
                data: params,
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
