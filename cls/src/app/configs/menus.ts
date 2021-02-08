/**
 * 一级菜单定义
 */
import {EMenuKeys,EMenuNames} from "../enums/e-menus.enum";

export interface IMenu {
  //主键值
  key: string;
  //菜单名称
  catalogName: string;
  //菜单图标
  icon: string;
  // //是否有子类
  // sub: boolean;
  //子类是否选中
  selected: boolean;
  //子类集合
  catalogs: Array<IMenuSub>;
}

/**
 * 子类定义或二级菜单定义
 */
export interface IMenuSub {
  //主键值
  key: string,
  //菜单名称
  catalogName:string,
  //是否选中
  selected: boolean,
  //跳转地址
  url: string
}


export const Menus = [
  {
    key: EMenuKeys.SCHEDULE,
    catalogName: EMenuNames.SCHEDULE,
    icon: "iconshouye",
    selected: false,
    catalogs: [
      {
        key: EMenuKeys.SCHEDULE_LIST,
        catalogName: EMenuNames.SCHEDULE_LIST,
        selected: false,
        url: "/pages/schedule"
      }]
  },
  {
    key: EMenuKeys.SETTLE,
    catalogName: EMenuNames.SETTLE,
    icon: "iconxiangmujiesuan",
    selected: false,
    catalogs:[
      {
        key: EMenuKeys.SETTLE_LIST,
        catalogName: EMenuNames.SETTLE_LIST,
        selected: false,
        url: "/pages/settle/list"
      },
    ]
  },
  {
    key: EMenuKeys.ORDER,
    catalogName: EMenuNames.ORDER,
    icon: "iconxiangmuguanli",
    selected: false,
    catalogs: [
      {
        key: EMenuKeys.ORDER_LIST,
        catalogName: EMenuNames.ORDER_LIST,
        selected: false,
        url: "/pages/order/list"
      },
      {
        key: EMenuKeys.ORDER_ITEM,
        catalogName: EMenuNames.ORDER_ITEM,
        selected: false,
        url: "/pages/order/item"
      },
    ]
  }
];
