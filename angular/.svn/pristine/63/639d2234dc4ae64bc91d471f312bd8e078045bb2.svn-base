import { Component, OnInit, Input } from '@angular/core';
import { Lightbox,LightboxConfig } from 'ngx-lightbox';
@Component({
  selector: 'rev-imgview',
  templateUrl: './imgview.component.html',
  styleUrls: ['./imgview.component.scss']
})
export class ImgviewComponent implements OnInit {
@Input() album:Array<any>;
@Input() index:number=0;
@Input() remarks:string='12321';
  constructor(
    private lightbox:Lightbox,
    private lightboxConfig:LightboxConfig
  ) { 

  }
  ngOnChanges(): void {
    this.lightbox.open(this.album,this.index)
    // let p3=document.createElement('p');
    // p3.innerText=this.remarks;
    // p3.className="remarks";
    // document.querySelector('body').append(p3);
 }

  ngOnInit() {
 
  }
openView(){
  
}
}
