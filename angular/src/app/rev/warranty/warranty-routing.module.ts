import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {WarrantyAuditComponent} from "./warranty-audit/warranty-audit.component";
import {GuardService} from "../../service/guard.service";
import {WarrantySettingComponent} from "./warranty-setting/warranty-setting.component";
import {WarrantyRecordListComponent} from "./warranty-record/warranty-record-list/warranty-record-list.component";
import {WarrantyRecordDetailComponent} from "./warranty-record/warranty-record-detail/warranty-record-detail.component";
import {WarrantyRecordComponent} from "./warranty-record/warranty-record.component";
import {WarrantyAuditListComponent} from "./warranty-audit/warranty-audit-list/warranty-audit-list.component";
import {WarrantyAuditEditComponent} from "./warranty-audit/warranty-audit-edit/warranty-audit-edit.component";


const routes: Routes = [
    {
        path: "",
        redirectTo: "audit",
        pathMatch: "full"
    },
    {
        path: "audit",
        component: WarrantyAuditComponent,
        data:{
            breadcrumb:"保修审核"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component:WarrantyAuditListComponent,
                canActivate:[GuardService]
            },
            {
                path:"edit",
                component:WarrantyAuditEditComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"详情"
                }
            }
        ]
    },
    // {
    //     path: "edit",
    //     component: WarrantyEditComponent,
    //     canActivate: [GuardService]
    // },
    {
        path: "setting",
        component: WarrantySettingComponent,
        canActivate: [GuardService],
        data:{
            breadcrumb:"保修卡设置"
        }
    },
    {
        path: "record",
        component: WarrantyRecordComponent,
        data: {
            breadcrumb: "保修记录"
        },
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: "list",
                component: WarrantyRecordListComponent,
                canActivate: [GuardService]
            },
            {
                path: "detail/:state",
                component: WarrantyRecordDetailComponent,
                canActivate: [GuardService],
                data:{
                    breadcrumb:"详情"
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
    exports: [RouterModule]
})
export class WarrantyRoutingModule {
}
