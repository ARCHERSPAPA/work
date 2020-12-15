import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ImgviewModule} from "../../../public/imgview.module";

import {SettleDetailDataComponent} from "./settle-detail-data/settle-detail-data.component";
import {SettleDetailRecordComponent} from "./settle-detail-record/settle-detail-record.component";
import {SettleDetailScheduleComponent} from "./settle-detail-schedule/settle-detail-schedule.component";
import {SettleDetailOrderComponent} from "./settle-detail-order/settle-detail-order.component";


@NgModule({
    declarations: [
        SettleDetailDataComponent,
        SettleDetailOrderComponent,
        SettleDetailRecordComponent,
        SettleDetailScheduleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ImgviewModule
    ],
    exports: [
        SettleDetailDataComponent,
        SettleDetailOrderComponent,
        SettleDetailRecordComponent,
        SettleDetailScheduleComponent
    ],
    entryComponents: [
        SettleDetailDataComponent,
        SettleDetailOrderComponent,
        SettleDetailRecordComponent,
        SettleDetailScheduleComponent
    ]
})
export class SettleDetailModule {
}
