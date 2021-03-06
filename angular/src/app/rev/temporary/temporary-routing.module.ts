import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

const routes:Routes = [
    {
        path: 'module',
        loadChildren: './../template/temp.module#TempModule',
        data:{
          breadcrumb:"临时模块"
        }
    }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TemporaryRoutingModule { }
