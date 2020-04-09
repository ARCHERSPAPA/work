import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rev-copy-right',
  template: `<footer class="footer" [ngStyle]="{'background-color':bg}">© Copyright&nbsp;&nbsp;&nbsp;&nbsp;2015&nbsp;-&nbsp;{{current}}&nbsp;&nbsp;&nbsp;&nbsp;MadRock&nbsp;&nbsp;蜀ICP备&nbsp;15023956号-2</footer>`,
  styles:[
    `.footer{
      display: block;
      padding: 50px 0;
      text-align: center;
      font-size: 12px;
    
    }`
  ]
})
export class CopyRightComponent implements OnInit {
  @Input() bg:string;

  public current:string;

  constructor() { }

  ngOnInit() {
    this.current = new Date().getFullYear()+"";
    this.bg = this.bg?this.bg:"#f5f5f5";
  }

}
