import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GuardService} from "../../service/guard.service";

import {SaleListComponent} from "./sale-list/sale-list.component";
import {SaleAddComponent} from "./sale-add/sale-add/sale-add.component";

const routes:Routes = [
    {
        path:"",
        redirectTo:"list",
        pathMatch:"full"
    },
    {
        path:"list",
        component:SaleListComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"客服列表"
        }
    },
    {
        path:"add",
        component:SaleAddComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"添加客服"
        }
    },


];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SalecsRoutingModule { }
