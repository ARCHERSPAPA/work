import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { WarningService } from '../../service/warning.service';
import { Messages } from '../../model/msg';

@Component({
    selector: 'select-brand',
    templateUrl: './selectBrand.component.html',
    styleUrls: ['./selectBrand.component.scss']
})
export class SelectBrandComponent implements OnInit {


    @Input() showActivity: boolean = false; // 已通过活动
    @Input() showMaterial: boolean = false; // 全部材料商
    @Input() showMaterialType: boolean = false; // 材料的类型
    
    @Input() clearAll: boolean = false; // 清空回显数据
    //是否选择套系 false:为不选; true:为选择
    @Input() showNested: boolean = false;
    @Input() backData;//回显数据
    @Input() type: any; // 类别请求参数 1-主材；2-辅材；3-软装
    @Output() handleCategory = new EventEmitter<any>();
    @Output() handleBrand = new EventEmitter<any>();
    @Output() handleMaterialSupplier = new EventEmitter<any>();
    @Output() handleActivity = new EventEmitter<any>();
    @Output() handleSearch = new EventEmitter<any>();
    @Output() handleInput = new EventEmitter<any>();
    @Output() handleResetData = new EventEmitter<any>();
    @Output() handleMaterialType = new EventEmitter<any>();
    //选择套系时回调
    @Output() handleNested = new EventEmitter<any>();



    public activityStatus: Array<any> = [{ id: '', activityName: '通过材料' }]; //活动选择
    public componeyStatus: Array<any> = [{ id: '', companyName: '全部材料商' }]; // 材料商选择
    //全部套系数据
    public nestedStatus: Array<any> = [];
    public materialStatus: Array<any> = [{ id: 1, materialName: '主材' }, { id: 2, materialName: '辅材' }];

    public brandStatus: Array<any> = []; // 品牌选择
    public categoryStatus: Array<any> = [{ id: '', categoryName: '全部类别' }]; // 类别选择
    // 查询条件
    public material = ''; // 活动id
    public materialType = 1;//1主材2辅材
    public company = ''; // 材料商id
    //套系ids
    public nested: any;
    public category = { id: '', categoryName: '全部类别' }; // 类别
    public brand = undefined; // 品牌
    public condition = 2;
    public spu = '';
    public sku = '';
    public name = '';
    public spec = '';
    public model = '';
    public compareFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2; //类别选择框为对象


    constructor(
        private request: RequestService,
        private warn: WarningService,) { }

    ngOnInit() {
        if (this.showMaterial) {
            this.getMaterialSupplierList();
        }
        this.getMarterialCategoryList();

        if (this.showNested) {
            this.getNestedList();
        }
        this.getBackData();

    }
    //获取回显数据
    getBackData() {
        if (this.backData) {
            if (this.backData['spu']) {
                this.spu = this.backData['spu']
                this.condition = 0;
            } else if (this.backData['sku']) {
                this.sku = this.backData['sku']
                this.condition = 1;
            } else if (this.backData['name']) {
                this.name = this.backData['name']
                this.condition = 2;
            } else if (this.backData['spec']) {
                this.spec = this.backData['spec']
                this.condition = 3;
            } else if (this.backData['model']) {
                this.model = this.backData['model']
                this.condition = 4;
            }
        }
    }
    //判断是否切换TAB清空数据
    ngDoCheck() {
        if (this.clearAll) {
            this.resetData();
            this.clearAll = false;
        }
        if (this.backData && Object.keys(this.backData).length === 0) {
            this.clearInput();
            this.condition = 2;
        }
    }
    // 所有的活动
    getmaterialList() {
        if (this.company) {
            this.request.doPost({
                url: 'materialByList',
                data: {
                    materialId: this.company
                },
                success: (res => {
                    if (res && res.code === 200) {
                        this.activityStatus = res.data
                        this.activityStatus.unshift({ id: '', activityName: '通过材料' })
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
            this.activityStatus = [{ id: '', activityName: '通过材料' }];
        }
    }

    // 所有的材料商
    getMaterialSupplierList() {
        this.request.doPost({
            url: 'materialSupplierListBySelect',
            data: {},
            success: (res => {
                if (res && res.code === 200) {
                    this.componeyStatus = res.data;
                    this.componeyStatus.unshift({ id: '', companyName: '全部材料商' })
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    //所有套系信息
    getNestedList() {
        this.request.doPost({
            url: "comboList",
            success: (res => {
                if (res && res.code == 200) {
                    this.nestedStatus = res.data;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }


    //所有的类别
    getMarterialCategoryList() {
        let type;
        if(this.showMaterialType){
            type=this.materialType;
        }else{
            type=this.type;
        }
        this.request.doPost({
            url: 'getMaterialCategory',
            data: {
                type: type,
            },
            success: (res => {
                if (res && res.code === 200) {
                    this.categoryStatus = res.data
                    this.categoryStatus.unshift({ id: '', categoryName: '全部类别' })
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    //所有的品牌
    getMarterialBrand() {
        if (this.category.id) {
            this.request.doPost({
                url: 'getMaterialBrand',
                data: {
                    id: this.category.id,
                },
                success: (res => {
                    if (res && res.code === 200) {
                        this.brandStatus = res.data
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
            this.brandStatus = []
        }
    }

    // 活动
    changeActivity() {
        this.handleActivity.emit(this.material);
    }
    // 1主材，2辅材
    changeMaterialType() {
        this.handleMaterialType.emit(this.materialType);
        this. getMarterialCategoryList();
        this.category={ id: '', categoryName: '全部类别' };
    }

    // 材料商
    changeMaterialSupplier() {
        if (this.showActivity) {
            this.material = '';
            this.getmaterialList();
        }
        this.handleMaterialSupplier.emit(this.company);
    }


    changeNested() {
        this.handleNested.emit(this.nested);
    }


    /*  类别
     *  拉出品牌
     */
    changeCategory() {
        this.brand = null;
        console.log("change category", this.category);
        this.getMarterialBrand()
        if (this.category.id) {
            this.handleCategory.emit(this.category);
        } else {
            this.handleCategory.emit({ id: '', categoryName: '' });
        }
    }

    //品牌
    changeBrand() {
        this.handleBrand.emit(this.brand);
    }

    // 切换搜索条件清空输入框
    clearInput() {
        this.spu = '';
        this.sku = '';
        this.name = '';
        this.spec = '';
        this.model = '';
    }

    // 输入框变化
    changeIpt() {
        console.log("select brand condition", this.condition);
        this.handleInput.emit({
            spu: this.spu,
            sku: this.sku,
            name: this.name,
            spec: this.spec,
            model: this.model
        })
        this.backData = {            //暂时没有发现原因，要回显需要加上这个
            spu: this.spu,
            sku: this.sku,
            name: this.name,
            spec: this.spec,
            model: this.model
        }
    }
    // 搜索
    searchCondition() {
        this.handleSearch.emit({
            spu: this.spu,
            sku: this.sku,
            name: this.name,
            spec: this.spec,
            model: this.model
        });

    }

    // tab切换重置
    resetData() {
        this.material = '';
        this.company = '';
        this.category = { id: '', categoryName: '全部类别' };
        this.brand = undefined;
        this.spu = null;
        this.sku = null;
        this.name = null;
        this.spec = null;
        this.model = null;
        this.materialType=1;
        this.brandStatus = [];
        this.activityStatus = [{ id: '', activityName: '通过材料' }];
        this.condition = 2;
    }
}
