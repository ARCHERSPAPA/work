import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../service/header.service";

@Component({
    selector: 'rev-item-price',
    template: `
                <rev-re-price  *ngIf="dataVersion === 1"></rev-re-price>
                <rev-detail-price *ngIf="dataVersion === 0"></rev-detail-price>
                `
})
export class ItemPriceComponent implements OnInit {

    public dataVersion: number = 0;

    constructor(private header: HeaderService) {
    }

    ngOnInit() {

    }


    ngAfterContentChecked() {
        this.dataVersion = this.header.getHeaderVersion();
    }


}
