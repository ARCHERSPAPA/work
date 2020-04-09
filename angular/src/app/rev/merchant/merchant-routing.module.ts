import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {BasisComponent} from "./basis/basis.component";
import {VerifyComponent} from "./verify/verify.component";
import {IdentifyComponent} from "./identify/identify.component";
import {DefendService} from "../../service/guard.service";
import {BindComponent} from "./bind/bind.component";
import {BindAddComponent} from "./bind-add/bind-add.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "basis",
        pathMatch: "full"
    },
    {
        path: "basis",
        component: BasisComponent,
        canActivate: [DefendService],
        data:{
            breadcrumb:"商家资料"
        }
    },
    {
        path: "verify",
        component: VerifyComponent,
        canActivate: [DefendService],
        data:{
            breadcrumb:"企业资质"
        }
    },
    {
        path: "identify",
        component: IdentifyComponent,
        canActivate: [DefendService],
        data:{
            breadcrumb:"认证资料"
        }
    },
    {
        path: "bind",
        component: BindComponent,
        canActivate: [DefendService],
        data:{
            breadcrumb:"绑定设备"
        }
    },
    {
        path: "bindAdd",
        component: BindAddComponent,
        canActivate: [DefendService]
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
export class MerchantRoutingModule {
}
