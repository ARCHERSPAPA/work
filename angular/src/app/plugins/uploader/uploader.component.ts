import {Component, OnInit, Input, ViewChild, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CropperSettings, Bounds, ImageCropperComponent} from 'ngx-img-cropper';

import {RequestService} from "../../service/request.service";
import {Messages} from "../../model/msg";
import {Default} from "../../model/constant";


@Component({
    selector: 'rev-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {


    @Input() name: string;

    /***上传图片需要的token和上传url***/
    @Input() width: number;
    @Input() height: number;

    /**
     * 获取上传图片数据
     */
    @Input() fileData:any;
    @Output() isVisible:boolean=true;



    public data: any;
    public cropperSettings: CropperSettings;
    public cropperWidth: number = 0;
    public cropperHeight: number = 0;

    public MAX_WIDTH: number = 800;
    public MAX_HEIGHT: number = 800;

    public msg: string;
    public isClick: boolean = false;

    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    constructor(public activeModal: NgbActiveModal,
                private request: RequestService) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.minWidth = 10;
        this.cropperSettings.minHeight = 10;

        //打开可以缩放裁剪窗口可裁剪
        this.cropperSettings.keepAspect = false;

        this.cropperSettings.minWithRelativeToResolution = true;
        this.cropperSettings.preserveSize = true;

        this.cropperSettings.canvasWidth = 600;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.croppedWidth = this.cropperWidth ? this.cropperWidth : this.cropperSettings.canvasWidth;
        this.cropperSettings.croppedHeight = this.cropperHeight ? this.cropperHeight : this.cropperSettings.canvasHeight;



        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(11,112,175,0.5)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

        this.cropperSettings.compressRatio = 1;

        this.cropperSettings.noFileInput = true;
        this.cropperSettings.touchRadius = 20;

        this.data = {};
    }

    ngOnInit() {
        this.name = this.name ? this.name : Default.NAME.UPLOAD_IMG;
        let that = this;
        if(this.fileData){
            let img: any = new Image();
            let file: File = this.fileData;
            let fileReader: FileReader = new FileReader();
            let size = Math.ceil(file.size / 1024);

            /***10M以内***/
            if (size > 102400) {
                this.showMsg(Messages.UPLOAD.IMG_MAX);
                return;
            }

            fileReader.onload = function (loadEvent: any) {
                img.src = loadEvent.target.result;
                that.cropper.setImage(img);
            };

            fileReader.readAsDataURL(file);
        }
    }

    fileChangeListener(e: any) {
        let that = this;
        let img: any = new Image();
        let file: File = e.target.files[0];
        let fileReader: FileReader = new FileReader();
        let size = Math.ceil(file.size / 1024);


        /***10M以内***/
        if (size > 102400) {
            that.showMsg(Messages.UPLOAD.IMG_MAX);
            e.target.value = "";
            return;
        }

        fileReader.onload = function (loadEvent: any) {
            img.src = loadEvent.target.result;
            that.cropper.setImage(img);
        };

        fileReader.readAsDataURL(file);
        e.target.value = "";
    }

    cropped(bounds: Bounds) {
        this.cropperHeight = bounds.bottom - bounds.top;
        this.cropperWidth = bounds.right - bounds.left;
        // console.log(this.cropperSettings);
    }

    onClickImage() {

        let that = this;
        if (that.data.image) {
            that.isClick = true;
            let img: any = new Image();
            img.src = that.data.image;
            img.onload = function () {

                if (this.height > that.MAX_HEIGHT) {
                    this.width *= (that.MAX_HEIGHT / this.height);
                    this.height = that.MAX_HEIGHT;
                }
                if (this.width > that.MAX_WIDTH) {
                    this.height *= (that.MAX_WIDTH / this.width);
                    this.width = that.MAX_WIDTH;
                }
                let canvas: any = document.getElementById("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                let ctx = canvas.getContext("2d");

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, this.width, this.height);
                this.crossOrigin = "";

                that.data.image = canvas.toDataURL('image/png', 0.5);

                that.request.doPostImg({
                    url: "token",
                    success: (res => {
                        if (res && res.code == 200) {
                            const token = JSON.parse(res.data).uptoken;
                            const uploadUrl = JSON.parse(res.data).url;
                            // console.log((JSON.parse(res.data)));
                            that.request.doPostQiniu({
                                token: token,
                                url: uploadUrl,
                                img: that.data.image,
                                success: (data => {
                                  
                                    // setTimeout(()=>{
                                        that.isClick = false;
                                        if (data && data.key) {
                                            that.activeModal.close({image: uploadUrl + '/' + data.key + ""});
                                         
                                        } else {
                               
                                            that.showMsg(Messages.UPLOAD.FAIL);
                                        }
                                    // },3000);

                                }),
                                error: (err => {
                                    // console.log(err);
                                    if(err){
                                        that.isClick = false;
                                        that.showMsg(Messages.UPLOAD.NET_BUSY);
                                    }
                                })
                            })


                        } else {
                            that.isClick = false;
                            that.showMsg(Messages.UPLOAD.NOT_AUTH);
                        }
                    })
                })
            }

        }
        else{
            that.showMsg(Messages.UPLOAD.EMPTY);
        }
    }

    showMsg(msg) {
        this.msg = msg;
        setTimeout(() => {
            this.msg = null;
        }, 2000);
    }


}
