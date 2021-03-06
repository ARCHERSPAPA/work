import { Component, OnInit } from '@angular/core';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { RequestService } from '../../../../service/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { btoa, ViewFile } from '../../../../model/methods';
import { Default } from '../../../../model/constant';
@Component({
    selector: 'rev-accessory-list',
    templateUrl: './accessory-list.component.html',
    styleUrls: ['./accessory-list.component.scss']
})
export class AccessoryListComponent implements OnInit {

    public filesData: string;

    public title: string;
    public buttons: Array<any>;
    public _albums = [];
    public imgIndex;
    constructor(private router: Router,
        private req: RequestService,
        private activatedRoute: ActivatedRoute,
        private warn: WarningService) { }

    ngOnInit() {
        this.title = '合同附件';

        this.buttons = [
            { name: '添加图片' },
            { name: '添加文件' }
        ];

        this.LoadContractList();
    }

    /**
     * 处理交互
     * @param {string} name
     */
    handleName(name: string) {
        let type = 0;
        type = (name === this.buttons[0].name) ? 0 : 1;
        this.router.navigate(['../detail'], { queryParams: { type: type }, relativeTo: this.activatedRoute });
    }

    // 加载列表
    LoadContractList() {
        this.req.doPost({
            url: 'getContractList',
            success: (res => {
                this.filesData = res.data;
            })
        });
    }
    openLarge(index) {

    }
    viewProduct(type, file) {
        this._albums = [];
        if (type == 1) {
            ViewFile(file[0].url);
        } else {
            if (file.length > 1) {
                file.forEach(v => {
                    this._albums.push({ src: v.url });
                });  
            } else {
                this._albums.push({ src: file[0].url });
            }
            this.imgIndex = 0;
        }
    }
    delAccessory(id: number) {
        this.req.doPost({
            url: 'delContractList',
            data: {
                'id': id
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.LoadContractList();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    uploadProduct(id: number, type: number) {
        this.req.doPost({
            url: 'uploadContractList',
            data: {
                'id': id,
                'state': type
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.LoadContractList();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * url 加密
     * @param {string} id
     * @returns {any}
     */
    btoa(id: string) {
        return btoa(id);
    }

}
