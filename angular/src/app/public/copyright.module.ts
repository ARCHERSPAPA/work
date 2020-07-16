import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CopyRightComponent} from '../component/copy-right/copy-right.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CopyRightComponent
    ],
    exports: [
        CopyRightComponent
    ]
})
export class CopyrightModule {
}
