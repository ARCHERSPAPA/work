import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HttpHeaders, HttpParams, HttpClient, HttpRequest, HttpEventType, HttpResponse} from '@angular/common/http';
import {RequestService} from '../../../../service/request.service';
import {QiNiuService} from '../../../../service/qi-niu.service';
import {WarningService} from '../../../../service/warning.service';
import {Messages} from '../../../../model/msg';

@Component({
  selector: 'rev-notice-material-add',
  templateUrl: './notice-material-add.component.html',
  styleUrls: ['./notice-material-add.component.scss']
})
export class NoticeMaterialAddComponent implements OnInit {
    public title: string;

    public config: any;
    public materialTitle: string;
    public content: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private request: RequestService,
        private qn: QiNiuService,
        private warn: WarningService
    ) { }

    ngOnInit() {
      this.title = '新建素材';
    }


    public quillLen: Number = 0;
    // 富文本
    contentChanged(event) {

        if (this.editor.getLength(3) - 1 > 5000) {
            this.editor.deleteText(5000, this.editor.getLength(3) - 1);
        } else {
            this.quillLen = this.editor.getLength(3) - 1;
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
            url: 'token',
            success: (res => {
                if (res && res.code == 200) {
                    const token = JSON.parse(res.data).uptoken;
                    const url = JSON.parse(res.data).url;
                    this.qn.setToken(token);
                    this.qn.setDataUrl(url);
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });

        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');


        // console.log(Imageinput)
        Imageinput.addEventListener('change', () => {
            const file = Imageinput.files[0];
            // console.log(file)
            const self = this;
            this.qn.postImg(file, this.qn.getToken()).subscribe(event => {

                if (event.type === HttpEventType.UploadProgress) {

                } else if (event instanceof HttpResponse) {
                    // console.log(event)
                    const src =  this.qn.getDataUrl() + '/' + event.body['key'];
                    // console.log(src)
                    const range = this.editor.getSelection(true);
                    const newRange = 0 + (range !== null ? range.index : 0);
                    // const index = range.index + range.length;
                    this.editor.insertEmbed(range.index, 'image', src);
                    this.editor.setSelection(1 + newRange);
                }

            }, error => {
                console.log(JSON.stringify(error));
            });
        });
        Imageinput.click();
    }
    getImageType(name) {
        return name.substring(name.lastIndexOf('.'));
    }

    handleSub() {
        if (!this.materialTitle) {
            // this._notification.create('error', '温馨提示',"请输入素材标题",{nzDuration: 2000});
            this.warn.onMsgWarn('请输入素材标题');
            return;
        } else if (!this.content) {
            // this._notification.create('error', '温馨提示',"请输入素材内容",{nzDuration: 2000});
            this.warn.onMsgWarn('请输入素材内容');
            return;
        } else if (this.editor.getLength(3) - 1 < 10) {
            // this._notification.create('error', '温馨提示',"素材内容长度至少为10",{nzDuration: 2000});
            this.warn.onMsgWarn('素材内容长度至少为10');
            return;
        }

        this.request.doPost({
            url: 'noticeSourceAdd',
            data: {
                title: this.materialTitle,
                content: this.content
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.router.navigate(['./../list'], {relativeTo: this.route});
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }
    handlePreview() {
        localStorage.setItem('title', this.materialTitle);
        localStorage.setItem('content', this.content);
        window.open(window.location.href.replace(/add/g, 'preview'), '_blank');
        // this.router.navigate(['../preview'],{relativeTo: this.route});
    }

}
