import { Component, Input, OnInit} from '@angular/core';
@Component({
    selector: 'examine-person',
    templateUrl: './examine-person.component.html',
    styleUrls: ['./examine-person.component.scss']
})
export class ExaminePersonComponent implements OnInit {
    //当前所有项目人员类型
    @Input() items: Array<any> = [];
    //当前选中人员类型
    // @Input() item: any;

    //选中时的回显数据
    @Input() index: number;


    // private radioValue:number;
    // private style = {
    //     display   : 'block',
    //     height    : '30px',
    //     lineHeight: '30px'
    // };

    ngOnInit() {
        console.log(this.index);
        // this.radioValue = this.index;
        // this.radioValue = this.index;
    }

    // handleSelect(item) {
    //     // this.index = item.key;
    //     console.log(item);
    //
    // }

}
