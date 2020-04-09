import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  public materialTitle:string = ""
  public text:any
  public time:any

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params =>{
      if(params && params["origin"]){
        if(params["origin"] === '1'){
          if( localStorage.getItem("time") !== 'undefined'){
            this.time = localStorage.getItem("time");
          }
        }
      }
    })
    
    
    if(localStorage.getItem("title") !== 'undefined'){
      this.materialTitle = localStorage.getItem("title");
    }
    if( localStorage.getItem("content") !== 'undefined'){
      this.text = this.sanitizer.bypassSecurityTrustHtml( localStorage.getItem("content")+"<style>p.ql-align-left{text-align: left} p.ql-align-center{text-align: center} p.ql-align-right{text-align: right} img{max-width: 100%;margin: 10px 0;}</style>");
    }


  }
}
