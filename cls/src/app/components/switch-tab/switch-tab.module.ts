import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import {SwitchTabComponent} from "./switch-tab.component";



@NgModule({
  declarations: [SwitchTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzRadioModule
  ],
  exports:[SwitchTabComponent],
  entryComponents:[SwitchTabComponent]
})
export class SwitchTabModule { }
