import { Component, OnInit,OnDestroy,Input,Output,EventEmitter } from '@angular/core';
import { AmapGeocoderService, AmapGeocoderWrapper,AmapAutocompleteService,AmapAutocompleteWrapper } from 'ngx-amap';
import { Subscription } from 'rxjs';
// import {Messages} from "../../model/msg";

@Component({
    selector: 'rev-gps',
    templateUrl: './gps.component.html',
    styles:[
        `.amap-sug-result{
            z-index: 2048;
        }
        .error{
            font-size: 12px;
            color: #eb0000;
        }
        `
    ]
})
export class GpsComponent implements OnInit,OnDestroy{
    //传入的坐标信息
    @Input() location:any;
    //交互付出信息
    @Output() gpsEmitter = new EventEmitter<any>();
    /***提示信息***/
    // public msg:string;
    /***搜索地址栏***/
    public address:string;
    /***定位***/
    public point: any;
    /***显示文字***/
    public _subscription: Subscription;
    public locationInfo: string;
    public pluginGeo: Promise<AmapGeocoderWrapper>;
    public pluginAuto:Promise<AmapAutocompleteWrapper>;


    //地图图标显示
    // public infoWindow:any;

    constructor(private  AmapGeocoder: AmapGeocoderService,
                private AmapAutocomplete:AmapAutocompleteService) {
        /***实例化***/
        this.pluginGeo = AmapGeocoder.of();

        // this.infoWindow = new AMap.InfoWindow({
        //     autoMove: true,
        //     offset: {x: 0, y: -30}
        // });

    }

    ngOnInit() {
        this.pluginAuto = this.AmapAutocomplete.of({
            input: 'geography'
        });
        // this.address = this.site;
        // console.log(this.site);
        // console.log(this.location);
        if(this.location){
            let local = JSON.parse(this.location);
            this.point = [Number(local.lng),Number(local.lat)];
            this.address = local.address;
            this.locationInfo = local.address;
            this.query();
        }
        this.pluginAuto.then(autocomplete => {
            this._subscription = autocomplete.on('complete').subscribe(event => {
                // console.log("complete=========");
                // console.log(event);
                // console.log(event.info);
                // if(event.info === 'NO_DATA'){
                //     this.getLocation(event);
                // }
                // console.log(event);


                // if(event.info === 'ok'){
                //     this.point = event.poi?event.poi.location:null;
                //     this.locationInfo = this.getAssembleAddress(event);
                //     this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode: event.poi.adcode}));
                // }
            });

            this._subscription.add(autocomplete.on('error').subscribe(event => {
                // console.log(event);
                if(event.info != 'NO_DATA'){
                    this.point = event.poi?event.poi.location:null;
                    this.locationInfo = this.getAssembleAddress(event);
                    this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode: event.poi.adcode}));
                }else{
                    // this.showMsg();
                }
                // this.getLocation(event);
            }));

            this._subscription.add(autocomplete.on('select').subscribe(event =>{
                // console.log(event);
                if(event.info != 'NO_DATA'){
                    this.point = event.poi?event.poi.location:null;
                    this.locationInfo = this.getAssembleAddress(event);
                    this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode: event.poi.adcode}));
                }
                // this.getLocation(event);
            }));

            this._subscription.add(autocomplete.on('choose').subscribe(event => {
                if(event.info != 'NO_DATA'){
                    this.point = event.poi?event.poi.location:null;
                    this.locationInfo = this.getAssembleAddress(event);
                    this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode: event.poi.adcode}));
                }
                this.getLocation(event);
            }));
        });
    }


    /****搜索***/
    query(){
        if(this.address){
            this.pluginGeo.then(gps => gps.getLocation(this.address))
                .then(data =>{
                    // console.log(data);
                    if(data.status === "complete" && data.result.info === "OK"){
                        // this.point = this.point?this.point:data.result.geocodes[0].location;
           
                        this.point = data.result.geocodes[0].location;
                        console.log(data.result)
                        // console.log(this.point);
                        let address = data.result.geocodes[0].formattedAddress;
                        this.locationInfo = address?address:this.locationInfo;
                        // this.locationInfo = this.address;
                        this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode:data.result.geocodes[0].adcode}));
                    }
                })
        }

        // console.log(this.location);

        // if(this.point){
        //     this.pluginGeo.then(gps => gps.getAddress(this.point))
        //         .then(data =>{
        //             this.getLocation(data);
        //         })
        // }
    }

    onMapEvent(event){
        this.point = event.lnglat;
        if(this.point){
            this.pluginGeo.then(gps => gps.getAddress(this.point))
                .then(data =>{
                    this.getLocation(data);
                })
        }

    }


    getLocation(data){
        // console.log("get location .....");
        // console.log(data);
        if(data.status && data.status === "complete" && data.result.info === "OK"){
            this.locationInfo = data.result.regeocode.formattedAddress;
            this.address = this.locationInfo;
            this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode: data.result.regeocode.addressComponent.adcode}));
        }
        // if(data.info && data.info != 'NO_DATA'){
        //     this.point = data.poi?data.poi.location:null;
        //     this.locationInfo = this.getAssembleAddress(data);
        //     if(data.poi && data.poi.adcode){
        //         this.gpsEmitter.emit(({point:this.point,address:this.locationInfo,adcode:data.poi.adcode}));
        //     }
        // }
    }


    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }


    getAssembleAddress(info){
        if(info && info.poi){
          return  info.poi["district"]+info.poi["address"]+"("+info.poi["name"]+")";
        }
        if(info && info.tip){
            return info.tip[0]["district"]+info.tip[0]["address"]+"("+info.tip[0]["name"]+")";
        }
        return info.poi && info.poi["name"]?info.poi["name"]:null;
    }

    // showMsg(){
    //     if(!this.msg){
    //         this.msg =  Messages.SELECT_NOT_EMPTY;
    //         setTimeout(()=>{
    //             this.msg = null;
    //         },3000);
    //     }
    // }

}
