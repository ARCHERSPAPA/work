import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TempModule} from "../template/temp.module";
import {TemporaryRoutingModule} from "./temporary-routing.module";
import {TemporaryComponent} from "./temporary.component";


@NgModule({
  declarations: [
      TemporaryComponent
  ],
  imports: [
    CommonModule,
    TempModule,
    TemporaryRoutingModule
  ]
})
export class TemporaryModule { }
