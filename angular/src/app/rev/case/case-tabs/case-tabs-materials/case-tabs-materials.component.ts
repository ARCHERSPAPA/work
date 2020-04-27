import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../../service/request.service";
import { ActivatedRoute } from '@angular/router';
import { WarningService } from "../../../../service/warning.service";
import { atob } from "../../../../model/methods";
import { Messages } from "../../../../model/msg";
import { SettleService } from "../../../../service/settle.service";
@Component({
  selector: 'rev-case-tabs-materials',
  templateUrl: './case-tabs-materials.component.html',
  styleUrls: ['./case-tabs-materials.component.scss']
})
export class CaseTabsMaterialsComponent implements OnInit {
  public materialsList = [];
  public quoteNo: string;
  public pveList = [];
  public index: number = 0;
  public currentIndex: number = 0;
  public newcase
  public cid;
  public editTitle: string;
  constructor(
    private req: RequestService,
    private warn: WarningService,
    private route: ActivatedRoute,
    private settle: SettleService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && !params["newcase"]) {
        this.quoteNo = atob(params["quoteNo"]);
        this.cid = atob(params["aid"]);
      }
      else {
        this.newcase = params["newcase"];
      } setTimeout(() => {
        this.changeData();
      }, 400);
    })
  }

  ngDoCheck() {
    if (this.settle.getCaseData() && this.newcase && this.settle.getCaseData().id) {
      this.cid = this.settle.getCaseData().id;
      this.quoteNo = this.settle.getCaseData().quoteId;
    }
  }
  //添加
  addRow() {
    this.editTitle = "确认取消添加"
    if (this.cid) {
      this.index++;
      this.materialsList.unshift({ name: '', brand: '', edit: true, key: this.index });
    } else {
      this.warn.onError('请先保存完工照,基础信息或者其他图片');
    }

  }
  //删除
  delList(i, id) {
    let url;
    if (!this.newcase) {
      url = 'smallDeleteBrand'
    } else {
      url = 'newSmallDeleteBrand'
    }
    this.req.doPost({
      url: url,
      data: {
        id: id,
      },
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          // this.settle.newLoadCaseHead(res.data,0).then(res => {
          //   this.settle.setCaseData(res);
          // });
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
    this.materialsList.splice(i, 1);
    // this.materialsList.find(item => item.key === key).name = this.pveList[0]['name'];
  }
  //编辑
  startEdit(key) {
    this.editTitle = "确认取消编辑"
    this.materialsList.find(item => item.key === key).edit = true;
    //暂存
    this.pveList.splice(0, 1, {
      name: this.materialsList.find(item => item.key === key).name,
      brand: this.materialsList.find(item => item.key === key).brand,
      key: this.materialsList.find(item => item.key === key).key
    });
  }
  //取消
  cancelEdit(i, key, brand, name, id) {
    this.currentIndex++;
    this.materialsList[i].edit = false;
    //是否真实数据
    if (id) {
      this.materialsList[i].name = '';
      this.materialsList[i].brand = '';
      this.materialsList.find(item => item.key === key && item.key === this.pveList[0]['key']).name = this.pveList[0]['name'];
      this.materialsList.find(item => item.key === key && item.key === this.pveList[0]['key']).brand = this.pveList[0]['brand'];
    } else {
      this.materialsList.splice(i, 1);
    }
  }
  
  //保存
  finishEdit(name, brand, key, id) {
    // .log(name,brand)
    if (!name) {
      this.warn.onWarn('材料不能为空');
      return
    }
    if (!brand) {
      this.warn.onWarn('品牌不能为空');
      return
    }
    let url;
    let params = {};
    // this.materialsList.find(item => item.key === key).name = name;
    this.materialsList.find(item => item.key === key).edit = false;
    if (!this.newcase) {
      if (!id) {
        url = 'smallAddBrand';
        params['quoteId'] = this.cid;
      } else {
        url = 'smallEditBrand';
        params['id'] = id;
      }
    } else {
      if (!id) {
        url = 'newSmallAddBrand';
        params['quoteId'] = this.quoteNo;
      } else {
        url = 'newSmallEditBrand';
        params['id'] = id;
      }
    }
    params['name'] = this.materialsList.find(item => item.key === key).name;
    params['brand'] = this.materialsList.find(item => item.key === key).brand;
    this.req.doPost({
      url: url,
      data: params,
      success: res => {
        if (res && res.code == 200) {
          this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
          this.materialsList.find(item => item.key === key).id = res.data;
        } else {
          this.warn.onError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }

  changeData() {
    let url;
    if (this.newcase) {
      url = "newSmallProgramMaterls"
    } else {
      url = "smallProgramMaterls"
    }
    this.req.doPost({
      url: url,
      data: {
        quoteId: this.newcase ? this.quoteNo : this.cid,
      },
      success: res => {
        if (res && res.code == 200) {
          this.materialsList = res.data;
          this.index = this.materialsList.length;
          this.currentIndex = this.materialsList.length;
          this.materialsList.filter((v, i) => {
            v['key'] = i;
          })
        } else {
          // this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        }
      }
    })
  }
} 
