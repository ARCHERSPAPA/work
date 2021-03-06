import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GuardService} from '../../service/guard.service';

import {PreviewComponent} from './preview/preview.component';
import {NoticeMaterialComponent} from './notice-material/notice-material.component';
import {NoticeMaterialListComponent} from './notice-material/notice-material-list/notice-material-list.component';
import {NoticeMaterialAddComponent} from './notice-material/notice-material-add/notice-material-add.component';
import {NoticeMaterialDtlComponent} from './notice-material/notice-material-dtl/notice-material-dtl.component';
import {NoticeInformComponent} from './notice-inform/notice-inform.component';
import {NoticeInformListComponent} from './notice-inform/notice-inform-list/notice-inform-list.component';
import {NoticeInformAddComponent} from './notice-inform/notice-inform-add/notice-inform-add.component';
import {NoticeInformDtlComponent} from './notice-inform/notice-inform-dtl/notice-inform-dtl.component';




const routes: Routes = [
  {
      path: '',
      redirectTo: 'material',
      pathMatch: 'full'
  },
    {
        path: 'material',
        component: NoticeMaterialComponent,
        data: {
            breadcrumb: '公告素材'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: NoticeMaterialListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'add',
                component: NoticeMaterialAddComponent,
                canActivate: [GuardService]
            },
            {
                path: 'dtl',
                component: NoticeMaterialDtlComponent,
                canActivate: [GuardService]
            },
            {
                path: 'preview',
                component: PreviewComponent,
                canActivate: [GuardService]
            }
        ]
    },
    {
        path: 'inform',
        component: NoticeInformComponent,
        data: {
            breadcrumb: '通知列表'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: NoticeInformListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'add',
                component: NoticeInformAddComponent,
                canActivate: [GuardService]
            },
            {
                path: 'dtl',
                component: NoticeInformDtlComponent,
                canActivate: [GuardService]
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
export class NoticeRoutingModule { }
