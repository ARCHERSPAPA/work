import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicModule} from '../../public/public.module';
import {AccountRoutingModule} from './account-routing.module';
import {BaseComponent} from './base/base.component';
import {FreshComponent} from './fresh/fresh.component';
import {PwdComponent} from './pwd/pwd.component';
import {TitleModule} from "../../public/title.module";


@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    TitleModule,
    AccountRoutingModule
  ],
  declarations: [
    BaseComponent,
    FreshComponent,
    PwdComponent
  ]
})
export class AccountModule {
}
