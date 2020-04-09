import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicModule} from "../../public/public.module";
import {DetailModule} from "../../public/detail.module";
import {WarrantyRoutingModule} from "./warranty-routing.module";

import {WarrantyAuditComponent} from "./warranty-audit/warranty-audit.component";
import {WarrantyRecordComponent} from "./warranty-record/warranty-record.component";
import { WarrantyRecordListComponent } from './warranty-record/warranty-record-list/warranty-record-list.component';
import { WarrantyRecordDetailComponent } from './warranty-record/warranty-record-detail/warranty-record-detail.component';
import {WarrantySettingComponent} from "./warranty-setting/warranty-setting.component";
import { WarrantyAuditListComponent } from './warranty-audit/warranty-audit-list/warranty-audit-list.component';
import {WarrantyAuditEditComponent} from "./warranty-audit/warranty-audit-edit/warranty-audit-edit.component";


@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    DetailModule,
    WarrantyRoutingModule
  ],
  declarations: [
    WarrantyAuditComponent,
    WarrantyAuditEditComponent,
    WarrantyRecordComponent,
    WarrantyRecordListComponent,
    WarrantyRecordDetailComponent,
    WarrantySettingComponent,
    WarrantyAuditListComponent
  ]
})
export class WarrantyModule { }
