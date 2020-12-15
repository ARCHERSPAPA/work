import { Injectable } from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {Messages} from "../../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class ArticleExceptionService {

  constructor(private req:RequestService) { }

    /**
     * 拉取订单异常接口数据
     * @param params
     * @returns {Promise<any>}
     */
  getExpList(params:any):Promise<any>{
     return new Promise((resolve,reject) =>{
       this.req.doPost({
           url:"expOrderList",
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
