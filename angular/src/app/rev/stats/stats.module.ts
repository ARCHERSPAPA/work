import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsOverallComponent } from './stats-overall/stats-overall.component';
import { StatsSketchComponent } from './stats-sketch/stats-sketch.component';
import {PublicModule} from "../../public/public.module";
import {StatsRoutingModule} from "./stats-routing.module";

@NgModule({
  imports: [
      CommonModule,
      PublicModule,
      StatsRoutingModule
  ],
  declarations: [
      StatsOverallComponent,
      StatsSketchComponent
  ]
})
export class StatsModule { }
