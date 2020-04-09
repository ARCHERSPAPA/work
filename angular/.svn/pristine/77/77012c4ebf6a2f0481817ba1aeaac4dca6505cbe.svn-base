import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {CostListComponent} from "./cost-list/cost-list.component";
import {GuardService} from "../../service/guard.service";
import {CostBudgetComponent} from "./cost-budget/cost-budget.component";
import {CostDetailComponent} from "./cost-budget/cost-budget-detail/cost-detail/cost-detail.component";
import {PriceComponent} from "../detail/price/price.component";
import {ContractComponent} from "../detail/contract/contract.component";
import {MakingsComponent} from "../detail/makings/makings.component";
import {CostDesignComponent} from "./cost-design/cost-design.component";
import {CostEngineerComponent} from "./cost-engineer/cost-engineer.component";
import {GraphComponent} from "../detail/graph/graph.component";
import {CostAccessoryComponent} from "./cost-accessory/cost-accessory.component";
import {ContractDetailComponent} from "../detail/contract-detail/contract-detail.component";
import {AccessoryListComponent} from "./cost-accessory/accessory-list/accessory-list.component";
import {CostBudgetListComponent} from "./cost-budget/cost-budget-list/cost-budget-list.component";
import {CostBudgetDetailComponent} from "./cost-budget/cost-budget-detail/cost-budget-detail.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "budget",
        pathMatch: "full"
    },
    {
        path: "budget",
        component: CostBudgetComponent,
        data: {
            breadcrumb: "成本核算"
        },
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path:"list",
                component:CostBudgetListComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"成本列表"
                }
            },
            {
                path:"costing/:state",
                component:CostDetailComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"详情"
                }
            },
            {
                path:"detail",
                component:CostBudgetDetailComponent,
                data:{
                    breadcrumb:"详情"
                },
                children: [
                    {
                        path: "",
                        redirectTo: "price",
                        pathMatch: "full"
                    },
                    {
                        path: "price/:state",
                        component: PriceComponent,
                        canActivate: [GuardService],
                        data:{
                            breadcrumb:"预算"
                        }
                    },
                    {
                        path: "makings/:state",
                        component: MakingsComponent,
                        canActivate: [GuardService],
                        data:{
                            breadcrumb:"材料清单"
                        }
                    },
                    {
                        path: "contract/:state",
                        component: ContractComponent,
                        canActivate: [GuardService],
                        data:{
                            breadcrumb:"合同"
                        }
                    },
                    {
                        path: "graph/:state",
                        component: GraphComponent,
                        canActivate: [GuardService],
                        data:{
                            breadcrumb:"设计图纸"
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "design",
        component: CostDesignComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: "设计费设置"
        }
    },
    {
        path: "engineer",
        component: CostEngineerComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: "工程系数设置"
        }
    },
    {
        path: "accessory",
        component: CostAccessoryComponent,
        data: {
            breadcrumb: "合同附件"
        },
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: "list",
                component: AccessoryListComponent,
                canActivate: [GuardService],
                data: {
                    breadcrumb: "附件列表"
                }
            },
            {
                path: "detail",
                component: ContractDetailComponent,
                canActivate: [GuardService],
                data: {
                    breadcrumb: "附件详情"
                }
            }
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CostRoutingModule {
}
