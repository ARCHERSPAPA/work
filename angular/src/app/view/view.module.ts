import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PublicModule} from "../public/public.module";
import {ViewRoutingModule} from "./view-routing.module";

import {ViewContractComponent} from "./view-contract/view-contract.component";
import { ViewQuoteComponent } from './view-quote/view-quote.component';
import { ViewExplainComponent } from './view-explain/view-explain.component';


@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    ViewRoutingModule
  ],
  declarations: [
      ViewContractComponent,
      ViewQuoteComponent,
      ViewExplainComponent
  ]
})
export class ViewModule { }
