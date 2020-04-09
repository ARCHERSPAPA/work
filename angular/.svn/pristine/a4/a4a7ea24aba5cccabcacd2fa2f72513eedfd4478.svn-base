import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {QiNiuService} from "../../../../service/qi-niu.service";
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'

import {Default} from "../../../../model/constant";
import {WarningService} from "../../../../service/warning.service";
import {Messages} from "../../../../model/msg";

@Component({
  selector: 'rev-notice-inform-add',
  templateUrl: './notice-inform-add.component.html',
  styleUrls: ['./notice-inform-add.component.scss']
})
export class NoticeInformAddComponent implements OnInit {

    public config;

    public pageNo:number = Default.PAGE.PAGE_NO;
    public pageSize:number = Default.PAGE.PAGE_SIZE;
    public total:number = Default.PAGE.PAGE_TOTAL;

    // 人员选择
    public userType = '1'; //默认展示员工
    public isPersonVisible = false;
    public nodes:Array<any> = [];
    public allChecked = false;
    public indeterminate = false;
    public displayData = [];
    public workerListCopy = [];
    public storeData =[];
    public departmentId:string;
    public workerList:any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private request:RequestService,
        private qn: QiNiuService,
        private warn:WarningService
    ) { }

    ngOnInit() {
        this.loadDepartment()
        this.loadSourceList()
    }

    // 拉取部门信息
    loadDepartment(){
        let that = this;
        this.request.doPost({
            url:"listDepartAddEmp",
            data:{},
            success:(res =>{
                if(res && res.code == 200){
                    this.nodes = res.data;

                    for(let i=0;i<that.nodes.length;i++){
                        that.nodes[i]['title'] = that.nodes[i].name;
                        that.nodes[i]['value'] = that.nodes[i].id;
                        that.nodes[i]['key'] = that.nodes[i].id;
                        that.nodes[i]['isLeaf'] = !that.nodes[i].ownSubset;
                    }
                    that.nodes[0].selected = true;
                    that.departmentId = that.nodes[0].value;
                    that.changeData()
                }else{
                   that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    // 拉取子部门
    onExpandChange(e): void {
        const that = this;
        if (e.node.getChildren().length === 0 && e.node.isExpanded) {
            this.request.doPost({
                url:"listDepartSearch",
                data:{
                    superiorDepartmentId:e.node.key
                },
                success:(res =>{
                    if(res && res.code == 200){

                        for(let i=0;i< res.data.length;i++){
                            res.data[i]['title'] =  res.data[i].name;
                            res.data[i]['value'] =  res.data[i].id;
                            res.data[i]['key'] =  res.data[i].id;
                            res.data[i]['isLeaf'] = !res.data[i].ownSubset
                            // that.allStoreData.set(res.data[i].id,[])
                        }
                        // console.log(that.allStoreData)
                        e.node.addChildren(res.data)
                    }else{
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }
    // 根据id拉取部门人员列表
    onClick(e): void {
        this.pageNo = 1;
        this.pageSize = 20;
        this.departmentId = e.node.origin.id;
        this.changeData()
    }
    changeData(){
        let that = this;
        let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            state:0
        };
        if(this.departmentId){
            params["departmentId"] = this.departmentId;
        }
        let url;
        if(this.userType === '1'){
            url = 'listEmployee'
        }else if(this.userType === '2'){
            url = 'workerList'
        }
        this.request.doPost({
            url:url,
            data:params,
            success:(res =>{
                if(res && res.code == 200){
                    that.workerList = res.data.pageSet;
                    that.total = res.data.total;

                    for(let i=0;i<that.workerList.length;i++){
                        if(that.userType === '1'){
                            that.workerList[i].positionName =  that.workerList[i].positionName
                        }else if(that.userType === '2'){
                            that.workerList[i].positionName = that.workerList[i].workerType
                        }
                    }
                    // 回显
                    if (this.storeData.length > 0) {
                        that.workerList.forEach(data => {
                            for (let i = 0; i < this.storeData.length; i++) {
                                if (data.id === this.storeData[i].id) {
                                    data.checked = true;
                                }
                            }
                        })
                    }
                    that.workerListCopy = [...that.workerList]
                }else{
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    // 切换工人、员工
    handleUserType(){
        this.changeData()
    }

    // 显示人员选择弹层
    showPersonModal(): void {
        this.isPersonVisible = true;
    }
    PersonOk(): void {
        this.isPersonVisible = false;
    }
    PersonCancel(): void {
        this.isPersonVisible = false;
    }

    // 全选
    currentPageDataChange($event: Array<any>): void {
        this.displayData = $event;
        this.refreshStatus();
    }

    refreshStatus(){
        const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

        this.displayData.forEach(data => {
            if (data.checked) {
                // 加入前清除工人员工数据差异
                if(this.userType === '1'){
                    data["userType"] = 1
                    data["positionName"] =  data.positionName
                }else if(this.userType === '2'){
                    data["userType"] = 2
                    data["positionName"] = data.workerType
                }
                this.storeData.push(data)
            }else if(!data.checked){
                this.storeData.forEach((item,index) => {
                    if (item.id === data.id) {
                        this.storeData.splice(index, 1)
                    }
                });
            }
        });
        if(this.storeData.length > 0){
            this.storeData = this.distinct(this.storeData)
        }
        // console.log(this.storeData)
    }

    checkAll(value: boolean): void {
        this.displayData.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }
    // 根据id去重
    distinct(arr) {
        // var result = [];
        let obj = {};
        //设置cur默认类型为数组，并且初始值为空的数组;
        arr = arr.reduce((cur,next) => {
            obj[next.id] ? "" : obj[next.id] = true  && cur.push(next);
            return cur;
        },[])
        return arr;
    }

    // 标题、富文本
    public noticeTitle:string = "";
    public content:string = "";
    public editor;

    public quillLen:Number = 0
    // 富文本
    contentChanged(event) {
        console.log(event);
        if(this.editor.getLength(3)-1 > 5000){
            this.editor.deleteText(5000,this.editor.getLength(3)-1)
        }else{
            this.quillLen = this.editor.getLength(3)-1
            this.content = event.html?event.html:'';
            console.log(this.content)
        }
    }
    EditorCreated(quill) {
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.imageHandler.bind(this));
        this.editor = quill;
    }
    imageHandler() {
        const that = this;
        this.request.doPostImg({
            url: "token",
            success: (res => {
                if (res && res.code == 200) {
                    let token = JSON.parse(res.data).uptoken;
                    let url = JSON.parse(res.data).url;
                    this.qn.setToken(token);
                    this.qn.setDataUrl(url);
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept','image/png, image/gif, image/jpeg, image/bmp, image/x-icon');

        Imageinput.addEventListener('change', () => {
            const file = Imageinput.files[0];
            const that = this;
            this.qn.postImg(file,this.qn.getToken()).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                } else if (event instanceof HttpResponse) {
                    let src =  this.qn.getDataUrl() + "/" + event.body['key'];
                    const range = this.editor.getSelection(true);
                    const newRange = 0 + (range !== null ? range.index : 0)
                    const index = range.index + range.length;
                    this.editor.insertEmbed(range.index, 'image', src);
                    this.editor.setSelection(1 + newRange)
                }
            }, error => {
                console.log(JSON.stringify(error));
            });
        });
        Imageinput.click();
    }
    getImageType(name){
        return name.substring(name.lastIndexOf("."));
    }

    //时间选择
    public publishTime:any;
    public date: Date | null = null;
    public today = new Date().getTime();
    onChange(result: Date): void {
        if(result === null){
            this.publishTime = ''
        }else{
            this.publishTime = new Date(result).getTime()
        }

    }
    disabledDate = (current: Date): boolean => {
        return  new Date(current).getTime() < this.today;
    };

    // 选择素材
    public isShowMaterial = false;
    public materialQuery:string = "";
    public materialItem:string = '0';
    public materialList:Array<any> = [];
    loadSourceList(): void{
        let that = this;
        this.request.doPost({
            url:"noticeSourceList",
            data:{
                pageNum:1,
                pageSize: 1000,
                title:this.materialQuery
            },
            success:(res =>{
                if(res && res.code == 200){
                    that.materialList = res.data.list;
                    // console.log(that.materialList)
                }else{
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    showMaterialModal(): void {
        this.materialItem = '0'
        this.materialQuery = ""
        this.loadSourceList();
        this.isShowMaterial = true;
    }
    materialOk(): void {
        this.isShowMaterial = false;
        if(this.materialList[this.materialItem]){
            this.noticeTitle  = this.noticeTitle +  this.materialList[this.materialItem].title
            this.content  = this.content +  this.materialList[this.materialItem].content
        }

    }
    materialCancel(): void {
        this.isShowMaterial = false;
    }

    // 通知选择对象
    public resetVal:boolean = true;
    handleResetVal(){
        this.resetVal = !this.resetVal
    }

    // 保存并发送
    handleSub(){


        const that = this;

        if(!this.publishTime){
            // this._notification.create('error', '温馨提示',"请选择发布时间",{nzDuration: 2000});
            that.warn.onMsgWarn("请选择发布时间");
            return;
        }
        else if(!this.noticeTitle){
            // this._notification.create('error', '温馨提示',"请输入通知标题",{nzDuration: 2000});
            that.warn.onMsgWarn("请输入通知标题");
            return;
        }
        else if(!this.content){
            // this._notification.create('error', '温馨提示',"请输入通知内容",{nzDuration: 2000});
            that.warn.onMsgWarn("请输入通知内容");
            return;
        }
        else if(this.storeData.length === 0){
            that.warn.onMsgWarn("请选择通知对象");
            // this._notification.create('error', '温馨提示',"请选择通知对象",{nzDuration: 2000});
            return;
        }
        else if(this.editor.getLength(3)-1 < 10){
            that.warn.onMsgWarn("素材内容长度至少为10");
            // this._notification.create('error', '温馨提示',"素材内容长度至少为10",{nzDuration: 2000});
            return;
        }
        if(this.publishTime){
            if(new Date().getTime() > this.publishTime){
                // this._notification.create('error', '温馨提示',"请重新选择发布时间",{nzDuration: 2000});
                that.warn.onMsgWarn("请重新选择发布时间");
                return;
            }
        }

        // 组装resetVal
        let resetValCopy;

        if(this.resetVal){
            resetValCopy = 1
        }else{
            resetValCopy = 0
        }

        // 组装sendObjList departAll
        let sendObjList = [];
        let departArr = [];
        let departAll:string

        if(this.storeData.length !== 0){
            for(let i=0;i<this.storeData.length;i++){
                departArr.push(this.storeData[i].departmentName)
                let obj = {};
                obj["topId"] = this.storeData[i].id;
                obj["userType"] =  this.storeData[i].userType;
                obj["phone"] =  this.storeData[i].phone;
                obj["userName"] =  this.storeData[i].name;
                obj["positionName"] =  this.storeData[i].positionName;
                obj["departmentName"] = this.storeData[i].departmentName;
                sendObjList.push(obj)
            };
            departAll = Array.from(new Set(departArr)).join("、")
        }

        this.request.doPost({
            url: "noticeAdd",
            data:{
                title:this.noticeTitle,
                content:this.content,
                sendTime:this.publishTime,
                needRespond:resetValCopy,
                // needRespond:1,
                sendDepartment:departAll,
                sendObjList:sendObjList
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.router.navigate(['./../list'],{relativeTo: this.route});
                }else {
                    // that._notification.create('error', '温馨提示',res.msg,{nzDuration: 2000});
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    // 预览
    handlePreview(){
        localStorage.setItem("title",this.noticeTitle);
        localStorage.setItem("content",this.content);
        localStorage.setItem("time",this.publishTime);
        window.open(window.location.href.replace(/add/g,'preview?origin=1'),'_blank');
        // this.router.navigate(['../preview'],{relativeTo: this.route});
    }

}
