import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrderComponent} from "./order/order.component";
import {ErrorComponent} from "./error/error.component";

const routes: Routes = [
  {
    path:"order",
    component:OrderComponent
  },
  {
    path:"error",
    component:ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
