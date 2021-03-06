import {Component, OnInit} from '@angular/core';
import {QuoteService} from '../../../../service/quote.service';
import {Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';
import {getIndexByUrl} from '../../../../model/methods';
import {Default} from '../../../../model/constant';

@Component({
    selector: 'rev-settle-wage-detail',
    templateUrl: './wage-detail.component.html',
    styleUrls: ['./../../settle.component.scss', '../../../detail/tab.scss', './wage-detail.component.scss']
})
export class SettleWageDetailComponent implements OnInit {

    public title: string;
    public tabs: Array<any>;

    public aid: number;
    public cid: number;
    public loading = false;
    public index = 0;

    constructor(private quote: QuoteService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {

        this.title = '工费结算';
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['aid']) {
                this.aid = params['aid'];
            }
            if (params && params['cid']) {
                this.cid = params['cid'];
            }
        });

        this.tabs = [
            {
                name: '收款情况',
                url: 'cost'
            },
            {
                name: '申请记录',
                url: 'record'
            },
            {
                name: '审核记录',
                url: 'verify'
            },
            {
                name: '项目方量',
                url: 'quantity'
            }];


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

    tabClick(url: string) {
        this.router.navigate(['./' + url + ''], {queryParams: {cid: this.cid, aid: this.aid}, relativeTo: this.activatedRoute});
        // this.router.navigate(['./' + url+ ''], {
        //     queryParams: params,
        //     relativeTo: this.activatedRoute
        // });
    }
}
