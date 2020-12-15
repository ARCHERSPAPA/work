import {Injectable} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {Messages} from "../../../model/msg";

@Injectable({
    providedIn: 'root'
})
export class OfferItemService {

    constructor(private req: RequestService) {
    }


    /**
     * 保存总价和备注
     * @param params
     * @returns {Promise<any>}
     */
    setOfferInPriceOrRemark(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "savePriceOrRemark",
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
     * 重新设置设计费
     * @param params
     * @returns {Promise<any>}
     */
    setOfferInDesign(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "costDesign",
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
     * 设置工程管理费用
     * @param params
     * @returns {Promise<any>}
     */
    setOfferInEngineerFee(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "costEngineer",
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
     * 设置增减项目的价格和备注
     * @param params
     * @returns {Promise<any>}
     */
    setOfferByPauseInPriceOrRemark(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"modifyPausePriceAndRemark",
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
     * 修改增减项目中的实付款
     * @param params
     * @param {string} url
     * @returns {Promise<any>}
     */
    setOfferByPauseInPrice(params:any,url:string):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url: url,
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
     * 修改增减项目中的数量
     * @param params
     * @param {string} url
     * @returns {Promise<any>}
     */
    setOfferByPauseInNum(params:any,url:string):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url: url,
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


    setOfferInFormulaAndNum(params:any,meal=false):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url: meal?'modifySplitPla':'updateQuote',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject((res.data?res.data:res.msg) || Messages.FAIL.DATA);
                    }
                })
            });
        })
    }
}
