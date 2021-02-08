import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAffixModule } from 'ng-zorro-antd/affix';


import { ViewsRoutingModule } from './views-routing.module';
import { ErrorComponent } from './error/error.component';
import { OrderComponent } from './order/order.component';


@NgModule({
  declarations: [ErrorComponent, OrderComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzGridModule,
    NzAffixModule,
    NzTableModule,
    ViewsRoutingModule
  ]
})
export class ViewsModule { }
