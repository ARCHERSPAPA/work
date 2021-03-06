import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {StepsComponent} from './steps/steps.component';
import {MasterComponent} from './master/master.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'schedule',
        pathMatch: 'full'
    },
    {
        path: 'schedule',
        loadChildren: './schedule/schedule.module#ScheduleModule',
        data: {
            breadcrumb: '待办事项'
        }
    },
    {
        path: 'steps',
        component: StepsComponent,
        loadChildren: './steps/steps.module#StepsModule',
        data: {
            breadcrumb: '我要开店'
        }
    },
    {
        path: 'merchant',
        loadChildren: './merchant/merchant.module#MerchantModule',
        data: {
            breadcrumb: '商家资料'
        }
    },
    {
        path: 'personnel',
        loadChildren: './personnel/personnel.module#PersonnelModule',
        data: {
            breadcrumb: '人事管理'
        }
    },
    {
        path: 'supplier',
        loadChildren: './supplier/supplier.module#SupplierModule',
        data: {
            breadcrumb: '材料商管理'
        }
    },
    // {
    //     path: 'temp',
    //     loadChildren: './template/template.module#TemplateModule',
    //     data: {
    //         breadcrumb: '成本管理'
    //     }
    // },
    {
        path: 'case',
        loadChildren: './case/case.module#CaseModule',
        data: {
            breadcrumb: '案例管理'
        }
    },
    {
        path: 'master',
        loadChildren: './master/master.module#MasterModule',
        component: MasterComponent,
        data: {
            breadcrumb: '材料管理'
        }
    },
    {
        path: 'client',
        loadChildren: './client/client.module#ClientModule',
        data: {
            breadcrumb: '客户管理'
        }
    },
    {
        path: 'offer',
        loadChildren: './offer/offer.module#OfferModule',
        data: {
            breadcrumb: '报价管理'
        }
    },
    {
        path: 'finance',
        loadChildren: './finance/finance.module#FinanceModule',
        data: {
            breadcrumb: '账务管理'
        }
    },
    {
        path: 'account',
        loadChildren: './account/account.module#AccountModule',
        data: {
            breadcrumb: '基础信息'
        }
    },
    {
        path: 'article',
        loadChildren: './article/article.module#ArticleModule',
        data: {
            breadcrumb: '项目管理'
        }
    },
    {
        path: 'settle',
        loadChildren: './settle/settle.module#SettleModule',
        data: {
            breadcrumb: '项目结算'
        }
    },
    {
        path: 'warranty',
        loadChildren: './warranty/warranty.module#WarrantyModule',
        data: {
            breadcrumb: '售后管理'
        }
    },
    {
        path: 'product',
        loadChildren: './product/product.module#ProductModule',
        data: {
            breadcrumb: '产品管理'
        }
    },
    {
        path: 'salecs',
        loadChildren: './salecs/salecs.module#SalecsModule',
        data: {
            breadcrumb: '客服管理'
        }
    },
    {
        path: 'cost',
        loadChildren: './cost/cost.module#CostModule'
    },
    {
        path: 'temp',
        loadChildren: './temporary/temporary.module#TemporaryModule'
    },
    {
        path: 'notice',
        loadChildren: './notice/notice.module#NoticeModule',
        data: {
            breadcrumb: '公告'
        }
    },
    {
        path: 'topic',
        loadChildren: './topic/topic.module#TopicModule',
        data: {
            breadcrumb: '公告'
        }
    },
    {
        path: 'stats',
        loadChildren: './stats/stats.module#StatsModule',
        data: {
            breadcrumb: '数据统计'
        }
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RevRoutingModule {
}
