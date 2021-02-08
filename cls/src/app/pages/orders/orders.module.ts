import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzImageModule } from 'ng-zorro-antd/image';



import { UploaderImgModule } from "../../components/uploader-img/uploader-img.module";
import { ItemOrdersComponent } from './item-orders/item-orders.component';
import { OrderListComponent } from "./order-list/order-list.component";
import { SearchBarModule } from "../../components/search-bar/search-bar.module";
import { SwitchTabModule } from "../../components/switch-tab/switch-tab.module";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderDetailHeadComponent } from './order-detail/order-detail-head/order-detail-head.component';
import { OrderDetailMaterialsComponent } from './order-detail/order-detail-materials/order-detail-materials.component';
import { OrderDetailSchedulesComponent } from './order-detail/order-detail-schedules/order-detail-schedules.component';
import { OrderDetailGraphComponent } from './order-detail/order-detail-graph/order-detail-graph.component';
import { TabModule } from '../../components/tab/tab.module';

import { AddMaterialListModule } from '../../components/add-material-list/add-material-list.module';

import { OrdersRoutingModule } from "./orders-routing.module";
@NgModule({
  declarations: [
    ItemOrdersComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderDetailHeadComponent,
    OrderDetailMaterialsComponent,
    OrderDetailSchedulesComponent,
    OrderDetailGraphComponent
  ],
  imports: [
    CommonModule,
    SearchBarModule,
    NzImageModule,
    NzPopconfirmModule,
    SwitchTabModule,
    NzTypographyModule,
    ReactiveFormsModule,
    FormsModule,
    NzRadioModule,
    AddMaterialListModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzListModule,
    NzTagModule,
    NzDrawerModule,
    TabModule,
    NzTimelineModule,
    NzIconModule,
    NzModalModule,
    UploaderImgModule,
    NzToolTipModule,
    NzPageHeaderModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
