import { Component, OnInit,Input } from '@angular/core';
import {Router, Params, ActivatedRoute,NavigationEnd} from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

interface IBread{
  url:string;
  label:string;
  params:Params;
}

@Component({
  selector: 'rev-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() breads:Array<any>;



  constructor(private router:Router,
              private activatedRoute:ActivatedRoute) {
  }

  ngOnInit() {

  }



}


