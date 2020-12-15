import {Injectable} from '@angular/core';
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";

@Injectable({
    providedIn: 'root'
})
export class MasterPromotionDetailService {

    constructor(private req: RequestService,) {
    }


    /**
     * 添加基础数据到活动中去
     * @param params
     * @returns {Promise<any>}
     */
    addMasterPromotionMaterials(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "addMasterToActivity",
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
     * 删除活动中的细项数据
     * @param params
     * @returns {Promise<any>}
     */
    deleteMasterPromotionMaterials(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "activityMasterDel",
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
     * 删除活动中的细项数据
     * @param params
     * @returns {Promise<any>}
     */
    removeMasterPromotionMaterials(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "activityMasterRm",
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
     * 修改活动
     * @param params
     * @returns {Promise<any>}
     */
    updateMasterPromotionMaterials(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionUpdate",
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
     * 详情中的tab切换
     * @param {string} url
     * @param params
     * @returns {Promise<any>}
     */
    tabMasterPromotionMaterials(url: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: url,
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
     * 提交审核
     * @param params
     * @returns {Promise<any>}
     */
    auditMasterPromotion(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "auditMasterInActivity",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.SUCCESS.DATA);
                    }
                })
            })
        })
    }


    /**
     * 撤回与下架共用(活动)
     * @param params
     * @returns {Promise<any>}
     */
    backMasterPromotions(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionBack",
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
     * 提交活动
     * @param params
     * @returns {Promise<any>}
     */
    submitMasterPromotions(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionSubmitAudit",
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
     * 删除活动
     * @param params
     * @returns {Promise<any>}
     */
    deleteMasterPromotions(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionDel",
                data: params,
                success: (res => {
                    console.log(res);
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
     * 新建活动
     * @param params
     * @returns {Promise<any>}
     */
    addMasterPromotion(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionAdd",
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
     * 渲染活动列表数据信息
     * @param params
     * @returns {Promise<any>}
     */
    listMasterPromotions(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "promotionList",
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
     * 修改细项目中的某个价格
     * @param params
     * @returns {Promise<any>}
     */
    updateMasterPromitionInPrice(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"updateMasterActivityPrice",
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

        /**
         this.req.doPost({
                    url:"updateMasterActivityPrice",
                    data:{
                        id: this.id,
                        activityPrice: this.num
                    },
                    success:(res =>{
                        if(res && res.code == 200){
                            this.changeValue.emit({
                                value: this.el.nativeElement.value
                            })
                        }else{
                            this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
         */
    }

}
