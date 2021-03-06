import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicModule} from './../../public/public.module';
import {MerchantRoutingModule} from './merchant-routing.module';
import {AreaDividePipe, BasisComponent} from './basis/basis.component';
import {ImgviewModule} from './../../public/imgview.module';
import {IdentifyComponent} from './identify/identify.component';
import {VerifyComponent} from './verify/verify.component';
import {BindComponent} from './bind/bind.component';
import {BindAddComponent} from './bind-add/bind-add.component';
import {UploadModule} from '../../public/upload.module';
import {TitleModule} from "../../public/title.module";

// import {ImgviewComponent} from "../../component/imgview/imgview.component";


@NgModule({
    imports: [
        CommonModule,
        UploadModule,
        TitleModule,
        PublicModule,
        MerchantRoutingModule,
        ImgviewModule

    ],
    declarations: [
        BasisComponent,
        IdentifyComponent,
        VerifyComponent,
        BindComponent,
        BindAddComponent,
        AreaDividePipe
    ]
})
export class MerchantModule {
}
