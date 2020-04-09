import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CostListComponent} from './cost-list/cost-list.component';
import {CostBudgetComponent} from './cost-budget/cost-budget.component';
import {CostDetailComponent} from './cost-budget/cost-budget-detail/cost-detail/cost-detail.component';
import {PublicModule} from "../../public/public.module";
import {DetailModule} from "../../public/detail.module";
import {CostRoutingModule} from "./cost-routing.module";
import { CostDesignComponent } from './cost-design/cost-design.component';
import { CostEngineerComponent } from './cost-engineer/cost-engineer.component';
import {CostAccessoryComponent} from "./cost-accessory/cost-accessory.component";
import { AccessoryListComponent } from './cost-accessory/accessory-list/accessory-list.component';
import { CostBudgetListComponent } from './cost-budget/cost-budget-list/cost-budget-list.component';
import { CostBudgetDetailComponent } from './cost-budget/cost-budget-detail/cost-budget-detail.component';



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
        CostDetailComponent,
        CostDesignComponent,
        CostEngineerComponent,
        CostAccessoryComponent,
        AccessoryListComponent,
        CostBudgetListComponent,
        CostBudgetDetailComponent
    ]
})
export class CostModule {
}
