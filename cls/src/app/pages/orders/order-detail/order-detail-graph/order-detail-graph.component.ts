import { Component, OnInit } from '@angular/core';
import { OrderDetialService } from '../../order-detail/order-detial.service';
import { ActivatedRoute } from '@angular/router';
import { WarningService } from "../../../../services/warning.service";

@Component({
  selector: 'app-order-detail-graph',
  templateUrl: './order-detail-graph.component.html',
  styleUrls: ['./order-detail-graph.component.less']
})
export class OrderDetailGraphComponent implements OnInit {
  public editStr: string = "添加备注";
  public imgList: any = [{ url: "https://tqiniu.madrock.com.cn/cls/material/p5pjlw8ibknl1ix0ho", status: "done" }];
  public imgLists: any = [];

  public orderId: any;
  public state: any;
  public lock: boolean = false;
  public showOmg: any = {
    num: 9,
    showRemove: true
  };
  public lockingBudget: any;

  constructor(private headDetailServe: OrderDetialService,
    private activatedRoute: ActivatedRoute,
    private warn: WarningService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['orderId']) {
        this.orderId = params['orderId']
      }
    });

    this.headDetailServe.getMaterialImgDetails(this.orderId).then(res => {
      this.renderData(res);
    });

    this.headDetailServe.loadOrderHead(this.orderId).then(res => {
      this.state = res.state;
      this.lockingBudget = res.lockingBudget;
      this.showOmg.num = !this.showEditableByState() ? (this.imgList && this.imgList.length) : 9;
      this.showOmg.showRemove = this.showEditableByState();
    });
  }

  //判断是否可以编辑
  showEditableByState() {
    return this.lockingBudget ? false : [3, 4, 41, 42].includes(this.state);
  }

  renderData(data: any) {
    this.editStr = data && data.imgRemark || '';
    this.imgList = data && data.imgs && this.computedImages(data.imgs) || [];
    this.imgLists = data && data.imgs && this.computedImages(data.imgs) || [];
  }
  //合并数量
  computedImages(images: any) {
    let imgs: any = [];
    if (images && images.length > 0) {
      images.forEach((img: any) => {
        imgs.push({
          status: "done",
          url: img.imgUrl
        })
      })
    }
    return imgs;
  }

  changeRemarkAndImgs(isRemark: boolean = false) {
    let imgs: any = []
    this.imgLists.forEach((v: any) => {
      imgs.push(v.url)
    });
    if (this.editStr.length > 120) {
      this.warn.onWarn('字数超过120请重新填写')
      this.headDetailServe.getMaterialImgDetails(this.orderId).then(res => {
        this.renderData(res);
      });
    } else {
      this.headDetailServe.upMaterialImgByCustomization({
        materialOrderId: this.orderId,
        imgRemark: this.editStr,
        imgs: imgs
      })
        .then(msg => {
          if (!isRemark && this.imgList && this.imgList.length > 0) {
            this.warn.onSuccess(msg)
            let imgs: any = [];
            this.imgList.map((img: any) => {
              imgs.push({ imgUrl: img });
            });
            this.headDetailServe.getMaterialImgDetails(this.orderId)
              .then(data => {
                this.renderData(data);
              })
          }

        })
        .catch(err => {
          this.warn.onError(err);
          this.headDetailServe.getMaterialImgDetails(this.orderId)
            .then(data => {
              this.renderData(data);
            })
        })
    }

  }

  handleImage(e: any) {
    const images = e;
    this.headDetailServe.upMaterialImgByCustomization({
      materialOrderId: this.orderId,
      imgRemark: this.editStr,
      imgs: images
    })
      .then(msg => {
        this.warn.onSuccess(msg)
        if (images && images.length > 0) {
          let imgs: any = [];
          images.map((img: any) => {
            imgs.push({ imgUrl: img });
          });
          const data = {
            imgRemark: this.editStr,
            imgs: imgs
          }
          this.renderData(data);
        }

      })
      .catch(err => {
        this.warn.onError(err);
        this.headDetailServe.getMaterialImgDetails(this.orderId)
          .then(data => {
            this.renderData(data);
          })
      })


  }
}
