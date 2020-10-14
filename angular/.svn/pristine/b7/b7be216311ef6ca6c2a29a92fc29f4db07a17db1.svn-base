import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Default } from '../../../../model/constant';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { btoa } from '../../../../model/methods';
import {compiledTplId} from '../../../../model/methods';
import {TempBasicListService} from "./temp-basic-list.service";
import {FormBuilder, FormGroup,Validators} from '@angular/forms';

@Component({
  selector: 'rev-temp-basic-list',
  templateUrl: './temp-basic-list.component.html',
  styleUrls: ['./temp-basic-list.component.scss','./../temp-basic.component.scss']
})
export class TempBasicListComponent implements OnInit {
    public title: string;
    // 创建基装
	public editForm: FormGroup;
	public editVisible = false;
	public editName = '';
    public editRemark = '';
    public editNote = '';

	public buttons;
	public radioSwitch = [
		{
			key: 1,
			text: '已上架'
		},
		{
			key: 0,
			text: '未上架'
		}
	];
	public state = 1; // 0已上架 1未上架
	public defaultRadio: any; // 默认选中的单选框

	public checkedNumber:Array<any> = []; //选中的数据

	public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
	public total: number = Default.PAGE.PAGE_TOTAL;
	public saleList:Array<any> = []; // 表格数据
	public isAllDisplayDataChecked: boolean;
	public indeterminate = false;

	constructor(
        private router: Router,
        private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
        private warn: WarningService,
        private tempBasicListService:TempBasicListService,
	) { }

	ngOnInit() {
		this.title = '基装管理';
		this.buttons = [{
			color: 'btn-primary',
			name: '创建'
        }];
        this.editForm = this.fb.group({
            editName: ['', [
                Validators.required,
                Validators.maxLength(30)
            ]],
            editRemark: ['', [
                Validators.maxLength(300)
            ]],
            editNote: ['', [
                Validators.maxLength(5000)
            ]]
        });

		this.activatedRoute.queryParams.subscribe((params) => {
            if (params) {
				this.state = params["state"]?Number(params["state"]):1;
                this.defaultRadio = this.state > 0? this.radioSwitch[0]:this.radioSwitch[1];
                if (params["page"]) {
                    this.pageNo = params["page"] > 0 ? params["page"] : Default.PAGE.PAGE_NO;
                }
				this.changeData();
            }
        })

	}
	// 创建
	handleName($event) {
        // this.router.navigate(['./../edit'], { relativeTo: this.activatedRoute });
        this.editForm.reset();
        this.editVisible = true;
    } 
    
    /**
     * 创建基装的cancel
     */
    handleCancel() {
        this.editVisible = false;
    }

    /**
     * 创建基装的ok
     */
    handleOk() {
        const that = this;
        if (that.editForm.value) {
            const params = {}
            params['versionName'] = that.editForm.value['editName'].trim();
            if(that.editRemark){    
                params['remark'] = that.editForm.value['editRemark'].trim();
            }
            if(that.editNote){
                params['offerExplain'] = that.editForm.value['editNote'].trim();
            }
            this.tempBasicListService.modifyTitle(params).then(data=>{
                that.handleCancel();
                that.changeData();
                that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
            }).catch(err=>{
                that.handleCancel();
                that.warn.onMsgError(err);
            })
        }
    }

    /* 已上架-未上架
     * @param 1已上架 0未上架
     */
	handleSwitch(e) {
        this.state = e;
        this.resetData();
	}

	// 搜索框查询
	searchData(){
		this.pageNo = Default.PAGE.PAGE_NO;
		this.changePage();
	}

	changeData(...args) {
        const that = this;
        if (args && args.length > 0) {
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        const params = {
            pageNo: this.pageNo,
            state:this.state
        };
        this.tempBasicListService.getVersionMouldList(params).then(data=>{
            that.saleList = data.list;
            this.isAllDisplayDataChecked = false;
            this.indeterminate = false;
            if(that.saleList && that.saleList.length > 0){
                that.saleList.filter(v => {
                    v['checked'] = false;
                });
            }
            that.total = data.total;
        }).catch(err=>{
            that.warn.onError(err);
        })
    }

    //数据置为原始值域
    resetData(){
        this.pageNo = Default.PAGE.PAGE_NO;
        this.total = Default.PAGE.PAGE_TOTAL;
        this.indeterminate = false;
        this.isAllDisplayDataChecked = false;
        this.changePage();
    }
    
    //编译id
    getCompileById(id: number) {
        return compiledTplId(id);
    }

	//全选
	checkAll(e) {
        this.isAllDisplayDataChecked = e;
        this.saleList.forEach(item =>{
            item.checked = this.isAllDisplayDataChecked;
        })
        this.refreshStatus();
	}
	
	//单个选择
    refreshStatus() {
        const allChecked = this.saleList.every(value => value.checked === true);
        const allUnChecked = this.saleList.every(value => !value.checked);
        this.isAllDisplayDataChecked = allChecked;
		this.indeterminate = (!allChecked) && (!allUnChecked);
		this.checkedNumber = this.saleList.filter(value => value.checked);
	}
	// 翻页
	changePage(){
        this.checkedNumber = [];
		this.router.navigate(['./'], {
            queryParams: {
				page: this.pageNo,
				state: this.state
            }, relativeTo: this.activatedRoute
        });
    }
    //批量上下架
    versionShelve(str){
        const that = this;
        const params = {};
        let ids = [];
        this.checkedNumber.forEach(item=>{
            ids.push(item.id)
        })
        params['ids'] = ids;
        switch (str){
            case 'on':
                params['type'] = 1;
                break;
            case 'off':
                params['type'] = 2;
                break;
            case 'del':
                params['type'] = null;
                break;
        }
        this.tempBasicListService.tableOperate('downVersion',params).then(data=>{
            that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
            that.checkedNumber = []
            that.changeData();
        }).catch(err=>{
            that.warn.onError(err);
        })
    }

	// 表格操作
	handleOperate(str, item){
		const that = this;
        const params = {};
        let url = '';
        switch (str) {
            case 'del':
                url = 'downVersion';
                params['type'] = null;
                params['ids'] = [item.id];
                break;
            case 'copy':
                url = 'copyVersion';
                params['id'] = item.id;
                break;
            case 'default':
                url = 'downVersion';
                params['type'] = 3;
                params['ids'] = [item.id];
                break;
            case 'on':
                url = 'downVersion';
                params['type'] = 1;
                params['ids'] = [item.id];
                break;
            case 'off':
                url = 'downVersion';
                params['type'] = 2;
                params['ids'] = [item.id];
                break;
        }
        that.tempBasicListService.tableOperate(url,params).then(data=>{
            that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
            that.checkedNumber = []
            that.changeData();
        }).catch(err=>{
            that.warn.onError(err);
        })
	}
	

	btoa(id: string) {
		return btoa(id);
	}

}
