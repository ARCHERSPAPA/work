import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from "../../service/guard.service";
import { SupplierMaterialComponent } from "./supplier-material/supplier-material.component";
import { SupplierMaterialListComponent } from "./supplier-material/supplier-material-list/supplier-material-list.component";
import { SupplierMaterialDetailComponent } from './supplier-material/supplier-material-detail/supplier-material-detail.component';

import { SupplierMaterialEditComponent } from './supplier-material/supplier-material-edit/supplier-material-edit.component'; import { SupplierMaterialInfoComponent } from './supplier-material/supplier-material-info/supplier-material-info.component'; import { SupplierMaterialAddComponent } from './supplier-material/supplier-material-add/supplier-material-add.component';

const routes: Routes = [
    {
        path: "",
        redirectTo: "material",
        pathMatch: "full"
    },
    {
        path: "material",
        component: SupplierMaterialComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: "材料商管理"
        },
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: "list",
                component: SupplierMaterialListComponent,
                canActivate: [GuardService]
            },
            {
                path: "add",
                component: SupplierMaterialAddComponent,
                canActivate: [GuardService]
            },
            {
                path: "info",
                component: SupplierMaterialDetailComponent,
                canActivate: [GuardService],
                data:{
                  breadcrumb:"材料详情"
                },
                children: [
                    {
                        path: "",
                        redirectTo: "list",
                        pathMatch: "full"
                    },
                    {
                        path: "list",
                        component: SupplierMaterialInfoComponent,
                        canActivate: [GuardService]
                    },
                    {
                        path: "edit",
                        component: SupplierMaterialEditComponent,
                        canActivate: [GuardService]
                    },
                ]
            },

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
export class SupplierRoutingModule { }
