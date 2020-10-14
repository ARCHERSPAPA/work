import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Default } from '../../../../model/constant';
import { RequestService } from '../../../../service/request.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { btoa } from '../../../../model/methods';
import {compiledTplId} from '../../../../model/methods';
import {FormBuilder, FormGroup, FormControlName, Validators, FormControl} from '@angular/forms';
import * as UserValidate from '../../../../validate/user-validate';
import { TempSuitListService } from './temp-suit-list.service'

@Component({
  selector: 'rev-temp-suit-list',
  templateUrl: './temp-suit-list.component.html',
  styleUrls: ['./temp-suit-list.component.scss','./../../temp-basic/temp-basic-list/temp-basic-list.component.scss','./../../template.component.scss']
})
export class TempSuitListComponent implements OnInit {

  	public title: string;
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

    public dataSource: Array<any>;


    public loading = false;

    public mealForm: FormGroup;
    public mealName: string;
    public price: number;
    public areaStart: number;
    public areaEnd: number;
    //户型数组
    public hxArray: Array<any> = [];
    public isVisible = false;
    public remark: string;

	public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
	public total: number = Default.PAGE.PAGE_TOTAL;
	public saleList:Array<any> = []; // 表格数据
	public isAllDisplayDataChecked: boolean;
	public indeterminate = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private request: RequestService,
        private warn: WarningService,
        private fb: FormBuilder,
        private tempSuitListService: TempSuitListService
	) { }

	ngOnInit() {
		this.title = '套装管理';
		this.buttons = [{
			color: 'btn-primary',
			name: '创建'
        }];
        this.mealForm = this.fb.group({
            mealName: ['', [
                Validators.required,
                Validators.maxLength(30)
            ]
            ],
            price: ['', [
                Validators.required,
                UserValidate.ValidatePrice,
            ]
            ],
            areaStart: ['', [
                Validators.required,
                UserValidate.ValidatePrice]
            ],
            areaEnd: ['', [
                Validators.required,
                UserValidate.ValidatePrice]
            ],
            remark: ['', [
                Validators.maxLength(300)
            ]]
        });
		this.activatedRoute.queryParams.subscribe((params) => {
            if (params) {
				this.state = params["state"] ? Number(params["state"]):1;
                this.defaultRadio = this.state > 0? this.radioSwitch[0]:this.radioSwitch[1];
                if (params["page"]) {
                    this.pageNo = params["page"] > 0 ? params["page"] : Default.PAGE.PAGE_NO;
                }
				this.changeData();
            }
        })

	}
	/**
     * title 回调函数
     * @param e
     */
    handleName(e) {
        if (e === this.buttons[0].name) {
            this.showModal();
        }
    }

    /**
     * 打开弹出框
     */
    showModal() {
        this.mealForm.reset();
        this.hxArray = [];
        this.mealName = '';
        this.price = null;
        this.areaStart = null;
        this.areaEnd = null;
        this.remark = '';
        this.addHx();
        this.isVisible = true;
    }

    /**
     * 新增户型单元
     */
    addHx() {
        const id = (this.hxArray.length > 0) ? this.hxArray[this.hxArray.length - 1].id + 1 : 0;
        const control = {id, room: `room${id}`, bath: `bath${id}`};
        const index = this.hxArray.push(control);
        this.mealForm.addControl(this.hxArray[index - 1].room, new FormControl(null, [
            Validators.required,
            Validators.max(99)
        ]));
        this.mealForm.addControl(this.hxArray[index - 1].bath, new FormControl(null, [
            Validators.required,
            Validators.max(99)
        ]));
    }

    /**
     * 删除户型
     * @param {number} index
     */
    delHx(control: any, index: number, e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.hxArray.length > 1) {
            this.mealForm.removeControl(control.room);
            this.mealForm.removeControl(control.bath);
            this.hxArray.splice(index, 1);
        }
    }
    /**
     * 新增户型
     */
    handleOk(): void {
        const that = this;
        if (that.mealForm.valid) {
            if (Number(that.areaStart) <= Number(that.areaEnd)) {
                // const companyId = this.user.getCompanyId();
                const params = {
                    packageType: 1,
                    packageName: that.mealName,
                    price: that.price,
                    houseArea: that.areaStart + '㎡-' + this.areaEnd + '㎡',
                    roomType: that.getHxByParams(this.mealForm.value),
                    remark: that.remark
                };
                this.tempSuitListService.createVersion(params).then(data=>{
                    that.handleCancel()
                    that.changeData();
                    that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
                }).catch(err=>{
                    that.handleCancel()
                    this.warn.onMsgError(err);
                })
            } else {
                that.warn.onMsgWarn(Messages.AREAS);
            }
        }
    }

    /**
     * 取消添加户型
     */
    handleCancel(): void {
        this.isVisible = false;
    }

    getHxByParams(values) {
        const arr = [];
        if (values) {
            this.hxArray.forEach(item => {
                arr.push(values[item.room] + '室' + values[item.bath] + '卫');
            });
        }
        return arr;
    }

    /* 已上架-未上架
     * @param 1已上架 0未上架
     */
	handleSwitch(e) {
        this.state = e;
        this.resetData();
	}

	changeData(...args) {
        const that = this;
        that.loading = true;
        if (args && args.length > 0) {
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        const params = {
            pageNo: this.pageNo,
            packageType: 1,
            state:this.state
        };
        this.tempSuitListService.getVersionPackageList(params).then(data=>{
            that.loading = false;
            if (data && data.list && data.list.length > 0) {
                data.list.forEach(item => {
                    item.roomType = JSON.parse(item.roomType);
                });
                data.list.filter(v => {
                    v['checked'] = false;
                });
            }
            that.saleList = data.list;
            this.isAllDisplayDataChecked = false;
            this.indeterminate = false;
            that.total = data.total;
        }).catch(err=>{
            that.loading = false;
            this.warn.onError(err);
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
                params['type'] = 3;
                break;
        }
        this.tempSuitListService.operatePackage('operationPackageBySuit',params).then(data=>{
            that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
            that.checkedNumber = []
            that.changeData();
        }).catch(err=>{
            this.warn.onMsgError(err);
        })
    }

	// 表格操作
	handleOperate(str, item){
		const that = this;
        const params = {};
        let url = '';
        switch (str) {
            case 'del':
                url = 'operationPackageBySuit';
                params['type'] = 3;
                params['ids'] = [item.id];
                break;
            case 'copy':
                url = 'copyPackageBySuit';
                params['id'] = item.id;
                break;
            case 'on':
                url = 'operationPackageBySuit';
                params['type'] = 1;
                params['ids'] = [item.id];
                break;
            case 'off':
                url = 'operationPackageBySuit';
                params['type'] = 2;
                params['ids'] = [item.id];
                break;
        }
        this.tempSuitListService.operatePackage(url,params).then(data=>{
            that.warn.onMsgSuccess(data || Messages.SUCCESS.DATA);
            that.checkedNumber = []
            that.changeData();
        }).catch(err=>{
            this.warn.onMsgError(err);
        })
	}
	

	btoa(id: string) {
		return btoa(id);
	}

}
