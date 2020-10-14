import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from '../../service/guard.service';
import {TempBasicComponent} from "./temp-basic/temp-basic.component";
import {TempSuitComponent} from "./temp-suit/temp-suit.component";
import {TempPackComponent} from './temp-pack/temp-pack.component';
import {TempBasicListComponent} from "./temp-basic/temp-basic-list/temp-basic-list.component";
import {TempBasicEditComponent} from "./temp-basic/temp-basic-edit/temp-basic-edit.component";
import {TempSuitListComponent} from "./temp-suit/temp-suit-list/temp-suit-list.component";
import {TempSuitEditComponent} from "./temp-suit/temp-suit-edit/temp-suit-edit.component";
import {TempPackListComponent} from "./temp-pack/temp-pack-list/temp-pack-list.component";
import {TempPackEditComponent} from "./temp-pack/temp-pack-edit/temp-pack-edit.component";
import {TempLibListComponent} from "./temp-lib/temp-lib-list/temp-lib-list.component";
import {TempLibEditComponent} from "./temp-lib/temp-lib-edit/temp-lib-edit.component";


const routes: Routes = [
    {
        path: '',
        redirectTo: 'basic',
        pathMatch: 'full'
    },
    //v2.2.8新增功能基装、套装、整装管理及相应的基础数据库管理
    {
        path:"basic",
        component:TempBasicComponent,
        data:{
            breadcrumb:"基装管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component: TempBasicListComponent,
                canActivate:[GuardService]
            },
            {
                path:"edit",
                component: TempBasicEditComponent,
                canActivate:[GuardService]
            }
        ]
    },
    {
        path:"suit",
        component:TempSuitComponent,
        data:{
            breadcrumb:"套装管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component: TempSuitListComponent,
                canActivate:[GuardService]
            },
            {
                path:"edit",
                component: TempSuitEditComponent,
                canActivate:[GuardService]
            }
        ]
    },
    {
        path:"pack",
        component:TempPackComponent,
        data:{
            breadcrumb:"整装管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component: TempPackListComponent,
                canActivate:[GuardService]
            },
            {
                path:"edit",
                component: TempPackEditComponent,
                canActivate:[GuardService]
            }
        ]
    },
    {
        path:"lib",
        component:TempPackComponent,
        data:{
            breadcrumb:"基础库管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component: TempLibListComponent,
                canActivate:[GuardService]
            },
            {
                path:"edit",
                component: TempLibEditComponent,
                canActivate:[GuardService]
            }
        ]
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
export class TempRoutingModule {
}
