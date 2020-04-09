import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rev-article-item',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
