import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleStayComponent } from './schedule-stay/schedule-stay.component';
import {PublicModule} from "../../public/public.module";
import {ScheduleRoutingModule} from "./schedule-routing.module";

@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    ScheduleRoutingModule
  ],
  declarations: [
      ScheduleStayComponent
  ]
})
export class ScheduleModule { }
