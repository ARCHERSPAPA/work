import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {GuardService} from '../../service/guard.service';
import {MasterListDetailComponent} from "./master-list-detail/master-list-detail.component";
import {MasterListComponent} from "./master-list-detail/master-list/master-list.component";
import {MasterDetailComponent} from "./master-list-detail/master-detail/master-detail.component";
import {MasterTempDetailComponent} from "./master-temp-detail/master-temp-detail.component";
import {MasterTempComponent} from "./master-temp-detail/master-temp/master-temp.component";
import {MasterAddComponent} from "./master-temp-detail/master-add/master-add.component";
import {MasterSaleDetailComponent} from "./master-sale-detail/master-sale-detail.component";
import {MasterSaleComponent} from "./master-sale-detail/master-sale/master-sale.component";
import {MasterSaleAddComponent} from "./master-sale-detail/sale-add/sale-add.component";
import {MasterPromotionDetailComponent} from "./master-promotion-detail/master-promotion-detail.component";
import {MasterPromotionComponent} from "./master-promotion-detail/master-promotion/master-promotion.component";
import {MasterPromotionMaterialsComponent} from "./master-promotion-detail/master-promotion-materials/master-promotion-materials.component";
import {MasterMaterialDetailComponent} from "./master-material-detail/master-material-detail.component";
import {MasterMaterialComponent} from "./master-material-detail/master-material/master-material.component";
import {MasterComboDetailComponent} from "./master-combo-detail/master-combo-detail.component";
import {MasterAuxiliaryComponent} from "./master-auxiliary-detail/master-auxiliary/master-auxiliary.component";
import {MasterAuxiliaryDetailComponent} from "./master-auxiliary-detail/master-auxiliary-detail.component";
import {MasterPackDetailComponent} from "./master-pack-detail/master-pack-detail.component";
import {MasterPackComponent} from "./master-pack-detail/master-pack/master-pack.component";
import {MasterPackMasterialsComponent} from "./master-pack-detail/master-pack-masterials/master-pack-masterials.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'listDetail',
        pathMatch: 'full'
    },
    {
        path: 'listDetail',
        component: MasterListDetailComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '主材列表'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: MasterListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'detail',
                component: MasterDetailComponent,
                canActivate: [GuardService],
            }
        ]
    },
    {
        path: 'tempDetail',
        component: MasterTempDetailComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '主材模板'
        },
        children: [
            {
                path: '',
                redirectTo: 'temp',
                pathMatch: 'full'
            },
            {
                path: 'temp',
                component: MasterTempComponent,
                canActivate: [GuardService]
            },
            {
                path: "add",
                component: MasterAddComponent,
                canActivate: [GuardService],
                data:{
                    breadcrumb:"主材编辑"
                }
            },
        ]
    },
    {
      path:"materialDetail",
      component:MasterMaterialDetailComponent,
      canActivate:[GuardService],
      data:{
          breadcrumb:'主材总览'
      },
      children:[
          {
            path:"",
            redirectTo:"material",
            pathMatch:"full"
          },
          {
              path:"material",
              component:MasterMaterialComponent,
              canActivate:[GuardService],
              data:{
                  breadcrumb:"总览列表"
              }
          }
      ]
    },
    {
        path:"auxiliaryDetail",
        component:MasterAuxiliaryDetailComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:'辅材总览'
        },
        children:[
            {
                path:"",
                redirectTo:"auxiliary",
                pathMatch:"full"
            },
            {
                path:"auxiliary",
                component:MasterAuxiliaryComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"总览列表"
                }
            }
        ]
    },
    {
        path:'combo',
        component:MasterComboDetailComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"套系说明"
        }
    },
    {
        path: 'saleDetail',
        component: MasterSaleDetailComponent,
        canActivate: [GuardService],
        data: {
            breadcrumb: '销售版本'
        },
        children: [
            {
                path: '',
                redirectTo: 'sale',
                pathMatch: 'full'
            },
            {
                path: 'sale',
                component: MasterSaleComponent,
                canActivate: [GuardService]
            },
            {
                path: 'add',
                component: MasterSaleAddComponent,
                canActivate: [GuardService],
                data:{
                    breadcrumb:"版本编辑"
                }
            }
        ]
    },
    {
        path:"promotionDetail",
        component:MasterPromotionDetailComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"活动管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component:MasterPromotionComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"活动列表"
                }
            },
            {
                path:"detail",
                component:MasterPromotionMaterialsComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"活动详情"
                }
            }
        ]
    },
    {
        path:"packDetail",
        component:MasterPackDetailComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"套餐管理"
        },
        children:[
            {
                path:"",
                redirectTo:"list",
                pathMatch:"full"
            },
            {
                path:"list",
                component:MasterPackComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"套餐列表"
                }
            },
            {
                path:"detail",
                component:MasterPackMasterialsComponent,
                canActivate:[GuardService],
                data:{
                    breadcrumb:"套餐详情"
                }
            }
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
export class MasterRoutingModule {
}
