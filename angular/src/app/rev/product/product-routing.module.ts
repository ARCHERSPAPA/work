import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GuardService} from "../../service/guard.service";

import {ProductListComponent} from "./product-list/product-list.component";
import {ProductDtlComponent} from "./product-dtl/product-dtl.component";
import {ProductPicComponent} from "./product-pic/product-pic.component";

const routes:Routes = [
    {
        path:"",
        redirectTo:"list",
        pathMatch:"full"
    },
    {
        path:"list",
        component:ProductListComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"产品列表"
        }
    },
    {
        path:"dtl",
        component:ProductDtlComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"产品详情"
        }
    },
    {
        path:"pic",
        component:ProductPicComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"产品封面"
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
export class ProductRoutingModule { }
