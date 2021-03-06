import {Component, OnInit} from '@angular/core';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Default} from '../../../../model/constant';
import {Messages} from '../../../../model/msg';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'rev-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./../post.component.scss']
})
export class PostListComponent implements OnInit {

    public pageNo: number = Default.PAGE.PAGE_NO;

    public total: number = Default.PAGE.PAGE_TOTAL;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public title: string;
    public buttons: Array<any>;
    public switch: string;

    // 添加
    public postForm: FormGroup;
    public name: string;
    public remarks: string;
    public id: number;
    public isVisible = false;

    public showBtn = false;
    //查询部门名称
    public positionName: string;

    public listPost: any;

    constructor(private request: RequestService,
                private warn: WarningService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private fb: FormBuilder) {
    }

    ngOnInit() {

        this.postForm = this.fb.group({
            name: [this.name, []],
            remarks: [this.remarks, [
                Validators.maxLength(120)
            ]]
        });

        this.activatedRoute.queryParams.subscribe(params => {
            console.log(params);
            if (params && params['checked']) {
                this.changeData();
            }
        });

        this.changeData();
    }


    changeData(...args) {
        const that = this;
        if (args && args.length > 0) {
            that.pageNo = Default.PAGE.PAGE_NO;
            that.total = Default.PAGE.PAGE_TOTAL;
        }
        that.request.doPost({
            url: 'listPosition',
            data: {
                pageNo: that.pageNo,
                pageSize: that.pageSize,
                positionName: that.positionName
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.total = res.data.total;
                    that.listPost = res.data.pageSet;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    delPost(id) {
        const that = this;
        that.request.doPost({
            url: 'delPosition',
            data: {id: id},
            success: (res => {
                if (res && res.code == 200) {
                    that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.changeData();
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    editPost(item) {
        this.isVisible = true;
        this.name = item.name;
        this.remarks = item.remarks;
    }

    rolePost(item) {
        this.router.navigate(['./../role'], {
            queryParams: {item: JSON.stringify(item)},
            relativeTo: this.activatedRoute
        });
    }

    submit() {
        const that = this;
        that.switch = 'up';
        if (that.postForm.valid) {
            const params = that.postForm.value;
            that.request.doPost({
                url: 'addPosition',
                data: params,
                success: (res => {
                    that.switch = 'down';
                    if (res && res.code == 200) {
                        that.pageNo = Default.PAGE.PAGE_NO;
                        that.total = Default.PAGE.PAGE_TOTAL;
                        that.request.doPost({
                            url: 'listPosition',
                            data: {
                                pageNo: that.pageNo,
                                pageSize: that.pageSize,
                            },
                            success: (res => {
                                if (res && res.code == 200) {
                                    this.router.navigate(['./role/'],
                                        {
                                            relativeTo: this.activatedRoute,
                                            queryParams: {item: JSON.stringify(res.data.pageSet[0])}
                                        });
                                    that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                                    this.isVisible = false;
                                } else {
                                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                                }
                            })
                        });


                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    handleCancel() {
        this.isVisible = false;
        this.postForm.reset();
    }

    handleName(name: string) {
        this.isVisible = true;
        switch (name) {
            case '新建职位':
                // this.router.navigate(["./add"],{relativeTo:this.activatedRoute});
                break;
            default:
                console.log('默认');
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.switch = 'right';
        });
    }

    ngDoCheck() {
        const url = this.activatedRoute.snapshot['_routerState'].url.toString();
        this.showBtn = url.indexOf('list') >= 0;
        console.log(this.activatedRoute.queryParams);
    }

    exist() {
        this.isVisible = false;
    }

}


