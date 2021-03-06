import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicModule} from '../../public/public.module';
import {DetailModule} from '../../public/detail.module';

import {TopicRoutingModule} from './topic-routing.module';

import {QuestionComponent} from './question/question.component';
import {QuestionListComponent} from './question/question-list/question-list.component';
import {QuestionDetailComponent} from './question/question-detail/question-detail.component';

import {ExamineComponent} from './examine/examine.component';
import {ExamineListComponent} from './examine/examine-list/examine-list.component';
import {ExamineDetailComponent} from './examine/examine-detail/examine-detail.component';
import {TopicTitleComponent} from './topic-title/topic-title.component';
import {TitleModule} from "../../public/title.module";

import {SearchSimpleBarModule} from "../../component/search-simple-bar/search-simple-bar.module";
@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        TitleModule,
        DetailModule,
        TopicRoutingModule,
        SearchSimpleBarModule
    ],
    declarations: [
        QuestionComponent,
        QuestionListComponent,
        QuestionDetailComponent,
        ExamineComponent,
        ExamineListComponent,
        ExamineDetailComponent,
        TopicTitleComponent
    ],
    exports: [
        TopicTitleComponent
    ]
})
export class TopicModule {
}
