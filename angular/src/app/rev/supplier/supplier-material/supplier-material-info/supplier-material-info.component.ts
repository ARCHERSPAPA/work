import {Component, OnInit, ViewChild} from '@angular/core';
import {atob} from '../../../../model/methods';
import {Router, ActivatedRoute} from '@angular/router';

import {ApiService} from '../../../../service/api.service';
import {Default} from './../../../../model/constant';
import {HttpClient} from '@angular/common/http';
import {RequestService} from '../../../../service/request.service';
import {WarningService} from '../../../../service/warning.service';
import {Messages} from '../../../../model/msg';
import {btoa} from '../../../../model/methods';
import {ThrowStmt} from '@angular/compiler';
import {data} from 'jquery';
import {resolve} from 'core-js/fn/promise';
import {MasterService} from "../../../master/master.service";

@Component({
    selector: 'rev-supplier-material-info',
    templateUrl: './supplier-material-info.component.html',
    styleUrls: ['./supplier-material-info.component.scss']
})
export class SupplierMaterialInfoComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;
    public showBtn = true;
    public showTitle = true;
    public pageType = 0;
    // public brand = []; //品牌
    // public serchs = {};//搜索
    // public historyData = {
    //     serch: {},
    //     pageNo: null
    // };//搜索

    //图片
    public _albums = [];
    public index = 0;
    // public brandType = [{id: 1, content: '全部数据'}];
    // public type; //材料类别
    public id;  //材料商ID
    public ids = [];  //材料ID租
    public checkedNumber; //已选数量
    public materialType: number = 1;//区别辅材主材软装
    public lock = false;//避免打印时多次执行
    public httpOptions = {
        withCredentials: true
    };
    @ViewChild('uploadFile') uploadFile: any;
    //查询相关
    public isAllDisplayDataChecked: boolean;
    public indeterminate = false;
    public radioSwitch = [
        {
            key: 0,
            text: '已创建'
        },
        {
            key: 1,
            text: '审核中'
        },
        {
            key: 2,
            text: '已通过'
        },
        {
            key: 3,
            text: '未通过'
        },
    ];
    public materialList = [];
    public defaultRadioSwitch:any;
    public downExcel;//下载的模板的URL

    //查询
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    //公共组件调用时
    public forms: Array<any> = [
        {
            type: "select",
            name: "category",
            data: null,
            value: null,
            cols: 3,
            placeholder: "请选择类别"
        },
        {
            type: "select",
            name: "brand",
            data: null,
            value: null,
            cols: 4,
            placeholder: "请选择品牌",
            mode: "multiple",
            connect: "category"
        },
        {
            type: "group",
            name: "group",
            data: [
                {label: "SPU", value: 0},
                {label: "SKU", value: 1},
                {label: "名称", value: 2},
                {label: "规格", value: 3},
                {label: "型号", value: 4}
            ],
            value: {
                select: 2,
                text: null
            },
            placeholder: "请输入",
            cols: 4
        },
        {
            type: "button",
            name: "search",
            text: "查询"
        }
    ];
    //类别信息cid
    public cid: number;
    //获取选中的品牌
    public brands: any;
    //输入文案查询
    public name: string;
    public spu: string;
    public sku: string;
    public model: string;
    public spec: string;
    //获取当前所有类别 信息
    public categories: any;
    //获取对应的品牌数据信息
    public brandes:any;
    public bransOnParam: any;


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private httpClient: HttpClient,
                private apiService: ApiService,
                private req: RequestService,
                private warn: WarningService,
                private master: MasterService) {
    }


    ngOnInit() {
        this.title = "材料";

        let createBTN;  //创建材料的名字，主材辅材软装
        this.activatedRoute.queryParams.subscribe(params => {
            this.title = params && params["title"] ? params["title"] : "材料";
            this.pageNo = params && params["pageNo"] ? params["pageNo"] : Default.PAGE.PAGE_NO;
            this.pageType = params && params["pageType"] ? params["pageType"] : 0;
            this.id = params && params["id"] ? atob(params["id"]) : null;


            if (params && params['materialType']) {
                this.materialType = params['materialType'];
                if (this.materialType == 1) {
                    createBTN = '创建主材';
                } else if (this.materialType == 2) {
                    createBTN = '创建辅材';
                } else if (this.materialType == 3) {
                    createBTN = '创建软装';
                }
            }
            try {
                this.cid = params && params["cid"] ? Number(params["cid"]) : null;
            } catch (e) {
                console.error(e);
                this.cid = null;
            }
            if(this.brandes){
              this.bransOnParam = null;
            }else{
                this.bransOnParam = params && params["brands"] ? params["brands"] : null;
            }


            if (this.categories && this.categories.length > 0) {
                let find = this.categories.find(c => c.id === this.cid);
                this.forms[0].value = find;
            } else {
                this.getCategory();
            }


            // if (params && params['pageType']) {
            //     this.pageType = params['pageType'];
            // }
            // if (params && params['id']) {
            //     this.id = atob(params['id']);
            // }
        });

        this.buttons = [
            {
                name: '模板下载',
                link: '/rev/supplier/material/add',
                type: 'default'
            },
            {
                name: '新建导入',
                link: '/rev/supplier/material/add',
                type: 'default'
            },
            {
                name: createBTN,
            }
        ];

        if (this.pageType == 0) {
            this.defaultRadioSwitch = this.radioSwitch[0]
        }
        else if (this.pageType == 1) {
            this.defaultRadioSwitch = this.radioSwitch[1]
        }
        else if (this.pageType == 2) {
            this.defaultRadioSwitch = this.radioSwitch[2]
        }
        else if (this.pageType == 3) {
            this.defaultRadioSwitch = this.radioSwitch[3]
        }
        // this.getHistory();
        // this.changeData();

        this.getDownLoadExcel();

    }


    //加载类别
    getCategory() {
        this.master.getCategoriesByType(this.materialType).then(data => {
            if (data && data.length > 0) {
                data.forEach(d => d["content"] = d["categoryName"]);
                this.forms[0].data = data;
                this.categories = data;
                if (this.cid) {
                    let find = data.filter(d => d["id"] === this.cid);
                    if (find && find.length > 0) {
                        this.forms[0].value = find[0];
                    }
                    this.brandes = null;
                    this.getBrands(this.cid);
                }
                if (!this.brands) {
                    this.changeData();
                }
            }

        }).catch(err => {
            this.warn.onMsgError(err);
            if (!this.brands) {
                this.changeData();
            }
        })
    }

    /**
     * 根据材料id 查询对应的品牌
     * @param {number} cid
     */
    getBrands(cid: number) {
        this.master.getBrands(cid).then(data => {
            if (data && data.length > 0) {
                data.forEach(d => d["content"] = d["brandName"]);
                this.forms[1].data = data;
                this.brandes = data;
                if (this.bransOnParam) {
                    this.brands = this.getBrandsInfo(this.bransOnParam, data);
                    this.bransOnParam = null;
                }

                if (this.brands) {
                    this.forms[1].value = this.brands;
                }
            }
        }).catch(err => {
            this.warn.onMsgError(err);
        })
    }


    handleForm(e: any) {
        if (e && e.name === this.forms[3].name) {
            if (e.value) {
                this.cleanInputInfo();
                let maps = e.value;
                if (maps && maps.size > 0) {
                    maps.forEach((map, key) => {
                        if (key === this.forms[2].name) {
                            this.getInfoBySwitch(map.select, map.text);
                        }
                    })
                    this.resetData();
                }

            }
        }
    }

    handleSelect(e: any) {
        if (e && e.name === this.forms[0].name) {
            this.cid = e.value ? e.value.id : null;
            this.forms[1].data = null;
            this.forms[1].value = null;
            this.brands = null;
            if (this.cid) {
                //将关联的品牌数据置为空
                this.getBrands(this.cid);
            }
        } else if (e && e.name === this.forms[1].name) {
            // console.log("brands is evalue",e.value);
            this.brands = e.value ? e.value : null;
        }
        this.resetData();
    }

    getInfoBySwitch(type: number, info: string) {
        switch (type) {
            case this.forms[2].data[0].value:
                this.spu = info;
                break;
            case this.forms[2].data[1].value:
                this.sku = info;
                break;
            case this.forms[2].data[2].value:
                this.name = info;
                break;
            case this.forms[2].data[3].value:
                this.spec = info;
                break;
            case this.forms[2].data[4].value:
                this.model = info;
                break;
            default:
                break;
        }
    }

    //清除文本选项
    cleanInputInfo() {
        this.spu = null;
        this.sku = null;
        this.name = null;
        this.spec = null;
        this.model = null;
    }

    //清除select选项
    cleanSelectInfo() {
        this.cid = null;
        this.forms[0].value = null;
        this.brands = null;
        this.forms[1].value = null;
    }


    resetData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changePage();
    }

    changePage() {
        this.router.navigate(["./"], {
            queryParams: {
                pageNo: this.pageNo,
                name: this.name,
                sku: this.sku,
                spu: this.spu,
                spec: this.spec,
                model: this.model,
                cid: this.cid,
                brands: this.getParamsByBrands(this.brands,false).join(","),
                id: btoa(this.id),
                title: this.title,
                materialType: this.materialType,
                pageType: this.pageType
            },
            relativeTo: this.activatedRoute
        });
        this.changeData();
    }


    btoa(id: string) {
        return btoa(id);
    }

    //下载模板
    getDownLoadExcel() {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: 'downloadExcel',
                data: {
                    id: this.materialType
                },
                success: res => {
                    if (res.code === 200) {
                        this.downExcel = res.data;
                        resolve();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }

                }
            })
        })
    }

    //上传文件
    handleFileChange(e) {
        const that = this;
        const files = e.target.files;
        const file = files[0];
        // files[0]['uploadString'] = Date.now();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('versionType', '1');
        // formData.append('supplierId', this.id);

        // this.httpOptions['params'] = {  }
        this.httpOptions['params'] = {'supplierId': this.id + '', 'type': this.materialType + ''}
        this.httpClient.post(this.apiService.getUrl('materialImportExcel'), formData, this.httpOptions)
            .subscribe(
                (res: any) => {
                    if (res.code === 200) {
                        this.changeData();
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        // that.loadData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                },
                error => {
                    that.warn.onWarn('请求失败');
                }
            );
        this.uploadFile.nativeElement.value = '';
    }

    /**
     * 组装品牌参数
     * @param brands
     * @param {boolean} bool True:直接返回，false：需要组装id
     * @returns {any[]}
     */
    getParamsByBrands(brands: any, bool: boolean) {
        let bs = [];
        if (brands && brands.length > 0) {
            brands.forEach(b => {
                if (bool) {
                    bs.push(b)
                } else {
                    if (b.id) {
                        bs.push(b.brandName);
                    }
                }

            })
        }
        return bs;
    }

    //获取类别名称
    getParamsByCate(cid: number) {
        if (this.categories && this.categories.length > 0) {
            let find = this.categories.find(cate => cate.id === cid);
            if (find && find.id > 0) return find["categoryName"];
        }
        return null;
    }

    //重组品牌数据回显
    getBrandsInfo(bids: any, data: any) {
        let bs = [];
        if (bids && data && data.length > 0) {
            let bis = bids.split(",");
            if (bis && bis.length > 0) {
                let find = null;
                bis.forEach(b => {
                    find = data.find(d => d["brandName"] === b);
                    if (find && find["id"]) {
                        bs.push(find);
                    }
                })
            }
        }
        return bs;
    }

    checkSubmit() {
        return this.materialList.some(v => {
            return v['checked']
        })
    }

    //切换
    handleName(e) {
        switch (e) {
            case '创建主材':
                this.router.navigate(['./../edit'], {
                    queryParams: {
                        newMaterial: true,
                        supplierId: btoa(this.id),
                        materialType: this.materialType
                    }, relativeTo: this.activatedRoute
                });
                break;
            case '创建辅材':
                this.router.navigate(['./../edit'], {
                    queryParams: {
                        newMaterial: true,
                        supplierId: btoa(this.id),
                        materialType: this.materialType
                    }, relativeTo: this.activatedRoute
                });
                break;
            case '创建软装':
                this.router.navigate(['./../edit'], {
                    queryParams: {
                        newMaterial: true,
                        supplierId: btoa(this.id),
                        materialType: this.materialType
                    }, relativeTo: this.activatedRoute
                });
                break;
            case '新建导入':
                document.getElementById('import').click();
                break;
            case '模板下载':
                this.getDownLoadExcel().then(() => {
                    const a = document.createElement('a');
                    a.href = this.downExcel;
                    a.click();
                })

                break;
            default:
                break;
        }
    }

    //切换RADIO
    handleSwitch(type: number) {
        // console.log("pageType",type);
        this.pageType = type;
        this.forms[2].value.select = 2;
        this.forms[2].value.text = null;
        this.cleanInputInfo();
        this.cleanSelectInfo();
        this.resetData();
    }

    //审核撤回
    apply(id) {
        let url
        if (this.pageType == 0 || this.pageType == 3) {
            url = 'submitMaterDetial'
        } else {
            url = 'submitMaterialRecall'
        }
        if (id) {
            this.ids.push(id)
        } else {
            this.materialList.forEach(v => {
                if (v['checked']) {
                    this.ids.push(v['id']);
                }
            })
        }
        this.req.doPost({
            url: url,
            data: {
                materialList: this.ids,
                supplierId: this.id,
                type: this.materialType
            },
            success: res => {
                this.ids = [];
                if (res.code === 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.pageNo = Default.PAGE.PAGE_NO;
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }

            }
        })
    }

    //合并SPU等列
    getNums(index) {
        let current = this.materialList[index];
        let next = this.materialList[index + 1];
        if (next) {
            if (current.spu === next.spu) {
                if (current["rows"]) {
                    current["rows"] = current["rows"] + 1;
                } else {
                    current["rows"] = 2;
                }
                next["rows"] = current["rows"];
                current["rows"] = 0;
            } else {
                if (!current["rows"]) {
                    current["rows"] = 1;
                }
                if (!next["rows"]) {
                    next["rows"] = 1;
                }
            }
        }
    }

    //获取已选的条数
    getNum() {
        this.checkedNumber = 0;
        this.materialList.forEach(v => {
            if (v['checked']) {
                this.checkedNumber += 1;
            }
        })
    }

    //单选
    refreshStatus() {
        const allChecked = this.materialList.every(value => value.checked === true);
        const allUnChecked = this.materialList.every(value => !value.checked);
        this.isAllDisplayDataChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.getNum();
    }

    /**
     *
     * @param isAll 判断是不是全部打印
     */
    print(isAll) {
        if (!this.lock) {
            if (isAll) {              //全部打印
                document.getElementById('prints').click();
                this.lock = false;
            } else {
                this.materialList.forEach(v => {
                    if (v['checked']) {
                        this.ids.push(v['id']);
                    }
                })
                setTimeout(() => {
                    document.getElementById('print').click();
                    this.ids = [];
                    this.lock = false;
                }, 400);
            }
        }

    }

    unlock() {
        this.lock = true;
    }

    //删除
    del(material) {
        let param = {list: [], supplierId: this.id};
        if (material) {
            param.list.push({
                spu: material.spu,
                useDefaultImage: material.useDefaultImage ? material.useDefaultImage : '',
                id: material.id,
            })
        } else {
            this.materialList.forEach(v => {
                if (v['checked']) {
                    param.list.push({
                        spu: v.spu,
                        useDefaultImage: v.useDefaultImage ? v.useDefaultImage : '',
                        id: v.id,
                    })
                }
            })
        }
        this.req.doPost({
            url: "deletMarterial",
            data: param,
            success: res => {
                if (res && res.code == 200) {
                    this.pageNo = Default.PAGE.PAGE_NO;
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }

    //全选
    checkAll(event) {
        if (event) {
            this.materialList.filter((item) => {
                item['checked'] = true;
            });
        } else {
            this.materialList.filter(item => {
                item['checked'] = false;
            });
        }
        this.indeterminate = false;
        this.getNum();
    }

//利用本地保存返回数据
    setHistory() {
        // this.historyData.pageNo = this.pageNo;
        // this.historyData.serch = this.serchs;
        // window.localStorage.setItem('materialHistory', JSON.stringify(this.historyData))
    }

    getHistory() {
        if (localStorage.getItem('materialHistory')) {
            // this.serchs = JSON.parse(localStorage.getItem('materialHistory')).serch;
            // this.pageNo = JSON.parse(localStorage.getItem('materialHistory')).pageNo;
        }
    }

    clearHistory() {
        // localStorage.removeItem('materialHistory');
        // this.serchs = {};
        // this.pageNo = 1;
    }

    //拉取数据信息
    changeData() {
        let params = {
            supplierId: this.id,
            pageSize: this.pageSize,
            pageNum: this.pageNo,
            status: this.pageType,
            type: this.materialType
        }

        if (this.name) {
            params["name"] = this.name.trim();
        }
        else if (this.sku) {
            params["sku"] = this.sku.trim();
        }
        else if (this.spu) {
            params["spu"] = this.spu.trim();
        }
        else if (this.spec) {
            params["spec"] = this.spec.trim();
        }
        else if (this.model) {
            params["model"] = this.model.trim();
        }

        if (this.cid) {
            params["category"] = this.getParamsByCate(this.cid);
        }

        //品牌初始化时
        if (this.bransOnParam) {
            params["brand"] = this.getParamsByBrands(this.bransOnParam.split(","), true);
        }

        //品牌选定时
        if (this.brands && this.brands.length > 0) {
            params["brand"] = this.getParamsByBrands(this.brands, false);
        }


        // if (this.serchs) {
        //     if (this.serchs['spu']) {
        //         parm['spu'] = this.serchs['spu'];
        //     }
        //     if (this.serchs['sku']) {
        //         parm['sku'] = this.serchs['sku'];
        //     }
        //     if (this.serchs['name']) {
        //         parm['name'] = this.serchs['name'];
        //     }
        //     if (this.serchs['spec']) {
        //         parm['spec'] = this.serchs['spec'];
        //     }
        //     if (this.serchs['model']) {
        //         parm['model'] = this.serchs['model'];
        //     }
        // }


        // let i = this.brand.indexOf(1)
        // if (i > 0 || this.brand[0] == 1) {
        //     this.brand.splice(i, 1);
        // }
        // if (this.brand && this.brand.length > 0) {
        //     parm['brand'] = this.brand;
        // }
        //
        // if (this.type && this.type != 1) {
        //     parm['category'] = this.type;
        // }
        this.req.doPost({
            url: 'detailMaterialList',
            data: params,
            success: res => {
                if (res.code === 200) {
                    this.materialList = res.data.list;
                    this.materialList.filter((v, i) => {
                        v['checked'] = false;
                        v["rows"] = 1;
                    })
                    this.materialList.reverse().forEach((v, i) => {
                        this.getNums(i);
                    })
                    this.total = res.data.total;
                    this.renderData();
                    this.setHistory();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }

    renderData() {
        this.checkedNumber = '';
        this.indeterminate = false;
        this.ids = [];
        this.isAllDisplayDataChecked = false;
        this.materialList = this.materialList.reverse();
    }

    openLarge(src) {
        this._albums = [];
        this._albums.push({src: src, thumb: src});
    }
}
