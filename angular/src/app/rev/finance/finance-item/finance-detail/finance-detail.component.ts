import {Component, OnInit} from '@angular/core';
import {bounceAnimate} from '../../../../animation/transform.component';
import {ActivatedRoute, NavigationStart, Router, NavigationEnd, NavigationCancel} from '@angular/router';
import {QuoteService} from '../../../../service/quote.service';
import {getIndexByUrl} from '../../../../model/methods';

@Component({
    selector: 'rev-finance-detail',
    templateUrl: './finance-detail.component.html',
    styleUrls: ['./../../finance.component.scss', './../../../detail/tab.scss'],
    animations: [
        bounceAnimate
    ]
})
export class FinanceDetailComponent implements OnInit {

    public msg: string;
    public mid: number;
    public cid: number;
    //tab的参数
    public tabs: Array<any>;
    public loading = false;
    public index = 0;

    constructor(private quote: QuoteService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['cid']) {
                this.cid = params['cid'];
            }
        });


        this.tabs = [
            {
                name: '合同'
            }

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
                }, 1500);
            } else if (event instanceof NavigationCancel) {
                this.loading = false;
            }
        });

    }





}
