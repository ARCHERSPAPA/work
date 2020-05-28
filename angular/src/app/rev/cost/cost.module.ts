import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CostListComponent} from './cost-list/cost-list.component';
import {CostBudgetComponent} from './cost-budget/cost-budget.component';
import {PublicModule} from "../../public/public.module";
import {DetailModule} from "../../public/detail.module";
import {CostRoutingModule} from "./cost-routing.module";
import { CostDesignComponent } from './cost-design/cost-design.component';
import { CostEngineerComponent } from './cost-engineer/cost-engineer.component';
import {CostAccessoryComponent} from "./cost-accessory/cost-accessory.component";
import { AccessoryListComponent } from './cost-accessory/accessory-list/accessory-list.component';
import { CostBudgetListComponent } from './cost-budget/cost-budget-list/cost-budget-list.component';
import { CostBudgetDetailComponent } from './cost-budget/cost-budget-detail/cost-budget-detail.component';
import { CostDetailContractComponent } from './cost-detail/cost-detail-contract/cost-detail-contract.component';
import { CostDetailDiscloseComponent } from './cost-detail/cost-detail-disclose/cost-detail-disclose.component';
import { CostDetailReceivablesComponent } from './cost-detail/cost-detail-receivables/cost-detail-receivables.component';
import { CostDetailAnnotateComponent } from './cost-detail/cost-detail-annotate/cost-detail-annotate.component';



@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        DetailModule,
        CostRoutingModule
    ],
    declarations: [
        CostListComponent,
        CostBudgetComponent,
        CostDesignComponent,
        CostEngineerComponent,
        CostAccessoryComponent,
        AccessoryListComponent,
        CostBudgetListComponent,
        CostBudgetDetailComponent,
        CostDetailContractComponent,
        CostDetailDiscloseComponent,
        CostDetailReceivablesComponent,
        CostDetailAnnotateComponent
    ]
})
export class CostModule {
}
