import {Injectable} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {Messages} from "../../configs/messages";

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(private req: RequestService) {
  }


  getUserInfo():Promise<any>{
    return new Promise((resolve, reject) => {
      return this.req.doPost({
        url: "userHomeInfo",
        data: {}
      }).subscribe(data => {
        if(data.body && data.body.code === 200){
          resolve(data.body.data);
        }else{
          reject(data.msg ||Messages.fail)
        }
      })
    })
  }


}
