import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rev-uploader-btn',
  templateUrl: './uploader-btn.component.html',
  styleUrls: ['./uploader-btn.component.scss']
})
export class UploaderBtnComponent implements OnInit {

  @Input() btnName:string;
  constructor() { }

  ngOnInit() {
    this.btnName = this.btnName?this.btnName:'上传文件';
  }

}
