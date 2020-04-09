import {Component, OnInit, Input} from '@angular/core';
import {AmapGeocoderService, AmapGeocoderWrapper} from 'ngx-amap';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Messages} from "../../model/msg";

@Component({
    selector: 'rev-location',
    templateUrl: './location.component.html',
    styles:[ `.amap-sug-result{z-index: 2048;}`]
})
export class LocationComponent implements OnInit {

    @Input() title:string;
    @Input() point:any;

    public pluginGeo:Promise<AmapGeocoderWrapper>;
    public position:any;
    public info:string;

    constructor(private  AmapGeocoder: AmapGeocoderService,
                public activeModal:NgbActiveModal) {
        /***实例化***/
        this.pluginGeo = AmapGeocoder.of();
    }

    ngOnInit() {
        this.position = [this.point.lng,this.point.lat];
        this.info = Messages.LOADING;
        this.load();

    }

    load(){
       if(this.position){
           this.pluginGeo.then(gps => gps.getAddress(this.position))
               .then(data =>{
                   if(data.status === "complete" && data.result.info === "OK"){
                       this.info = data.result.regeocode.formattedAddress;
                   }
               })
       }
    }


    sure(){
        this.activeModal.close({info:this.info});
    }



}
