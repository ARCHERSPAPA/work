import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../service/request.service";

;
import {WarningService} from "../../service/warning.service";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Default} from "../../model/constant";
import {Messages} from "../../model/msg";

@Component({
    selector: 'rev-item-quest',
    templateUrl: './item-quest.component.html',
    styleUrls: ['./item-quest.component.scss'],
})
export class ItemQuestComponent implements OnInit {

    public title: string;
    public switch:string;


    //查询
    public name: string;
    public items:Array<any>;
    public selectId:number = 0;

    public pageNo:number = Default.PAGE.PAGE_NO;
    public pageSize:number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    constructor(private req: RequestService,
                private warn: WarningService,
                public modal: NgbActiveModal) {
    }

    ngOnInit() {
        this.title = "从题目中选取";
        this.switch = "up";
        this.changeData();
    }

    searchData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.pageSize = Default.PAGE.PAGE_SIZE;
        this.changeData();
    }

    selectItem(item){
        
        this.selectId = item.id;
    }

    cancel(){
        this.modal.dismiss(null);
    }
    ok(){
        this.modal.close(this.selectId);
    }
    refreshStatus(e){
        this.items.forEach(item=>{
            if(item.id==e.id){
                this.selectId = item.id;
            }else{
                item["checked"] = false;
                return item;
            } 
        })
        if(this.items.every(i=>{
            return i["checked"]==false
        })){
          this.selectId=null;
        }
        
    }
    changeData(){
        this.req.doPost({
            url:"listQuest",
            data:{
                page: this.pageNo,
                pageSize: this.pageSize,
                title: this.name
            },
            success:(res =>{
                if(res && res.code == 200){
                
                    this.items = res.data.list;
                    this.total = res.data.total;
                    if(this.items && this.items.length>0){
                        this.items.filter(item=>{
                            item["checked"] = false;
                            return item;
                        })
                    }
                
                }else{
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

}
