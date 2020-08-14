import {CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SelectBrandComponent} from '../component/selectBrand/selectBrand.component';



@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgZorroAntdModule.forRoot(),
  ],
  declarations: [
    SelectBrandComponent
  ],
  exports: [SelectBrandComponent]
})
export class SelectBrandModule { }
