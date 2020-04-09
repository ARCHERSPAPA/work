import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../service/request.service";
import { NzNotificationService } from 'ng-zorro-antd';
import { UploaderComponent } from "../../../plugins/uploader/uploader.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from "../../../model/msg";
import { WarningService } from "../../../service/warning.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as UserValidate from "../../../validate/user-validate";
import { Router, ActivatedRoute } from '@angular/router';

import {btoa} from "../../../model/methods";
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    public productList = []
    public title = '产品管理';

    //   模块相关
    public workerForm: FormGroup;
    public headImg;
    public name;
    public price;
    public info;

    public buttons: Array<any>;
    public isVisible = false;
    public isEdit:boolean = false;


    constructor(
        private request: RequestService,
        private fb: FormBuilder,
        private _notification: NzNotificationService,
        private modalService: NgbModal,
        private warn: WarningService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loadProductList()
        this.buttons = [
            {
                name: "新建产品",
                color: "btn-primary"
            }
        ];
        this.workerForm = this.fb.group({
            name: [this.name, [
                Validators.required
            ]],
            price: [this.price, [
                Validators.required,
                UserValidate.ValidateNonInt
            ]],
            info: [this.info, [
               Validators.maxLength(120)
            ]],
        });
    }

    // 产品列表
    loadProductList(): void {
        let self = this;
        this.request.doPost({
            url: "productList",
            data: {},
            success: (res => {
                
                if (res && res.code == 200) {
                    self.productList = res.data;
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 产品置顶
    topProduct(id): void {
        let self = this;
        this.request.doPost({
            url: "topProduct",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadProductList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 产品移动
    moveProduct(id, toId): void {
        let self = this;
        this.request.doPost({
            url: "moveProduct",
            data: {
                sourceId: id,
                targetId: toId,
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadProductList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 上架产品
    upperProduct(id): void {
        let self = this;
        this.request.doPost({
            url: "upperProduct",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadProductList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 下架产品
    downProduct(id): void {
        let self = this;
        this.request.doPost({
            url: "downProduct",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadProductList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }

    // 删除产品
    delProduct(id): void {
        let self = this;
        this.request.doPost({
            url: "delProduct",
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    self.loadProductList()
                    self._notification.create('success', '温馨提示', res.msg, { nzDuration: 2000 });
                } else {
                    self._notification.create('error', '温馨提示', res.msg, { nzDuration: 2000 });
                }
            })
        })
    }
    // 打开图片选择
    openModal() {
        this.isVisible=false
        const modalRef = this.modalService.open(UploaderComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.name = "修改头像信息";
        modalRef.componentInstance.width = 10;
        modalRef.componentInstance.height = 10;
        modalRef.result.then((result) => {
        this.isVisible=true
            if (result && result.image) {
                this.headImg = result.image;
            } else {
                this.warn.onError(Messages.ERROR.IMG_LARGE);
            }

        }, (reason) => {
            console.log(reason);
        });
    }
    Newproduct() {
        this.isVisible = true
    }
    handleCancel() {
        this.isVisible = false
    }
    submit() {
        let self = this;
        if (this.workerForm.valid) {
            let values = this.workerForm.value;
            this.request.doPost({
                url: "addProduct",
                data: {
                    headImg: this.headImg ? this.headImg :
                        "https://qiniu.madrock.com.cn/sys/img/diy_large_product_head_img_default.png",
                    name: values.name,
                    price: values.price,
                    info: this.info
                },
                success: (res => {
                    this.loadProductList()
                    setTimeout(function () {
                        self.isVisible=false;
                        let newIndex=0
                        if (res && res.code == 200) {   
                         self.productList.forEach((arr,index)=>{
                             if(arr.state==1){
                                 newIndex=index+1;      
                             }
                             self.router.navigate(['./../dtl'], { relativeTo: self.activatedRoute, queryParams: { id:btoa(self.productList[newIndex].id), index: 0 } });
                         })          
                        } else {
                            self.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    }, 600)

                })
            })
        }
    }
    btoa(id:string){
        return btoa(id);
    }

}


