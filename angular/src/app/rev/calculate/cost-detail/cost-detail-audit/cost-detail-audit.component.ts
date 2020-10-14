import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../../../service/header.service";

@Component({
  selector: 'rev-cost-detail-audit',
  template: `
    <rev-cost-detail-contract *ngIf="dataVersion === 0"></rev-cost-detail-contract>    
    <rev-cost-detail-account *ngIf="dataVersion === 1"></rev-cost-detail-account>`
})
export class CostDetailAuditComponent implements OnInit {

  public dataVersion: number = 0;

  constructor(private header:HeaderService) { }

  ngOnInit() {

  }

  ngDoCheck(){
      this.dataVersion = this.header.getHeaderVersion();
  }

}
