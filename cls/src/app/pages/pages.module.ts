import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { FooterModule } from "../components/footer/footer.module";
import {BreadcrumbModule} from "../components/breadcrumb/breadcrumb.module";

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';



@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    FooterModule,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzAvatarModule,
    NzDropDownModule,
    BreadcrumbModule,
    PagesRoutingModule
  ]
})
export class PagesModule {
}
