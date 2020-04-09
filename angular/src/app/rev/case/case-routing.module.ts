import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from "../../service/guard.service";

import {CaseListComponent} from "./case-list/case-list.component";
import {CaseDetailComponent} from "./case-detail/case-detail.component";
import {CaseTabsAnotherComponent} from "./case-tabs/case-tabs-another/case-tabs-another.component"
import {CaseTabsCompleteComponent} from "./case-tabs/case-tabs-complete/case-tabs-complete.component"
import {CaseTabsMaterialsComponent} from "./case-tabs/case-tabs-materials/case-tabs-materials.component"
import {CaseTabsRealComponent} from "./case-tabs/case-tabs-real/case-tabs-real.component"
import {CaseTabPreviewComponent} from "./case-tabs/case-tab-preview/case-tab-preview.component"
const routes: Routes = [
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full"
    },
    {
        path: "list",
        component: CaseListComponent,
        canActivate: [GuardService],
        data:{
            breadcrumb:"案例列表"
        }
    },
    {
        path:"preview",
        component:CaseTabPreviewComponent,
        canActivate:[GuardService]
    },
    {
        path: "detail",
        component: CaseDetailComponent,
        canActivate: [GuardService],
        data:{
            breadcrumb:"案例详情"
        },
          children:[
              {
                  path:"",
                  redirectTo:"cost",
                  pathMatch:"full"
              },
              {
                  path:"another",
                  component:CaseTabsAnotherComponent,
                  canActivate:[GuardService]
              },
              {
                  path:"complete",
                  component:CaseTabsCompleteComponent,
                  canActivate:[GuardService]
              },
              {
                  path:"materials",
                  component:CaseTabsMaterialsComponent,
                  canActivate:[GuardService]
              },
              {
                  path:"real",
                  component:CaseTabsRealComponent,
                  canActivate:[GuardService]
              },
          ]
      }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CaseRoutingModule {
}
