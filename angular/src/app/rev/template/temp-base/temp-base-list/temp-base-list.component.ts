import { Component, OnInit,ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Default} from "../../../../model/constant";
import {ApiService} from "../../../../service/api.service";
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";
import {compiledTplId,btoa} from "../../../../model/methods";
import {WarningService} from "../../../../service/warning.service";

@Component({
  selector: 'rev-temp-base-list',
  templateUrl: './temp-base-list.component.html',
  styleUrls: ['./../../template.component.scss', './temp-base-list.component.scss']
})
export class TempBaseListComponent implements OnInit {
    public title: string;

    public dataSet: Array<any>;
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    public buttons: Array<any>;


    public httpOptions = {
        withCredentials: true
    };

    @ViewChild('uploadFile') uploadFile: any;

    constructor(private httpClient: HttpClient,
                private apiService: ApiService,
                private req: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {
        this.title = "基装管理";
        this.loadData();
        this.buttons = [
            {
                name: "下载模板",
                link: Default.TEMP_URL.BASE
            },
            {
                name: "批量提交"
            }]
    }

    loadData() {
        const that = this;
        this.req.doPost({
            url: "mouldList",
            data: {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                versionType: 2
            },
            success: function (res) {
                if (res.code === 200) {
                    that.dataSet = res.data.pageSet;
                    that.total = res.data.total;
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }

    handleEvent(e: any) {
        if (e === this.buttons[0].name) {
            let a = document.createElement("a");
            a.href = this.buttons[0].link;
            a.click();
        } else {
            document.getElementById('import').click();
        }
    }

    // // 上传
    // handleImport() {
    //     document.getElementById('import').click()
    // }

    handleFileChange(e) {
        const that = this;
        const files = e.target.files;
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('versionType', '2');

        that.httpClient.post(this.apiService.getUrl('upExl'), formData, that.httpOptions)
            .subscribe((res: any) => {
                    if (res.code === 200) {
                        that.loadData()
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                }, error => {
                    that.warn.onMsgError(Messages.FAIL.DATA);
                }
            );
        that.uploadFile.nativeElement.value = '';
    }

    // 操作
    handleOperate(str, item) {
        let that = this;
        let param = {
            id: item.id
        };
        let url = "mouldUpd";
        switch (str) {
            case 'del':
                url = "mouldUpd";
                that.pageNo = Default.PAGE.PAGE_NO;
                param['state'] = 2;
                break;
            case 'def':
                url = "mouldUpd";
                param['defaultVsersion'] = 1;
                break;
            case 'on':
                url = "baseRack";
                param['state'] = 1;
                break;
            case 'off':
                url = "baseRack";
                param['state'] = 0;
                break;
        }

        that.req.doPost({
            url: url,
            data: param,
            success: function (res) {
                if (res.code === 200) {
                    that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.loadData()
                } else {
                    that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            }
        })

    }

    /**
     * 编译id
     * @param {number} id
     * @returns {any}
     */
    getCompileId(id: number) {
        return compiledTplId(id);
    }
    btoa(id:string) {
        return btoa(id)
    }
}
