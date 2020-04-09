import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicModule} from "../../public/public.module";
import {OfferRoutingModule} from "./offer-routing.module";
import {BsDatepickerModule  } from 'ngx-bootstrap';
import {DetailModule} from "../../public/detail.module";
import {UploadModule} from "../../public/upload.module";
import { OfferItemComponent } from './offer-item/offer-item.component';
import {OfferListComponent} from "./offer-item/offer-list/offer-list.component";
import {OfferDetailComponent} from "./offer-item/offer-detail/offer-detail.component";

@NgModule({
  imports: [
    CommonModule,
    UploadModule,
    PublicModule,
    DetailModule,
    OfferRoutingModule
  ],
  declarations: [
      OfferItemComponent,
      OfferListComponent,
      OfferDetailComponent,
  ]
})
export class OfferModule { }
