import { Injectable } from '@angular/core';
import {AmapGeocoderService, AmapGeocoderWrapper} from 'ngx-amap';

@Injectable({
  providedIn: 'root'
})
export class LocateService {

  private pluginGeo:Promise<AmapGeocoderWrapper>;

  public firstInfo:string;
  public lastInfo:string;

  constructor(private  AmapGeocoder: AmapGeocoderService) {
      this.pluginGeo = AmapGeocoder.of();
  }


  firstLocation(point:any){
      if(point){
          this.pluginGeo.then(gps => gps.getAddress(point))
              .then(data =>{
                  if(data.status === "complete" && data.result.info === "OK"){
                      this.setFirstInfo(data.result.regeocode.formattedAddress);
                  }
              });
      }
  }

  lastLocation(point:any){
      if(point){
          this.pluginGeo.then(gps => gps.getAddress(point))
              .then(data =>{
                  if(data.status === "complete" && data.result.info === "OK"){
                      this.setLastInfo(data.result.regeocode.formattedAddress);
                  }
              });
      }
  }

  getFirstInfo(){
      return this.firstInfo;
  }

  getLastInfo(){
      return this.lastInfo;
  }

  setFirstInfo(info){
      this.firstInfo = info;
  }

  setLastInfo(info){
      this.lastInfo = info;
  }

}
