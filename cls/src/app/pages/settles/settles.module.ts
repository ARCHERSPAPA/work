import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettlesComponent } from './settles.component';
import {SwitchTabModule} from "../../components/switch-tab/switch-tab.module";
import {SearchBarModule} from "../../components/search-bar/search-bar.module";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


import { SettleListComponent } from './settle-list/settle-list.component';

import {SettlesRoutingModule} from "./settles-routing.module";



@NgModule({
  declarations: [SettlesComponent, SettleListComponent],
  imports: [
    CommonModule,
    SearchBarModule,
    SwitchTabModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzToolTipModule,
    NzPopconfirmModule,
    SettlesRoutingModule
  ]
})
export class SettlesModule { }
