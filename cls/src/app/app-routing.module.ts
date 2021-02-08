import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EMenuKeys} from "./enums/e-menus.enum";


const routes: Routes = [
  {
    path:"",
    redirectTo:"user",
    pathMatch:"full"
  },
  {
    path:"user",
    loadChildren:() => import("./user/user.module").then(m => m.UserModule)
  },
  {
    path:"pages",
    loadChildren:() => import("./pages/pages.module").then(m => m.PagesModule),
    data:{
      customBreadcrumb:"首页",
      key: EMenuKeys.SCHEDULE_LIST
    }
  },
  {
    path:"views",
    loadChildren:() => import("./views/views.module").then(m => m.ViewsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
