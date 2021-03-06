import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { cosh } from 'core-js/fn/number';
import {WarningService} from "../../../../service/warning.service";

@Component({
    selector: 'rev-master-common-promotion',
    templateUrl: './master-common-promotion.component.html',
    styleUrls: ['./master-common-promotion.component.scss']
})
export class MasterCommonPromotionComponent implements OnInit {



    public validateForm: FormGroup;
    public name: string;
    //公司id
    public companyId: string;
    public startTime: Date;
    public endTime: Date;
    public remark: string;

    // public isOkLoading:boolean = false;

    //是否禁用公司选择
    public disabledCompany:boolean = false;

    //区别显示title
    @Input() type:number = 1;
    //获取当前关联的合作公司
    @Input() companies:any;
    //当时选中时的数据
    @Input() form:any;
    //是否显示弹出框
    @Input() isVisible:boolean = false;
    //确定提交时
    @Output() confirmEmitter:EventEmitter<any> = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
                private warn:WarningService) {
    }


    ngOnInit() {
        if(this.form){
            this.name = this.form["name"];

        }

        this.validateForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30)
            ]],
            companyId: ['', [
                Validators.required
            ]],
            startTime: ['', [
                Validators.required
            ]],
            endTime: ['', []],
            remark: ['', [
                Validators.maxLength(300)
            ]]
        });
    }

    ngOnChanges(changes:SimpleChanges){
        if(changes.form && changes.form.currentValue){
            const values = changes.form.currentValue;
            this.name = values["name"];
            this.companyId = values["companyId"];
            this.remark = values["remark"];
            this.startTime = values["startTime"];
            this.endTime = values["endTime"];
            this.isVisible = true;
            if(this.type == 2){
                this.disabledCompany = true;
            }else{
                this.disabledCompany = false;
            }
        }
    }

    disabledStartDate = (st:Date):boolean =>{
        if(!st) return false;
        return st.getTime() <= new Date('2020/1/1').getTime() - 1;
    }

    disabledEndDate = (et:Date):boolean =>{
        if(!et) return false;
        return et.getTime() <= new Date(new Date().toLocaleDateString()).getTime() - 1;
    }

    modelChangeStartTime(e:Date){
        let st = new Date(e).getTime();
        if(this.endTime){
            let et = new Date(this.endTime).getTime();
            if(st > et){
                this.startTime = null;
                this.warn.onMsgWarn("最早可选择到当前时间，且早于结束时间")
            }
        }
    }

    modelChangeEndTime(e:Date){
        let et = new Date(e).getTime();
        if(this.startTime){
            let st = new Date(this.startTime).getTime();
            if(st > et){
                this.endTime = null;
                this.warn.onMsgWarn("开始时间必须晚于结束时间");
            }
        }
    }

    handleCancel (){
        this.isVisible = false;
        this.validateForm.reset();
    }

    handleOk(){
        if(this.validateForm.valid){
            this.confirmEmitter.emit(this.validateForm.value);
        }
    }


    getTitle(type:number){
        switch(type){
            case 1:return "新建活动";
            case 2: return "修改活动";
            default: return "修改活动";
        }
    }
}
