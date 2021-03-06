import { Component, OnInit, Input } from '@angular/core';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
@Component({
  selector: 'rev-imgview',
  templateUrl: './imgview.component.html',
  styleUrls: ['./imgview.component.scss']
})
export class ImgviewComponent implements OnInit {
@Input() album: Array<any>;
@Input() index = 0;
  constructor(
    private lightbox: Lightbox,
  ) {

  }
  ngOnChanges(): void {
    this.lightbox.open(this.album, this.index);
 }

  ngOnInit() {

  }
}
