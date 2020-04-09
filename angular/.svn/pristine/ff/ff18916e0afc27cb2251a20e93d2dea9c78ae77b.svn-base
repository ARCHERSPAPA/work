import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Urls } from "./../model/urls";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getHost(){
    if(environment.production){
        return environment.config.apiUrl
    }else{
        return environment.config.apiUrl;
    }
  }

  getHostApp(){
      if(environment.production){
          return environment.config.appUrl;
      }else{
          return environment.config.appUrl;
      }
  }

  getUrl(name:string){
    return this.getHost() + Urls[name];
  }

  getApp(name:string){
      return this.getHostApp() + Urls[name];
  }
}
