import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from "../../service/guard.service";
import {SettleWageListComponent} from "./settle-wage/wage-list/wage-list.component";
import {SettleWageDetailComponent} from "./settle-wage/wage-detail/wage-detail.component";
import {AuditListComponent} from "./settle-audit/audit-list/audit-list.component";
import {AuditDetailComponent} from "./settle-audit/audit-detail/audit-detail.component";
import {SettleDetailAttendComponent} from "./settle-detail/settle-detail-attend/settle-detail-attend.component";
import {SettleDetailRecordComponent} from "./settle-detail/settle-detail-record/settle-detail-record.component";
import {SettleDetailCostComponent} from "./settle-detail/settle-detail-cost/settle-detail-cost.component";
import {SettleAuditComponent} from "./settle-audit/settle-audit.component";
import {SettleWageComponent} from "./settle-wage/settle-wage.component";
import {SettleDetailVerifyComponent} from './settle-detail/settle-detail-verify/settle-detail-verify.component';
import {ItemQuantityComponent} from '../detail/item-quantity/item-quantity.component';

const routes:Routes = [
    {
        path:"",
        redirectTo:"wage",
        pathMatch:"full"
    },
    {
        path:"wage",
        component:SettleWageComponent,
        data:{
            breadcrumb:"工费结算"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component:SettleWageListComponent,
                canActivate:[GuardService]
            },
            {
                path:"detail",
                component:SettleWageDetailComponent,
                data:{
                  breadcrumb:"详情"
                },
                children:[
                    {
                        path:"",
                        redirectTo:"cost",
                        pathMatch:"full"
                    },
                    {
                        path:"cost",
                        component:SettleDetailCostComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"record",
                        component:SettleDetailRecordComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"verify",
                        component:SettleDetailVerifyComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"quantity",
                        component:ItemQuantityComponent,
                        canActivate:[GuardService]
                    }
                ]
            }
        ]
    },
    {
        path:"audit",
        component:SettleAuditComponent,
        data:{
          breadcrumb:"工费审核"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component:AuditListComponent,
                canActivate:[GuardService]
            },
            {
                path:"detail",
                component:AuditDetailComponent,
                data:{
                  breadcrumb:"详情"
                },
                children:[
                    {
                        path:"",
                        redirectTo:"attend",
                        pathMatch:"full"
                    },
                    {
                        path:"attend",
                        component:SettleDetailAttendComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"record",
                        component:SettleDetailRecordComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"verify",
                        component:SettleDetailVerifyComponent,
                        canActivate:[GuardService]
                    },
                    {
                        path:"quantity",
                        component:ItemQuantityComponent,
                        canActivate:[GuardService]
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
export class SettleRoutingModule { }
