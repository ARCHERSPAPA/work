import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from '../../service/guard.service';
import {MasterListComponent} from './master-list-detail/master-list/master-list.component';
import {MasterDetailComponent} from './master-list-detail/master-detail/master-detail.component';
import { MasterTempComponent } from './master-temp-detail/master-temp/master-temp.component';
import { MasterAddComponent } from './master-temp-detail/master-add/master-add.component';
import { MasterListDetailComponent } from './master-list-detail/master-list-detail.component';
import { MasterTempDetailComponent } from './master-temp-detail/master-temp-detail.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'listDetail',
        pathMatch: 'full'
    },
    {
        path: 'listDetail',
        component: MasterListDetailComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '主材列表'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: MasterListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'detail',
                component: MasterDetailComponent,
                canActivate: [GuardService],
            }
        ]
    },
    {
        path: 'tempDetail',
        component: MasterTempDetailComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '主材模板'
        },
        children: [
            {
                path: '',
                redirectTo: 'temp',
                pathMatch: 'full'
            },
            {
                path: 'temp',
                component: MasterTempComponent,
                canActivate: [GuardService]
            },
            {
                path: "add",
                component: MasterAddComponent,
                canActivate: [GuardService],
                data:{
                    breadcrumb:"主材编辑"
                }
            },
        ]
    },
    // {
    //     path: "add",
    //     component: MasterAddComponent,
    //     canActivate: [GuardService],
    //     data:{
    //         breadcrumb:"主材编辑"
    //     }
    // },
    // {
    //     path: "detail",

    //     component: MasterDetailComponent,
    //     data: {
    //         breadcrumb: '主材详情'
    //     }
    // }

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
