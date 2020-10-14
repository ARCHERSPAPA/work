import { Injectable } from '@angular/core';
import {RequestService} from "../../service/request.service";
import {Messages} from "../../model/msg";

@Injectable({
  providedIn: 'root'
})
export class ItemDetailService {

  constructor(private req:RequestService) { }

    /**
     *  that.request.doPost({
                    url: 'addPause',
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            //存储你的查询信息
                            this.buffer.setBuffer(this.bufferName,
                                {
                                    versionId: this.versionId,
                                    category: this.category,
                                    projectName: this.projectName
                                });
                            // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            that.resetIds();
                            that.modal.close(res);
                        } else {
                            that.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
     */

    /**
     * 添加细项到增减项目中去
     * @param params
     * @returns {Promise<any>}
     */
    addItemsToPause(params:any):Promise<any>{
      return new Promise((resolve,reject) =>{
        this.req.doPost({
            url:"addPause",
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
