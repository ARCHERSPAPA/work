import { Component, OnInit } from '@angular/core';
import { QuoteService } from "../../../../service/quote.service";
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import {Default} from "../../../../model/constant";
import {btoa, getIndexByUrl} from "../../../../model/methods";
@Component({
    selector: 'rev-article-regulation-detail',
    templateUrl: './article-regulation-detail.component.html',
    styleUrls: ['./../../article.component.scss', './../../../detail/tab.scss']
})
export class ArticleRegulationDetailComponent implements OnInit {

    public cid: string;

    //tab的参数
    public tabs: Array<any>;
    public loading: boolean = false;
    public index: number = 0;

    constructor(private quote: QuoteService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["cid"]) {
                this.cid = params["cid"];
            }
        })

          
        this.tabs = [
            {
                name: "预算",
                url:"price",
                params:{
                    cid:this.cid
                }
            },
            {
                name: "合同",
                url:"contract",
                params:{
                    cid:this.cid
                }
            }
  
        ];
        
        //判断当前url
        let url = this.router.url.split("detail");
         this.index = getIndexByUrl(url[1],this.tabs);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            } else if (event instanceof NavigationEnd) {
                setTimeout(()=>{
                    this.loading = false;
                },1500)
            } else if (event instanceof NavigationCancel) {
                this.loading = false;
            }
        })

    }
    tabClick(url,params){
        this.quote.setTypeByParam("head",true);
        this.router.navigate(['./'+url+'',Default.STATE.ITEM_5],{queryParams:params,relativeTo:this.activatedRoute});
    }

}
