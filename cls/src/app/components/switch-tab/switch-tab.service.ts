import { Injectable } from '@angular/core';
import {IRadio} from "./switch-tab.component";


@Injectable({
  providedIn: 'root'
})
export class SwitchTabService {

  constructor() { }


  /**
   * 切换switch 开关时调用
   * @param {Array<ISwitchTab>} switches
   * @param {string} key
   * @returns {any} 调用时的数据
   */
  resetSwitch(switches:Array<IRadio>,key:string){
     if(switches && switches.length > 0){
       return switches.map((s:IRadio) =>{
          s.selected = s.key === key;
          return s;
       })
     }
     return switches;
  }

}
