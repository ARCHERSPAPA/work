import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {WarningService} from './warning.service';
import {Messages} from '../model/msg';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private req: RequestService) {
    }

    /**
     * 拉取配制 v2.2.7
     * @param id
     * @returns {Promise<any>}
     */
    loadConfig(id:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: 'configQuote',
                data: {id: id},
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        })
    }

    /**
     * v2.2.9 新版本中的类型
     * @param {number} id
     * @returns {Promise<any>}
     */
    loadReConfig(id:number):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"configReQuote",
                data:{id:id},
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
