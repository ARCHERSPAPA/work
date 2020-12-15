import {Component, OnInit} from '@angular/core';
import {
    equalZero,
    getComboNames,
    getIdsBySelectedByField,
    getRows,
    showTitleBySurvival
} from "../../../../model/methods";
import {WarningService} from "../../../../service/warning.service";
import {RequestService} from "../../../../service/request.service";
import {Default} from "../../../../model/constant";
import {ActivatedRoute, Router} from '@angular/router';
import {MasterService} from "../../master.service";
import {MasterComboService} from "../../master-combo-detail/master-combo.service";
import {MasterPackService} from "../master-pack.service";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Messages} from "../../../../model/msg";

@Component({
    selector: 'rev-master-pack-masterials',
    templateUrl: './master-pack-masterials.component.html',
    styleUrls: ['./../../master-promotion-detail/master-promotion-detail.component.scss',
        './../../master-promotion-detail/master-promotion-materials/master-promotion-materials.component.scss',
        './master-pack-masterials.component.scss'],
    providers: [MasterService, MasterComboService, MasterPackService]
})
export class MasterPackMasterialsComponent implements OnInit {
    public edit: boolean = false;
    //显示详情
    public title: string;
    //显示当前详情标题
    public name: string;
    //当前的关联材料商信息
    public supplierId: number;
    //备注
    public remark: string;
    //套系
    public comboName: any;
    public comboIds: any;

    //销售价
    public sellingPrice: number;
    //供货价
    public newSupplyPrice: number;
    //活动价
    public supplyPrice: number;
    public startTime: Date;
    public endTime: Date;
    //是否拆分
    public separable: string;
    //单位
    public unit: string;
    //套餐id
    public pid: number;

    //tab切换时
    public radioSwitch: Array<any>;
    //切换时的数据记录(默认为已添加显示，默认为1)
    public radio: number = 1;
    //查看图片
    public _albums: Array<any> = [];

    //材料详情数据
    public materials: any;
    //全选
    public allChecked: boolean = false;
    //全选时的中间状态
    public indeterminate: boolean = false;
    //选中时的所有选项集合
    public selectItems: Array<any> = [];
    //展示已添加的数据量
    public masterTotal: number = 0;
    //加载数据时
    public loading: boolean = false;

    //上下架(默认为上架)
    public shelf: number = 1;

    //审核类别
    public status: number = 0;
    //记录所有供应商信息
    public companys: any;
    //记录所有的套系数据
    public combos: any;

    //弹出框显示
    public isVisible: boolean = false;
    public form: any;

    //分页查询
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    //类别
    public category: any;
    //品牌
    public brands: any;
    //其实
    public info: any;

    // 弹出数量弹窗
    public amountVisible: boolean = false;
    public amountForm: FormGroup;

    // 弹出活动价弹窗
    public priceVisible: boolean = false;
    public priceForm: FormGroup;

    public addData:any;

    public lastPage:boolean;


    constructor(private warn: WarningService,
                private req: RequestService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private master: MasterService,
                private masterCombo: MasterComboService,
                private masterPack: MasterPackService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.title = "套餐详情";

        this.radioSwitch = [{
            key: 1,
            text: "已添加"
        }, {
            key: 0,
            text: "未添加"
        }];

        //拉取供应商所有数据
        this.getCompanys();

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.pack) {
                const pack = JSON.parse(params.pack);
                this.edit = JSON.parse(params.edit);

                this.pid = pack.id;
                this.name = pack.name;
                this.remark = pack.remark;
                let comboIds = [];
                if (pack && pack.newComboNameId && pack.newComboNameId.length > 0) {
                    pack.newComboNameId.split(',').forEach(combo => {
                        comboIds.push({id: combo})
                    })
                }
                this.comboIds = comboIds;
                this.comboName = pack.comboName;

                this.newSupplyPrice = pack.newSupplyPrice;
                this.sellingPrice = pack.sellingPrice;
                this.supplyPrice = pack.supplyPrice;

                if (pack.startTime) {
                    this.startTime = new Date(pack.startTime);
                }
                if (pack.endTime) {
                    this.endTime = new Date(pack.endTime);
                }
                this.separable = String(pack.separable)
                this.supplierId = pack.supplierId;
                this.unit = pack.unit;
                this.shelf = pack.putaway;
                this.status = Number(pack.status);

            }
        });

        //拉取套系所有数据
        this.getCombos();

        //拉取材料详情数据
        this.changeData();

        this.amountForm = this.fb.group({
            amount: ['', [
                Validators.required
            ]]
        })

        this.priceForm = this.fb.group({
            price: ['', [
                Validators.required
            ]]
        })

    }

    /**
     * 根据当前状态显示编辑
     * @returns {boolean}
     */
    showBtnByStatus() {
        switch (this.status) {
            case 0:
                return true;
            case 1:
                if (this.edit) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if (this.edit) {
                    return true;
                } else {
                    return false;
                }
            case 3:
                return true;
            default:
                return false;
        }
    }

    /**
     * 根据当前选中的套系显示其套系所有名称
     * @returns {any}
     */
    getComboNames(comboIds) {
        return getComboNames(comboIds);
    }

    /**
     * 根据当前的供应商id显示其供应商名称
     */
    getCompanyName() {
        if (this.companys && this.companys.length > 0 && this.supplierId) {
            let find = this.companys.filter(c => c.id === this.supplierId);
            if (find && find.length > 0) {
                return find[0]["companyName"] ? find[0]["companyName"] : null;
            }
        }
        return null;
    }

    /**
     * 根据是否上下架显示其对立标示
     * @param {number} shelf： 0 未上架或者下架，1：上架
     * @returns {string}
     */
    getTitleByShelf(shelf: number) {
        return shelf ? '确定下架该套餐吗?' : '确定上架该套餐吗?'
    }

    /**
     * 拉取所有供应商的数据
     */
    getCompanys() {
        this.master.getCompanys().then(data => {
            this.companys = data;
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    /**
     * 拉取所有的套系数据
     */
    getCombos() {
        this.masterCombo.getCombos().then(data => {
            this.combos = data;
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    //tab 切换显示其添加数量
    handleSwitch(tab: number) {
        this.radio = tab;
        this.info = null;
        this.category = null;
        this.brands = null;
        this.resetData();
    }


    handleCategory(cate: any) {
        this.category = cate;
        this.resetData();
    }


    handleBrand(brands: any) {
        this.brands = brands;
        this.resetData();
    }

    handleSearch(search: any) {
        this.info = search;
        this.changeData();
    }


    resetData(isFirst = true) {
        if(isFirst){
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        this.selectItems = [];
        this.allChecked = false;
        this.indeterminate = false;
        this.changeData();
    }

    //加载数据
    changeData() {
        const params = {
            pageNum: this.pageNo,
            pageSize: this.pageSize,
            type: this.radio,
            supplierId: this.supplierId,
            planId: this.pid
        };

        if (this.category && this.category.id) {
            params["category"] = this.category.categoryName;
        }
        if (this.brands && this.brands.length > 0) {
            params["brand"] = this.brands;
        }

        if (this.info) {
            if (this.info.spu) {
                params["spu"] = this.info.spu.trim();
            }
            if (this.info.sku) {
                params["sku"] = this.info.sku.trim();
            }
            if (this.info.model) {
                params["model"] = this.info.model.trim();
            }
            if (this.info.spec) {
                params["spec"] = this.info.spec.trim();
            }
            if (this.info.name) {
                params["name"] = this.info.name.trim();
            }
        }

        this.loading = true;
        this.masterPack.getMaterialList(params).then(data => {
            this.loading = false;
            this.materials = this.renderData(data && data.list ? data.list : null);

            this.total = data && data.total ? data.total : Default.PAGE.PAGE_TOTAL;
            if (this.radio === 1) {
                this.masterTotal = this.total;
            }
            this.lastPage = data.isLastPage;
            this.refreshStatus();
        }).catch(err => {
            this.loading = false;
            this.warn.onMsgError(err);
        })
    }


    /**
     * 合并单元格
     * @param data
     * @returns {any}
     */
    renderData(data) {
        if (data && data.length > 0) {
            const d = data.reverse();
            d.forEach((v, i, arr) => {
                getRows(arr, i);
            })
            return d.reverse();
        }
        return data;
    }


    /**
     * 添加材料
     * @param {number} pid 套餐id
     * @param ids 材料ids
     */
    packDetailAddMaterials(pid: number,str, ...ids) {
        if (pid) {
            this.masterPack.addMaterials(pid, ids).then(msg => {
                this.warn.onMsgSuccess(msg[1]);
                this.masterTotal = this.masterTotal + ids.length;
                this.sellingPrice = msg[0].sellingPrice;
                this.supplyPrice = msg[0].supplyPrice;
                this.newSupplyPrice = msg[0].newSupplyPrice;
                this.pid = msg[0].id;
                this.addData = null;
                if(str === 'price'){
                    this.resetData(false);
                }
                this.isLastPage(str);
                
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        } else {
            this.addData = null;
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    // 最后一页操作后是否返回第一页
    isLastPage(str){
        if(str === 'single'){
            if(this.lastPage){
                if(this.materials.length - 1 == 0){
                    this.resetData();
                }
            }
            this.resetData(false);
        }
        if(str === 'multiple'){
            if(this.lastPage){
                if(this.materials.length - this.selectItems.length == 0){
                    this.resetData();
                }
            }
            this.resetData(false);
        }
    }

    //单个添加材料
    addItem(data: any) {
        let ids = [{id: data.id, materialActivityPrice: data.materialActivityPrice, number: data.number}]
        if(this.status === 1){
            this.priceVisible = true;
            this.addData = data;
        }else{
            this.packDetailAddMaterials(this.pid, 'single',...ids);
        }
    }

    //批量添加
    addItems() {
        // let ids = getIdsBySelectedByField(this.selectItems);
        if(this.status === 1){
            this.priceVisible = true;
        }else{
            let ids = []
            this.selectItems.forEach(item => {
                ids.push({id: item.id, materialActivityPrice: item.materialActivityPrice, number: item.number})
            })
            this.packDetailAddMaterials(this.pid,'multiple',...ids);
        }
    }

    /**
     * 删除材料
     * @param {number} pid
     * @param ids
     */
    packDetailDelMaterials(pid: number,str, ...ids) {
        if (pid) {
            this.masterPack.delMaterials(pid, ids).then(msg => {
                this.warn.onMsgSuccess(msg[1]);
                this.masterTotal = this.masterTotal - ids.length;
                this.sellingPrice = msg[0].sellingPrice
                this.supplyPrice = msg[0].supplyPrice;
                this.newSupplyPrice = msg[0].newSupplyPrice;
                this.pid = msg[0].id;
                this.changeBarParam();
                this.isLastPage(str);
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    //单个删除材料
    deleteItem(id: number) {
        this.packDetailDelMaterials(this.pid,'single', id);
    }

    //批量删除
    deleteItems() {
        let ids = getIdsBySelectedByField(this.selectItems);
        this.packDetailDelMaterials(this.pid,'multiple', ...ids);
    }

    //全选
    checkAll(bool: boolean) {
        this.allChecked = bool;
        this.materials.forEach(m => {
            m["checked"] = this.allChecked;
        });
        this.refreshStatus();
    }

    //选择某一项
    refreshStatus() {
        let allChecked = false,
            allUnChecked = false;

        if (this.materials && this.materials.length > 0) {
            allChecked = this.materials.every(m => m.checked === true);
            allUnChecked = this.materials.every(m => !m.checked);
            this.allChecked = allChecked;
            this.indeterminate = (!allChecked) && (!allUnChecked);
            this.selectItems = this.materials.filter(m => m.checked === true);
        } else {
            this.allChecked = allUnChecked;
        }

        this.radioSwitch[0].text = `已添加${this.masterTotal > 0 ? '（' + this.masterTotal + '）' : ''}`;

    }


    /**
     * 根据是否失效显示文案
     * @param data
     * @param survival
     * @returns {string}
     */
    showTipOnTitle(data, survival) {
        return showTitleBySurvival(data, survival);
    }

    /**
     * 查看图片放大
     * @param {string} src
     */
    openLarge(src: string) {
        this._albums = [];
        this._albums.push({src: src, thumb: src});
    }

    //编辑
    openPack() {
        let selectCombos = [];
        if (this.combos && this.combos.length > 0 && this.comboIds && this.comboIds.length > 0) {
            this.comboIds.forEach(combo => {
                let find = this.combos.filter(c => c.id == combo.id);
                if (find && find.length > 0) {
                    selectCombos = selectCombos.concat(find);
                }
            })
        }
        this.form = {
            packName: this.name,
            packSupplyId: this.supplierId,
            packCombos: selectCombos,
            packUnit: this.unit,
            packSalePrice: this.sellingPrice ? this.sellingPrice : (typeof this.sellingPrice === 'number' ? 0 : null),
            packSupplyPrice: this.newSupplyPrice ? this.newSupplyPrice : (typeof this.newSupplyPrice === 'number' ? 0 : null),
            packActivityPrice: this.supplyPrice ? this.supplyPrice : (typeof this.supplyPrice === 'number' ? 0 : null),
            startTime: this.startTime,
            endTime: this.endTime,
            separable: this.separable,
            packRemark: this.remark
        }
        this.isVisible = true;
    }

    //提交编辑
    handleOk(form: any) {
        console.log(form);
        const params = {
            id: this.pid,
            comboIds: this.masterCombo.getComboIds(form.packCombos),
            name: form.packName,
            supplierId: form.packSupplyId,
            separable: form.separable,
            remark: form.packRemark
        };
        if (form.packUnit && form.packUnit.length > 0) {
            params["unit"] = form.packUnit.trim();
        }

        //供货价
        // params["newSupplyPrice"] = form.packSupplyPrice?form.packSupplyPrice:(typeof form.packSupplyPrice === 'number'?0:null);
        //销售价
        // params["sellingPrice"] = form.packSalePrice?form.packSalePrice:0;
        //活动价
        // params["supplyPrice"] = form.packActivityPrice?form.packActivityPrice:(typeof form.packActivityPrice === 'number'?0:null);
        if (form.startTime) {
            params["startTime"] = new Date(form.startTime).getTime();
        }
        if (form.endTime) {
            params["endTime"] = new Date(form.endTime).getTime();
        }

        this.masterPack.savePack(params).then(msg => {
            this.warn.onMsgSuccess(msg[0]);
            this.pid = msg[1];
            params["combos"] = form.packCombos;
            this.evaluatedPackByParams(params);
            this.changeBarParam();
            this.handleCancel();

        }).catch(err => {
            this.handleCancel();
            this.warn.onMsgError(err);
        })
    }

    handleCancel() {
        this.isVisible = false;
    }

    /**
     * 编辑成功后重新赋值
     * @param params
     */
    evaluatedPackByParams(params: any) {
        this.name = params["name"];
        this.remark = params["remark"];
        /* this.newSupplyPrice = params["newSupplyPrice"];
        this.sellingPrice = params["sellingPrice"]; */
        this.supplierId = params["supplierId"];
        this.comboName = this.getComboNames(params["combos"])
        this.comboIds = params["combos"];
        this.unit = params["unit"];
        // this.supplyPrice = params["supplyPrice"]
        this.startTime = params["startTime"];
        this.endTime = params["endTime"];
        this.separable = params["separable"];
    }


    /**
     * 提交审核
     * @param {number} id
     */
    submitItem(id: number) {
        if (id) {
            if (this.supplyPrice && this.startTime || !this.supplyPrice && !this.startTime) {
                this.masterPack.submitPacks([id]).then(msg => {
                    this.warn.onMsgSuccess(msg);
                    this.router.navigate(["../list"], {relativeTo: this.activatedRoute});
                }).catch(err => {
                    this.warn.onMsgError(err);
                })
            } else {
                this.warn.onModalInfo({
                    title: '提示',
                    content: '请填写套餐完整材料活动价及时间',
                    ok: () => {
                        console.log('tips');
                    }
                });
            }

        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    /**
     * 撤回
     * @param {number} id
     */
    recallItem(id: number) {
        this.masterPack.recallPacks([id]).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.router.navigate(["../list"], {relativeTo: this.activatedRoute});
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }

    /**
     * 上下架
     * @param {number} id
     * @param {number} shelf
     */
    shelfItem(id: number, shelf: number) {
        this.masterPack.shelfPacks([id], shelf).then(msg => {
            this.warn.onMsgSuccess(msg);
            this.router.navigate(["../list"], {relativeTo: this.activatedRoute});
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }




    // 修改数量
    // modelAmountChange(amount:number,ids) {
    //     if(this.pid){
    //         if(amount || amount === 0){
    //             this.changeAmount(this.pid,amount,ids)
    //         }else{
    //             this.warn.onMsgError('请填写数量');
    //             this.changeData();
    //             return;
    //         }
    //
    //     }else{
    //         this.warn.onMsgWarn(Messages.PARAM_EMPTY);
    //     }
    // }
    //
    // 数量批量修改
    // handleAmount(){
    //     if(this.amountForm.valid){
    //         let ids = [];
    //         this.materials.map(v => {
    //             if (v['checked']) {
    //                 ids.push(v['id'])
    //             }
    //         })
    //         if(this.pid){
    //             this.changeAmount(this.pid,this.amountForm.value["amount"],...ids)
    //         }else{
    //             this.warn.onMsgWarn(Messages.PARAM_EMPTY);
    //         }
    //     }
    // }

    // changeAmount(pid,amount,...ids){
    //     this.masterPack.addAmountMaterials(pid,amount,ids).then(data =>{
    //         this.warn.onMsgSuccess(data.msg);
    //         this.amountCancel();
    //         if(data && data["data"]){
    //             this.sellingPrice = data.data.sellingPrice;
    //             this.supplyPrice = data.data.supplyPrice;
    //             this.newSupplyPrice = data.data.newSupplyPrice;
    //             this.changeBarParam();
    //         }
    //         this.changeData();
    //     }).catch(err =>{
    //         this.warn.onMsgError(err);
    //     })
    // }

    //合并活动价和数量（单条数据计算）
    modelPriceAndNumChange(data: any,str:string) {
        if (this.pid) {
            let params = {
                planId: this.pid,
                materialList: [{id: data.id, materialActivityPrice: data.materialActivityPrice, number: data.number}]
            };
            if(str === 'price'){
                if(data.materialActivityPrice || data.materialActivityPrice === 0){
                    this.updatePackInMaterials(params);
                }else{
                    this.warn.onMsgError('请填写活动价');
                    this.changeData();
                    return;
                }
            }
            if(str === 'num'){
                if(data.number || data.number === 0){
                    this.updatePackInMaterials(params);
                }else{
                    this.warn.onMsgError('请填写数量');
                    this.changeData();
                    return;
                }
            }
        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    // 弹出数量弹窗
    editAmount() {
        this.amountVisible = true;
    }

    amountCancel() {
        this.amountVisible = false;
        this.amountForm.reset();
    }

    // 弹出活动价弹窗
    editPrice() {
        this.priceVisible = true;
    }

    priceCancel() {
        this.priceVisible = false;
        this.priceForm.reset();
    }

    //批量修改数量
    handleAmount(){
        if(this.amountForm.valid){
            this.batchPriceAndNumChange(this.amountForm.value["amount"],"amount");
            this.amountCancel();
        }
    }
    //批量活动价格
    handlePrice(){
        if(this.priceForm.valid){
            this.batchPriceAndNumChange(this.priceForm.value["price"],"price");
            if(this.status === 1 && this.radio === 0){
                if(this.selectItems && this.selectItems.length > 0 && !this.addData){
                    let ids = []
                    this.selectItems.forEach(item => {
                        ids.push({id: item.id, materialActivityPrice: this.priceForm.value["price"], number: 1})
                    })
                    this.packDetailAddMaterials(this.pid,'price',...ids);
                }else{
                    let ids = [{id: this.addData.id, materialActivityPrice: this.priceForm.value["price"], number: 1}]
                    this.packDetailAddMaterials(this.pid,'price',...ids);
                }
            }
            this.priceCancel();
        }
    }

    /**
     * 批量操作活动价或者数量
     * @param {number} val 数值
     * @param {string} type 类别区分活动价还是数量
     */
    batchPriceAndNumChange(val: number,type:string) {
        console.log("value is",val,"type is====",type);
        console.log("batch select items",this.selectItems);
        let params = {
            planId: this.pid,
            materialList: []
        };
        if(this.selectItems && this.selectItems.length > 0 && !this.addData){
            this.selectItems.forEach(item =>{
                params.materialList.push({
                    id:item.id,
                    materialActivityPrice: (type ==="price")?val:item.materialActivityPrice,
                    number: (type === "amount")?val:this.status === 1 ? 1:item.number
                });
            })
        }
        if(this.status === 1 && this.radio === 0 && this.addData && Object.keys(this.addData).length > 0){
            params.materialList.push({
                id:this.addData.id,
                materialActivityPrice: val,
                number: 1
            });
        }
        this.updatePackInMaterials(params);
    }

    /**
     * 更新套餐中的活动价和数量
     * @param params
     */
    updatePackInMaterials(params) {
        this.masterPack.updatePackInMaterials(params).then(data => {
            if(this.radio === 1){
                this.warn.onMsgSuccess(data.msg);
                this.pid = data.data.id;
                if(params["materialList"] && params["materialList"].length > 0){
                    this.changeData()
                }
            }
            if (data && data.data) {
                this.sellingPrice = data.data.sellingPrice;
                this.supplyPrice = data.data.supplyPrice;
                this.newSupplyPrice = data.data.newSupplyPrice;
                this.pid = data.data.id;
            }
            this.changeBarParam();
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }


    // 修改活动价
   // activityPriceChange(price:number,data:any) {
    //     if(this.pid){
    //         let materialList = [];
    //         if(price || price === 0){
    //             materialList = [
    //                 {id:data.id,materialActivityPrice:price,number:data.number}
    //             ]
    //         }else{
    //             this.warn.onMsgError('请填写活动价');
    //             this.changeData();
    //             return;
    //         }
    //         this.changeActivityPrice(this.pid,materialList)
    //     }else{
    //         this.warn.onMsgWarn(Messages.PARAM_EMPTY);
    //     }
    // }




    // 活动价批量修改
    // handlePrice(){
    //     if(this.priceForm.valid){
    //         let ids = [];
    //         this.materials.map(v => {
    //             if (v['checked']) {
    //                 ids.push({id:v.id,materialActivityPrice:this.priceForm.value["price"],number:v.number})
    //             }
    //         })
    //         if(this.pid){
    //             this.changeActivityPrice(this.pid,ids)
    //         }else{
    //             this.warn.onMsgWarn(Messages.PARAM_EMPTY);
    //         }
    //     }
    // }

    // changeActivityPrice(pid,ids){
    //     this.masterPack.activityPriceModify(pid,ids).then(data =>{
    //         this.warn.onMsgSuccess(data.msg);
    //         this.priceCancel();
    //         if(data && data["data"]){
    //             this.supplyPrice = data.data.supplyPrice;
    //             this.changeBarParam();
    //         }
    //         this.changeData();
    //     }).catch(err =>{
    //         this.warn.onMsgError(err);
    //     })
    // }

    /**
     * 显示 0 和 空的问题
     * @param num
     * @returns {number | string}
     */
    showZero(num) {
        return this.masterPack.equalZero(num);
    }

    //变更导航栏参数
    changeBarParam() {
        let newComboNameId = [];
        if (this.comboIds && this.comboIds.length > 0) {
            this.comboIds.forEach(combo => {
                newComboNameId.push(combo.id)
            })
        }
        let params = {
            id: this.pid,
            name: this.name,
            remark: this.remark,
            newComboNameId: newComboNameId.join(','),
            comboName: this.comboName,
            newSupplyPrice: this.newSupplyPrice,
            sellingPrice: this.sellingPrice,
            supplyPrice: this.supplyPrice,
            startTime: this.startTime,
            endTime: this.endTime,
            separable: this.separable,
            supplierId: this.supplierId,
            unit: this.unit,
            putaway: this.shelf,
            status: this.status,
        }
        this.router.navigate(["./"], {
            queryParams: {
                pack: JSON.stringify(params),
                edit: this.edit
            },
            relativeTo: this.activatedRoute
        })
    }
}

