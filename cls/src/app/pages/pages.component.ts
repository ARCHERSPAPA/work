import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {UserService} from "../user/user.service";
import {WarningService} from "../services/warning.service";
import {StorageService} from "../services/storage.service";
import {Base} from "../configs/base";
import {NzIconService} from 'ng-zorro-antd/icon';
import {IMenu, IMenuSub, Menus} from "../configs/menus";
import {EStorage} from "../enums/e-storage.enum";
import {filter} from 'rxjs/operators';
import {startWith} from 'rxjs/internal/operators/startWith';

interface IUser {
  headImg: string;
  nickName: string;
  id: any;
  loginStatus: any,
  menus: Array<any>
}

class CUser implements IUser {
  headImg: string = Base.user.headImg;
  id: any;
  loginStatus: any;
  nickName: string = "暂无名称";
  menus: Array<IMenu> = [];
}


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  //是否展开菜单栏
  public isCollapsed: boolean = false;
  //接受menus的数据
  public menus: Array<IMenu> = [];

  //用户登录信息
  public user: IUser = new CUser();

  constructor(private router: Router,
              private userService: UserService,
              private warn: WarningService,
              private storageService: StorageService,
              private iconService: NzIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: "//at.alicdn.com/t/font_1455291_0bmhw3z2q4hn.js"
    })
  }

  ngOnInit(): void {
    if (this.storageService.getStorage(EStorage.USER_INFO)) {
      this.user = this.storageService.getStorage(EStorage.USER_INFO);
      this.user.nickName = this.userService.setDefaultUserInfo(this.user.nickName, Base.user.nickName);
      this.user.headImg = this.userService.setDefaultUserInfo(this.user.headImg, Base.user.headImg);
    }
    // this.menus = Object.assign(Menus,this.user.menus);
    this.menus = this.renderMenus(Menus, this.user.menus, this.menus);

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      startWith(true)
    ).subscribe(event => {
      const defaultKey = this.storageService.getStorage(EStorage.CLICK_MENU);
      if (defaultKey) {
        this.menus = this.patchRouter(defaultKey, this.menus);
      } else {
        this.menus = this.patchRouter(Menus[0].catalogs[0].key, this.menus);
      }
    })


  }


  /**
   * 退出登录
   */
  logout() {
    this.userService.logout().then(msg => {
      this.warn.onSuccess(msg);
      this.storageService.clearAll();
      setTimeout(() => {
        this.router.navigate(["/"]);
      })
    }).catch(err => {
      this.warn.onError(err);
    })
  }

  //跳转链接
  clickMenu(data: IMenuSub, menus: Array<IMenu>) {
    this.storageService.setStorage(EStorage.CLICK_MENU, data.key);
    this.menus = this.patchRouter(data.key, menus);
    this.router.navigateByUrl(data.url);
  }

  /**
   * 匹配当前路由与菜单列表
   * @param {string} key
   * @param {Array<IMenu>} menus
   * @returns {Array<IMenu>}
   */
  patchRouter(key: string, menus: Array<IMenu>): Array<IMenu> {
    menus = this.resetMenu(menus);
    const parentKey = key.substring(0, key.lastIndexOf("-"));
    const parent = menus.find(menu => menu.key === parentKey);
    if (parent && parent.key) {
      parent.selected = true;
      const current: IMenuSub | undefined = parent.catalogs.find((menu: any) => menu.key === key);
      if (current && current.key) {
        current.selected = true;
      }

    }
    return menus;
  }


  /**
   * 重置所有menu值为false
   * @param {Array<any>} menus
   * @returns {Array<any>}
   */
  resetMenu(menus: Array<any>): Array<any> {
    menus.map((menu: any) => {
      menu.selected = false;
      if (menu.catalogs && menu.catalogs.length > 0) {
        this.resetMenu(menu.catalogs);
      }
    })
    return menus;
  }


  renderMenus(menus: Array<any>, userMenus: any, resultMenus: Array<any>): Array<any> {
    // 以用户数据为导向
    // userMenus.map((um:any) =>{
    //     if(this.hasMenuByRouter(um.key,menus)) {
    //       if(this.getMenuByLevel(um.key) === 0){
    //         const pf = menus.find((menu:IMenu) => menu.key === um.key);
    //         console.log("level === 0",pf.catalogs);
    //         if(pf && pf.key){
    //           resultMenus.push({
    //             key: pf.key,
    //             catalogName: pf.catalogName,
    //             icon: pf.icon,
    //             selected: pf.selected,
    //             catalogs: []
    //           });
    //           this.renderMenus(pf.catalogs,um.catalogs,resultMenus[resultMenus.length - 1].catalogs);
    //         }
    //       }else{
    //         const sf = menus.find((menu:IMenuSub) => menu.key === um.key);
    //         console.log("level === 1",sf);
    //         if(sf && sf.key){
    //           resultMenus.push({
    //             key: sf.key,
    //             catalogName: sf.catalogName,
    //             selected: sf.selected,
    //             url:sf.url
    //           });
    //         }
    //       }
    //     }
    // })
    //以本地数据为导向
    menus.map((menu: any) => {
      if (this.hasMenuByRouter(menu.key, userMenus)) {
        if (this.getMenuByLevel(menu.key) === 0) {
          const pf = userMenus.find((um: any) => um.key === menu.key);
          resultMenus.push({
            key: menu.key,
            catalogName: menu.catalogName,
            icon: menu.icon,
            selected: menu.selected,
            catalogs: []
          });
          this.renderMenus(menu.catalogs, pf.catalogs, resultMenus[resultMenus.length - 1].catalogs);
        } else {
          resultMenus.push({
            key: menu.key,
            catalogName: menu.catalogName,
            selected: menu.selected,
            url: menu.url
          });
        }
      }
    })
    return resultMenus;
  }


  //判断是否存在
  hasMenuByRouter(routerKey: string, menus: Array<any>): boolean {
    if (menus && menus.length > 0) {
      return menus.some((menu: any) => menu.key === routerKey);
    }
    return false;
  }


  getMenuByLevel(routerKey: string): number {
    return routerKey && routerKey.split("-").length === 2 ? 0 : 1;
  }

}
