import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SelectBarComponent} from "./select-bar.component";

@NgModule({
    declarations: [
        SelectBarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule.forRoot()
    ],
    exports:[
        SelectBarComponent
    ]
})
export class SelectBarModule {
}
