import { Component, OnInit,Input,Output,OnChanges,EventEmitter } from '@angular/core';


@Component({
    selector: 'rev-count-down',
    template: `
  		<span *ngIf="count > 0 && undo">({{count >= 10?count:'0'+count}}s)</span>
  `
})
export class CountDownComponent implements OnInit,OnChanges {
    /***设置当前时间***/
    @Input() total:number;
    /***设置是否开启时间显示***/
    @Input() isOpen:boolean;

    @Output() open:EventEmitter<any> = new EventEmitter<any>();
    @Output() close:EventEmitter<any> = new EventEmitter<any>();

    public count:number;
    public undo:boolean;
    public timerCount:any;

    constructor() { }

    ngOnChanges(){
        this.undo = this.isOpen?this.isOpen:false;
        this.count = this.total?this.total:30;
        this.start();
    }

    ngOnInit() {

    }

    start(){
        if(this.undo){
            if(this.count > 0){
                this.count --;
                this.open.emit(this.count);
                this.timerCount = setTimeout(() =>{
                    this.start();
                },1000);
            }else{
                this.close.emit(this.count);
                clearTimeout(this.timerCount);
                this.timerCount = null;
                this.count = this.total?this.total:0;
            }
        }

    }









}
