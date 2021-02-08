import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<p style="min-width: 1000px;text-align:center;font-size:14px;">© Copyright&nbsp;&nbsp;&nbsp;&nbsp;2015&nbsp;-&nbsp;{{year}}&nbsp;&nbsp;&nbsp;&nbsp;MadRock&nbsp;&nbsp;蜀ICP备 15023956号-2</p>`
})
export class FooterComponent implements OnInit {
  public year:string = "2020";
  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear()+"";
  }


}
