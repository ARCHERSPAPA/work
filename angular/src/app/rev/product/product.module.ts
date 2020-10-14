import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from './../../public/public.module';
import { ProductRoutingModule } from './product-routing.module';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDtlComponent } from './product-dtl/product-dtl.component';
import {ProductPicComponent} from './product-pic/product-pic.component';
import {UploadModule} from '../../public/upload.module';
import {ImgviewModule} from './../../public/imgview.module';
import {TitleModule} from "../../public/title.module";
@NgModule({
    imports: [
        CommonModule,
        UploadModule,
        PublicModule,
        TitleModule,
        ProductRoutingModule,
        ImgviewModule
    ],
    declarations: [
        ProductDtlComponent,
        ProductListComponent,
        ProductPicComponent,
    ]
})
export class ProductModule { }
