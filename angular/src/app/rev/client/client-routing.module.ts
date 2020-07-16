import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ClientDetailComponent} from './client-detail/client-detail.component';
import {DetailListComponent} from './client-detail/detail-list/detail-list.component';
import {ClientSourceComponent} from './client-source/client-source.component';
import {GuardService} from '../../service/guard.service';
import {DetailAddComponent} from './client-detail/detail-add/detail-add.component';



const routes: Routes = [
    {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full'
    },
    {
        path: 'detail',
        component: ClientDetailComponent,
        data: {
            breadcrumb: '客户列表'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: DetailListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'add',
                component: DetailAddComponent,
                canActivate: [GuardService],
                data: {
                    breadcrumb: '客户信息'
                }
            }
        ]
    },
    {
        path: 'source',
        component: ClientSourceComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '客户来源列表'
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
export class ClientRoutingModule { }
