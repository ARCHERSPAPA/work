import {NgModule} from '@angular/core';

// Module
import {CommonModule} from '@angular/common';
import {CopyrightModule} from '../public/copyright.module';
import {UploadModule} from '../public/upload.module';
import {RevRoutingModule} from './rev-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {PublicModule} from '../public/public.module';
import {StepsComponent} from './steps/steps.component';
import {MasterComponent} from './master/master.component';

// Service
import {QuoteService} from '../service/quote.service';
import {DepartService} from '../service/depart.service';
import {ArticleService} from '../service/article.service';
import {RichTextService} from '../service/rich-text.service';




@NgModule({
    imports: [
        CommonModule,
        CopyrightModule,
        UploadModule,
        PublicModule,
        RevRoutingModule,
        NgbModule.forRoot(),
    ],
    declarations: [
        StepsComponent,
        MasterComponent,
    ],
    providers: [
        DepartService,
        QuoteService,
        ArticleService,
        RichTextService,
    ]
})
export class RevModule {
}
