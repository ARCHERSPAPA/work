import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';
import { UserLoginComponent } from './user-login/user-login.component';
import {UserRoutingModule} from "./user-routing.module";
import {FooterModule} from "../components/footer/footer.module";



@NgModule({
  declarations: [UserLoginComponent],
  imports: [
    CommonModule,
    QrCodeModule,
    FooterModule,
    UserRoutingModule
  ]
})
export class UserModule { }
