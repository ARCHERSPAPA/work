import { Component, OnInit, ViewChild } from '@angular/core';
import {compiledTplId,btoa} from "../../../../model/methods";
import {RequestService} from "../../../../service/request.service";
import {Messages} from "../../../../model/msg";
import {Default} from "../../../../model/constant";
import {WarningService} from "../../../../service/warning.service";
import {ApiService} from "../../../../service/api.service";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'rev-temp-whole-base-list',
  templateUrl: './temp-whole-base-list.component.html',
  styleUrls: ['./temp-whole-base-list.component.scss']
})
export class TempWholeBaseListComponent implements OnInit {

    public title: string;
    public buttons:Array<any> = [];

    //分页
    public pageNo:number = Default.PAGE.PAGE_NO;
    public pageSize:number = Default.PAGE.PAGE_SIZE;
    public total:number = Default.PAGE.PAGE_TOTAL;
    public dataSource:Array<any> = [];

    //上传文件
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
        this.title = "整装基装管理";
        this.buttons = [
            {
                name: "下载模板",
                link: Default.TEMP_URL.BASE
            },
            {
                name: "批量导入"
            }];

        this.changeData();
    }

    changeData(...args){
        if(args && args.length > 0){
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        this.req.doPost({
            url: "mouldList",
            data: {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                versionType: 4
            },
            success: (res => {
                if (res && res.code === 200) {
                    this.dataSource = res.data.pageSet;
                    this.total = res.data.total;
                }else{
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    handleEvent(e) {
        if (e === this.buttons[0].name) {
            let a = document.createElement("a");
            a.href = this.buttons[0].link;
            a.click();
        } else {
            document.getElementById('import').click();
        }
    }

    /**
     * 引入文件
     * @param $event
     */
    handleFileChange(e:any){
        let that = this;
        let files = e.target.files;
        let file = files[0];
        let formData = new FormData();
        formData.append('file', file);
        formData.append('versionType', '4');

        that.httpClient.post(that.apiService.getUrl('upExl'), formData, this.httpOptions)
            .subscribe((res: any) => {
                    if (res && res.code === 200) {
                        that.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData(true);
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                },
                (error => {
                    that.warn.onMsgWarn(error || Messages.ERROR_TEXT)
                })
            );
        that.uploadFile.nativeElement.value = ''
    }

    handleOperate(type:string,item:any){
        let that = this;
        let param = {
            id: item.id
        };
        let url = "mouldUpd";
        switch (type) {
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
                url = "mealBaseRack";
                param['state'] = 1;
                break;
            case 'off':
                url = "mealBaseRack";
                param['state'] = 0;
                break;
        }
        this.req.doPost({
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
        })
    }

    getCompileId(id:number){
        return compiledTplId(id);
    }

    btoa(id:string) {
        return btoa(id)
    }

}
