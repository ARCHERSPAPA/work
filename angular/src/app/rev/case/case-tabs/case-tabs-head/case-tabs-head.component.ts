import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WarningService} from "../../../../service/warning.service";
import {atob, getCaseName} from "../../../../model/methods";
import {SettleService} from "../../../../service/settle.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from "../../../../plugins/info/info.component";
import {Messages} from "../../../../model/msg";
import { Router } from '@angular/router'
@Component({
    selector: 'rev-case-tabs-head',
    templateUrl: './case-tabs-head.component.html',
    styleUrls: ['./case-tabs-head.component.scss']
})
export class CaseTabsHeadComponent implements OnInit {
    public case: any = [];
    //主键Id
    public cid: string;
    public loading: string;
    //项目编号
    public quoteNo: string;
    //判断是新增还是详情2.2.3
    public newcase: boolean = false;//true为新增时的功能
    

    constructor(private activatedRoute: ActivatedRoute,
                private warn: WarningService,
                private modal: NgbModal,
                private router: Router,
                private settle: SettleService) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && !params["newcase"]) {
                this.quoteNo = atob(params["quoteNo"]);
                this.cid = atob(params["aid"]);
                this.loadSettleHead(this.quoteNo, 1);
            }
            else {
                this.newcase = params["newcase"];
                //其他案例中的详情初始化
                if (params && params["quoteNo"]) {
              ;
                    this.quoteNo = atob(params["quoteNo"]);
                    this.loadSettleHead(this.quoteNo, 0);
                }
                if (params && params["aid"]) {
                    this.cid = atob(params["aid"])
                //   this.loadSettleHead(this.quoteNo, 0);
              }
            }
        });
    }
    //获取ID
  ngDoCheck() {
    if (this.settle.getCaseData() && this.newcase) {
        this.quoteNo = this.settle.getCaseData().quoteId;
    }else{
      if(this.settle.getCaseData() &&this.settle.getCaseData().quoteNo){
        this.quoteNo = this.settle.getCaseData().quoteNo;
      }
    }
}

    loadSettleHead(quoteNo, type) {
        if (this.newcase) {
            this.settle.newLoadCaseHead(quoteNo, type).then(res => {
                this.case = res;
                this.settle.setCaseData(this.case);
            }).catch(err => {
                this.warn.onError(err);
            })
        } else {
            this.settle.loadCaseHead(quoteNo)
                .then(res => {
                        this.case = res;
                        this.settle.setCaseData(this.case);
                }).catch(err => {
                // console.log(err);
                this.warn.onError(err.msg || Messages.FAIL.DATA);
            })
        }
    }

    showModal() {
        let that = this;
        this.case['newcase'] = this.newcase;
        if(this.quoteNo){
          this.case['quoteId'] = this.quoteNo;
        }else{
          this.case['quoteId'] ='';
        }
        let info = that.modal.open(InfoComponent, {
            centered: true,
            keyboard: true,
            backdrop: "static"
        });
        info.componentInstance.type = 12;
        // info.componentInstance.id = that.aid;
        info.componentInstance.user = this.case;
        info.result.then((res) => {
            //区别新建时，tab的高亮
            let url;
            if( this.router.url.match('materials')){
                url='materials'
            }else{
                url='real'
            }
            this.router.url.split('materials');
                if(!this.quoteNo){
                  this.router.navigate([`/rev/case/detail/${url}`], { queryParams: { newcase: true,quoteNo:btoa(res)} });
                }
            //新建时的CASE数据
                if (this.newcase) {
                    this.settle.newLoadCaseHead(res, 0).then(res => {
                        this.case = res;
                        this.settle.setCaseData(this.case);
                    }).catch(err => {
                        this.warn.onError(err);
                    })
                } else {
                    this.settle.loadCaseHead(this.quoteNo).then(res => {
                        this.case = res;
                        this.settle.setCaseData(this.case);
                    }).catch(err => {
                        this.warn.onError(err);
                    })
                }
            },
            (rea) => {
            })
    }

    getcaseName(state) {
        return getCaseName(state);
    }
}
