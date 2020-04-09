import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../../service/request.service';
import {WarningService} from '../../../service/warning.service';
import {atob, setStyleBg} from '../../../model/methods';
import {ActivatedRoute} from '@angular/router';
import {Default} from '../../../model/constant';
import {Lightbox} from 'ngx-lightbox';
import {Messages} from '../../../model/msg';

@Component({
  selector: 'rev-item-quantity',
  templateUrl: './item-quantity.component.html',
  styleUrls: ['./item-quantity.component.scss']
})
export class ItemQuantityComponent implements OnInit {

  public cid:string;

  public quantities:Array<any>;
  public state:number = Default.STATE.ITEM_1;
  public alblums:Array<any> = [];

  //分页处理
  public pageNo:number = Default.PAGE.PAGE_NO;
  public pageSize:number = Default.PAGE.PAGE_SIZE;
  public total:number = Default.PAGE.PAGE_TOTAL;

  constructor(private req:RequestService,
              private warn:WarningService,
              private activatedRoute:ActivatedRoute,
              private lightbox: Lightbox) { }

  ngOnInit() {

    try {
      this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));
    } catch (e) {
      this.state = Default.STATE.ITEM_1;
    }

    this.activatedRoute.queryParams.subscribe( params =>{
      if(params && params["cid"]){
        this.cid = atob(params["cid"]);
      }
    });
    this.changeData();
  }

  changeData(...args){
    // this.quantities = this.quantities.concat(this.quantities);
    // this.total = this.quantities.length;
    if(args && args.length > 0){
      this.pageNo = Default.PAGE.PAGE_NO;
    }
    let params = {
      pageNo: this.pageNo,
      quoteId: this.cid
    };

    if(this.cid){
      this.req.doPost({
        url:"listQuantity",
        data: params,
        success:(res =>{
          if(res && res.code ==200){
            if(res.data){
              this.total = res.data.pageCount;
              this.quantities = res.data.pageSet;
            }
          }else{
              this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
          }
        })
      })
    }

  }

  /**
   * 图片放大
   * @param imgs
   * @param index
   */
   openLargeImg(imgs,index){
    this.alblums = [];
    if(imgs && imgs.length > 0){
      imgs.forEach(img =>{
        this.alblums.push({src:img.imgUrl});
      });
      this.lightbox.open(this.alblums,index);
    }

   }

  /**
   * 判断是否显示删除按钮问题
   */
  showDelBtn(){
    return this.state === Default.STATE.ITEM_4;
  }

  /**
   * 删除方量
   * @param id
   */
  delItem(id:any){
    if(id){
      this.req.doPost({
        url:"deleteQuantity",
        data:{id:id},
        success:(res =>{
            if(res && res.code ==200){
              this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
              this.changeData(true);
            }else{
              this.warn.onMsgError(res.msg || Messages.FAIL.DATA)
            }
        })
      })
    }
  }

  /**
   * 渲染图片信息
   * @param img
   */
  styleImg(img) {
    if(img)
    return setStyleBg(img, 160, 160);
  }
}
