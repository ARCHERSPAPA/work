import { Injectable } from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {Messages} from "../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class MasterComboService {

  constructor(private req:RequestService) { }

  getCombos():Promise<any>{
    return new Promise((resolve,reject) =>{
      this.req.doPost({
          url:"comboList",
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
     * 根据选中的套系返回选中套系的ids
     * @param combos
     * @returns {any[]}
     */
  getComboIds(combos:Array<any>){
    const ids = [];
    if(combos && combos.length > 0){
        combos.forEach(combo =>{
          ids.push(combo.id);
        })
    }
    return ids;
  }

}
