import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicModule} from "./../../public/public.module";
import {PersonnelRoutingModule} from "./personnel-routing.module";

import {StaffComponent} from "./staff/staff.component";
import { PostComponent } from './post/post.component';
import { DepartComponent } from './depart/depart.component';
import {StaffAddComponent} from './staff/staff-add/staff-add.component';
import { StaffListComponent } from './staff/staff-list/staff-list.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostRoleComponent } from './post/post-role/post-role.component';
// import { DepartAddComponent } from './depart/depart-add/depart-add.component';
// import { DepartListComponent } from './depart/depart-list/depart-list.component';
import {RoleService} from "../../service/role.service";
import {RoleTreesComponent} from "./post/post-role/role-trees.component";
import {DepartNodeComponent} from "./depart/depart-list/depart-node.component";
import {WorkerComponent} from "./worker/worker.component";
import {WorkerListComponent} from "./worker/worker-list/worker-list.component";
import {WorkerAddComponent} from "./worker/worker-add/worker-add.component";
import {CookieService} from "ngx-cookie-service";
import { ReuseComponent } from './reuse/reuse.component';
import { ReuseListComponent } from './reuse/reuse-list/reuse-list.component';
import {UploadModule} from "../../public/upload.module";
import { AddressComponent } from './address/address.component';
import { AddressRoleComponent } from './address/address-role/address-role.component';
import { AddressDetailComponent } from './address/address-detail/address-detail.component';
import { AddressListComponent } from './address/address-list/address-list.component';
import { AssociateComponent } from './associate/associate.component';
import { WechatComponent } from './staff/wechat/wechat.component';
import { AppPermissionComponent } from './staff/app-permission/app-permission.component';

// import {DepartTreeDemo} from "./depart/depart-list/depart-tree-demo";


@NgModule({
    imports: [
        CommonModule,
        UploadModule,
        PublicModule,
        PersonnelRoutingModule
    ],
    declarations: [
        StaffComponent,
        PostComponent,
        DepartComponent,
        StaffAddComponent,
        StaffListComponent,
        PostListComponent,
        PostRoleComponent,
        // DepartAddComponent,
        // DepartListComponent,
        DepartNodeComponent,

        // DepartTreeDemo,

        RoleTreesComponent,
        WorkerComponent,
        WorkerAddComponent,
        WorkerListComponent,
        ReuseComponent,
        ReuseListComponent,
        AddressComponent,
        AddressRoleComponent,
        AddressDetailComponent,
        AddressListComponent,
        AssociateComponent,
        WechatComponent,
        AppPermissionComponent
    ],
    providers:[
        RoleService,
        CookieService
    ]
})
export class PersonnelModule { }
