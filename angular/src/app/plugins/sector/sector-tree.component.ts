import { Component, OnInit, Input } from '@angular/core';
import {EventEmitter} from '@angular/core';
import {DepartService} from "../../service/depart.service";


@Component({
    selector: 'rev-sector-tree',
    template: `
      <ul class="quick-item" [ngClass]="{'item-inline':rank > 0}">
        <li *ngFor="let depart of sectorTree">
            <span class="qk-btn qk-doc" *ngIf="!depart.ownSubset"></span>
            <span class="qk-btn" [ngClass]="{'qk-plus':!depart.show,'qk-minus':depart.show}"
                  *ngIf="depart.ownSubset" (click)="loadChild(depart)"></span>
            <span class="qk-btn qk-empty" *ngIf="!depart.ownSubset"></span>
            <a>
                <span class="qk-btn" [ngClass]="{'qk-close':!depart.show,'qk-open':depart.show}" *ngIf="depart.ownSubset"></span>
                <span class="qk-node" (click)="select(depart)">{{depart.name}}</span>
            </a>
            <rev-sector-tree [sectorTree]="depart.child" [rank]="depart.rank" [type]="type" [url]="url"
            [hidden]="!depart.show" *ngIf="depart.child && depart.child.length > 0"></rev-sector-tree>
        </li>
    </ul>

    `,
    styleUrls: ['./sector.component.scss']
})
export class SectorTreeComponent implements OnInit {
    @Input() sectorTree:any;
    @Input() rank:number;
    @Input() type:string;
    @Input() url:string;

    constructor(private depart:DepartService){

    }

    ngOnInit(){

    }

    loadChild(item){
        item.show = !item.show;
        if(!item.load && item.ownSubset){
            this.depart.loadDepart(item.id,this.url);
        }
    }

    select(depart){
        console.log(1);
        if(this.type === "checkbox"){
            this.depart.showDeparts(depart);
        }else if(this.type === "radio"){
            // debugger;
            this.depart.replaceDepart(depart);
        }

    }
}
