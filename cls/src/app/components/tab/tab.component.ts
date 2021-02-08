import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getIndexByUrl } from '../../configs/methods';
@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less']
})
export class TabComponent implements OnInit {
  @Input() tabs: Array<any> = [];
  @Input() index: number = 0;
  @Output() handleSelect: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getIndex();
  }
  getIndex() {
    setTimeout(() => {
      const urls = this.router.url.split('detail');
      this.index = getIndexByUrl(urls[1], this.tabs);
      console.log(urls)
    }, 100)
  }
  tabClick(url: any, params: any) {
    this.router.navigate(['./' + url + ''], {
      queryParams: params,
      relativeTo: this.activatedRoute
    });
    this.getIndex();
    this.handleSelect.emit(this.index)
  }
}
