import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { OrderDetailMaterialsComponent } from "./order-detail/order-detail-materials/order-detail-materials.component";
import { OrderDetailSchedulesComponent } from "./order-detail/order-detail-schedules/order-detail-schedules.component";
import { OrderDetailGraphComponent } from "./order-detail/order-detail-graph/order-detail-graph.component";
import { ItemOrdersComponent } from "./item-orders/item-orders.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full"
  },
  {
    path: "list",
    component: OrderListComponent,
    data: {
      customBreadcrumb: "订单列表",
    }
  },
  {
    path: "detail",
    component: OrderDetailComponent,
    data: {
      customBreadcrumb: "订单详情",
      color: "#FFF"
    },
    children: [
      {
        path: "",
        redirectTo: "materials",
        pathMatch: "full"
      },
      {
        path: "materials",
        component: OrderDetailMaterialsComponent
      },
      {
        path: "schedules",
        component: OrderDetailSchedulesComponent
      },
      {
        path: "graph",
        component: OrderDetailGraphComponent
      }
    ]
  },
  {
    path: "item",
    component: ItemOrdersComponent,
    data: {
      customBreadcrumb: "打印订单"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {
}
