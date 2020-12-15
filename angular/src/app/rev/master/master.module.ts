import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicModule} from '../../public/public.module';
import {InputModule} from "../../public/input.module";
import {ImgviewModule} from './../../public/imgview.module';
import {SelectBrandModule} from "../../public/selectBrand.module";
import {MasterRoutingModule} from './master-routing.module';
import {MasterListComponent} from './master-list-detail/master-list/master-list.component';
import {MasterDetailComponent} from './master-list-detail/master-detail/master-detail.component';
import { MasterTempComponent } from './master-temp-detail/master-temp/master-temp.component';
import { MasterAddComponent } from './master-temp-detail/master-add/master-add.component';
import { MasterSaleComponent } from './master-sale-detail/master-sale/master-sale.component';
import { MasterSaleAddComponent } from './master-sale-detail/sale-add/sale-add.component';
import { MasterListDetailComponent } from './master-list-detail/master-list-detail.component';
import { MasterTempDetailComponent } from './master-temp-detail/master-temp-detail.component';
import { MasterSaleDetailComponent } from './master-sale-detail/master-sale-detail.component';
import { MasterPromotionDetailComponent } from './master-promotion-detail/master-promotion-detail.component';
import { MasterPromotionComponent } from './master-promotion-detail/master-promotion/master-promotion.component';
import { MasterPromotionMaterialsComponent } from './master-promotion-detail/master-promotion-materials/master-promotion-materials.component';
import {TitleModule} from "../../public/title.module";
import { MasterMaterialDetailComponent } from './master-material-detail/master-material-detail.component';
import { MasterMaterialComponent } from './master-material-detail/master-material/master-material.component';
import { MasterComboDetailComponent } from './master-combo-detail/master-combo-detail.component';
import { MasterAuxiliaryDetailComponent } from './master-auxiliary-detail/master-auxiliary-detail.component';
import { MasterAuxiliaryComponent } from './master-auxiliary-detail/master-auxiliary/master-auxiliary.component';
import { MasterPackDetailComponent } from './master-pack-detail/master-pack-detail.component';
import { MasterPackComponent } from './master-pack-detail/master-pack/master-pack.component';
import { MasterPackMasterialsComponent } from './master-pack-detail/master-pack-masterials/master-pack-masterials.component';
import {MasterCommonPromotionModule} from "./master-promotion-detail/master-common-promotion/master-common-promotion.module";
import {MasterCommonPackModule} from "./master-pack-detail/master-common-pack/master-common-pack.module";
import {SelectBarModule} from "../../component/select-bar/select-bar.module";
import { MasterClassRestrictComponent } from './master-class-restrict/master-class-restrict.component';
import {SearchSimpleBarModule} from "../../component/search-simple-bar/search-simple-bar.module";





@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        TitleModule,
        ImgviewModule,
        InputModule,
        SelectBrandModule,
        SelectBarModule,
        MasterCommonPromotionModule,
        MasterRoutingModule,
        MasterCommonPackModule,
        SearchSimpleBarModule
    ],
    declarations: [
        MasterListComponent,
        MasterDetailComponent,
        MasterTempComponent,
        MasterAddComponent,
        MasterSaleComponent,
        MasterSaleAddComponent,
        MasterListDetailComponent,
        MasterTempDetailComponent,
        MasterSaleDetailComponent,
        MasterPromotionDetailComponent,
        MasterPromotionComponent,
        MasterPromotionMaterialsComponent,
        MasterMaterialDetailComponent,
        MasterMaterialComponent,
        MasterComboDetailComponent,
        MasterAuxiliaryDetailComponent,
        MasterAuxiliaryComponent,
        MasterPackDetailComponent,
        MasterPackComponent,
        MasterPackMasterialsComponent,
        MasterClassRestrictComponent
    ]
})
export class MasterModule {
}
