import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

interface  IForm {
    //传入搜索栏类型text（文本），group（下拉文本联合）,select(下拉),button(点击按钮)
    type:string,
    //相应的类型的名称（建议与查询的字段对应）
    name:string,
    //所展示的宽度比例
    cols:number,
    //select选项时的被选项
    data:any,
    //默认值或者当前选择的值
    value:any,
    //是否开启自动搜索
    search:boolean,
    //关联对应的选项名称
    connect:string
}

@Component({
    selector: 'rev-search-simple-bar',
    templateUrl: './search-simple-bar.component.html',
    styleUrls: ['./search-simple-bar.component.scss']
})
export class SearchSimpleBarComponent implements OnInit {

    @Input() forms: Array<IForm>;
    //文本输出
    @Output() handleForm: EventEmitter<any> = new EventEmitter<any>();
    //选项输入
    @Output() handleSelect: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
        // console.log(this.forms);
    }

    //单项或者多项选择时触发使用
    modelSelectChanged(e: any, name: string) {
        // console.log("input changed ", e);
        // console.log("input name is", name);
        this.handleSelect.emit({value: e, name: name});
    }

    //单击按钮控制触发时使用
    clickChanged(e: any, name: string) {
        e.preventDefault();
        e.stopPropagation();
        this.handleForm.emit({value: this.getInfo(), name: name});

    }

    modelChanged(e:any,name:string){
        // console.log("event is",e);
        // console.log("name is",name);
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
            if(group && group.length > 0){
                group.forEach(g =>{
                    maps.set(g.name,g.value);
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
    getConnectInfo(connect:string){
        if(connect){
            if(this.forms && this.forms.length > 0){
                let find = this.forms.filter(f => f.name === connect);
                if(find && find.length > 0){
                    return this.justEmpty(find[0].value);
                }
                return false;
            }
        }
        return false;
    }

    justEmpty(value:any){
        if(value === null) return true;
        else if(value === undefined) return true;
        else return false;
    }

}
