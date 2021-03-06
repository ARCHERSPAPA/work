import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {Messages} from "../../../model/msg";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MasterComboService} from "./master-combo.service";

@Component({
    selector: 'rev-master-combo-detail',
    templateUrl: './master-combo-detail.component.html',
    styleUrls: ['./master-combo-detail.component.scss'],
    providers:[MasterComboService]
})
export class MasterComboDetailComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;
    //套系数据
    public combos:any;

    //弹出框说明
    public comboForm: FormGroup;
    public comboInfo: string;
    public isVisible: boolean = false;
    public editId: number;

    //全选
    public selectItems: Array<any> = [];

    public allChecked: boolean = false;
    public indeterminate: boolean = false;


    constructor(private req: RequestService,
                private warn: WarningService,
                private fb: FormBuilder,
                private masterCombo:MasterComboService) {
    }

    ngOnInit() {
        this.title = "套系说明";

        this.buttons = [
            {
                name: "创建",
                type: "primary"
            }
        ];

        this.comboForm = this.fb.group({
            comboInfo: [this.comboInfo, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30)
            ]]
        })

        this.getComboList();

    }

    /**
     * 拉取所有套系数据
     */
    getComboList() {
        this.masterCombo.getCombos().then(data =>{
            this.combos = this.renderData(data);
            this.refreshStatus();
        }).catch(err =>{
            this.warn.onMsgError(err);
        })
    }

    /**
     * 重构数据渲染
     * @param data
     * @returns {any}
     */
    renderData(data){
        if(this.combos && this.combos.length > 0){
            this.combos.forEach(combo =>{
                if(data && data.length > 0){
                    data.forEach(d =>{
                        if(d.id === combo.id){
                            d["checked"] = combo["checked"];
                        }
                    })
                }
            })
        }
        return data;
    }

    /**
     * 创建套系
     * @param e
     */
    handleName(e: any) {
        if (e === this.buttons[0].name) {
            this.openCombo();
        }
    }

    /**
     * 弹出套系编辑框
     * @param args
     */
    openCombo(...args) {
        if (args && args.length > 0) {
            this.editId = args[0].id;
            this.comboInfo = args[0].comboName;
        }
        this.isVisible = true;
    }

    /**
     * 新建或者编辑时确定提交时调用
     */
    handleOk() {
        if (this.comboForm.valid) {
            const reqUrl = this.editId ? "comboUpt" : "comboAdd";
            const params = {
                name: this.comboInfo
            };
            if (this.editId) {
                params["id"] = this.editId;
            }

            this.req.doPost({
                url: reqUrl,
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.getComboList();
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                    this.handleCancel();
                })
            })
        }
    }

    /**
     * 取消二次提示框
     */
    handleCancel() {
        this.comboInfo = null;
        this.editId = null;
        this.comboForm.reset();
        this.isVisible = false;
    }

    /**
     * 全选
     * @param {boolean} value
     */
    checkAll(value:boolean) {
        this.combos.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    /**
     * 单选
     */
    refreshStatus() {
        const allChecked = this.combos.every(combo => combo.checked === true);
        const allUnChecked = this.combos.every(combo => !combo.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.selectItems = this.combos.filter(combo => combo.checked === true);
    }

    //单个删除
    deleteItem(id){
        this.deleteCombos([id]);
    }

    //批量删除
    deleteItems(){
        const ids = [];
        this.selectItems.forEach(item => {
            ids.push(item.id);
        });
        this.deleteCombos(ids);
    }

    /**
     * 调用删除套系接口使用
     * @param {Array<any>} ids
     */
    deleteCombos(ids:Array<any>){
        if(ids && ids.length > 0){
            this.req.doPost({
                url:"comboDelete",
                data:{ids:ids},
                success:(res =>{
                    if(res && res.code == 200){
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.getComboList();
                    }else{
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }



}
