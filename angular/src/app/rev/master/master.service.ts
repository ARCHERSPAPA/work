import { Injectable } from '@angular/core';
import {RequestService} from "../../service/request.service";
import {Messages} from "../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private req:RequestService) { }


    /**
     * 获取当前公司所有的合作商
     * @returns {Promise<any>}
     */
  getCompanys():Promise<any>{
    return new Promise((resolve,reject) =>{
        this.req.doPost({
            url:"materialSupplierListBySelect",
            data:{},
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
     * 根据选中的套系对象数组，获取对应就的ids数组
     * @param combos
     * @returns {any[]}
     */
    getComboIds(combos: any) {
        const ids = [];
        if (Array.isArray(combos) && combos && combos.length > 0) {
            combos.forEach(combo => {
                if(combo && combo.id){
                    ids.push(combo.id);
                }
            })
        }
        return ids;
    }


    getCategoriesByType(type:number):Promise<any>{
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
     * 根据类别获得相应的品牌数据
     * @param {number} cid
     * @returns {Promise<any>}
     */
    getBrands(cid:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"getMaterialBrand",
                data:{id: cid},
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
