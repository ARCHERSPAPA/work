import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {RequestService} from '../../service/request.service';
import {ConfigService} from '../../service/config.service';
import {Messages} from '../../model/msg';
import {WarningService} from '../../service/warning.service';
import {Default} from '../../model/constant';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {getVersionType, subItemName} from '../../model/methods';
import {UserService} from '../../service/user.service';
import {BufferService} from '../../service/buffer.service';
import {ItemCartService} from "./item-cart.service";
import {ItemDetailService} from "../../rev/detail/item-detail.service";


declare const $: any;

@Component({
    selector: 'rev-item-cart',
    templateUrl: './item-cart.component.html',
    styleUrls: ['./item-cart.component.scss'],
    providers: [ItemCartService]
})
export class ItemCartComponent implements OnInit {
    //报价id
    @Input() id: number;
    //是否显示列表
    // @Input() visible: boolean = false;
    //当前选择四大类型
    @Input() type: number;
    //新旧版本 0：旧版本；1:新版本
    @Input() dataVersion: number = 0;

    //数据来源分析（v2.2.9新增，0:报价,1:成本）
    @Input() sourceInfo: number = 0;

    @Input() isNewQuote: boolean = false; //区别新老数据

    //外部传入version id
    @Input() vid: number;

    //基础报价时的小项菜单名称
    @Input() infoName: string;

    //小项菜单的id
    @Input() infoId: number;

    @Input() versionId: number;

    //增减项主的id
    @Input() aid: number;

    //显示列表的title
    @Input() title: string;

    public loading = false;
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;


    public category: any;
    public projectName = '';

    /**
     * 版本相关
     */
    public changeOptions: any;

    //套系数据
    public combos: Array<any>;


    /**
     * 类型相关
     */
    public moduleList: any;
    public categoryList: Array<any> = [];

    /**
     * 选择选中的ids
     * @type {any[]}
     */
    private selectModuleIds: Array<any> = [];

    /**
     * 选择选中的项目item
     * @type {any[]}
     */
    public selectModules: Array<any> = [];


    private configBase: any;

    /**
     * 是否显示当前已选中文件
     * @type {boolean}
     */


    public bufferName: string;

    //区别展示与否
    public toggleType = 'down';
    public toggle = false;


    //确定完成时重复
    public isConfirmLoading: boolean = false;

    //防止多次重复加载
    public preventRepeatLoad: boolean = true;
    //全选时的加载
    public clickSelectAll = false;
    //全选时的加载情况
    public loadingModuleAll = true;
    //全选(选择项目时,非选中的全选项目)
    public storeData: any;

    constructor(private request: RequestService,
                private warn: WarningService,
                public modal: NgbActiveModal,
                private config: ConfigService,
                private user: UserService,
                private el: ElementRef,
                private buffer: BufferService,
                private itemCart: ItemCartService,
                private itemDetail: ItemDetailService) {
    }

    ngOnInit() {
        /**
         * 判断是否已存在本地
         */
        this.bufferName = this.buffer.getRandKey(this.id, this.type);
        const buf = this.buffer.getBuffer(this.bufferName);
        if (buf) {
            const sd = this.buffer.getBuffer(this.bufferName);
            this.versionId = sd.versionId;
            if (this.versionId) {
                this.loadCategory();
                this.category = sd.category ? sd.category : '';
            }
            this.projectName = sd.projectName;
        }


        this.changeData();

        //加载套系
        this.loadCombos();

        //加载类型数据
        this.loadConfig();

    }


    /**
     * 初始化时调用此项，选择默认第一项
     */
    changeChildOptions() {
        const that = this;
        if (that.configBase && that.configBase.length > 0) {
            for (const tc of that.configBase) {
                if (that.getSelectType()) {
                    if (tc.type == that.getSelectType()) {
                        that.changeOptions = tc.versions;
                        if (that.changeOptions && that.changeOptions.length > 0) {
                            if (that.changeOptions.length === 1) {
                                that.versionId = that.changeOptions[0].versionId;
                                that.loadCategory();
                                this.changeData();
                            }
                            else {
                                if (!that.versionId) {
                                    if (that.dataVersion) {
                                        that.versionId = that.changeOptions[0].versionId;
                                        that.loadCategory();
                                        that.changeData();
                                    }
                                } else {
                                    if (!that.categoryList || (that.categoryList && that.categoryList.length === 0)) {
                                        that.loadCategory();
                                    }
                                }
                            }
                        }


                    }
                }
            }
        }
    }

    /**
     * 根据版本id 拉取对应的类型
     * @param {number} vid
     */
    changeVersion(vid: number) {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.projectName = null;
        this.category = null;
        this.versionId = vid;
        if (this.versionId) {
            this.loadCategory();
            this.clickSelectAll = false;
        } else {
            this.categoryList = [];
            this.moduleList = [];
        }
        this.searchData();
    }

    changeData() {
        this.loading = true;
        let params = {};
        if (this.dataVersion) {
            if (this.type === Default.STATE.ITEM_5) {
                params["page"] = this.pageNo;
                params["pageSize"] = this.pageSize;
                if (this.category && this.category["categoryName"]) {
                    params["category"] = this.category["categoryName"];
                }
                if (this.projectName && this.projectName.trim()) {
                    params["name"] = this.projectName.trim();
                }
                this.itemCart.getMaterialDetail(params).then(data => {
                    this.loading = false;
                    this.renderData(data);
                }).catch(err => {
                    this.loading = false;
                    this.warn.onMsgError(err);
                })
            }
            else {
                params["pageNo"] = this.pageNo;
                params["pageSize"] = this.pageSize;
                if (this.category && this.category["categoryName"]) {
                    params["category"] = this.category.categoryName;
                }
                if (this.projectName && this.projectName.trim()) {
                    params["projectName"] = this.projectName.trim();
                }
                //表明已添加过的数据
                params["type"] = 1;
                //默认未删除的数据显示
                params["state"] = 1
                if (this.versionId) {
                    params["id"] = this.versionId;
                    this.itemCart.getQuoteDetail(params).then(data => {
                        this.loading = false;
                        this.renderData(data);
                    }).catch(err => {
                        this.loading = false;
                        this.warn.onMsgError(err);
                    });
                } else {
                   this.changeChildOptions();
                }

            }
        }
        else {
            params["pageNo"] = this.pageNo;
            params["pageSize"] = this.pageSize;
            if (this.category && this.category["categoryName"]) {
                params["category"] = this.category.categoryName;
            }
            if (this.projectName && this.projectName.trim()) {
                params["projectName"] = this.projectName.trim();
            }
            params["companyId"] = this.user.getCompanyId();
            params["versionType"] = this.getSelectType();
            if (this.versionId) {
                params["versionId"] = this.versionId;
            }
            this.itemCart.getQuoteModules(params).then(data => {
                this.loading = false;
                this.renderData(data);
            }).catch(err => {
                this.loading = false;
                this.warn.onMsgError(err);
            })
        }
    }

    /**
     * 组装渲染时的数据
     * @param data
     */
    renderData(data: any) {
        if (this.dataVersion) {
            if (data.infoList && data.infoList.list) {
                this.moduleList = data.infoList.list;
                this.moduleList.forEach(v => {
                    v['specifications'] = v['spec'];
                    v['projectName'] = v['name'];
                    v['colours'] = v['color'];
                    v['modelNum'] = v['model']
                    v['category'] = v['categoryName'];
                })
                this.total = data.infoList.total;
            } else {
                this.moduleList = data.list;
                this.moduleList.forEach(v => {
                    v['specifications'] = v['spec'];
                    v['projectName'] = v['name'];
                    v['colours'] = v['color'];
                    v['versionId'] = v['combos'];
                    v['modelNum'] = v['model']
                });
                this.total = data.total;
            }
        } else {
            this.moduleList = data.pageSet;
            this.total = data.total;
        }
    }

    //重新渲染,兼容查看
    renderData2(data: any) {
        if (data.infoList && data.infoList.list) {
            data.infoList.list.forEach(v => {
                v['specifications'] = v['spec'];
                v['projectName'] = v['name'];
                v['colours'] = v['color'];
                v['modelNum'] = v['model']
                v['category'] = v['categoryName'];
            })
            return data.infoList.list;
        } else {
            data.list.forEach(v => {
                v['specifications'] = v['spec'];
                v['projectName'] = v['name'];
                v['colours'] = v['color'];
                v['versionId'] = v['combos'];
                v['modelNum'] = v['model']
            });
            return data.list;
        }
    }


    /**
     * 拉取选择
     */
    loadConfig() {
        if (this.dataVersion) {
            this.config.loadReConfig(this.id).then(data => {
                this.configBase = data;
                this.changeChildOptions();
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        } else {
            this.config.loadConfig(this.id).then(data => {
                this.configBase = data;
                this.changeChildOptions();
            }).catch(err => {
                this.warn.onMsgError(err);
            })
        }
    }


    ngDoCheck() {
        // this.switch = this.toggleModule ? "down" : "up";
        // console.log(this.selectModules);

        if (this.selectModules && this.selectModules.length == 0) {
            this.toggle = false;
            this.toggleType = this.toggle ? 'up' : 'down';
        }
    }

    searchData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.total = Default.PAGE.PAGE_TOTAL;
        this.selectModuleIds = []
        this.clickSelectAll = false;
        this.preventRepeatLoad = true;
        this.storeData = null;
        this.changeData();
    }

    /**
     * 加载套系
     */
    loadCombos() {
        if (this.type === Default.STATE.ITEM_5) {
            if (this.dataVersion) {
                this.itemCart.getCombos().then(data => {
                    this.combos = data;
                }).catch(err => {
                    console.log("加载套系失败");
                    this.warn.onMsgError(err);
                })
            }
        }

    }

    /**
     * 加载类别
     */
    loadCategory() {
        if (this.dataVersion) {
            if (this.type !== Default.STATE.ITEM_5) {
                this.itemCart.getBasicCategory().then(data => {
                    if (data && data.length > 0) {
                        data.forEach(d => {
                            d["categoryName"] = d.name;
                        })
                        this.categoryList = data;
                    }
                }).catch(err => {
                    this.warn.onMsgError(err);
                    this.categoryList = [];
                })
            } else {
                this.itemCart.getMaterialCategory(1).then(data => {
                    this.categoryList = data;
                }).catch(err => {
                    this.warn.onMsgError(err);
                    this.categoryList = [];
                })
            }
        }
        else {
            if (this.versionId) {
                this.itemCart.getCategory(this.versionId).then(data => {
                    const cates = [];
                    if (data && data.length > 0) {
                        data.forEach(d => {
                            cates.push({
                                categoryName: d
                            });
                        })
                    }
                    this.categoryList = cates;
                }).catch(err => {
                    this.warn.onMsgError(err);
                })
            }
        }


        // if (this.versionId) {
        //     let url
        //     let param
        //     if (this.isNewQuote) {
        //         url = 'getMaterialCategory';
        //         param = {
        //             type: 1
        //         }
        //     } else {
        //         url = 'categoryList';
        //
        //         param = {
        //             versionId: this.versionId
        //         }
        //     }
        //     this.request.doPost({
        //         url: url,
        //         data: param,
        //         success: (res => {
        //             if (res && res.code === 200) {
        //                 this.categoryList = [];
        //                 // if(this.categoryList && this.categoryList.length === 1){
        //                 //     this.category = this.categoryList[0];
        //                 // }
        //                 if (this.isNewQuote) {
        //                     res.data.forEach(v => {
        //                         this.categoryList.push(v['categoryName'])
        //                     });
        //
        //                 } else {
        //                     if (this.category) {
        //                         const findCategory = this.categoryList.filter(cate => cate === this.category);
        //                         if (findCategory && findCategory.length <= 0) {
        //                             this.category = this.categoryList[0];
        //                         }
        //                     }
        //                 }
        //
        //                 this.searchData();
        //             } else {
        //                 this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        //             }
        //         })
        //     });
        // }
    }


    /**
     * 添加
     * @param e
     * @param data
     */
    selectModule(e, data) {
        e.stopPropagation();
        e.preventDefault();
        data['num'] = 1;
        this.selectModules.push(data);
    }

    removeModule(e, i) {
        e.stopPropagation();
        e.preventDefault();
        this.selectModules.splice(i, 1);
        if (this.selectModules.length === 0) {
            this.toggle = false;
            this.clickSelectAll = false;
            this.preventRepeatLoad = true;
        }
    }


    //获取终点坐标
    getEndPoint() {
        const point = this.el.nativeElement.querySelector('#count');
        return {
            x: point.offsetLeft + point.offsetWidth,
            y: point.offsetTop + point.offsetHeight / 2 + 70
        };
    }

    // showModules() {
    //     this.toggleModule = !this.toggleModule;
    // }


    // existModuleId(id) {
    //     let ids = this.selectModuleIds
    //     if (ids && ids.length > 0) {
    //         for (let i = 0; i < ids.length; i++) {
    //             if (ids[i] == id) return true;
    //         }
    //     }
    //     return false;
    // }

    /**
     * 选择去重
     * @param id
     * @returns {boolean}
     */
    // existModuleById(id) {
    //     let modules = this.selectModules;
    //     if (modules && modules.length > 0) {
    //         for (let module of modules) {
    //             if (module.id == id) return true;
    //         }
    //     }
    // }
    //
    // findModuleById(id) {
    //     let index = 0;
    //     return index;
    // }


    /**
     * 取消
     */
    cancel() {
        this.resetData();
        this.modal.dismiss();
    }

    /**
     * 提交数据
     */
    send(e) {
        e.stopPropagation();
        e.preventDefault();
        const params = {};
        this.isConfirmLoading = true;
        if (this.selectModules && this.selectModules.length > 0) {
            params['infoIds'] = this.getOfferIds(this.selectModules);
            params['type'] = this.type;
            params['infoBranchName'] = this.infoName ? this.infoName : '';
            if (this.infoId) {
                params['infoBranchId'] = this.infoId;
            }

            if (this.aid) {
                params['pauseId'] = this.aid;
                this.itemDetail.addItemsToPause(params).then(data => {
                    this.isConfirmLoading = false;
                    this.warn.onMsgSuccess(data);
                    this.buffer.setBuffer(this.bufferName,
                        {
                            versionId: this.versionId,
                            category: this.category,
                            projectName: this.projectName
                        });
                    this.resetData();
                    this.modal.close(data);
                }).catch(err => {
                    this.warn.onMsgError(err);
                })
            } else {
                params['id'] = this.id;
                if (params['infoBranchId']) {
                    this.doAddBasicBatch(params, params['infoIds']);
                } else {
                    this.warn.onMsgWarn(Messages.ERROR_TEXT);
                }

            }

        } else {
            this.warn.onWarn(Messages.SELECT_NOT_EMPTY);
        }
    }

    doAddBasicBatch(params, ids) {
        if (ids.length <= Default.UPLOAD.MAX_DATA) {
            params['infoIds'] = ids;
            this.addBasicBatch(params)
                .then(res => {
                    this.buffer.setBuffer(this.bufferName,
                        {
                            versionId: this.versionId,
                            category: this.category,
                            projectName: this.projectName
                        });
                    this.isConfirmLoading = false;
                    this.warn.onSuccess(res['msg'] || Messages.SUCCESS.DATA);
                    this.resetData();
                    this.modal.close(res);
                }).catch(err => {
                this.warn.onMsgError(err.msg || Messages.FAIL.DATA);
            });
        } else {
            params['infoIds'] = ids.splice(0, Default.UPLOAD.MAX_DATA);
            this.addBasicBatch(params)
                .then(res => {
                    this.doAddBasicBatch(params, ids);
                })
                .catch(err => {
                    this.warn.onMsgError(err.msg || Messages.FAIL.DATA);
                });
        }

    }

    //分段执行添加任务
    addBasicBatch(params) {
        return new Promise((resolve, reject) => {
            this.request.doPost({
                url: 'addBasicQuote',
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
            });
        });

    }

    //组装ids
    getOfferIds(modules) {
        const ids = [];
        if (modules && modules.length > 0) {
            for (const module of modules) {
                ids.push(module.id);
            }
        }
        return ids;
    }

    /**
     * 提交材料清单数据
     */
    sendTo(e) {
        e.stopPropagation();
        e.preventDefault();
        this.isConfirmLoading = true;
        if (this.selectModules && this.selectModules.length > 0) {
            this.buffer.setBuffer(this.bufferName,
                {
                    versionId: this.versionId,
                    category: this.category,
                    projectName: this.projectName
                });
            this.isConfirmLoading = false;
            this.modal.close(JSON.stringify(this.selectModules));
        } else {
            this.isConfirmLoading = false;
            this.warn.onWarn(Messages.SELECT_NOT_EMPTY);
        }
    }

    /**
     * 重置数据
     */
    resetData() {
        this.selectModuleIds = [];
        this.selectModules = [];
        this.pageNo = Default.PAGE.PAGE_NO;
        this.projectName = null;
        this.category = null;
        this.preventRepeatLoad = true;
        this.clickSelectAll = false;
    }

    /**
     * 全选
     */
    selectModuleAll(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.clickSelectAll = !this.clickSelectAll;
        //新版本
        if (this.dataVersion) {
            let params = {
                pageNo: Default.PAGE.PAGE_NO,
                pageSize: this.total ? this.total : Default.PAGE.PAGE_SIZE,

            };
            if (this.type === Default.OFFER_ITEM.ITEM_5) {
                if (this.category && this.category["categoryName"]) {
                    params["category"] = this.category["categoryName"];
                }
                if (this.projectName && this.projectName.trim()) {
                    params["name"] = this.projectName.trim();
                }
            } else {
                if (this.category && this.category["categoryName"]) {
                    params["category"] = this.category.categoryName;
                }
                if (this.projectName && this.projectName.trim()) {
                    params["projectName"] = this.projectName.trim();
                }
                //表明已添加过的数据
                params["type"] = 1;
                //默认未删除的数据
                params["state"] = 1;
                if (this.versionId) {
                    params["id"] = this.versionId;
                }
            }
            if (this.storeData && this.total != this.storeData.length) {
                if (this.preventRepeatLoad) {
                    this.clickSelectAll = true;
                    this.loadModuleAll2(params);
                }
            } else {
                if (this.preventRepeatLoad && this.clickSelectAll) {
                    this.clickSelectAll = true;
                    this.loadModuleAll2(params);
                } else {
                    if (this.clickSelectAll) {
                        this.moduleAll(this.storeData);
                    } else {
                        this.moduleRemoveAll(this.storeData);
                    }
                }
            }

        }
        else {
            let params = {
                pageNo: Default.PAGE.PAGE_NO,
                pageSize: this.total ? this.total : Default.PAGE.PAGE_SIZE,
                category: this.category,
                projectName: this.projectName,
                companyId: this.user.getCompanyId(),
                versionType: this.getSelectType()
            };

            if (this.versionId) {
                params['versionId'] = this.versionId;
            }

            if (this.storeData && this.total != this.storeData.length) {
                if (this.preventRepeatLoad) {
                    this.clickSelectAll = true;
                    this.loadModuleAll(params);
                }
            } else {
                if (this.preventRepeatLoad && this.clickSelectAll) {
                    this.clickSelectAll = true;
                    this.loadModuleAll(params);
                } else {
                    if (this.clickSelectAll) {
                        this.moduleAll(this.storeData);
                    } else {
                        this.moduleRemoveAll(this.storeData);
                    }
                }
            }
        }
    }


    //老版本选中全部
    loadModuleAll(params) {
        this.loading = true;
        this.preventRepeatLoad = false;
        this.itemCart.getQuoteModules(params).then(data => {
            this.loading = false;
            this.moduleAll(data.pageSet)
            this.storeData = data.pageSet;
        }).catch(err => {
            this.loading = false;
            this.warn.onMsgError(err);
        })
    }

    //新版本选中全部
    loadModuleAll2(params) {
        this.loading = true;
        this.preventRepeatLoad = false;
        if (this.type === Default.OFFER_ITEM.ITEM_5) {
            this.itemCart.getMaterialDetail(params).then(data => {
                this.loading = false;
                this.storeData = this.renderData2(data);
                this.moduleAll(this.storeData);
            }).catch(err => {
                this.loading = false;
                this.warn.onMsgError(err);
            })
        }
        else {
            this.itemCart.getQuoteDetail(params).then(data => {
                this.loading = false;
                this.storeData = this.renderData2(data);
                this.moduleAll(this.storeData);
            }).catch(err => {
                this.loading = false;
                this.warn.onMsgError(err);
            });
        }
    }

    //重新给数据数量赋值
    moduleAll(data) {
        console.log(data);
        if (data && data.length > 0) {
            for (const d of data) {
                d['num'] = 1;
                this.selectModules.push(d);
            }
        }
    }

    //删除全部选择的全部数据
    moduleRemoveAll(data) {
        const that = this;
        if (data && data.length > 0) {
            let dl = data.length,
                sl = that.selectModules.length,
                flag = true; //记录删除一次

            for (let i = 0; i < dl; i++) {
                flag = true;
                for (let j = 0; j < sl; j++) {
                    if (that.selectModules[j].id === data[i].id && flag) {
                        that.selectModules.splice(j, 1, '');
                        flag = false;
                    }
                }
            }
            that.selectModules = that.sortModuleAll(that.selectModules);
        }

    }

    sortModuleAll(data) {
        const arr = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    arr.push(data[i]);
                }
            }
        }
        return arr;
    }


    changeCategory(cate: any) {
        this.category = cate;
        this.searchData();
    }


    // getName() {
    //     let that = this, name = '';
    //     if (that.configBase) {
    //         if (that.configBase && that.configBase.length > 0) {
    //             for (const tc of that.configBase) {
    //                 if (that.versionId && !name) {
    //                     if (tc.versions && tc.versions.length > 0) {
    //                         for (const option of tc.versions) {
    //                             if (option.versionId === Number(that.versionId)) {
    //                                 name = option.name;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return name ? name : '版本名称';
    // }

    /**
     * 拉取对应的装修类型
     * @returns {number}
     */
    getSelectType() {
        return getVersionType(this.type);
    }


    /**
     * 根据对应的版本id获取相应的版本名称
     * @param id 版本id
     * @returns {null}
     */
    getVersionName(id) {
        if (id && this.changeOptions && this.changeOptions.length > 0) {
            const v = this.changeOptions.filter(item => item.versionId === id);
            return v && v.length == 1 ? v[0].name : null;
        }
        return null;

    }

    /**
     * 交互下拉选出
     * @param e
     */
    toggleClick(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.toggle = !this.toggle;
        this.toggleType = this.toggle ? 'up' : 'down';
    }

    exist(id): boolean {
        if (this.selectModules && this.selectModules.length) {
            const m = this.selectModules.filter(m => m.id === id);
            return m && m.length > 0;
        }
        return false;
    }

    /**
     * 手动删除添加项
     * @param e
     * @param {number} id
     */
    manualRemoveModlue(e: any, id: number) {
        e.stopPropagation();
        e.preventDefault();

        if (this.selectModules && this.selectModules.length > 0) {
            let index = 0;
            this.selectModules.map((s, i) => {
                if (s.id === id) {
                    index = i;
                }
            });
            // console.log(index);
            this.removeModule(e, index);
        }

    }

    /**
     * 添加此细项的数量
     * @param {number} id
     * @returns {any}
     */
    moduleSize(id: number) {
        if (this.selectModules && this.selectModules.length > 0) {
            const size = this.selectModules.filter(m => m.id === id);
            if (size && size.length > 0) {
                return size.length;
            }
            return 0;
        }
        return 0;
    }

    subItem(name,num){
        return subItemName(name,num);
    }

    ngOnDestroy() {
        this.resetData();
        this.configBase = null;
    }
}
