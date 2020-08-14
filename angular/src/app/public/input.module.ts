import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputDecimalDirective} from "../directive/input-decimal.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputDecimalDirective
    ],
    exports: [
        InputDecimalDirective
    ]
})
export class InputModule {
}