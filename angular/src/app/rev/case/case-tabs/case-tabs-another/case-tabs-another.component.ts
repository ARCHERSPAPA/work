import { Component, OnInit } from '@angular/core';
import { UploaderMultisComponent } from '../../../../plugins/uploader-multis/uploader-multis.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Lightbox } from 'ngx-lightbox';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { RequestService } from '../../../../service/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SettleService } from '../../../../service/settle.service';
import { setStyleBg } from 'src/app/model/methods';
@Component({
  selector: 'rev-case-tabs-another',
  templateUrl: './case-tabs-another.component.html',
  styleUrls: ['./case-tabs-another.component.scss']
})
export class CaseTabsAnotherComponent implements OnInit {
  public split = 'another';
  //图片地址
  public imgList = [];
  public effectPicture: string;
  public realisticPicture: string;
  public _albums = [];
  public imgIndex;
  //判断是不是已经发布
  // public isDown: number;
  public anotherForm: FormGroup;
  public quoteNo: any; //项目编号
  public cid: string; //项目主键
  public newcase = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private req: RequestService,
    private warn: WarningService,
    private settle: SettleService,
    private fb: FormBuilder,
    // private _lightbox: Lightbox,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && !params['newcase']) {
        this.quoteNo = atob(params['quoteNo']);
        this.cid = atob(params['aid']);
        //top案例中的初始化
        this.loadCaseInfo();
      } else {
        this.newcase = params['newcase'];
        //其他案例中的详情初始化
        if (params && params['quoteNo']) {
          this.quoteNo = atob(params['quoteNo']);
        }
        setTimeout(() => {
          if (this.quoteNo) {
            this.settle.newLoadCaseHead(this.quoteNo, 0).then(res => {
              this.effectPicture = res['vrResultImg'];
              this.realisticPicture = res['vrLiveImg'];
              if (res['newStyleImg']) {
                this.imgList = res['newStyleImg'];
              } else {
                this.imgList = [];
              }
            });
          }
        }, 400);
      }
    });
    this.anotherForm = this.fb.group({
      effectPicture: [this.effectPicture, [
        Validators.required,
      ]],
      realisticPicture: [this.realisticPicture, [
        Validators.required,
      ]],
    });
  }
  //获取Setter的状态
  ngDoCheck() {
    //top案例和其他案例不一样
    if (this.settle.getCaseData() && this.newcase) {
      this.quoteNo = this.settle.getCaseData().quoteId;
    } else {
      if (this.settle.getCaseData() && this.settle.getCaseData().quoteNo) {
        this.quoteNo = this.settle.getCaseData().quoteNo;
      }
    }
  }

  addImg() {
    if (this.imgList.length && this.imgList.length > 4) {
      this.warn.onWarn(Messages.ERROR.CASE_IMG_MAX);
    } else {
      const modalRef = this.modalService.open(UploaderMultisComponent, {
        centered: true,
        keyboard: false
      });
      modalRef.componentInstance.name = '新增图片';
      modalRef.componentInstance.open = true;
      modalRef.componentInstance.total = 6;
      modalRef.componentInstance.size = 2;
      modalRef.componentInstance.cid = this.cid;
      modalRef.componentInstance.split = this.split;
      // modalRef.componentInstance.cid = this.id ? this.id : Math.ceil(Math.random() * 100);
      modalRef.result.then((result) => {

        result.forEach(item => {
          if (this.imgList.length && this.imgList.length > 4) {
            this.warn.onWarn(Messages.ERROR.CASE_IMG_MAX);
          } else {
            this.imgList.push(item);
          }
        });
      });
    }
  }

  //打开图片放大
  openModal( index) {
    this.imgIndex = index;
    this._albums = [];
    this.imgList.forEach((i) => {
      this._albums.push({ src: i });
    });
}
  // openModal(index) {
  //   let _albums = []
  //   this.imgList.forEach((i) => {
  //     _albums.push({ src: i });
  //   })
  //   this._lightbox.open(_albums, index);
  // }
  delAnotherDetail(index: number) {
    this.imgList.splice(index, 1);
  }

  //加载数据
  loadCaseInfo() {
    this.req.doPost({
      url: 'smallProgramDetails',
      data: { quoteNo: this.quoteNo },
      success: (res => {
        if (res && res.code == 200) {
          this.effectPicture = res.data.vrResultImg;
          this.realisticPicture = res.data.vrLiveImg;
          this.imgList = res.data.newStyleImg ? res.data.newStyleImg : [];
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      })
    });
  }

  //判断是新建时的保存还是详情的保存
  checkImg() {
    const img = [];
    if (this.imgList && this.imgList.length > 0) {
      this.imgList.forEach(item => {
        img.push(item);
      });
    }
    if (this.newcase) {
      this.newCaseSave(img);
    } else {
      this.submit(img);
    }
  }
//新建案例的保存
  newCaseSave(img) {
    this.req.doPost({
      url: 'newSmallProgramSave',
      data: {
        quoteId: this.quoteNo,
        isSave: 2,
        styleImg: img,
        vrResultImg: this.effectPicture ? this.effectPicture : '',
        vrLiveImg: this.realisticPicture ? this.realisticPicture : ''
      },
      success: res => {
        if (res && res.code == 200) {
          if (!this.quoteNo) {
            this.router.navigate(['/rev/case/detail/another'], { queryParams: { newcase: true, quoteNo: btoa(res.data) } });
          }
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          this.settle.newLoadCaseHead(res.data, 0).then(res => {
            this.settle.setCaseData(res);
          });
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    });
  }

  //提交
  submit(img) {
    //已发布不能编辑操作
    // if(this.isDown!=0){
    //   this.warn.onWarn(Messages.ERROR.EDIT_ERROR);
    //   return;
    // }
    this.req.doPost({
      url: 'smallProgramSave',
      data: {
        quoteNo: this.quoteNo,
        isSave: 2,
        styleImg: img,
        vrResultImg: this.effectPicture ? this.effectPicture : '',
        vrLiveImg: this.realisticPicture ? this.realisticPicture : ''
      },
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    });
  }

  styleImg(img) {
    return setStyleBg(img, 160, 160);
  }

}
