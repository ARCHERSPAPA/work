import {States} from "./states";

/**
 * 判断传入的值是否为数值型
 * @param num
 * @returns {any}
 */
export function equalZero(num: any, symbol: string = "-"): any {
  if (typeof num === "undefined") return symbol;
  if (typeof num === null) return symbol;
  if (typeof num === "string") {
    if (Number.isNaN(Number(num))) return symbol;
    else num;
  }
  if (typeof num === "number") return num;
}

/**
 * 根据key 当前传入的st 查找相应的文本
 * @param st
 * @param {Array<any>} names
 * @param {string} key
 * @returns {any}
 */
export function getNameByKey(st: any, names: Array<any>, key: string = "state") {
  let find = names.filter(n => n[key] === st);
  if (find && find.length > 0) return find[0]["content"];
  return null;
}

/**
 * 根据url来判断当前显示tab
 * @param url 当前url
 * @param tabs tabs集合
 */
export function getIndexByUrl(url: any, tabs: any) {
  if (url && tabs && tabs.length > 0) {
    for (let i = 0; i < tabs.length; i++) {
      if (url.indexOf(tabs[i].url) > -1) {
        return i;
      }
    }
  }
  return 0;
}

/**
 * 两数相乘
 * @param {number} num
 * @param {number} unit
 * @returns {number}
 */
export function addition(num: number, unit: number) {
  return ((Math.pow(10, 2) * num) * (Math.pow(10, 2) * unit)) / Math.pow(10, 4);
}

/**
 * 两数相加
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
export function plus(num1: number, num2: number) {
  return (100 * num1 + 100 * num2) / 100;
}

/**
 * 根据对应的文本渲染,
 * @param {string} name
 * @param {string} symbol 替代符号
 */
export function renderName(name: any, symbol: string = "--") {
  return name ? name : symbol
}

/**
 * 根据相应的文本数组渲染
 * @param arr
 * @param {string} symbol
 * @param {string} join
 * @returns {any}
 */
export function renderArrayName(arr: any, symbol: string = "--", join: string = ",") {
  if (arr && arr instanceof Array && arr.length > 0) {
    return arr.join(join);
  }
  return symbol;
}


/**
 * 根据表单类型查找表单
 * @param {Array<any>} forms
 * @param {string} type
 * @returns {any}
 */
export function findFormByType(forms: Array<any>, type: string) {
  if (forms && forms.length > 0) {
    return forms.filter(form => form.type === type);
  }
  return null;
}

/**
 * 根据相应的数组字段返回总额
 * @param {Array<any>} items 数组
 * @param {string} filed 求总计的字段名称
 * @returns {any}
 */
export function computedTotal(items: Array<any>, filed: string) {
  return items.reduce((prev, item) => {
    if (filed) return plus(Number(item[filed]?item[filed]:0), prev);
    return plus(item, prev);
  }, 0)
}

/**
 * 自定义编码名称
 * @param {number} n
 * @returns {string}
 */
export function autoKey(n: number) {
  let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
  let tmp = '',
    i = 0,
    l = str.length;
  for (i = 0; i < n; i++) {
    tmp += str.charAt(Math.floor(Math.random() * l));
  }
  return tmp;
}


//合并同类项（标准单、定制单）
export function combineSimilarItems() {
  let items: any = [];
  //s:标准单，c：定制单
  const s = States.itemState, c = States.customizedState;
  let o = new Map();
  for (let i in s) {
    o.set(s[i].content, s[i].state);
  }

  for (let j in c) {
    if (o && o.size > 0) {
      if (o.has(c[j].content)) {
        let v = o.get(c[j].content);
        o.set(c[j].content, [v, c[j].state].join(","))
      } else {
        o.set(c[j].content, c[j].state);
      }
    } else {
      o.set(c[j].content, c[j].state);
    }
  }

  if (o && o.size > 0) {
    o.forEach((item, key) => {
      items.push({state: item.toString(), content: key});
    })
  }
  items.unshift({state: "-100", content: "全部类别"});
  return items;
}


/**
 * 判断是否为当天
 * @param date
 * @returns {boolean}
 */
export function isToday(date: any) {
  const today = new Date(new Date().toLocaleDateString()).getTime();
  const compare = new Date(new Date(date).toLocaleDateString()).getTime();
  return today === compare;
}

/***
 * 置空参数设置
 * @param params
 * @returns {any}
 */
export function renderParams(params: any) {
  for (var key in params) {
    if (params[key] === null) {
      delete params[key];
    }
  }
  return params;
}

/**
 * 执行操作后是否需要刷新当前或前一页代码判断
 * @param {Array<any>} params 提交时的数组对象（取个数）
 * @param {Array<any>} results 页面数据渲染时的对象（取个数）
 * @returns {Promise<any>}
 */
export function reloadChange(params: Array<any> = [], results: Array<any> = []): Promise<any> {
  return new Promise((resolve) => {
    resolve(params && results && params.length === results.length);
  })
}

/**
 * 根据状态码是否在对应的状态码数组中返回boolean
 * @param {number} state
 * @param {Array<number>} status
 * @returns {boolean}
 */
export function stateInArray(state: number, status: Array<number>): boolean {
  return status.some((s: any) => s === state);
}
