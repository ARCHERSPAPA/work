import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from "./user-routing.module";
import {LoginComponent} from "./login/login.component";
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import { UserInfoComponent } from './user-info/user-info.component';
import { UserCompanyComponent } from './user-company/user-company.component';
import {PublicModule} from "../public/public.module";
import {CopyrightModule} from "../public/copyright.module";

@NgModule({
    declarations: [
        LoginComponent,
        UserInfoComponent,
        UserCompanyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CopyrightModule,
        PublicModule,
        UserRoutingModule
    ]
})
export class UserModule {
}
