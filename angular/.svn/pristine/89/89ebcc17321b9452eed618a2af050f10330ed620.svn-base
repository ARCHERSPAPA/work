import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

declare var jigsaw: any;

@Component({
    selector: 'rev-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
    //此组件需要在使用的页面的input上加上class（sliderContainer_active_input）
    @Output() handleSwitch = new EventEmitter<any>();
    @Input() img: false;
    public lock = true; //初始化时有可能失败，直到初始成功解锁

    public inits = function () {
        if (this.lock) {
            const that = this;
            if (jigsaw) {
                jigsaw.init({
                    //初始化
                    el: document.getElementById('captcha'), //选取dom
                    width: 320, //宽
                    height: 220,
                    imgList: that.img, //验证的图片
                    onSuccess: function () {
                        that.handleSwitch.emit('success');
                    },
                    onFail: function () {
                        that.handleSwitch.emit('fail');
                    },
                    onRefresh: function () {
                        that.handleSwitch.emit('Refresh');
                    },
                });
                this.lock = false;
            }
        }

    };
    constructor() {
    }
    ngDoCheck() {
        if (this.lock) {
            if (typeof jigsaw != 'undefined') {
                this.inits();
            this.lock = false;
        }
        }
    }

    ngOnInit() {
        setTimeout(() => {
            this.inits();
        }, 300);
    }

}
