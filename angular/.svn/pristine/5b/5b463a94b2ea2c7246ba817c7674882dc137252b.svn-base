import { Component, OnInit } from '@angular/core';
import {QuoteService} from "../../../../service/quote.service";
import {Router, NavigationStart, NavigationEnd, NavigationCancel, ActivatedRoute} from '@angular/router';
import {btoa, getIndexByUrl} from "../../../../model/methods";
import {Default} from "../../../../model/constant";
@Component({
  selector: 'rev-article-notice-detail',
  templateUrl: './article-notice-detail.component.html',
  styleUrls: ['./../../article.component.scss','./../../../detail/tab.scss']
})
export class ArticleNoticeDetailComponent implements OnInit {

    public msg:string;
    public cid:string;
    public nid:string;

    // tab的参数
    public tabs: Array<any> = [];
    public index:number=0;
    public loading:boolean = false;
    
    constructor(private quote:QuoteService,
                private router:Router,
                private activatedRoute:ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params =>{
            if(params && params["cid"]){
                this.cid = params["cid"];
            }
        })

        this.activatedRoute.queryParams.subscribe(params =>{
            if(params && params["nid"]){
                this.nid = params["nid"];
            }
        })
        this.tabs = [
            {
                name: "预算",
                url:"price",
                params:{
                    cid:this.cid,
                    nid:this.nid
                }
            },
            {
                name: "合同",
                url:"contract",
                params:{
                    cid:this.cid,
                    nid:this.nid
                }
            },
            {
                name: "通知详情",
                url:"notice",
                params:{
                    cid:this.cid,
                    nid:this.nid
                }
            }
        ];
        let url = this.router.url.split("detail");
        this.index = getIndexByUrl(url[1],this.tabs);

  this.router.events.subscribe(event => {
     if(event instanceof  NavigationStart){
         this.loading = true;
     }else if(event instanceof  NavigationEnd){
         setTimeout(()=>{
             this.loading = false;
         },1000);
     }else if(event instanceof NavigationCancel){
         this.loading = false;
     }
  });
    }
    tabClick(url,params){
        this.router.navigate(['./'+url+'',Default.STATE.ITEM_8],{queryParams:params,relativeTo:this.activatedRoute});
    }

}
