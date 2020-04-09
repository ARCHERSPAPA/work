import { Component, OnInit } from '@angular/core';
import {WarningService} from "../../service/warning.service";
import {Default} from "../../model/constant";
import {QuoteService} from "../../service/quote.service";
import {RequestService} from "../../service/request.service";
import {ConfigService} from "../../service/config.service";
import {ActivatedRoute} from '@angular/router';
import {bounceAnimate} from "../../animation/transform.component";
import {atob} from "../../model/methods";

@Component({
  selector: 'rev-view-explain',
  templateUrl: './view-explain.component.html',
  styleUrls: ['./../../rev/detail/detail.scss', './../../rev/detail/price/price.component.scss'],
  animations:[bounceAnimate]
})
export class ViewExplainComponent implements OnInit {

    public data:any;

    public state: number = Default.STATE.ITEM_1;

    constructor(private request: RequestService,
                private warn: WarningService,
                private quote: QuoteService,
                private config: ConfigService,
                private activatedRoute: ActivatedRoute) {
    }


    ngOnInit() {
        try {
            this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));
        }
        catch (e) {
            this.state = Default.STATE.ITEM_1;
        }

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params["cid"]) {
                this.reloadData(atob(params["cid"]));
            }
        });

    }

    /**
     * 重新渲染数据（body）
     */
    reloadData(cid){
        let p = new Promise((resolve,reject)=>{
            this.quote.loadDataSimple(cid,resolve,reject);
        });
        p.then((res) =>{
            this.data = res;
            if(res){
                let array = res;
            }
            this.data = this.data.filter(d =>{
                return d.type === Default.OFFER_ITEM.ITEM_1;
            });
        }).catch(err =>{
            this.warn.onError(err);
        })
    }

    ngOnDestroy() {
        // this.quote.resetQuotePrice();
    }

}
