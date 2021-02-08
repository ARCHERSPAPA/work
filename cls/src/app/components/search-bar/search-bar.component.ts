import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import {findFormByType} from "../../configs/methods";

interface ISearchBar {
  type: string;
  //相应的类型的名称（建议与查询的字段对应）
  name: string;
  //所展示的宽度比例
  cols: number;
  //select选项时的被选项
  data: any;
  //默认值或者当前选择的值
  value: any;
  //是否开启自动搜索
  search: boolean;
  //关联对应的选项名称
  connect: string;
  //提示信息
  placeholder:string;
  //按钮时text显示名称
  text:string;
  //按钮时的颜色或者主题
  theme:any;
  //选项时的mode或者日历
  mode:any;
  //是否开启清除
  clear:boolean;
  //是否回车
  keydown:boolean,
  //是否预设日期区间格式ranges:[new Date(),new Date()]
  ranges:any
}


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {
  //查询表单化
  @Input() forms: Array<ISearchBar> = [];

  @Output() handleSelect: EventEmitter<any> = new EventEmitter<any>();

  @Output() handleForm: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {

  }


  clickChanged(e: any, name: string) {
    e.preventDefault();
    e.stopPropagation();
    this.handleForm.emit({value: this.getInfo(), name: name});
  }

  keydownChange(e: any, f: any) {
    if (f.keydown && e.keyCode === 13) {
      this.handleForm.emit({value: this.getInfo(), name: f.name});
    }
  }

  disabledDateRange = (current: Date): boolean =>{
    const f = findFormByType(this.forms,"dateRange");
    if(f && f.length === 1){
      if(f[0].ranges && f[0].ranges.length > 0){
        return !(differenceInCalendarDays(current,f[0].ranges[0]) > 0 &&   differenceInCalendarDays(current,f[0].ranges[1]) <= 0)
      }
    }
    return false;
  }

  disabledDate = (current: Date): boolean =>{
    const f = findFormByType(this.forms,"date");
    if(f && f.length === 1){
      if(f[0].ranges && f[0].ranges.length > 0){
        return !(differenceInCalendarDays(current,f[0].ranges[0]) > 0 &&   differenceInCalendarDays(current,f[0].ranges[1]) <= 0)
      }
    }
    return false;
  }




  /**
   * 根据不同类型查找
   * @param {string} type
   * @returns {any}
   */
  findFormByType(type:string){
    return this.forms.filter(form => form.type === type);
  }


  modelSelectChanged(e: any, name: string) {
    this.handleSelect.emit({
      value: e,
      name: name
    });
  }

  //精验输入文本的数据信息
  getInfo() {
    let maps = new Map();
    if (this.forms && this.forms.length > 0) {
      let find = this.forms.filter(f => f.type === 'text');
      if (find && find.length > 0) {
        find.forEach(f => {
          maps.set(f.name, f.value);
        })
      }
      let group = this.forms.filter(f => f.type === 'group');
      if (group && group.length > 0) {
        group.forEach(g => {
          maps.set(g.name, g.value);
        })
      }
      let text = this.forms.filter(f => f.type === 'textGroup');
      if (text && text.length > 0) {
        text.forEach(g => {
          maps.set(g.name, g.value);
        })
      }
    }

    return maps;
  }

  /**
   * 根据当前传入的实参得出
   * @param {number} v
   * @param {Array<any>} g
   */
  getTips(v: number, g: Array<any>) {
    if (g && g.length > 0) {
      let f = g.filter(item => item.value === v);
      if (f && f.length > 0) {
        return f[0].label;
      }
    }
    return null;
  }

  /**
   * 根据关联的名称查询相关联的选项的名称数据
   * @param {string} connect
   * @returns {any}
   */
  getConnectInfo(connect: string) {
    if (connect) {
      if (this.forms && this.forms.length > 0) {
        let find = this.forms.filter(f => f.name === connect);
        if (find && find.length > 0) {
          return this.justEmpty(find[0].value);
        }
        return false;
      }
    }
    return false;
  }


  /**
   * 判断输入是否为空
   * @param value
   * @returns {boolean}
   */
  justEmpty(value: any) {
    if (value === null) return true;
    else if (value === undefined) return true;
    else return false;
  }


  ngOnDestroy(){
     this.forms = [];
  }


}
