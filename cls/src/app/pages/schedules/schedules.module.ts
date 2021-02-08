import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {SchedulesRoutingModule} from "./schedules-routing.module";
import {SchedulesComponent} from "./schedules.component";

@NgModule({
  declarations:[
    SchedulesComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    SchedulesRoutingModule
  ]
})
export class SchedulesModule { }
