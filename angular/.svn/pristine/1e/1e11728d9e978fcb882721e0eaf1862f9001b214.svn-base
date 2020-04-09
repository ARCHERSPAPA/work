import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {WarningService} from "./warning.service";
import {Messages} from "../model/msg";

@Injectable({
  providedIn: 'root'
})
export class MakeService {

  private makings:Array<any> = [];
  private showMakes:Array<any> = [];



  constructor(private req:RequestService,
              private warn:WarningService) { }


  getMarkings(){
      return this.makings;
  }

  addMakings(data){
      if(this.makings && this.makings.length === 0){
          for(let d of data){
              d["num"] = 1;
              this.makings.push(d);
          }
      }

      if(this.makings &&  this.makings.length > 0){
          for(let d of data){
              d["num"] = 1;
              if(!this.existMakingById(d.id)){
                  this.makings.push(d);
              }
          }
      }
  }

  setMarking(data){
      this.makings = [];
      if(data && data.length > 0){
          for(let d of data){
              d["num"] = 1;
              this.makings.push(d);
          }
      }
  }

  existMakingById(id){
      if(this.makings && this.makings.length > 0){
          for(let making of this.makings){
              if(making.id === id ) return true;
          }
      }
      return false;

  }

  resetMakingRemark(){
      if(this.makings && this.makings.length > 0){
          this.makings.forEach(making =>{
              making.remark = "";
          })
      }
  }

  // loadMaterialByAll(params){
  //     if(params && params["versionId"]){
  //        if(!this.findMaterialByAll(params["versionId"],params["pageSize"])){
  //            this.req.doPost({
  //                url:"moduleListQuote",
  //                data:params,
  //                success:(res =>{
  //                    if(res && res.code == 200){
  //                        if(res.data && res.data.pageSet){
  //                            this.addMakings(res.data.pageSet);
  //                        }
  //                    }else{
  //                        this.warn.onError(res.msg || Messages.FAIL.DATA);
  //                    }
  //                })
  //            })
  //        }
  //     }
  // }


  findMaterialByAll(versionId,length){
      if(this.makings && this.makings.length > 0){
          let m = [];
          for(let make of this.makings){
              if(make["versionId"] == versionId){
                  m.push(make);
              }
          }
          return m.length === length;
      }
      return false;
  }

}
