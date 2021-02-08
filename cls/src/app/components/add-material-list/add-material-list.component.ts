import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderDetialService } from '../../pages/orders/order-detail/order-detial.service';
import {
  renderName,
  equalZero
} from "../../configs/methods";
import { EPage } from "../../enums/e-page.enum";
import { IRadio } from "../../components/switch-tab/switch-tab.component";

interface IOrderParams {
  pageNum: number;
  pageSize: number;
  type: number;
  serchInfo: string;
  category: string;
  quoteId: number;
}

class COrderParams implements IOrderParams {
  pageNum: number = EPage.page_no;
  pageSize: number = EPage.page_size_20;
  type: number = 1;
  serchInfo: string = '';
  category: string = '';
  quoteId: number = 0;
}

@Component({
  selector: 'app-add-material-list',
  templateUrl: './add-material-list.component.html',
  styleUrls: ['./add-material-list.component.less']
})

export class AddMaterialListComponent implements OnInit {
  public materials: Array<any> = [];
  public total: number = EPage.page_total;
  public loading: boolean = false;

  @Input() reset: boolean = false;
  @Input() quoteId: number = 0;

  public checked: boolean = false;
  public indeterminate: boolean = false;
  @Output() handleList: EventEmitter<any> = new EventEmitter<any>();
  public setOfCheckedId = new Set<number>();
  public setOfCheckedIds: any = [];
  @Input() type: number = 1;
  public forms: Array<any> = [
    {
      type: "select",
      cols: 2,
      mode: "default",
      placehoder: '请选择材料类型',
      data: [{ content: '主材', id: 1 }, { content: '辅材', id: 2 }],
      value: null,
      clear: false,
      name: '类型'
    },
    {
      type: "select",
      cols: 2,
      mode: "default",
      placehoder: '请选择材料类型',
      data: [{ content: '主材', id: 123 }, { content: '辅材', id: 12323 }],
      value: null,
      clear: false,
      name: '类别'
    },
    {
      type: "textGroup",
      name: "search",
      cols: 8,
      placeholder: "请输入 名称/规格/型号/品牌/材质/颜色/产地",
    },
    {
      type: "button",
      name: "clear",
      text: "重置",
      theme: "default",

    }
  ];

  // public switches: Array<IRadio> = [
  //   {
  //     key: "0",
  //     label: "主材",
  //     selected: true
  //   },
  //   {
  //     key: "1",
  //     label: "辅材",
  //     selected: false
  //   },
  // ];
  public orderParams: IOrderParams = new COrderParams();

  constructor(private headDetailServe: OrderDetialService,) {
  }



  ngDoCheck() {
    if (!this.reset) {
      this.setOfCheckedIds = [];
      this.checked = false;
      this.indeterminate = false;
      this.changePage();
      this.reset = true;
    }
  }

  ngOnInit(): void {
    this.renderCategory();
    this.orderParams.quoteId = this.quoteId;
    this.forms[0].value = this.forms[0].data[0];
    this.changePage();
  }

  resetData() {
    this.orderParams.pageNum = EPage.page_no;
    this.changePage();
  }

  changePageIndex(num: number) {
    this.orderParams.pageNum = num;
    this.changePage();
  }

  changePage() {
    this.headDetailServe.getSelectionList(this.orderParams).then(res => {
      try {
        res.list.forEach((v: any) => {
          v['checked'] = false;
        });
        this.total = res && res.total;
        res.list.forEach((v: any) => {
          this.setOfCheckedIds.forEach((item: any) => {
            if (v.id == item.id) {
              v.checked = true;
            }
          });
        });
        this.checked = false;
        this.indeterminate = false;
        this.materials = res.list;
      } catch (e) {
        console.log("error is", e);
      }
    })
  }


  renderCategory() {
    this.headDetailServe.getCategoryList({ type: this.orderParams.type, orderType: 2 }).then(res => {
      if (res) {
        res.forEach((v: any) => {
          v['content'] = v['name']
        });

        res.unshift({ 'content': '全部类别', id: '' })
        this.forms[1].data = res;
        this.forms[1].value = this.forms[1].data[0]
      }
    })
  }


  renderName(data: any, mark: string = "--") {
    return renderName(data, mark);
  }

  equalZero(num: any) {
    return equalZero(num, "无");
  }

  // handleSwitch(sch: any) {
  //   console.log(sch)
  //   // this.orderParams
  // }

  submit() {
    this.setOfCheckedIds.concat(this.materials)
  }

  handleSelect(e: any) {
    if (e && e.name == this.forms[0].name) {
      this.orderParams.type = e.value.id
      this.renderCategory();
    } else {
      this.orderParams.category = e.value.content
    }

    this.resetData();
  }

  handleForm(e: any) {
    if (e.name == "clear") {
      this.forms[0].value = this.forms[0].data[0];
      this.forms[1].value = this.forms[1].data[0];
      this.forms[2].value = null
      this.orderParams = new COrderParams();
    }
    this.orderParams.serchInfo = e.value.get("search")
    this.resetData();
  }

  exist(id: any): boolean {
    if (this.setOfCheckedIds && this.setOfCheckedIds.length > 0) {
      const m = this.setOfCheckedIds.filter((m: any) => m.id === id);
      return m && m.length > 0;
    }
    return false;
  }

  itemsSize(id: any) {
    if (this.setOfCheckedIds) {
      const size = this.setOfCheckedIds.filter((m: any) => m.id === id);
      if (size && size.length > 0) {
        return size.length;
      }
      return 0;
    }
    return 0;
  }

  checkAll(value: boolean) {

    this.materials.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  removeItem(id: any, i: number) {
    console.log(i)
    if (this.setOfCheckedIds && this.setOfCheckedIds.length > 0) {
      let index = 0;
      this.setOfCheckedIds.map((s: any, i: any) => {
        if (s.id === id) {
          index = i;
        }
      });
      this.deleteItem(index);
      if (this.setOfCheckedIds.filter((v: any) => v.id == id).length == 0) {
        this.materials[i]['checked'] = false;
      }
      this.rendSatus()
    } else {
      this.checked = false;
    }
  }

  rendSatus() {
    const allChecked = this.materials.every(material => material.checked === true);
    const allUnChecked = this.materials.every(material => !material.checked);
    this.checked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  arrSubtraction2(a: Array<any>, b: Array<any>) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.filter(i => !b.includes(i))
    }
    return [];
  }

  deleteItem(index: any) {
    this.setOfCheckedIds.splice(index, 1);
  }

  /**
   *  @param type 区别是单选还是全选执行这个函数
   * @param index 当前点击的这个数据的index
   */

  refreshStatus(type: boolean = false, index: number = 0,) {
    const allChecked = this.materials.every(material => material.checked === true);
    const allUnChecked = this.materials.every(material => !material.checked);
    this.checked = allChecked;
    if (allChecked && !type) {
      this.setOfCheckedIds = this.setOfCheckedIds.concat(this.materials)
    } else if (!type) {
      this.setOfCheckedIds = this.arrSubtraction2(this.setOfCheckedIds, this.materials)
    }
    if (type) {
      if (this.materials[index]['checked']) {
        this.setOfCheckedIds.push(this.materials[index])
      } else {
        let arr = this.setOfCheckedIds.filter((v: any, i: number) => {
          return v['id'] == this.materials[index].id
        })
        this.setOfCheckedIds = this.arrSubtraction2(this.setOfCheckedIds, arr)
        arr.pop();
        this.setOfCheckedIds = this.setOfCheckedIds.concat(arr);
      }

    }
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.handleList.emit(this.setOfCheckedIds)
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
      this.setOfCheckedIds.push(id)
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(data: any, i: number): void {
    this.materials[i]['checked'] = true;
    this.rendSatus();
    this.setOfCheckedIds = JSON.parse(JSON.stringify(this.setOfCheckedIds.concat(data)));
    this.handleList.emit(this.setOfCheckedIds)
  }

  // addMaterial(id: number) {
  //   this.getLIst()
  // }
  // getLIst() {
  //
  // }
  // selectAll() {
  //
  // }
}
