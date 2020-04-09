import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {RequestService} from "../../../service/request.service";
import {Default} from "../../../model/constant";
import {atob} from "../../../model/methods";

@Component({
    selector: 'rev-product-log',
    templateUrl: './product-log.component.html',
    styleUrls: ['./product-log.component.scss']
})
export class ProductLogComponent implements OnInit {
    public productLogList;
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = 20;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public quoteId: string;

    constructor(
        private req: RequestService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params && params["cid"]) {
                this.quoteId = atob(params["cid"]);
                this.loadList();
            }
        });

    }

    loadList() {
        let param = {
            "pageNo": this.pageNo,
            "pageSize": this.pageSize,
            'quoteId': this.quoteId
        }
        this.req.doPost({
            url: "getProductList",
            data: param,
            success: (res => {
                this.total = res.data.pageCount;
                this.productLogList = res.data.pageSet;
            })
        })
    }

}
