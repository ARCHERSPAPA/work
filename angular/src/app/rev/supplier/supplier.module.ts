import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupplierRoutingModule} from "./supplier-routing.module";
import {SupplierMaterialComponent} from './supplier-material/supplier-material.component';
import {SupplierMaterialListComponent} from './supplier-material/supplier-material-list/supplier-material-list.component';
import {PublicModule} from '../../public/public.module';
import {SupplierMaterialAddComponent} from './supplier-material/supplier-material-add/supplier-material-add.component';
import {UploadModule} from '../../public/upload.module';
import {ImgviewModule} from './../../public/imgview.module';
import {SupplierMaterialInfoComponent} from './supplier-material/supplier-material-info/supplier-material-info.component';
import {SupplierMaterialEditComponent} from './supplier-material/supplier-material-edit/supplier-material-edit.component';
// import {DetailModule} from '../../public/detail.module';
import {SelectBrandModule} from './../../public/selectBrand.module';
import {SupplierMaterialDetailComponent} from './supplier-material/supplier-material-detail/supplier-material-detail.component';
import {TitleModule} from "../../public/title.module";
import {SearchSimpleBarModule} from "../../component/search-simple-bar/search-simple-bar.module";

@NgModule({
    declarations: [
        SupplierMaterialComponent,
        SupplierMaterialListComponent,
        SupplierMaterialAddComponent,
        SupplierMaterialInfoComponent,
        SupplierMaterialEditComponent,
        SupplierMaterialDetailComponent
    ],
    imports: [
        CommonModule,
        PublicModule,
        TitleModule,
        UploadModule,
        SupplierRoutingModule,
        ImgviewModule,
        SearchSimpleBarModule,

        // DetailModule
        SelectBrandModule
    ]
})
export class SupplierModule {
}
