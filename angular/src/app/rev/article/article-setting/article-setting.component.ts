import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../service/article.service';
import { Messages } from '../../../model/msg';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../../service/request.service';
import { WarningService } from '../../../service/warning.service';
import * as UserValidate from '../../../validate/user-validate';
import {STAGES} from '../../../model/constant';
import {getStageName} from '../../../model/methods';



@Component({
    selector: 'rev-article-setting',
    templateUrl: './article-setting.component.html',
    styleUrls: ['./../article.component.scss', './article-setting.component.scss']
})
export class ArticleSettingComponent implements OnInit {
    public title: string;
    public buttons: Array<any>;
    public isVisible = false;

    public showBtn = true;
    public isEdit = false;
    public pid: string;
    public articleSettings: Array<any> = [];
    //新增阶段说明v2.2.1
    public stages: Array<any> = [];

    public articleSettingForm: FormGroup;
    public info: string;
    public stage = 1;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private article: ArticleService,
        private warn: WarningService,
        private fb: FormBuilder,
        private request: RequestService,
    ) { }

    // ngOnInit() {
    //     this.title = "项目验收设置";
    //     this.switch = "left";
    //     this.buttons = [
    //         {
    //             name:"添加设置",
    //             type:"click",
    //             color:"btn-primary",
    //             method:()=>{
    //                 this.switch = "left";
    //                 setTimeout(() =>{
    //                     this.switch = "right";
    //
    //                 },500);
    //             }
    //         }
    //     ]
    // }
    //
    // ngAfterViewInit(){
    //     setTimeout(() =>{
    //         this.switch = "right";
    //     })
    // }


    ngOnInit() {
        this.stages = STAGES;
        this.loadStage();
        this.title = '验收设置';
        this.buttons = [{
            color: 'btn-primary',
            name: '添加设置'
        }];
        this.articleSettingForm = this.fb.group({
            info: [this.info, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                UserValidate.ValidateAccount
            ]],
            stage: [this.stage, [
                Validators.required
            ]]
        });
    }

    handleName(isopen: boolean) {
        this.isVisible = isopen;
        this.info = '';
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.article.setArticleSetNumber(this.articleSettings.length);
        }, 1000);
    }

    getParams(set, index) {
        const item = set;
        item['index'] = index;
        return JSON.stringify(item);
    }

    loadStage() {
        const that = this;
        that.request.doPost({
            url: 'listStage',
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.articleSettings = res.data;
                    this.article.setArticleSetNumber(this.articleSettings.length);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    edit(item) {
        this.isVisible = true;
        this.info = item.info;
        this.stage = item.stage;
        this.isEdit = !!item['id'];
        this.pid = item.id;
    }
    editSubmit() {
        const that = this;
        if (that.articleSettingForm.valid) {
            const params = that.articleSettingForm.value;
            if (that.pid) {
                params['id'] = that.pid;
            }
            that.request.doPost({
                url: 'upStage',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.isVisible = false;
                        that.loadStage();
                        // that.warn.onSuccess( Messages.SUCCESS.DATA);
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });

        }
    }
    delStage(id) {
        const that = this;
        if (id) {
            that.request.doPost({
                url: 'delStage',
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.loadStage();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }
    // ngDoCheck() {
    //     let url = this.activatedRoute.snapshot["_routerState"].url.toString();
    //     this.showBtn = url.indexOf("list") >= 0;
    // }
    handleCancel() {
        this.isVisible = false;
        this.info = '';
        this.isEdit = false;
    }

    submit() {
        const that = this;
        if (that.articleSettingForm.valid) {
            const params = that.articleSettingForm.value;
            if (that.pid) {
                params['id'] = that.pid;
            }
            that.request.doPost({
                url: 'addStage',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.isVisible = false;
                        that.loadStage();
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    getStageName(stage: number) {
        return getStageName(stage);
    }
}

