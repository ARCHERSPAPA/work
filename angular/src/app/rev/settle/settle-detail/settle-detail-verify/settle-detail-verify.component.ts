import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Messages} from "../../../../model/msg";
import {atob} from "../../../../model/methods";

@Component({
  selector: 'rev-settle-detail-verify',
  templateUrl: './settle-detail-verify.component.html',
  styleUrls: ['./settle-detail-verify.component.scss']
})
export class SettleDetailVerifyComponent implements OnInit {

	public aid:string;
	public verify:Array<any>;

	constructor(private req:RequestService,
				private warn:WarningService,
				private activatedRoute:ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params =>{
			if(params && params["aid"]){
				this.aid = atob(params["aid"]);
				this.loadVerify(this.aid);
			}
		})
	}

	loadVerify(aid){
		if(this.aid){
			this.req.doPost({
				url:"veriftyLabourExpenses",
				data:{id:aid},
				success:(res =>{
					if(res && res.code == 200){
						this.verify = res.data;
					}else{
						this.warn.onError(res.msg || Messages.FAIL.DATA);
					}
				})
			})
		}
	}

}
