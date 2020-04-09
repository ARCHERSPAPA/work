import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ViewContractComponent} from "./view-contract/view-contract.component";
import {ViewQuoteComponent} from "./view-quote/view-quote.component";
import {ViewExplainComponent} from "./view-explain/view-explain.component";

const routes:Routes = [
    {
        path:"contract",
        component:ViewContractComponent
    },
    {
        path:"quote",
        component:ViewQuoteComponent
    },
    {
        path:"explain",
        component:ViewExplainComponent
    }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule]
})
export class ViewRoutingModule { }
