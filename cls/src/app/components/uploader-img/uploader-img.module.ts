import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderImgComponent } from './uploader-img.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [UploaderImgComponent],
  imports: [
    CommonModule,
    NzUploadModule,
    NzIconModule,
    NzModalModule
  ],
  exports: [UploaderImgComponent],
})
export class UploaderImgModule { }
