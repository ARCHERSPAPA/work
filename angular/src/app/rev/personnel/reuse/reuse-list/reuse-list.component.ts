import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Router, ActivatedRoute} from '@angular/router';
import {Messages} from "../../../../model/msg";

@Component({
  selector: 'rev-reuse-list',
  templateUrl: './reuse-list.component.html',
  styleUrls: ['./../../staff/staff.component.scss','./reuse-list.component.scss']
})
export class ReuseListComponent implements OnInit {

  public reUsers:Array<any>;
  constructor(private req:RequestService,
              private warn:WarningService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.loadOfferUsers();
  }

    loadOfferUsers() {
        this.req.doPost({
            url: "listReuseMember",
            data: {},
            success: (res => {
                // console.log(res);
                if (res && res.code == 200) {
                    this.reUsers = res.data;
                } else {
                    this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    editItem(item) {
        this.router.navigate(["./../add"], {
            queryParams: {item: JSON.stringify(item)},
            skipLocationChange: true,
            relativeTo: this.activatedRoute
        });
    }

    delItem(id){
        if(id){
            this.req.doPost({
                url:"deleteReuseMember",
                data:{id:id},
                success:(res =>{
                    if(res && res.code == 200){
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadOfferUsers();
                    }else{
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }

                })
            })
        }
    }

}
