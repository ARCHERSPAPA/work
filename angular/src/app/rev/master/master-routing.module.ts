import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from "../../service/guard.service";
import {MasterListComponent} from './master-list/master-list.component';
import {MasterDetailComponent} from "./master-detail/master-detail.component";


const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full"
    },
    {
        path: "list",
        component: MasterListComponent,
        canActivate: [GuardService],
        data:{
            breadcrumb:"主材列表"
        }
    },
    {
        path: "detail",
        component: MasterDetailComponent,
        data:{
            breadcrumb:"主材详情"
        }
    }

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
export class MasterRoutingModule {
}
