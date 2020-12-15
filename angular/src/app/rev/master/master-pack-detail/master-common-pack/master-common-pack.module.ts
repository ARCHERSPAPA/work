import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MasterCommonPackComponent} from './master-common-pack.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
    declarations: [MasterCommonPackComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    exports: [
        MasterCommonPackComponent
    ]
})
export class MasterCommonPackModule {
}
