import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {FinanceItemComponent} from "./finance-item/finance-item.component";
import {ContractComponent} from "../detail/contract/contract.component";
import {GuardService} from "../../service/guard.service";
import {FinanceListComponent} from "./finance-item/finance-list/finance-list.component";
import {FinanceDetailComponent} from "./finance-item/finance-detail/finance-detail.component";


const routes: Routes = [
    {
        path: "",
        redirectTo: "item",
        pathMatch: "full"
    },
    {
        path:"item",
        component:FinanceItemComponent,
        data:{
            breadcrumb:"财务列表"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path: "list",
                component: FinanceListComponent,
                canActivate: [GuardService]
            },
            {
                path: "detail",
                component: FinanceDetailComponent,
                data:{
                    breadcrumb:"详情"
                },
                children: [
                    {
                        path: "contract/:state",
                        component: ContractComponent,
                        canActivate: [GuardService]
                    }
                ]
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
export class FinanceRoutingModule {
}
