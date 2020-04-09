import { Component, OnInit } from '@angular/core';
import {Default} from "../../../../model/constant";
import {QuoteService} from "../../../../service/quote.service";
import {getIndexByUrl} from "../../../../model/methods";
import {Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel} from '@angular/router';

@Component({
  selector: 'rev-cost-budget-detail',
  templateUrl: './cost-budget-detail.component.html',
  styleUrls: ['./../../cost.component.scss', './../../../detail/tab.scss','./cost-budget-detail.component.scss']
})
export class CostBudgetDetailComponent implements OnInit {
    //报价id
    public cid:string;
    //成本核算
    public pid:string;
    public index:number=0;
    public tabs: Array<any>;
    public loading:boolean = false;

    //切换按钮控制
    public radioSwitch = [{
        key: 1,
        text: '预算'
    }, {
        key: 0,
        text: '成本'
    }];

    constructor(private quote:QuoteService,
                private router:Router,
                private activatedRoute:ActivatedRoute) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params =>{
            if(params && params["cid"]){
                this.cid = params["cid"];
            }
            if(params && params["pid"]){
                this.pid = params["pid"];
            }
        })
        this.tabs = [
            {
                name: "预算",
                url:"price",
                params:{
                    cid:this.cid,
                    pid:this.pid
                }
            },
            {
                name: "材料清单",
                url:"makings",
                params:{
                    cid:this.cid,
                    pid:this.pid
                }
            },
            {
                name: "合同",
                url:"contract",
                params:{
                    cid:this.cid,
                    pid:this.pid
                }
            },
            {
                name: "设计图纸",
                url:"graph",
                params:{
                    cid:this.cid,
                    pid:this.pid
                }
            },

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


    /**
     * 切换
     * @param {number} status
     */
    handleSwitch(key: number) {
        if (key === 1) {
            this.router.navigate(["/rev/cost/budget/detail/price", 6], {preserveQueryParams: true});
        } else {
            this.router.navigate(["/rev/cost/budget/costing", 6], {preserveQueryParams: true});
        }
    }
    tabClick(url,params){
        this.quote.setTypeByParam("head",true);
        this.router.navigate(['./'+url+'',Default.STATE.ITEM_6],{queryParams:params,relativeTo:this.activatedRoute});
    }

}
