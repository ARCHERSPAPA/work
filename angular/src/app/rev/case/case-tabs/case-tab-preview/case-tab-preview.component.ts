import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'rev-case-tab-preview',
  templateUrl: './case-tab-preview.component.html',
  styleUrls: ['./case-tab-preview.component.scss','../../../notice/preview/preview.component.scss']
})
export class CaseTabPreviewComponent implements OnInit {
public text
  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if( localStorage.getItem("content") !== 'undefined'){
      this.text = this.sanitizer.bypassSecurityTrustHtml( localStorage.getItem("content")+"<style>p.ql-align-left{text-align: left} p.ql-align-center{text-align: center} p.ql-align-right{text-align: right} img{max-width: 100%;margin: 10px 0;}</style>");
    }
    console.log(localStorage.getItem("content"))
  }

}
