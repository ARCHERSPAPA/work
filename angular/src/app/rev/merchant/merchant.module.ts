import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicModule} from "./../../public/public.module";
import {MerchantRoutingModule} from "./merchant-routing.module";
import {AreaDividePipe, BasisComponent} from "./basis/basis.component";

import { IdentifyComponent } from './identify/identify.component';
import { VerifyComponent } from './verify/verify.component';
import {BindComponent} from "./bind/bind.component";
import {BindAddComponent} from "./bind-add/bind-add.component";
import {UploadModule} from "../../public/upload.module";
import {ImgviewComponent} from "../../component/imgview/imgview.component";




@NgModule({
  imports: [
    CommonModule,
    UploadModule,
    PublicModule,
    MerchantRoutingModule,

  ],
  declarations: [
    BasisComponent,
    IdentifyComponent,
    VerifyComponent,
    BindComponent,
    BindAddComponent,
      AreaDividePipe,
      ImgviewComponent
  ]
})
export class MerchantModule { }
