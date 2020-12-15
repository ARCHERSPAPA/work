import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicModule} from '../../public/public.module';
import {OfferRoutingModule} from './offer-routing.module';
import {BsDatepickerModule  } from 'ngx-bootstrap';
import {DetailModule} from '../../public/detail.module';
import {UploadModule} from '../../public/upload.module';
import { OfferItemComponent } from './offer-item/offer-item.component';
import {OfferListComponent} from './offer-item/offer-list/offer-list.component';
import {OfferDetailComponent} from './offer-item/offer-detail/offer-detail.component';
import {TitleModule} from "../../public/title.module";
import {ItemBasicModule} from "../../plugins/item-basic/item-basic.module";
import {ContractUploadModule} from "../../public/accessory/contractUpload.module";
import {ItemPackModule} from "../../plugins/item-pack/item-pack.module";
import {SearchSimpleBarModule} from "../../component/search-simple-bar/search-simple-bar.module";

@NgModule({
  imports: [
    CommonModule,
    UploadModule,
    PublicModule,
    TitleModule,
    DetailModule,
    ItemBasicModule,
    ItemPackModule,
    OfferRoutingModule,
    ContractUploadModule,
    SearchSimpleBarModule
  ],
  declarations: [
      OfferItemComponent,
      OfferListComponent,
      OfferDetailComponent,
  ]
})
export class OfferModule { }
