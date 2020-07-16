import { NgModule } from '@angular/core';
import {UploaderNewComponent} from '../plugins/uploader-new/uploader-new.component';
import {UploaderBtnComponent} from '../plugins/uploader-btn/uploader-btn.component';


@NgModule({
  imports: [],
  declarations: [
      UploaderNewComponent,
      UploaderBtnComponent
  ],
  exports: [UploaderNewComponent, UploaderBtnComponent]
})
export class UploadModule { }
