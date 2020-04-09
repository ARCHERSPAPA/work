import {Component, OnInit, Input, AfterViewChecked, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';
@Component({
    selector: 'rev-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

    /**
     * 传递title
     */
    @Input() title: string;
    /**
     * 右侧buttons
     * [{
        name:"按钮名称",
        type:"按钮事件",
        color:"按钮样式",
        method:() =>{
          执行函数
        }
      }]
     */
    @Input() buttons: Array<any>;

    /**
     * 右侧tags
     */
    @Input() atags: Array<any>;

    @Input() show: Boolean;

    //显示的文字
    @Input() text: string;

    //显示的数据
    @Input() num: number;

    @Input() isVisible: boolean;
    @Input() showBorder: boolean=true;

    constructor(private router:Router) {}

    ngOnInit() {}

    @Output() handleName = new EventEmitter<string>();

    // 部分页面的弹窗返回是否打开状态

    @Output() isopen = new EventEmitter<boolean>();

    handleNameClick(name: string) {
        this.isVisible = true
        this.isopen.emit(this.isVisible)
        this.handleName.emit(name)

    }


}
