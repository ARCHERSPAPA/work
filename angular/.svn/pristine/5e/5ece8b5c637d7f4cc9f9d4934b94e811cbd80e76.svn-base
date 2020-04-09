import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {RequestService} from "../../../../service/request.service";
import {QiNiuService} from "../../../../service/qi-niu.service";
import {WarningService} from "../../../../service/warning.service";
import {Messages} from "../../../../model/msg";
import {atob} from "../../../../model/methods";

@Component({
  selector: 'rev-notice-inform-dtl',
  templateUrl: './notice-inform-dtl.component.html',
  styleUrls: ['./notice-inform-dtl.component.scss']
})
export class NoticeInformDtlComponent implements OnInit {
    public noticeTitle;
    public content;
    public noticeId;
    public title:string;
    public objList:Array<any> = [];
    public objReadList:Array<any> = [];
    public objUnReadList:Array<any> = [];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private request:RequestService,
        private qn: QiNiuService,
        private warn: WarningService
    ) { }

    ngOnInit() {
        this.title="通知详情";
        this.route.queryParams.subscribe(params =>{
            if(params && params["noticeId"]){
                this.noticeId = atob(params["noticeId"]);
                this.loadNoticeInfo(this.noticeId);
                this.loadNoticeObjList(this.noticeId);
            }
        })
    }

    // 通知选择对象
    public resetVal:boolean;
    handleResetVal(){
        this.resetVal = !this.resetVal
    }
    
    //时间选择
    public publishTime:any;
    public date: Date | null = null;
    public today = new Date().getTime();
    onChange(result: Date): void {
        this.publishTime = new Date(result).getTime()
    }
    disabledDate = (current: Date): boolean => {
        return  new Date(current).getTime() + 3600000 < this.today;
    };

    loadNoticeInfo(noticeId){
        this.request.doPost({
            url:"noticeInfo",
            data:{
                id:noticeId
            },
            success:(res =>{
                if(res && res.code == 200){
                    this.noticeTitle = res.data.title;
                    this.content = res.data.content;
                    if(res.data.needRespond == 1){
                        this.resetVal = true
                    }else{
                        this.resetVal = false
                    }
                    this.date = new Date(res.data.sendTime);
                }else{
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    // 富文本
    public quillLen:Number = 0
    // 富文本
    contentChanged(event) {
        if(this.editor.getLength(3)-1 > 5000){
            this.editor.deleteText(5000,this.editor.getLength(3)-1)
        }else{
            this.quillLen = this.editor.getLength(3)-1
            this.content = event.html;
        }
    }
    public editor;
    EditorCreated(quill) {
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.imageHandler.bind(this));
        this.editor = quill;
    }
    imageHandler() {
        this.request.doPostImg({
            url: "token",
            success: (res => {
                if (res && res.code == 200) {
                    let token = JSON.parse(res.data).uptoken;
                    let url = JSON.parse(res.data).url;
                    this.qn.setToken(token);
                    this.qn.setDataUrl(url);
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept','image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        Imageinput.addEventListener('change', () => {
            const file = Imageinput.files[0];
            this.qn.postImg(file,this.qn.getToken()).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                } else if (event instanceof HttpResponse) {
                    let src =  this.qn.getDataUrl() + "/" + event.body['key'];
                    const range = this.editor.getSelection(true);
                    const newRange = 0 + (range !== null ? range.index : 0);
                    this.editor.insertEmbed(range.index, 'image', src);
                    this.editor.setSelection(1 + newRange)
                }
            }, error => {
                // console.log(JSON.stringify(error));
            });
        });
        Imageinput.click();
    }
    getImageType(name){
        return name.substring(name.lastIndexOf("."));
    }
    // 保存
    handleSub(){
        // 组装resetVal
        let resetValCopy;
        if(this.resetVal){
            resetValCopy = 1
        }else{
            resetValCopy = 0
        }
        if(!this.noticeTitle){
            // this._notification.create('error', '温馨提示',"请输入通知标题",{nzDuration: 2000});
            this.warn.onMsgWarn("请输入通知标题");
            return;
        }
        else if(!this.content){
            // this._notification.create('error', '温馨提示',"请输入通知内容",{nzDuration: 2000});
            this.warn.onMsgWarn("请输入通知内容");
            return;
        }
        else if(this.editor.getLength(3)-1 < 10){
            // this._notification.create('error', '温馨提示',"素材内容长度至少为10",{nzDuration: 2000});
            this.warn.onMsgWarn("素材内容长度至少为10");
            return;
        }
        // if(this.publishTime){
        //   if(new Date().getTime() > this.publishTime){
        //     this._notification.create('error', '温馨提示',"请重新选择发布时间",{nzDuration: 2000});
        //     return;
        //   }
        // }
        this.request.doPost({
            url: "noticeUpd",
            data:{
                id: this.noticeId,
                title: this.noticeTitle,
                content: this.content,
                sendTime: this.publishTime,
                // sendDepartment: "修改的部门",
                needRespond:resetValCopy,
            },
            success: (res => {
                if (res && res.code == 200) {
                    // self._notification.create('success', '温馨提示',res.msg,{nzDuration: 2000});
                    this.router.navigate(["../list"], {relativeTo: this.route})
                } else {
                    // self._notification.create('error', '温馨提示',res.msg,{nzDuration: 2000});
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    // handlePreview(){
    //   this.richText.setMaterialTitle(this.noticeTitle)
    //   this.richText.setRichText(this.content)
    //   this.router.navigate(['../preview'],{relativeTo: this.route});
    // }
    loadNoticeObjList(noticeId){
        let self = this;
        this.request.doPost({
            url:"noticeObjList",
            data:{
                noticeId:noticeId
            },
            success:(res =>{
                if(res && res.code == 200){
                    self.objList = res.data.objList;
                    self.objReadList = res.data.objReadList;
                    self.objUnReadList = res.data.objUnReadList;
                }else{
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    isVisible = false;
    showModal(): void {
        this.isVisible = true;
    }
    handleOk(): void {
        this.isVisible = false;
    }
    handleCancel(): void {
        this.isVisible = false;
    }
}
