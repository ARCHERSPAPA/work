import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InputModule} from "./input.module";
import {CostDetailAccountComponent} from '../rev/calculate/cost-detail/cost-detail-account/cost-detail-account.component';
import {ItemDetailsModule} from "../component/item-details/item-details.module";

@NgModule({
    imports: [
        CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgZorroAntdModule,
		NgbModule,
        //单独作为组件引入
        ItemDetailsModule,
        //单独引入可编辑公式的输入框
		InputModule
    ],
    declarations: [
        CostDetailAccountComponent
    ],
    exports: [
        CostDetailAccountComponent
    ]
})
export class CostAccountModule {
}