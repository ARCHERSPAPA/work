import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../service/request.service";
import { WarningService } from "../../../service/warning.service";
import { Messages } from "../../../model/msg";
import {FormGroup,FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'rev-master-class-restrict',
  templateUrl: './master-class-restrict.component.html',
  styleUrls: ['./master-class-restrict.component.scss','./../master.component.scss']
})
export class MasterClassRestrictComponent implements OnInit {

	public title: string;
	public radioSwitch: Array<any> = [];
	public state: number = 1;

	// 表格
	public restrictLsit:Array<any> = [];

	//限制弹窗
    public isLimitVisible = false;
    public limitForm: FormGroup;
	public limitOrder:string;
	public id:any;

	constructor(
		private req: RequestService,
        private warn: WarningService,
        private fb: FormBuilder
	) { }

	ngOnInit() {
		this.title = '类别限制';
		this.radioSwitch = [
            {
                key: 1,
                text: "主材"
            },
            {
                key: 2,
                text: "辅材"
            }
		];
		//限制
        this.limitForm = this.fb.group({
            limitOrder: [this.limitOrder, [
				Validators.required
			]]
		});
		this.changeData();
	}

	changeData(){
		this.req.doPost({
			url: 'astrictList',
			data: {materialType:this.state},
			success: (res => {
				if (res && res.code === 200) {
					this.restrictLsit = res.data;
				} else {
					this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
				}
			})
		});
	}

	//tab 切换
    handleSwitch(e: number) {
        this.state = e;
        this.changeData();
	}
	
	// 限制操作弹窗
	limitModal(type,id){
		this.isLimitVisible = true;
		this.limitOrder = String(type);
		this.id = id
	}

	handleCancel(){
		this.isLimitVisible = false;
		this.id = null;
        this.limitForm.reset();
	}
	
	handleOk(){
		if(this.limitForm.valid){
			let params = {
				materialType:this.state,
				id:this.id,
				type:this.limitForm.value['limitOrder']
			}
			this.req.doPost({
				url: 'astrictEdit',
				data: params,
				success: (res => {
					if (res && res.code === 200) {
						this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
						this.changeData();
						this.handleCancel();
					} else {
						this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
					}
				})
			});
		}
	}

	getTypeName(type){
		switch(type) {
			case 1:
			  	return '不限制'
			case 2:
				return '标品订单'
			case 3:
				return '定制订单'
			default:
			   return;
	   } 
	}

}
