import { Component, OnInit } from '@angular/core';
import { menus } from 'src/app/model/menu';
import {
    Router,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
    RoutesRecognized
} from '@angular/router';
import { RequestService } from '../service/request.service';
import { WarningService } from '../service/warning.service';
import { Messages } from '../model/msg';
import { UserService } from '../service/user.service';
import { NzIconService } from 'ng-zorro-antd';
import { RoleService } from '../service/role.service';

@Component({
    selector: 'rev-rev',
    templateUrl: './rev.component.html',
    styleUrls: ['./rev.component.scss']
})
export class RevComponent implements OnInit {
    public menus: Array<any>;
    public currentUrl: string;
    public name: string;

    //左侧导航栏
    // public isCollapsed = false;
    // public isReverseArrow = false;
    // public width = 200;

    constructor(private router: Router,
        private userInfo: UserService,
        private request: RequestService,
        private warn: WarningService,
        private iconService: NzIconService,
        private role: RoleService) {
        this.iconService.fetchFromIconfont({
            scriptUrl: '//at.alicdn.com/t/font_1455291_anffrgt4fn.js'
        });

        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                // console.log("NavigationStart");
                // console.log(event);
            } else if (event instanceof NavigationEnd) {
                // console.log("NavigationEnd");
                // console.log(event);
                this.currentUrl = event.urlAfterRedirects ? event.urlAfterRedirects : null;
                if (this.menus && this.menus.length > 0) {
                    this.componentMenu(this.menus);
                }
            } else if (event instanceof NavigationCancel) {
                // console.log("NavigationCancel");
            } else if (event instanceof NavigationError) {
                //
                // console.log("NavigationError");
            } else if (event instanceof RoutesRecognized) {
                //
                // console.log("RoutesRecognized");
            }
        });
    }

    ngOnInit() {
        this.reloadMenu();
        // this.renderMenu(menus);
    }

    ngDoCheck() {
        this.name = this.userInfo.getAccount();
    }

    renderMenu(data: any) {
        let index = -1;
        if (data && data.length > 0) {
            const d = data.filter((d, i) => {
                if (d.catalogName === '待办事项') {
                    index = i;
                    return d;
                }
            });
            if (d && d.length == 1 && index >= 0) {
                data.splice(index, 1);
                data.unshift(d[0]);
            }
            this.menus = this.componentMenu(data);
            // console.log(this.menus);
        }
    }

    componentMenu(data) {
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] && data[i].catalogs && data[i].catalogs.length > 0) {
                    data[i]['sub'] = false;
                    data[i]['name'] = this.setIconByName(data[i].catalogName);
                    data[i].catalogs.forEach((item, index) => {
                        item['go'] = this.findUrlByName(item.catalogName);
                        item['isSelect'] = false;
                        if (this.currentUrl) {
                            if (this.currentUrl.includes(item['go'])) {
                                item['isSelect'] = true;
                                data[i].sub = true;
                            }
                        } else {
                            if (i === 0 && index === 0) {
                                item['isSelect'] = true;
                                data[i].sub = true;
                            }
                        }
                    });
                }
            }
        }
        return data;
    }

    /**
     * 给url赋值跳转路径
     * @param name
     * @returns {any}
     */
    findUrlByName(name) {
        for (const menu of menus) {
            for (const log of menu.catalogs) {
                if (log.catalogName == name) { return log.go; }
            }
        }
        return '';
    }

    setIconByName(name: string) {
        const menu = menus.filter((menu) => {
            return (menu.catalogName == name);
        });
        if (menu && menu.length > 0) {
            return menu[0].name;
        }
        return '';
    }

    /**
     * 左侧导航栏打开时
     * @param {number} i
     */
    openHandler(i: number) {
        if (this.menus && this.menus.length > 0) {
            this.menus.map((menu, index) => {
                return menu.sub = (i === index);
            });
        }
    }

    /**
     * 退出登录
     */
    exit() {
        this.request.doPost({
            url: 'logout',
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.userInfo.clearCookie();
                    this.userInfo.setCompanyId(null);
                    this.userInfo.setKey(null);
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.router.navigateByUrl('/user/login');
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * 加载menus
     */
    reloadMenu() {
        const p = new Promise((resolve, reject) => {
            this.role.loadRoles(-1, resolve, reject);
        });
        p.then(res => {
            this.renderMenu(res);
        }).catch(rea => {
            this.warn.onError(rea || Messages.FAIL.DATA);
        });
    }

    /**
     * menu icon 定义
     * @param {string} name icon 定义名称
     * @returns {string}
     */
    getMenuIcon(name: string) {
        switch (name) {
            case 'schedule':
                return 'icondaibanshixiang';
            case 'merchant':
                return 'iconshangjiaziliao';
            case 'personal':
                return 'iconrenshiguanli';
            case 'product':
                return 'iconchanpinguanli';
            case 'sales':
                return 'iconkefuguanli';
            case 'cost':
                return 'iconchengbenguanli';
            case 'master':
                return 'iconzhucaiguanli';
            case 'supplier':
                return 'iconcailiaoshangguanli';
            case 'client':
                return 'iconkehuguanli';
            case 'offer':
                return 'iconbaojiaguanli';
            case 'finance':
                return 'iconcaiwuguanli';
            case 'article':
                return 'iconxiangmuguanli';
            case 'settle':
                return 'iconxiangmujiesuan';
            case 'warranty':
                return 'iconshouhouguanli';
            case 'topic':
                return 'icongonggao';
            case 'stats':
                return 'iconshujutongji';
            case 'case':
                return 'iconxiaochengxuanli';
            default:
                return 'iconbaojiaguanli';
        }
    }
    ngOnDestory() {
        this.currentUrl = null;
        this.menus = null;
    }

}
