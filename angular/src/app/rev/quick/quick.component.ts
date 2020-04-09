import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DepartService} from "../../service/depart.service";

@Component({
  selector: 'rev-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.scss']
})
export class QuickComponent implements OnInit {

  @Input() type:number;
    /**
     * 是否关联快捷查询 1：不关联
     */
  @Input() relate:string;

  @Output() selectId:EventEmitter<any> = new EventEmitter<any>();

  public departList:any;

  public quickId:number;

  public connection:boolean = false;



  constructor(private depart:DepartService) {

  }

  ngOnInit() {
      this.type = this.type?this.type:4;
      this.connection = this.relate?false:true;

    if(this.type){
        if(!this.depart.getDepartList(this.type)){
            this.depart.loadDepart(0,this.type);
        }
    }
  }


    selectQuickId(id){
      console.log(id);
      this.quickId = id;
      this.selectId.emit(id);
    }

  ngAfterViewInit() {
      setTimeout(() => {
        this.departList = this.depart.getDepartList(this.type);
        if(this.departList && this.departList.length > 0){
            this.quickId = this.departList[0].id;
            this.selectId.emit(this.departList[0].id);
        }
      },1000);
  }


    ngOnDestroy(){
        this.depart.setDepartData(this.type,0,null);
        // this.depart-tree.setQuickDepartId(null);
    }

}
