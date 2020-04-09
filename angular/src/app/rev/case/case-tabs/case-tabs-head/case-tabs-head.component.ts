import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WarningService} from "../../../../service/warning.service";
import {atob,getCaseName} from "../../../../model/methods";
import {SettleService} from "../../../../service/settle.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from "../../../../plugins/info/info.component";

@Component({
  selector: 'rev-case-tabs-head',
  templateUrl: './case-tabs-head.component.html',
  styleUrls: ['./case-tabs-head.component.scss']
})
export class CaseTabsHeadComponent implements OnInit {


  public case: any;
  public aid: string;
  public cid:string;
  public loading: string;
  public quoteNo:string;

  constructor(private activatedRoute: ActivatedRoute,
              private warn: WarningService,
              private modal: NgbModal,
              private settle: SettleService) {
  }

  ngOnInit() {

      this.activatedRoute.queryParams.subscribe(params => {
          if (params && params["quoteNo"]) {
              this.aid = atob(params["aid"]);
              this.quoteNo=atob(params["quoteNo"]);
             
          }

      });
      this.loadSettleHead(this.quoteNo);

  }

  ngDoCheck(){
      if(this.settle.getCaseData()){
        this.case=this.settle.getCaseData();
      }
  }

  loadSettleHead(quoteNo){
      this.settle.loadCaseHead(quoteNo)
          .then(res =>{
              this.case = res;
              this.settle.setCaseData(this.case);
          }).catch(err =>{
              this.warn.onError(err);
      })
  }
showModal(){
    let that = this;
    let info = that.modal.open(InfoComponent, {
        centered: true,
        keyboard: true,
        backdrop: "static"
    });
    info.componentInstance.type = 12;
    info.componentInstance.id = that.aid;
    info.componentInstance.user=this.case;
    info.result.then((res) => {
        this.loadSettleHead(this.quoteNo);

        },
        (rea) => {
        })
}

getcaseName(state){
    return getCaseName(state);
    }
}
