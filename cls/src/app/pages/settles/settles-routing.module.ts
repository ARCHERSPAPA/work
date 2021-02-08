import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SettleListComponent} from "./settle-list/settle-list.component";


const routes: Routes = [
  {
    path:"",
    redirectTo:"list",
    pathMatch:"full"
  },
  {
    path:"list",
    component:SettleListComponent,
    data:{
      customBreadcrumb:"结算列表"
    }
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class SettlesRoutingModule { }
