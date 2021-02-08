import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(private req:RequestService) { }

  checkLogin(){
    // this.req.doPost({})
  }

}
