import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rev-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./../../user/user-info/user-info.component.scss','./steps.component.scss']
})
export class StepsComponent implements OnInit {
    public breads:Array<any>;
    constructor() { }

    ngOnInit() {
        this.breads = [
            {
                name: "登录页",
                url: "/user/login"
            },
            {
                name: "我要开店"
            }
        ]
    }

}
