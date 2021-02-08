import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from "./pages.component";
import {EMenuKeys, EMenuNames} from "../enums/e-menus.enum";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        redirectTo: "schedule",
        pathMatch: "full"
      },
      {
        path: "schedule",
        data: {
          customBreadcrumb: EMenuNames.SCHEDULE_LIST,
          key:EMenuKeys.SCHEDULE_LIST
        },
        loadChildren: () => import("./schedules/schedules.module").then(p => p.SchedulesModule)
      },
      {
        path: "order",
        data: {
          customBreadcrumb: EMenuNames.ORDER,
          key:EMenuKeys.ORDER_LIST
        },
        loadChildren: () => import("./orders/orders.module").then(p => p.OrdersModule)
      },
      {
        path: "settle",
        data: {
          customBreadcrumb: EMenuNames.SETTLE,
          key:EMenuKeys.SETTLE_LIST
        },
        loadChildren: () => import("./settles/settles.module").then(p => p.SettlesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
