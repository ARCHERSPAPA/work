import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicModule} from '../../public/public.module';
import {DetailModule} from '../../public/detail.module';
import {ArticleRoutingModule} from './article-routing.module';
import {ArticleSettingComponent} from './article-setting/article-setting.component';
import {ArticleNoticeComponent} from './article-notice/article-notice.component';
import {ArticleStayComponent} from './article-stay/article-stay.component';
import {ArticleItemComponent} from './article-item/article-item.component';
import {ArticleListComponent} from './article-item/article-list/article-list.component';
import {ArticleDetailComponent} from './article-item/article-detail/article-detail.component';
import {ArticleNoticeListComponent} from './article-notice/article-notice-list/article-notice-list.component';
import {ArticleNoticeDetailComponent} from './article-notice/article-notice-detail/article-notice-detail.component';

import {ArticleRegulationComponent} from './article-regulation/article-regulation.component';
import {ArticleRegulationDetailComponent} from './article-regulation/article-regulation-detail/article-regulation-detail.component';
import {ArticleRegulationListComponent} from './article-regulation/article-regulation-list/article-regulation-list.component';
import {TitleModule} from "../../public/title.module";
import {ArticleExceptionComponent} from './article-exception/article-exception.component';
import {SearchSimpleBarModule} from "../../component/search-simple-bar/search-simple-bar.module";
import { ArticleExceptionListComponent } from './article-exception/article-exception-list/article-exception-list.component';
import { ArticleExceptionDetailComponent } from './article-exception/article-exception-detail/article-exception-detail.component';
import {CostAccountModule} from "../../public/costAccount.module";
import {SettleDetailModule} from "../settle/settle-detail/settle-detail.module";
import {ExplainPipe,CheckHtml} from '../../pipes/explain.pipe';

@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        TitleModule,
        DetailModule,
        SearchSimpleBarModule,
        CostAccountModule,
        SettleDetailModule,
        ArticleRoutingModule
    ],
    declarations: [
        ArticleItemComponent,
        ArticleListComponent,
        ArticleDetailComponent,
        ArticleSettingComponent,
        ArticleNoticeComponent,
        ArticleStayComponent,
        ArticleNoticeListComponent,
        ArticleNoticeDetailComponent,
        ArticleRegulationComponent,
        CheckHtml,
        ArticleRegulationListComponent,
        ArticleRegulationDetailComponent,
        ArticleExceptionComponent,
        ArticleExceptionListComponent,
        ArticleExceptionDetailComponent
    ]
})
export class ArticleModule {
}
