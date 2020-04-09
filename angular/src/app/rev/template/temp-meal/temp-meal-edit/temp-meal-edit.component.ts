import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from "../../../../service/request.service";
import {FormGroup, FormBuilder, Validators,FormControl} from '@angular/forms';
import * as UserValidate from "../../../../validate/user-validate";
import {WarningService} from "../../../../service/warning.service";
import {Messages} from "../../../../model/msg";
import {UserService} from "../../../../service/user.service";
import {atob} from "../../../../model/methods";

@Component({
    selector: 'rev-temp-meal-edit',
    templateUrl: './temp-meal-edit.component.html',
    styleUrls: ['./../../template.component.scss','./temp-meal-edit.component.scss']
})
export class TempMealEditComponent implements OnInit {

    public mealForm: FormGroup;

    public sid: string;
    public companyId: number;
    //主要内容修改(参数)
    public isVisible:boolean = false;
    public mealName:string;
    public price:number;
    public areaStart:number;
    public areaEnd:number;
    public remark:string;
    public hxArray:Array<any> = [];

    public pkg:any;
    //说明
    public info:string;

    //数据列表
    public dataSource:Array<any> = [];

    //修改版本信息
    public isVersionVisible:boolean = false;
    public versionList:Array<any> = [];
    public typeForm:FormGroup;
    public selectType:any;

    //大项的添加或者修改
    public isBranchVisible:boolean = false;
    public branchForm:FormGroup;
    public branchName:string;
    public branchTitle:string;
    public branchItem:any;


    constructor(private activatedRoute: ActivatedRoute,
                private req: RequestService,
                private fb: FormBuilder,
                private warn:WarningService,
                private user:UserService) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["sid"]) {
                this.sid = atob(params["sid"]);
                this.loadData(this.sid);
            }
        });

        //套餐参数设置
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
        //版本修改或者增加
        this.typeForm = this.fb.group({
            selectType:['',[
                Validators.required
            ]]
        });
        //添加或者修改大项名称
        this.branchForm = this.fb.group({
            branchName:['',[
                Validators.required,
                Validators.maxLength(30)
            ]]
        })
    }


    /**
     * 加载头部基础数据
     * @param sid
     */
    loadData(sid){
        let that = this;
        if(sid){
            that.req.doPost({
                url:"packageInfo",
                data:{id:sid},
                success:(res =>{
                    if(res && res.code === 200){
                        res.data.pkg.roomType = JSON.parse(res.data.pkg.roomType);
                        that.pkg = res.data.pkg;
                        if(res.data && res.data.pkg && res.data.pkg.offerExplain){
                            that.info = res.data.pkg.offerExplain;
                        }
                        if(res.data && res.data.pkgInfoVo && res.data.pkgInfoVo.length > 0){
                            that.dataSource = res.data.pkgInfoVo;
                            that.dataSource.forEach(data =>{
                                data["expand"] = true;
                            })
                        }else{
                            that.dataSource = [];
                        }
                        that.setTitleParams(res.data.pkg);
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }

    }

    showModal(data){
        this.isVisible = true;
        this.setTitleParams(data);
    }

    setTitleParams(data){
        this.price = data.price;
        this.mealName = data.packageName;
        this.areaStart = data.houseArea.split("-")[0].split("㎡")[0];
        this.areaEnd = data.houseArea.split("-")[1].split("㎡")[0];
        this.remark = data.remark;
        this.hxArray = [];
        this.getHxArray(data.roomTypeList);
    }

    getHxArray(roomList){
        if(roomList && roomList.length > 0){
            for(let i = 0; i < roomList.length; i++){
                let control = {i, room: `room${i}`, bath: `bath${i}`};
                let index = this.hxArray.push(control);
                this.mealForm.addControl(this.hxArray[index - 1].room, new FormControl(roomList[i].room, [
                    Validators.required,
                    Validators.max(99)
                ]));
                this.mealForm.addControl(this.hxArray[index - 1].bath, new FormControl(roomList[i].toilet, [
                    Validators.required,
                    Validators.max(99)
                ]));
            }
        }else{
            this.addHx();
        }
    }

    handleCancel(){
        this.isVisible = false;
        this.mealForm.reset();
    }

    handleOk(e:any){
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        if(that.mealForm.valid && that.sid){
            if(Number(that.areaStart) < Number(that.areaEnd)){
                let companyId = this.user.getCompanyId();
                let params = {
                    companyId: companyId,
                    packageType: 3,
                    packageName: that.mealName,
                    price: that.price,
                    houseArea: that.areaStart + '㎡-' + this.areaEnd + '㎡',
                    roomType: that.getHxByParams(this.mealForm.value),
                    remark: that.remark,
                    id: that.sid
                };
                that.req.doPost({
                    url: "packageUpd",
                    data: params,
                    success: (res => {
                        that.handleCancel();
                        if (res && res.code == 200) {
                            that.loadData(that.sid);
                        } else {
                            that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })

            }else{
                that.warn.onMsgWarn(Messages.AREAS);
            }
        }

    }

    /**
     * 新增户型单元
     */
    addHx() {
        let id = (this.hxArray.length > 0) ? this.hxArray[this.hxArray.length - 1].id + 1 : 0;
        let control = {id, room: `room${id}`, bath: `bath${id}`};
        let index = this.hxArray.push(control);
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
    delHx(control: any,index:number, e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.hxArray.length > 1) {
            this.mealForm.removeControl(control.room);
            this.mealForm.removeControl(control.bath);
            this.hxArray.splice(index, 1);
        }
    }

    /**
     * 获取当前数组对象信息
     * @param values
     * @returns {any[]}
     */
    getHxByParams(values) {
        let arr = [];
        if (values) {
            this.hxArray.forEach(item => {
                arr.push(values[item.room] + '室' + values[item.bath] + '卫');
            })
        }
        return arr;
    }

    //拉取版本信息
    loadVersionData():Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"mouldNameList",
                data:{
                    versionType:3
                },
                success:function (res) {
                    if(res && res.code === 200){
                        resolve(res.data);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        })
    }

    showVersionModal(){
        this.isVersionVisible = true;
        if(this.versionList && this.versionList.length == 0){
            this.loadVersionData().then(res =>{
                this.versionList = res;
                this.initSelectType(this.versionList);
            }).catch(err =>{
                this.warn.onMsgError(err);
            });
        }else{
            this.initSelectType(this.versionList);
        }
    }

    initSelectType(list){
        if(list && list.length > 0 &&
            this.pkg && this.pkg.id > 0){
            let type = list.filter(item => item.id === this.pkg.versionId);
            if(type && type.length > 0){
                this.selectType = type[0];
            }
        }
    }

    handleVersionCancel(){
        this.isVersionVisible = false;
        this.typeForm.reset();
    }

    handleVersionOk(e:any){
        console.log(this.typeForm);
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        if(that.typeForm.valid){
            let params = {
                id: that.sid,
                versionName: that.typeForm.value.selectType.versionName,
                versionId: that.typeForm.value.selectType.id
            };
            that.req.doPost({
                url:"packageUpd",
                data:params,
                success:(res =>{
                    if(res && res.code == 200){
                        that.handleVersionCancel();
                        that.loadData(that.sid);
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }

    }

    /**
     * 添加或者修改大项（type=>1:添加，2：修改）
     * @param {number} type
     */
    showBranchModal(type:number = 1,...args){
        this.isBranchVisible = true;
        this.branchTitle = (type === 1)?"添加大项":"修改大项";
        if(args && args.length > 0){
            this.branchItem = args[0];
            this.branchName = this.branchItem.projectName;
        }else{
            this.branchItem = null;
        }

    }

    handleBranchOk(e:any){
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        if(that.branchForm.valid){
            let params = {};
            if(that.branchItem && that.branchItem.id){
                 params = {
                     id: that.branchItem.id,
                     projectName: that.branchForm.value.branchName
                 }
            }else{
                params = {
                    projectName: that.branchForm.value.branchName,
                    versionType: 3,
                    companyId: that.user.getCompanyId(),
                    packageId: that.sid
                };
            }
            that.req.doPost({
                url: (that.branchItem && that.branchItem.id > 0)? "packageInfoItemUpdate":"packageInfoParentAdd",
                data:params,
                success:(res =>{
                    that.handleBranchCancel();
                    if(res && res.code == 200){
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.loadData(that.sid);
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })

        }
    }

    handleBranchCancel(){
        this.isBranchVisible = false;
        this.branchForm.reset();
    }


    delBranchItem(id:number){
        if(id){
            this.req.doPost({
                url:"packageInfoRemove",
                data:{id:id},
                success:(res =>{
                    if(res && res.code ==200){
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadData(this.sid);
                    }else{
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    //保存说明
    handleSaveExplain(){
        let that = this;
        if(that.sid){
            that.req.doPost({
                url:"offerExplainUpd",
                data:{mouldPkgId:that.sid,offerExplain: that.info.trim()},
                success:(res =>{
                    if(res && res.code == 200){
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }
}
