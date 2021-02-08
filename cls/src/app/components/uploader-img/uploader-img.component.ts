import { Component, OnInit, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { RequestService } from "../../services/request.service";
import { QiNiuService } from '../../services/qi-niu.service';
import { autoKey } from '../../configs/methods';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { WarningService } from "../../services/warning.service";
import { Messages } from "../../configs/messages";
import { Observable, Observer } from 'rxjs';

const token = { token: null, url: null };

interface IShowImg {
  num: number;
  showPreview: boolean;
  showRemove: boolean;
  showDownload: boolean;
}

@Component({
  selector: 'app-uploader-img',
  templateUrl: './uploader-img.component.html',
  styleUrls: ['./uploader-img.component.less']
})
export class UploaderImgComponent implements OnInit {


  @Output() handleImage: EventEmitter<any> = new EventEmitter<any>();

  @Input() showOmg: any;

  public uploadOmg: IShowImg = {
    num: 9,
    showPreview: true,
    showRemove: true,
    showDownload: false
  };

  @Input() fileList: any = [];

  public previewImage: any;
  public token: any;
  public previewVisible: boolean = false;

  //上传完成与否
  public loading: boolean = false;


  constructor(private req: RequestService,
    private qn: QiNiuService,
    private warn: WarningService) {

  }

  // ngOnChanges(changes: SimpleChanges) {
  // if (changes.showOmg && changes.showOmg.currentValue) {
  //   this.showOmg = changes.showOmg.currentValue;
  //   this.uploadOmg = Object.assign(this.uploadOmg, this.showOmg);
  //   console.log("fulfil uplaod omg ", this.uploadOmg);
  // }
  // }


  ngDoCheck() {
    this.uploadOmg = Object.assign(this.uploadOmg, this.showOmg);
  }

  ngOnInit(): void {
    if (!this.qn.getToken()) {
      this.getToken().then(res => {
        token.token = res.uptoken;
        token.url = res.url;
      });
    }

  }

  getToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.qn.doPostImg({
        success: (res: any) => {
          resolve(JSON.parse(res.data));
        }
      })
    })
  }

  getExtraData(file: File) {
    return {
      token: token.token,
      file: file,
      key: 'cls/material/' + autoKey(18)
    }
  }


  /**
   * 上传文件前控制
   * @param {} file
   * @param {[]} _fileList
   * @returns {}
   */
  beforeUpload = (file: any, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp');
      if (!isJpgOrPng) {
        this.warn.onError(Messages.upload_file_format);
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.warn.onError(Messages.upload_file_size);
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  };

  /**
   * 移除文件时
   * @param {} file
   */
  removeFile = (file: NzUploadFile) => {
    return new Observable((observe: Observer<boolean>) => {
      this.handleImage.emit(this.getImageList(this.fileList))
      observe.next(file.status === "removed");
    })
  }


  handleChange(info: { file: NzUploadFile }) {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.loading = false;
        this.handleImage.emit(this.getImageList(this.fileList))
        break;
      case 'error':
        this.warn.onError(Messages.net_abnormal);
        this.loading = false;
        break;
    }

  }


  handlePreview = async (file: any) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };


  getImageList(fileList: any) {
    let images: any = [];
    if (fileList && fileList.length > 0) {
      fileList.map((file: any) => {
        if (file.status === "done") {
          if (file && file.uid) {
            //新上传图片
            images.push(`${token.url}/${file && file.response && file.response.url}`)
          } else {
            //已有图片
            images.push(file.url);
          }
        }
      })
    }
    return images;
  }

}
