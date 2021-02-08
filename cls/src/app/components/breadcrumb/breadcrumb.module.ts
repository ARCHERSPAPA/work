import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';

import {BreadcrumbComponent} from "./breadcrumb.component";



@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzBreadCrumbModule
  ],
  exports:[BreadcrumbComponent],
  entryComponents:[BreadcrumbComponent]
})
export class BreadcrumbModule { }
