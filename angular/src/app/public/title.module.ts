import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TitleComponent} from '../component/title/title.component';

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule
    ],
    declarations: [
        TitleComponent
    ],
    exports: [
        TitleComponent
    ]
})
export class TitleModule {
}
