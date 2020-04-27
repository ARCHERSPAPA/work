import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { sideAnimate } from "../../../animation/transform.component";

@Component({
  selector: 'rev-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./../personnel.component.scss', './staff.component.scss'],
  animations: [
    sideAnimate
  ]
})
export class StaffComponent implements OnInit {
  public title: string;
  public buttons: Array<any>;
  public showBtn: boolean = false
  public showTitle: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.title = this.getTitle();
    this.buttons = [{
      name: "新建员工",
      link: "/rev/personnel/staff/add"
    }]
  }

  handleName(name: string) {
    switch (name) {
      case "新建员工":
        this.router.navigate(["./add"], { relativeTo: this.activatedRoute });
        break;
      default:
        this.router.navigate(["./list"], { relativeTo: this.activatedRoute });
        break;
    }
  }

  ngDoCheck() {
    this.title = this.getTitle();
    let url = this.activatedRoute.snapshot["_routerState"].url.toString();
    this.showBtn = url.indexOf("list") >= 0;
  }

  getTitle() {
    let url = this.router.url.match(/personnel\/staff\/[a-z]+/g);
    if (url && url.length > 0 && url[0].includes('add')) {
      let id = this.activatedRoute.queryParams["value"]["id"];
      if (!id) return "新建员工";
      return "编辑员工";
    } else if (url && url.length > 0 && url[0].includes("wechat")) {
      return "微信通知";
    } else if (url && url.length > 0 && url[0].includes("permission")) {
      return "APP权限";
    } else if (url && url.length > 0 && url[0].includes("associate")) {
      return "交接项目";
    }
    else {
      return "员工管理";
    }

  }

}
