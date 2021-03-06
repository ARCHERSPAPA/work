import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {UploaderComponent} from '../../../plugins/uploader/uploader.component';
import {Messages} from '../../../model/msg';
import {WarningService} from '../../../service/warning.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from '../../../service/request.service';
import { NzNotificationService } from 'ng-zorro-antd';
import * as UserValidate from '../../../validate/user-validate';
import {UploaderMultisComponent} from '../../../plugins/uploader-multis/uploader-multis.component';
import {Default} from '../../../model/constant';
import {getStateName, atob} from '../../../model/methods';
// import { Lightbox } from 'ngx-lightbox';
@Component({
    selector: 'app-product-dtl',
    templateUrl: './product-dtl.component.html',
    styleUrls: ['./product-dtl.component.scss']
})
export class ProductDtlComponent implements OnInit {
    public workerForm: FormGroup;

    public headImg;
    public name;
    public _albums = [];
    public imgIndex;
    public price;
    public info;
    /***所有图片存储***/
    public images = [];

    public index;
    public isEdit = false;
    public productId;

    public isVisible = false;
    public isVisibleImage = false;
    public largeImg: string;

    public allChecked = false;
    public indeterminate = false;
    public displayData = [];

    public data = [];
    public pageNo = 1;
    public pageSize = 10;
      public ProductPageSize = 20;
    public total = 1;

    public relatedData = [];
    public projectIds = [];

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private warn: WarningService,
        // private _lightbox: Lightbox,
        private request: RequestService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.index = params.index;
            if (params && params.id) {
                this.isEdit = true;
                this.productId = atob(params.id);
                this.loadBaseInfo();
                this.loadimgInfo();
                this.loadProductProject();
                this.loadProductToAddProject();
            }
        });

        this.workerForm = this.fb.group({
            name: [this.name, [
                Validators.required
            ]],
            price: [this.price, [
                Validators.required,
                UserValidate.ValidateNonInt
            ]],
        });

    }
    openLarge( index) {
        this.imgIndex = index;
        this.images.forEach((i) => {
            this._albums.push({ src: i.imgUrl , thumb: i.imgUrl });
          });

    }

    // openLarge(index) {
    //     const _albums = [];
    //     this.images.forEach((i) => {
    //       _albums.push({ src: i.imgUrl });
    //     });
    //     this._lightbox.open(_albums, index);
    //   }

    // 拉取产品基础信息
    loadBaseInfo(): void {
        const that = this;
        this.request.doPost({
            url: 'productBaseInfo',
            data: {
                id: that.productId
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.headImg = res.data.headImg;
                    that.name = res.data.name;
                    that.price = res.data.price;
                    that.info = res.data.info;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // 拉取产品图片信息
    loadimgInfo(): void {
        const that = this;
        this.request.doPost({
            url: 'productImgInfo',
            data: {
                id: that.productId
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.images = res.data;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // 关联项目
    loadProductProject(): void {
        const that = this;
        this.request.doPost({
            url: 'selectProductProject',
            data: {
                id: that.productId,
                pageNo: this.pageNo,
                pageSize: this.ProductPageSize
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.total = res.data.total;
                    that.relatedData = res.data.pageSet;
                    console.log(res.data.total);

                    // that.relatedData[0].coverImg ='http://tqiniu.madrock.com.cn/rev/imgs/2c0738ee-3741-e307-b08b-c5bdd103ba55.png?imagelim'
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // 可关联项目
    loadProductToAddProject(): void {
        const that = this;
        this.request.doPost({
            url: 'selectProductToAddProject',
            data: {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.data = res.data.pageSet;
                    that.total = res.data.total;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * 第1选项卡相关
     */
    // 头像裁剪
    openModal() {
        const modalRef = this.modalService.open(UploaderComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.name = '修改头像信息';
        modalRef.componentInstance.width = 10;
        modalRef.componentInstance.height = 10;
        modalRef.result.then((result) => {
            if (result && result.image) {
                this.headImg = result.image;
            } else {
                this.warn.onError(Messages.ERROR.IMG_LARGE);
            }

        }, (reason) => {
            console.log(reason);
        });
    }
    // 提交
    submit() {
        const that = this;
        if (this.workerForm.valid) {
            const values = this.workerForm.value;
            this.request.doPost({
                url: 'addProduct',
                data: {
                    headImg: this.headImg ? this.headImg :
                        'https://qiniu.madrock.com.cn/sys/img/diy_large_product_head_img_default.png',
                    name: values.name,
                    price: values.price,
                    info: this.info
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.router.navigate(['./../'], {relativeTo: that.activatedRoute});
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }
    // 修改
    modify() {
        const that = this;
        if (this.workerForm.valid) {
            const values = this.workerForm.value;
            this.request.doPost({
                url: 'upProduct',
                data: {
                    id: this.productId,
                    headImg: this.headImg ? this.headImg :
                        'https://qiniu.madrock.com.cn/sys/img/diy_large_product_head_img_default.png',
                    name: values.name,
                    price: values.price,
                    info: this.info
                },
                success: (res => {
                    if (res && res.code == 200) {
                        that.router.navigate(['./../'], {relativeTo: that.activatedRoute});
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }
    // 返回
    exist() {
        this.router.navigate(['./../'], {relativeTo: this.activatedRoute});
    }

    /**
     * 第2选项卡相关
     */
    // 上传图片
    addImg() {
        const that = this;
        const modalRef = this.modalService.open(UploaderMultisComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.name = '新增图片';
        modalRef.componentInstance.cid = that.productId;
        modalRef.componentInstance.open = true;
        modalRef.componentInstance.num = that.images.length;
        modalRef.componentInstance.total = 30;

        modalRef.componentInstance.split = 'project';
        // modalRef.componentInstance.width = 200;
        // modalRef.componentInstance.height = 100;
        modalRef.result.then((result) => {
            // if(that.images.length ===30){
            //     that.warn.onError(`最多只能上传${that.images.length}张照片啊`);
            //     return
            // }
            if (result && result.length > 0) {
                // console.log(result);
                // let that = this;
                // this.request.doPost({
                //     url:"productAddImg",
                //     data:{
                //         productId:this.productId,
                //         imgUrl:result.image
                //     },
                //     success:(res =>{
                //         if(res && res.code == 200){
                //             that.loadimgInfo()
                //             that._notification.create('success', '温馨提示',res.msg,{nzDuration: 2000});
                //         }else{
                //             that._notification.create('error', '温馨提示',res.msg,{nzDuration: 2000});
                //         }
                //     })
                // })
                const pArr = [];
                for (let i = 0; i < result.length; i++) {
                    pArr.push(new Promise(function(resolve, reject) {
                        that.requestUpload(result[i], that.productId, resolve, reject);
                    }));
                }

                Promise.all(pArr).then(res => {
                    // console.log(res);
                    that.loadimgInfo();
                    that.warn.onSuccess('上传成功');

                }).catch(err => {

                    that.warn.onError('上传失败');
                });


            } else {

                that.warn.onError(Messages.ERROR.IMG_LARGE);
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    requestUpload(img, pid, resolve, reject) {
        this.request.doPost({
            url: 'productAddImg',
            data: {
                productId: pid,
                imgUrl: img
            },
            success: (res => {
                resolve(res);
            }),
            error: (err => {
                reject(err);
            })
        });
    }

    delImg(e: any, id: number) {
        e.stopPropagation();
        e.preventDefault();
        const that = this;
        this.request.doPost({
            url: 'productDelImg',
            data: {
                id: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.loadimgInfo();
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // openLarge(e:any,url:string){
    //     e.stopPropagation();
    //     e.preventDefault();
    //     this.largeImg = url;
    //     this.isVisibleImage = true;
    // }

    handleCancelImage(): void {
        this.isVisibleImage = false;
        this.largeImg = null;
    }

    /**
     * 第3选项卡相关
     */
    // 取消关联项目
    removeProject(id): void {
        const that = this;
        this.request.doPost({
            url: 'removeProject',
            data: {
                productId: this.productId,
                projectId: id
            },
            success: (res => {
                if (res && res.code == 200) {
                    that.loadProductProject();
                    that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    that.warn.onError(res.msg ||  Messages.FAIL.DATA);
                }
            })
        });
    }

    // 弹层表格
    showModal(): void {
        this.isVisible = true;
        const data = this.relatedData;
        if (data && data.length > 0) {
            this.projectIds = data;
        } else {
            this.projectIds = [];
        }
        this.pageNo = Default.PAGE.PAGE_NO;
        this.loadProductToAddProject();

        if (this.projectIds && this.projectIds.length > 0) {
            this.displayData.forEach(item => {
                this.projectIds.forEach(d => {
                    if (d.id == item.id) {
                        item.checked = true;
                    }
                });
            });
        } else {
            this.displayData.forEach(data => {
                data.checked = false;
            });
        }
        this.allChecked = false ;
        this.indeterminate  = false;
    }

    handleOk(): void {
        this.isVisible = false;
        const projectIds = [];

        for (let i = 0; i < this.projectIds.length; i++) {
            console.log(this.projectIds);
                projectIds.push(this.projectIds[i].id);
        }

        if (this.projectIds.length > 0) {
            const that = this;
            this.request.doPost({
                url: 'relationProject',
                data: {
                    productId: that.productId,
                    projectIds: projectIds
                },
                success: (res => {
                    that.loadProductProject();
                    if (res && res.code == 200) {
                        if (res.data) {
                            that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        } else {
                            that.warn.onSuccess(res.msg);
                        }

                    } else {
                        that.warn.onError(res.msg ||  Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    handleCancel(): void {
        this.isVisible = false;
        this.loadProductProject();
    }

    currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
        this.displayData = $event;
        this.projectIds.forEach(p => {
            this.displayData.forEach(data => {
                if (p.id === data.id) {
                    data.checked = true;
                }
            });
        });
        this.refreshStatus();
    }

    refreshStatus(): void {
        const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.displayData.forEach(data => {
            if (typeof data.checked !== 'undefined') {
                this.justData(data);
            }
        });
    }

    checkAll(value: boolean): void {
        this.displayData.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }

    justData(data) {
        if (!data.checked) {
           this.projectIds.forEach((p, index) => {
               if (p.id === data.id) {
                   this.projectIds.splice(index, 1);
                   return;
               }
           });
        } else {
            let flag = false;
            this.projectIds.forEach((p) => {
                if (p.id === data.id) {
                    flag = true;
                }
            });

            if (!flag) {
                this.projectIds.push(data);
            }
        }
    }

    getState(state) {
        return getStateName(state);
    }

    styleBg(src) {
        return {
            'background-image': 'url(' + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/160/h/160') + ')',
            'background-size': '100% 100%'
        };
    }
}
