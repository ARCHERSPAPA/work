import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from "./../../public/public.module";
import { QuillModule } from 'ngx-quill'

import {NoticeRoutingModule} from "./notice-routing.module";
import {PreviewComponent} from "./preview/preview.component";
import { NoticeMaterialComponent } from './notice-material/notice-material.component';
import { NoticeMaterialListComponent } from './notice-material/notice-material-list/notice-material-list.component';
import { NoticeMaterialAddComponent } from './notice-material/notice-material-add/notice-material-add.component';
import { NoticeMaterialDtlComponent } from './notice-material/notice-material-dtl/notice-material-dtl.component';
import { NoticeInformComponent } from './notice-inform/notice-inform.component';
import { NoticeInformListComponent } from './notice-inform/notice-inform-list/notice-inform-list.component';
import { NoticeInformAddComponent } from './notice-inform/notice-inform-add/notice-inform-add.component';
import { NoticeInformDtlComponent } from './notice-inform/notice-inform-dtl/notice-inform-dtl.component';



@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        NoticeRoutingModule,
        QuillModule
    ],
    declarations: [
        PreviewComponent,
        NoticeMaterialComponent,
        NoticeMaterialListComponent,
        NoticeMaterialAddComponent,
        NoticeMaterialDtlComponent,
        NoticeInformComponent,
        NoticeInformListComponent,
        NoticeInformAddComponent,
        NoticeInformDtlComponent
    ]
})
export class NoticeModule { }
