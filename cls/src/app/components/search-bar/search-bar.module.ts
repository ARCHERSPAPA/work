import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { SearchBarComponent } from './search-bar.component';


@NgModule({
  declarations: [SearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule ,
    NzSelectModule,
    NzButtonModule
  ],
  exports:[SearchBarComponent],
  entryComponents:[SearchBarComponent]
})
export class SearchBarModule { }
