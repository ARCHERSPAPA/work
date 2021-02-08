import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TabComponent } from './tab.component';

@NgModule({
  declarations: [TabComponent],
  imports: [
    CommonModule,
    NzTabsModule
  ],
  exports: [TabComponent],
})
export class TabModule { }
