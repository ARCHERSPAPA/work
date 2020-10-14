import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../../../../service/quote.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../../service/request.service';
import { getIndexByUrl } from '../../../../model/methods';
import { SettleService } from '../../../../service/settle.service';
import { WarningService } from '../../../../service/warning.service';
import { atob } from '../../../../model/methods';
import { btoa } from '../../../../model/methods';
@Component({
    selector: 'rev-settle-material-detail',
    templateUrl: './settle-material-detail.component.html',
    styleUrls: ['./settle-material-detail.component.scss']
})
export class SettleMaterialDetailComponent implements OnInit {
    public loading = false;
    public tabs: Array<any> = [];
    public state = 1;
    public id;
    public index = 0;
    public materialId;
    public type;
    constructor(
        private router: Router,
        private settle: SettleService,
        private activatedRoute: ActivatedRoute,
        private warn: WarningService,
    ) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['type']) {
                this.type = params['type'];
                this.materialId = atob(params['materialId']);
                this.id = atob(params['id']);
            }

        });
        this.tabs = [
            {
                name: '详情',
                url: 'info',
                params: {
                    type: this.type,
                    id: btoa(this.id),
                    materialId: btoa(this.materialId)
                }
            },
            {
                name: '进度',
                url: 'schedule',
                params: {
                    type: this.type,
                    id: btoa(this.id),
                    materialId: btoa(this.materialId)
                }
            },

        ];
        //判断当前url
        const url = this.router.url.split('detail');
        this.index = getIndexByUrl(url[1], this.tabs);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            } else if (event instanceof NavigationEnd) {
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            } else if (event instanceof NavigationCancel) {
                this.loading = false;
            }
        });

    }
    btoa(id: string) {
        return btoa(id);
    }
    tabClick(url, params) {
        this.settle.loadMaterialHead(this.id).then(res => {
            this.settle.setOrderData(res);
        }).catch(err => {
            this.warn.onError(err);
        });
        this.router.navigate(['./' + url + ''], {
            queryParams: params,
            relativeTo: this.activatedRoute
        });

    }
}
