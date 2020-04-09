import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PublicModule} from "../../public/public.module";
import {ResetComponent} from "./reset/reset.component";
import {ForgetComponent} from "./forget/forget.component";
import {UserInfoRoutingModule} from "./user-info-routing.module";
import { FindComponent } from './find/find.component';
import { UserInfoStepComponent } from './user-info-step/user-info-step.component';


@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        FormsModule,
        ReactiveFormsModule,
        UserInfoRoutingModule
    ],
    declarations: [
        ForgetComponent,
        ResetComponent,
        FindComponent,
        UserInfoStepComponent
    ]
})
export class UserInfoModule { }
