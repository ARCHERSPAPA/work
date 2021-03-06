import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PublicModule} from '../public/public.module';
import {ViewRoutingModule} from './view-routing.module';

import {ViewContractComponent} from './view-contract/view-contract.component';
import { ViewQuoteComponent } from './view-quote/view-quote.component';
import { ViewExplainComponent } from './view-explain/view-explain.component';
import { ViewMaterialsComponent } from './view-materials/view-materials.component';
import { ViewMaterialListComponent } from './view-material-list/view-material-list.component';
import {ImgviewModule} from './../public/imgview.module';


@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    ViewRoutingModule,
    ImgviewModule
  ],
  declarations: [
      ViewContractComponent,
      ViewQuoteComponent,
      ViewExplainComponent,
      ViewMaterialsComponent,
      ViewMaterialListComponent
  ]
})
export class ViewModule { }
