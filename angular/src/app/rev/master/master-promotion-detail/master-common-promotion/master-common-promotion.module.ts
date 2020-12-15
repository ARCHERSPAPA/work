import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MasterCommonPromotionComponent} from './master-common-promotion.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
    declarations: [MasterCommonPromotionComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    exports: [
        MasterCommonPromotionComponent
    ]
})
export class MasterCommonPromotionModule {
}
