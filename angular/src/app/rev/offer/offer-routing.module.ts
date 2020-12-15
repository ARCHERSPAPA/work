import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from '../../service/guard.service';
import { ContractComponent } from '../detail/contract/contract.component';
import { GraphComponent } from '../detail/graph/graph.component';
import { uploaderFileComponent } from '../detail/uploader-file/uploader-file.component';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { OfferListComponent } from './offer-item/offer-list/offer-list.component';
import { OfferDetailComponent } from './offer-item/offer-detail/offer-detail.component';
import {ItemPriceComponent} from "../detail/item-price/item-price.component";
import {ItemMakingsComponent} from "../detail/item-makings/item-makings.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'item',
        pathMatch: 'full'
    },
    {
        path: 'item',
        component: OfferItemComponent,
        data: {
            breadcrumb: '报价列表'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: OfferListComponent,
                canActivate: [GuardService]
            },
            {
                path: 'detail',
                component: OfferDetailComponent,
                data: {
                    breadcrumb: '详情'
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'price',
                        pathMatch: 'full'
                    },
                    {
                        path: 'price/:state',
                        component: ItemPriceComponent,
                        canActivate: [GuardService]
                    },
                    {
                        path: 'uploaderFile/:state',
                        component: uploaderFileComponent,
                        canActivate: [GuardService]
                    },
                    {
                        path: 'making/:state',
                        component: ItemMakingsComponent,
                        canActivate: [GuardService]
                    },
                    {
                        path: 'contract/:state',
                        component: ContractComponent,
                        canActivate: [GuardService]
                    },
                    {
                        path: 'graph/:state',
                        component: GraphComponent,
                        canActivate: [GuardService]
                    }
                ]
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
export class OfferRoutingModule {
}
