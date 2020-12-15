import { Component, OnInit } from '@angular/core';
import {atob, btoa, getIndexByUrl} from "../../../../model/methods";
import {SettleService} from "../../../../service/settle.service";
import {WarningService} from "../../../../service/warning.service";
import {Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';

@Component({
  selector: 'rev-article-exception-detail',
  templateUrl: './article-exception-detail.component.html',
  styleUrls: ['./article-exception-detail.component.scss']
})
export class ArticleExceptionDetailComponent implements OnInit {

    public loading = false;
    public tabs: Array<any> = [];
    public state = 1;
    public id;
    public index = 0;
    public quote = {workerRemark: '', state: null, quoteId: ''};
    public materialId;
    public type;
    public cid;
    //1一般，2定制
    public materialType;
    constructor(private router: Router,
                private settle: SettleService,
                private activatedRoute: ActivatedRoute,
                private warn: WarningService) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['type']) {
                this.type = params['type'];
                this.materialId = atob(params['materialId']);
                this.id = atob(params['id']);
                this.materialType = params['materialType'];
            }

        });

        //判断当前url
        this.setData();

    }

    showRed() {
        if (this.quote && this.quote.workerRemark) {
            if (this.quote.state == 1 || this.quote.state == 43) {
                return true;
            }
        }
    }

    btoa(id: string) {
        return btoa(id);
    }

    renderTab() {
        this.tabs = [
            {
                name: '详情',
                url: 'info',
                params: {
                    type: this.type,
                    id: btoa(this.id),
                    materialId: btoa(this.materialId),
                    materialType: this.materialType
                }
            },
            {
                name: '进度',
                url: 'schedule',
                params: {
                    type: this.type,
                    id: btoa(this.id),
                    materialId: btoa(this.materialId),
                    materialType: this.materialType
                }
            },
            {
                name: '成本',
                url: 'cost',
                params: {
                    cid: btoa(this.cid),
                    type: this.type,
                    id: btoa(this.id),
                    materialId: btoa(this.materialId),
                    materialType: this.materialType
                }
            }
        ];
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

    setData() {
        this.settle.loadMaterialHead(this.id).then(res => {
            this.settle.setOrderData(res);
            this.quote = res['quote'];
            this.cid = res['quote'].quoteId;
            this.renderTab();
        }).catch(err => {
            this.renderTab();
            this.warn.onError(err);
        });
    }

    tabClick(url, params) {
        this.setData();
        this.router.navigate(['./' + url + ''], {
            queryParams: params,
            relativeTo: this.activatedRoute
        });

    }

}
