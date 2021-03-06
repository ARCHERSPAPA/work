import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PublicModule} from '../../public/public.module';
import {StepsRoutingModule} from './steps-routing.module';
import {StepHeadComponent} from './step-head/step-head.component';
import {StepOneComponent} from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import {RegionPipe} from '../../pipes/region.pipe';
import {TitleModule} from "../../public/title.module";



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PublicModule,
      TitleModule,
    StepsRoutingModule
  ],
  declarations: [
    StepHeadComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    RegionPipe
  ]
})
export class StepsModule { }
