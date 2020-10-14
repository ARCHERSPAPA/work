import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ItemBasicService} from "./item-basic.service";

import {ItemBasicComponent} from "./item-basic.component";
import {ItemBasicCustomizeComponent} from "./item-basic-customize.component";

import {MasterComboService} from "../../rev/master/master-combo-detail/master-combo.service";






@NgModule({
    declarations: [
        ItemBasicComponent,
        ItemBasicCustomizeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    providers:[
      ItemBasicService,
      MasterComboService
    ],
    entryComponents: [
        ItemBasicComponent,
        ItemBasicCustomizeComponent
    ],
    exports: [
        ItemBasicComponent,
        ItemBasicCustomizeComponent,
        NgZorroAntdModule
    ]
})
export class ItemBasicModule {
}
