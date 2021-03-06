import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rev-view',
  templateUrl: './view.component.html',
  styleUrls: ['./../rev/rev.component.scss']
})
export class ViewComponent implements OnInit {

  public isPrint=false;
  constructor(private router: Router,) {
  }

  ngOnInit() {
    if(this.router.url.includes('view/print')){
      this.isPrint=true
    }
    console.log(this.router.url.includes('view/print'))
  }
}
