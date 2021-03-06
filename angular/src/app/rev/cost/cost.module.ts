import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplateModule} from "../template/template.module";
import {CalculateModule} from "../calculate/calculate.module";
import {CostRoutingModule} from "./cost-routing.module";



@NgModule({
    imports: [
        CommonModule,
        CalculateModule,
        TemplateModule,
        CostRoutingModule
    ],
    declarations: [
    ]
})
export class CostModule {
}
