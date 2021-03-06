import { Component, OnInit } from '@angular/core';
import {UploaderComponent} from '../../../plugins/uploader/uploader.component';
import {RequestService} from '../../../service/request.service';
import {WarningService} from '../../../service/warning.service';
import { NzNotificationService } from 'ng-zorro-antd';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Messages} from '../../../model/msg';
import {Router, ActivatedRoute} from '@angular/router';
import {styleBg} from '../../../model/methods';

@Component({
    selector: 'app-product-pic',
    templateUrl: './product-pic.component.html',
    styleUrls: ['./../product-dtl/product-dtl.component.scss']
})
export class ProductPicComponent implements OnInit {

    public productId;
    public quoteId;
    public coverImg = [];

    constructor(
        private modalService: NgbModal,
        private warn: WarningService,
        private request: RequestService,
        private _notification: NzNotificationService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.productId = params.productId;
            this.quoteId = params.quoteId;

            if (params && params.coverImg) {
                this.coverImg.push({
                    imgUrl: params.coverImg
                });
            }

            // let self = this;
            // this.request.doPost({
            //     url:"upProByCoverImg",
            //     data:{
            //         productId:this.productId,
            //         coverImg:this.coverImg[0].imgUrl,
            //         quoteId:this.quoteId
            //     },
            //     success:(res =>{
            //         if(res && res.code == 200){
            //             // self._notification.create('success', '温馨提示',res.msg,{nzDuration: 2000});
            //         }else{
            //             self._notification.create('error', '温馨提示',res.msg,{nzDuration: 2000});
            //         }
            //     })
            // })
            // console.log(this.coverImg)
        });
    }

    // 上传图片
    addImg() {
        const self = this;
        const modalRef = this.modalService.open(UploaderComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.name = '新增图片';
        modalRef.componentInstance.width = 150;
        modalRef.componentInstance.height = 150;
        modalRef.result.then((result) => {
            if (result && result.image) {
                const self = this;
                this.request.doPost({
                    url: 'upProByCoverImg',
                    data: {
                        productId: this.productId,
                        coverImg: result.image,
                        quoteId: this.quoteId
                    },
                    success: (res => {

                        if (res && res.code == 200) {
                            self.coverImg = [];
                            self.coverImg.push({
                                imgUrl: result.image
                            });

                            self._notification.create('success', '温馨提示', res.msg, {nzDuration: 2000});
                        } else {
                            self._notification.create('error', '温馨提示', res.msg, {nzDuration: 2000});
                        }
                    })
                });
                // self.coverImg=[]
                // self.coverImg.push({
                //     imgUrl:result.image
                // })
            } else {
                self.warn.onError(Messages.ERROR.IMG_LARGE);
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    styleBg(src) {
        return styleBg(src);
    }

}
