import {Component, OnInit,Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MasterPackService} from "../../rev/master/master-pack-detail/master-pack.service";
import {CUSTOM_SEARCH_NAMES, Default} from "../../model/constant";
import {getCompanyNameById} from "../../model/methods";
import {WarningService} from "../../service/warning.service";

@Component({
    selector: 'rev-item-pack',
    template: `<rev-item-details-pack [type]="type" (ok)="handleDetailPackOk($event)"
                                   (cancel)="handleDetailPackCancel()"></rev-item-details-pack>`,
    // styleUrls: ['./../../rev/master/master-promotion-detail/master-promotion-detail.component.scss','./item-pack.component.scss']
})
export class ItemPackComponent implements OnInit {
    //区别套餐选择时的报价和成本展示问题（1：报价，2：成本）
    @Input() type:number = 1;

    // public pageNo: number = Default.PAGE.PAGE_NO;
    // public pageSize: number = Default.PAGE.PAGE_SIZE_5;
    // public total: number = Default.PAGE.PAGE_TOTAL;
    // public packs:any;
    // public loading: boolean = false;
    //
    //
    // //所有供应商数据
    // public companys:any;
    // //材料商id
    // public sid:number;
    // //套系数据id
    // public cbs:Array<number>;
    // //类别
    // public category:any;
    // //品牌
    // public brands:Array<any>;
    // //输入文本查询
    // public info:any;
    //
    // //添加时的交互
    // public selectItems:Array<any> = [];
    // public toggleType = 'down';
    // public toggle = false;



    constructor(public modal: NgbActiveModal,
                private masterPack:MasterPackService,
                private warn:WarningService) {
    }

    ngOnInit() {
        //初始化加载数据
        // this.changeData();
    }

    handleDetailPackOk(e:any){
        this.modal.close(e);
    }
    handleDetailPackCancel(){
        this.modal.dismiss();
    }



    // selectMaterialSupplier(mid: number) {
    //     this.sid = mid;
    //     this.resetData();
    // }
    //
    // selectCbs(cbs: any) {
    //     this.cbs = cbs;
    //     this.resetData();
    // }
    //
    // selectCategory(cate: any) {
    //     this.category = cate;
    //     this.resetData()
    // }
    //
    // selectBrand(bs: any) {
    //     this.brands = bs;
    //     this.resetData();
    // }
    //
    // selectSearch(info: any) {
    //     this.info = info;
    //     this.resetData();
    // }
    //
    //
    // cancelModal() {
    //     this.modal.dismiss(null);
    // }
    //
    // confirmModal(){
    //     if(this.selectItems && this.selectItems.length > 0){
    //         this.modal.close(this.selectItems);
    //     }
    // }
    //
    //
    // resetData(){
    //     this.pageNo = Default.PAGE.PAGE_NO;
    //     this.total = Default.PAGE.PAGE_TOTAL;
    //     this.changeData();
    // }
    //
    // /**
    //  * 拉取接口数据
    //  */
    // changeData(){
    //     const params = {
    //         pageNum: this.pageNo,
    //         pageSize: this.pageSize,
    //         status: 2
    //     };
    //
    //     //套系
    //     if(this.cbs && this.cbs.length > 0){
    //         params["comboIds"] = this.cbs;
    //     }
    //
    //     //供应商
    //     if(this.sid){
    //         params["supplierId"] = this.sid;
    //     }
    //
    //     //类别
    //     if(this.category && this.category["id"]){
    //         params["category"] = this.category["categoryName"];
    //     }
    //
    //
    //     //品牌
    //     if(this.brands && this.brands.length > 0){
    //         params["brand"] = this.brands;
    //     }
    //
    //     if(this.info && this.info["content"]){
    //         if(this.info["type"] === CUSTOM_SEARCH_NAMES.NAME.value){
    //             params["detailName"] = this.info["content"].trim();
    //         }else{
    //             params[this.info["type"]] = this.info["content"].trim();
    //         }
    //     }
    //
    //     if(this.info && this.info["detailName"]){
    //         params["detailName"] = this.info["detailName"].trim();
    //     }
    //
    //     this.loading = true;
    //     this.masterPack.getPackList(params).then(data =>{
    //         this.loading = false;
    //         // data.list[0].separable=1
    //         // this.packs = this.masterPack.renderPacks(data && data.list?data.list:[],0);
    //         this.packs = this.masterPack.renderColors(data && data.list?data.list:[]);
    //         // console.log(this.packs)
    //         this.total = data && data.total?data.total:Default.PAGE.PAGE_TOTAL;
    //     }).catch(err =>{
    //         this.loading = false;
    //         this.warn.onMsgError(err);
    //     })
    // }
    //
    // /**
    //  * 根据供应商id获取供应商简称
    //  * @param {number} cid
    //  * @returns {any}
    //  */
    // getCompanyName(cid:number){
    //     return getCompanyNameById(cid,this.companys);
    // }
    //
    // //回调拉取的所有供应商数据
    // getCompanies(cps:any){
    //     this.companys = cps;
    // }
    //
    //
    // /**
    //  * 计算当前添加项目的个数
    //  * @param {number} id
    //  * @returns {any}
    //  */
    // itemsSize(id:number){
    //     if (this.selectItems && this.selectItems.length > 0) {
    //         const size = this.selectItems.filter(m => m.id === id);
    //         if (size && size.length > 0) {
    //             return size.length;
    //         }
    //         return 0;
    //     }
    //     return 0;
    // }
    //
    // /**
    //  * 计算当前可拆分套餐添加细项的个数
    //  * @param {number} pId
    //  * @param {number} oId
    //  * @returns {any}
    //  */
    // singleSize(pId:number,oId:number){
    //     if (this.selectItems && this.selectItems.length > 0) {
    //         let size = [];
    //         this.selectItems.forEach(out=>{
    //             if(pId === out.id){
    //                 out.details.forEach(inner=>{
    //                     if(inner.id === oId){
    //                         size.push(out.details)
    //                     }
    //                 })
    //             }
    //         })
    //         if (size && size.length > 0) {
    //             return size.length;
    //         }
    //         return 0;
    //     }
    //     return 0;
    // }
    //
    // /**
    //  * 直接添加套餐
    //  * @param item
    //  */
    // addItem(item:any){
    //     this.selectItems.push(item);
    // }
    //
    // /**
    //  * 直接添加可拆分项的套餐
    //  * @param pack
    //  * @param data
    //  */
    // addSingleItem(pack,data){
    //     // console.log(this.selectItems,pack,data)
    //     let newPack = JSON.parse(JSON.stringify(pack));
    //     newPack.details = new Array(data);
    //     this.selectItems.push(newPack);
    // }
    //
    // /**
    //  * 根据当前id删除选中的套餐
    //  * @param e
    //  * @param {number} id
    //  */
    // removeItem(e:any,id:number){
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if(this.selectItems && this.selectItems.length > 0){
    //         let index = 0;
    //         index = this.selectItems.findIndex(item => item.id === id);
    //         this.selectItems.splice(index,1);
    //     }
    // }
    //
    //
    // /**
    //  * 可拆分套餐根据当前id和自己的id删除
    //  * @param e
    //  * @param {number} pid
    //  * @param {number} oId
    //  */
    // removeSingleItem(e:any,pid:number,oId:number){
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if(this.selectItems && this.selectItems.length > 0){
    //         let index = 0;
    //         index = this.selectItems.findIndex(item => {
    //             if(item.id === pid){
    //                 return item.details[0].id === oId
    //             }
    //         });
    //         this.selectItems.splice(index,1);
    //     }
    // }
    //
    // /**
    //  * 已选中的可拆分套餐根据当前id和自己的id删除
    //  * @param e
    //  * @param {number} pid
    //  * @param {number} oId
    //  */
    // removeSingleSelect(e:any,pid:number,oId:number){
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if(this.selectItems && this.selectItems.length > 0){
    //         let index = 0;
    //         this.selectItems.map((item,idx) => {
    //             if(item.id === pid){
    //                 if(item.details[0].id === oId){
    //                     index = idx;
    //                 }
    //             }
    //         });
    //         this.selectItems.splice(index,1);
    //     }
    // }
    //
    // /**
    //  * 切换选中是否展示全部
    //  * @param e
    //  */
    // toggleClick(e: any) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     this.toggle = !this.toggle;
    //     this.toggleType = this.toggle ? 'up' : 'down';
    // }

}
