import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TitleComponent} from "../component/title/title.component";

@NgModule({
    imports: [
        CommonModule
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
