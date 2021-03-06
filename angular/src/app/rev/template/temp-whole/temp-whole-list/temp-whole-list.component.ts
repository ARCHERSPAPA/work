import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControlName, Validators, FormControl } from '@angular/forms';
import { Default } from '../../../../model/constant';
import { RequestService } from '../../../../service/request.service';
import { UserService } from '../../../../service/user.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { compiledTplId, btoa } from '../../../../model/methods';

@Component({
    selector: 'rev-temp-whole-list',
    templateUrl: './temp-whole-list.component.html',
    styleUrls: ['./../../template.component.scss', './temp-whole-list.component.scss']
})
export class TempWholeListComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;

    public dataSource: Array<any> = [];

    public pageNo = Default.PAGE.PAGE_NO;
    public pageSize = Default.PAGE.PAGE_SIZE;
    public total = Default.PAGE.PAGE_TOTAL;


    public loading = false;

    public wholeForm: FormGroup;
    public isVisible = false;
    public packageName: string;
    public remark: string;

    constructor(private req: RequestService,
        private warn: WarningService,
        private fb: FormBuilder,
        private user: UserService) {
    }

    ngOnInit() {
        this.title = '整装管理';
        this.buttons = [
            {
                name: '新建',
                color: 'btn-primary'
            }
        ];

        this.wholeForm = this.fb.group({
            packageName: ['', [
                Validators.required,
                Validators.maxLength(30)
            ]],
            remark: ['', [
                Validators.maxLength(300)
            ]]
        });

        this.changeData();
    }

    handleName(e) {
        if (e === this.buttons[0].name) {
            this.showModal();
        }
    }

    changeData() {
        const that = this;
        that.loading = true;
        this.req.doPost({
            url: 'packageList',
            data: {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                packageType: 4
            },
            success: function (res) {
                that.loading = false;
                if (res && res.code == 200) {
                    that.dataSource = res.data.pageSet;
                    that.total = res.data.total;
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            }
        });
    }

    //操作
    handleOperate(type: string, item: any) {
        const param = {
            id: item.id
        };
        let url, that = this;
        switch (type) {
            case 'del':
                url = 'packageUpd';
                param['state'] = 2;
                that.pageNo = Default.PAGE.PAGE_NO;
                break;
            case 'on':
                url = 'wholeRack';
                param['state'] = 1;
                break;
            case 'off':
                url = 'wholeRack';
                param['state'] = 0;
                break;
        }

        that.req.doPost({
            url: url,
            data: param,
            success: (res => {
                if (res && res.code === 200) {
                    that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.changeData();
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }


    showModal() {
        this.wholeForm.reset();
        this.isVisible = true;
    }

    handleCancel() {
        this.isVisible = false;
    }

    handleOk(e: any) {
        e.stopPropagation();
        e.preventDefault();
        const that = this;
        if (that.wholeForm.valid) {
            const params = that.wholeForm.value;
            params['companyId'] = that.user.getCompanyId();
            params['packageType'] = 4;
            that.req.doPost({
                url: 'packageUpd',
                data: params,
                success: (res => {
                    that.handleCancel();
                    if (res && res.code == 200) {
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    getCompileId(id: number) {
        return compiledTplId(id);
    }
    btoa(id: string) {
        return btoa(id);
    }
    /**
     * 复制整装
     */
    copy(id) {
        this.req.doPost({
            url: 'wholeBaseCopy',
            data: {
                id: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }
}
