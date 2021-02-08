import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchedulesComponent} from "./schedules.component";

const routes:Routes = [
  {
    path:"",
    redirectTo:"list",
    pathMatch:"full"
  },
  {
    path:"list",
    component:SchedulesComponent,
    data:{
      customBreadcrumb: null
    }
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class SchedulesRoutingModule { }
