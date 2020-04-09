import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {WarningService} from "./warning.service";
import {Messages} from "../model/msg";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private examList:Array<any>;

  constructor(private req:RequestService,
              private warn:WarningService) { }


  loadExamList(id,state){
      if(id){
          this.req.doPost({
              url:"detailMemberExam",
              data:{
                  id: id,
                  state: state
              },
              success:(res =>{
                  if(res && res.code == 200){
                      this.setExamList(res.data);
                  }else{
                      this.warn.onError(res.msg ||  Messages.FAIL.DATA);
                  }
              })
          })
      }
  }

  getExamList(){
      return this.examList;
  }

  setExamList(list){
      this.examList = list;
  }


}
