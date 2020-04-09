import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';
import {getIndexByUrl} from '../../../../model/methods';

@Component({
    selector: 'rev-audit-detail',
    templateUrl: './audit-detail.component.html',
    styleUrls: ['./../../settle.component.scss', './../../../detail/tab.scss', './audit-detail.component.scss']
})
export class AuditDetailComponent implements OnInit {

    public title: string;

    public aid: string;
    public cid: string;
    public tabs: Array<any>;
    public loading: boolean = false;
    public index: number = 0;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.title = '工费审核';
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
                name: '考勤详情',
                url: 'attend'
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
        let url = this.router.url.split('detail');
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
    }

}
