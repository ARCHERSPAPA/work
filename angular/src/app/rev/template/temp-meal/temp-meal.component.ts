import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'rev-temp-meal',
    templateUrl: './temp-meal.component.html',
    styleUrls: ['./../template.component.scss','./temp-meal.component.scss']
})
export class TempMealComponent implements OnInit {
    public title: string;
    public buttons: Array<any>;

    constructor() {
    }

    ngOnInit() {

    }

    handleName(e: any) {
        if(e === this.buttons[0].name){

        }
    }

}
