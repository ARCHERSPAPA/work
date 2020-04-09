import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {DepartService} from "../../service/depart.service";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'rev-quick-tree',
  templateUrl: './quick-tree.component.html',
  styleUrls: ['./quick.component.scss']
})
export class QuickTreeComponent implements OnInit {
  @Input() quickTree:any;
  @Input() rank:number;
  @Input() type:number;
  @Input() quickId:number;

    /**
     * 是否关联 true:关联，false:不关联
     */
  @Input() relate:boolean;

  @Output() selectDepartmentId:EventEmitter<any> = new EventEmitter<any>();

  public quickDepartType:number;

  constructor(private depart:DepartService,
              private user:UserService) { }

  ngOnInit() {
      this.quickDepartType = this.user.getQuickQueryDepartType();
  }


  DoCheck(){
      if(!this.quickDepartType || this.user.getQuickQueryDepartType()){
          this.quickDepartType = this.user.getQuickQueryDepartType();
      }
  }

  loadChild(item,type){
      item.show = !item.show;
      // console.log(type);
      if(!item.loatd && item.ownSubset){
          this.depart.loadDepart(item.id,type);
      }
  }

  selectDepart(id){
      this.quickId = id;
      this.selectDepartmentId.emit(id);
  }

  selectQuickId(id){
      this.quickId = id;
      this.selectDepartmentId.emit(id);
  }

  ngDoCheck(){
      // if(this.depart-tree.getQuickDepartId()){
      //     this.getQuickId = this.depart-tree.getQuickDepartId();
      // }
      // else{
      //     this.getQuickId =  this.depart-tree.getDepartFirstId(this.type);
      // }

      // if(this.getQuickId){
      //     this.depart-tree.setQuickDepartId(this.getQuickId);
      // }
  }

  ngOnDestroy(){
      // this.getQuickId = null;
  }



}
