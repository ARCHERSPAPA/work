import {Component, OnInit} from '@angular/core';
import {Menus} from "../../configs/menus";
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from "../../services/storage.service";
import {EStorage} from "../../enums/e-storage.enum";
import {SchedulesService} from "./schedules.service";
import {WarningService} from "../../services/warning.service";

enum ERoleName {
  admin = "管理员",
  employee = "普通管理员",
  others = "其它职员"
}


interface IUser {
  company: string;
  username: string;
  headImg: string;
  phone: string;
  role: string,
  schedules: Array<any> | null;
}

interface ISchedule {
  key: string;
  code: string;
  count: number;
  url: string;
  state: number
}

class User implements IUser {
  company: string = "张家口装饰装潢有限责任公司";
  headImg: string = "https://qiniu.madrock.com.cn/rev/imgs/435467b6-6b9e-2a36-a51b-bde1d77a31ce.png";
  phone: string = "xxx";
  role: string = "暂无";
  username: string = "暂未获取到";
  schedules: Array<any> | null = null;

}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.less']
})
export class SchedulesComponent implements OnInit {

  public user: IUser = new User();

  //自动更换列数
  public count: number = 3;

  public columns: Array<any> = new Array(this.count);

  public schedules: ISchedule[] = [];

  public loading: boolean = false;

  constructor(private router: Router,
              private activatedRoute:ActivatedRoute,
              private storageService: StorageService,
              private schedulesService: SchedulesService,
              private warn: WarningService) {

  }

  ngOnInit(): void {

    this.getUserInfo();


    // this.user.schedules = [
    //   {key: '1-1-1', num: 5},
    //   {key: '1-13-1', num: 7},
    //   {key: '1-14-1', num: 35},
    //   {key: '1-14-2', num: 17}
    // ];

  }


  getScheduleNameByKey(schedules: Array<any> | null): Array<any> {
    const menus = Menus;
    if (schedules && schedules.length > 0) {
      schedules.map(schedule => {
        const level = schedule.key.split("-").length === 2 ? 0 : 1;
        if (level === 1) {
          const find = menus.find(menu => menu.key === schedule.key.substring(0, schedule.key.lastIndexOf("-")));
          if (find && find.catalogName) {
            const child = find.catalogs.find(cf => cf.key === schedule.key);
            if (child && child.url) {
              schedule["url"] = child.url;
              // schedule["name"] = child.catalogName;
            }
          }
        }
      })
      return schedules;
    }
    return []
  }


  todo(schedule: ISchedule) {
    this.storageService.setStorage(EStorage.CLICK_MENU, schedule.key);
    this.router.navigate([schedule.url],{
      queryParams:{
        state: schedule.state
      },
      relativeTo: this.activatedRoute
    });
  }


  getUserInfo() {
    this.loading = true;
    this.schedulesService.getUserInfo()
      .then(data => {
        this.loading = false;
        if (data && data.userInfo) {
          const userInfo = data.userInfo;
          this.user.username = userInfo && userInfo.nickName;
          this.user.company = userInfo && userInfo.companyName;
          this.user.headImg = userInfo && userInfo.headImg;
          this.user.phone = userInfo && userInfo.account;
          this.user.role = userInfo && userInfo.position;
        }
        if (data && data.modules) {
          this.user.schedules = data.modules;
          this.schedules = this.getScheduleNameByKey(this.user.schedules);
          const len = this.schedules.length;
          this.count = (len / 3) >= 1 ? 3 : (len % 3);
        }
      })
      .catch(err => {
        this.loading = false;
        this.warn.onError(err);
      })
  }

}
