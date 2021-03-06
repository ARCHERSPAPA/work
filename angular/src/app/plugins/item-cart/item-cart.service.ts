import {Injectable} from '@angular/core';
import {RequestService} from "../../service/request.service";
import {Messages} from "../../model/msg";

@Injectable({
    providedIn: 'root'
})
export class ItemCartService {

    constructor(private req: RequestService) {
    }


    /**
     * 根据类型拉取材料中的类别
     * @param {number} type 1：主材，2：辅材，3：软材
     * @returns {Promise<any>}
     */
    getMaterialCategory(type: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "getMaterialCategory",
                data: {type: type},
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
     * 拉取基础库中的类别
     * @returns {Promise<any>}
     */
    getBasicCategory(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "versionSuiteCategory",
                data: {},
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
     * 根据所选版本id拉取对应的类别
     * @param {number} vid 版本id
     * @returns {Promise<any>}
     */
    getCategory(vid: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "categoryList",
                data: {versionId: vid},
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
     * 当前新的材料清单加载详情(主材总览数据) v2.2.9版本使用
     * @param params
     * @returns {Promise<any>}
     */
    getMaterialDetail(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"materialDetailQuery",
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
     * v2.2.9版本中选择基装时调用的数据信息
     * @param params
     * @returns {Promise<any>}
     */
    getQuoteDetail(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"versionMouldInfoList",
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
     * 加载以前的报价详情中的数据详情v2.2.9 以前版本
     * @param params
     * @returns {Promise<any>}
     */
    getQuoteModules(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"moduleListQuote",
                data:params,
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
     * 拉取套系数据信息
     * @returns {Promise<any>}
     */
    getCombos():Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url: 'comboList',
                success: res => {
                    if (res && res.code == 200) {
                       resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        })
    }

    /**
     *
     */
    getBaseVersions():Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:""
            })
        })
    }

}
