import { Component, OnInit } from '@angular/core';
import qrCode from 'qrcode'
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../service/request.service';
import { WarningService } from '../../service/warning.service';
import { Messages } from '../../model/msg';
import { atob } from '../../model/methods';
@Component({
  selector: 'rev-view-materials',
  templateUrl: './view-materials.component.html',
  styleUrls: ['./view-materials.component.scss']
})
export class ViewMaterialsComponent implements OnInit {
  public Ids;
  public marterialList = [];
  constructor(private router: Router,
    private req: RequestService,
    private warn: WarningService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    // qrCode.toCanvas(document.getElementById('canvas'), 'sample text', function (error) {
    //   if (error) console.error(error)
    //   console.log('success!');
    // })

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['id']) {
        this.Ids = atob(params['id']);
        // console.log(this.Ids.split(','))
        this.Ids = this.Ids.split(',')
        this.getList();
      }
    });


  }
  getList() {
    this.req.doPost({
      url: 'printMaterial',
      data: {
        detail: this.Ids
      },
      success: res => {
        if (res && res.code == 200) {
          this.marterialList = res.data;

          this.marterialList.forEach((v, i) => {
            setTimeout(() => {
              this.renderQr(i)
            }, 400);

          });

        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
  print() {
    window.print();
  }
  renderQr(i) {
    qrCode.toCanvas(document.getElementById(`canvas${i}`), this.marterialList[i]['sku']?this.marterialList[i].sku:'暂无数据',{
      width:230,
      height:230,
      margin:0,
      errorCorrectionLevel:'H'
    },function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }
}
