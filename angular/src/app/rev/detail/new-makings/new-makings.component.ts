import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../model/msg';
import { RequestService } from '../../../service/request.service';
import { QuoteService } from '../../../service/quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { WarningService } from '../../../service/warning.service';
import { Default, OFFER_DEFAULT_DATA } from '../../../model/constant';
import {
    btoa,
    changeToDecimal,
    equalToSame,
    showLockByState,
    showMakeBtnByState,
    toInteger
} from '../../../model/methods';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemBasicComponent } from '../../../plugins/item-basic/item-basic.component';
import { ItemPackComponent } from '../../../plugins/item-pack/item-pack.component';
import { HeaderService } from '../../../service/header.service';
import * as UserValidate from '../../../validate/user-validate';
import { findColorReset, renderColors } from '../../../model/budget-method';
import { MasterPackService } from '../../master/master-pack-detail/master-pack.service';

@Component({
    selector: 'rev-new-makings',
    templateUrl: './new-makings.component.html',
    styleUrls: ['./../detail.scss', './new-makings.component.scss'],
})
export class NewMakingsComponent implements OnInit {
    public cid: string;

    public baseQuote: any;
    public designers: any;

    //主材(数据)
    // public materials: any;

    //初始化时显示
    public material: any = { infoMaps: null };
    public loading = false;

    public materialName: string = Default.NAME.MATERIALS;

    public remarks: string;

    public state: number = Default.STATE.ITEM_1;

    //材料清单的相关提交信息
    public materialInfo: any;

    public showBtnTextByState = false;

    //备注信息相关
    public markForm: FormGroup;
    public markVisible = false;
    public markItem: any;
    //备注信息
    public markInfo;
    public isNewQuote;
    //套餐的弹窗信息
    public comboNum;
    public numVisible = false;
    // public markInfo: string;
    // public markIndex: number = -1;
    // public markObj: any;

    //添加/修改大项
    public branchForm: FormGroup;
    public branchVisible = false;
    public branchTitle: string;
    public branchInfo: string;
    //是否修改大项信息
    public branchEdit = false;
    //当前大项id
    public branchId: number;

    //实现拖拽
    public drag = false;
    public moveMenus: any;

    //记数器（id专用）
    public countId = 1000;

    public pageSize: number = 5;
    public pageIndexs: any;
    // 选择模板名
    // public templateName = '选择模板';
    // 选择模板
    public selectAllTemplate: Array<any> = [];
    // 选中的模板索引
    // public selectIndex = -1;


    constructor(private request: RequestService,
        private quote: QuoteService,
        private header: HeaderService,
        private modalService: NgbModal,
        private masterPack: MasterPackService,
        private activatedRoute: ActivatedRoute,
        private warn: WarningService,
        private user: UserService,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.state = parseInt(this.activatedRoute.snapshot.paramMap.get('state'));
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
            }
        });


        this.markForm = this.fb.group({
            markInfo: [this.markInfo, [
                Validators.maxLength(500)
            ]],
            comboNum: [this.comboNum, [
            ]]
        });

        this.branchForm = this.fb.group({
            branchInfo: [this.branchInfo, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                UserValidate.ValidateAccount
            ]]
        });
        //读取模板信息
        // this.loadTemplate();
        //获取固定大项

        this.getMaterialList()
        // this.dragItem("dragInfo");
        this.quote.loadSubmitInfo(this.cid)
    }


    renderversionDetail(version) {
        if (version) {
            return version.split(',').join('、');
        }
    }




    setDefaultMake() {
        let mat;
        const data = OFFER_DEFAULT_DATA.filter(d => {
            return d.type === Default.OFFER_ITEM.ITEM_5;
        });
        if (data && data.length > 0) {
            mat = data[0];
            mat.infoMaps = [];
            mat['expand'] = false;
        }
        return mat;
    }
    getEX(e) {
        return e.expand
    }

    //新材料清单的数据回显
    getMaterialList() {
        return new Promise((resolve, reject) => {
            this.request.doPost({
                url: 'materialDetailList',
                data: {
                    id: this.cid
                },
                success: res => {
                    if (res && res.code == 200) {
                        this.material.infoMaps = res.data
                        this.material.infoMaps.forEach((v, index) => {
                            if (v['infos'] && v['infos'].length > 0) {
                                v['expand'] = true;
                                v['pageNo'] = 1;
                                v['separable'] = v['splitPlan'];
                                v['rows'] = v['infos'].length;
                                v['infos'].forEach(item => {
                                    item['number'] = item['num'];
                                    item['id'] = item['materialId'];
                                    item['offerExplain'] = item['explainMsg'];
                                });
                            }
                            // this.dragItem('dragInfo' + index, index);
                        });
                        resolve(res.data)
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        })
    }

    /**
     * 初始化加载数据信息
     * @param cid 报价id
     * @param type 类型5：表示材料清单
     */
    // loadMaking(cid) {
    //     if (cid) {
    //         this.loading = true;
    //         this.quote.loadData(cid, Default.OFFER_ITEM.ITEM_5)
    //             .then(res => {
    //                 this.loading = false;
    //                 /* this.templateName = "自定义";
    //                 this.selectIndex = -1; */
    //                 this.material = this.renderMaking(res);
    //                 this.resetPageIndex();
    //                 if (res.length === 0) {
    //                     setTimeout(() => {
    //                         this.findTemplateData(this.selectAllTemplate[0].id)
    //                     }, 500)
    //                 }
    //             }).catch(err => {
    //                 this.warn.onMsgError(err);
    //             });
    //     }
    // }

    /**
     * 初始化数据渲染
     * @param data
     * @returns {any}
     */



    ngAfterContentChecked() {
        const that = this;
        that.materialName = Default.NAME.MATERIALS;
        if (that.quote.getSubmitInfo()) {
            this.materialInfo = this.quote.getSubmitInfo();
            that.showBtnTextByState = that.materialInfo.submitedMaterial;
            if (that.showBtnTextByState) {
                that.materialName = that.materialName + '  ' + (that.materialInfo.customConfirmMaterial ? '客户已确认' : '客户尚未确认');
            }
        }
        if (that.header && that.header.getHeaderInfo() && this.header.getHeadBool()) {
            that.header.setHeadBool(false);
            that.baseQuote = that.header.getHeaderInfo()['quoteBase'];
            that.designers = that.header.getHeaderInfo()['designers'];
            that.isNewQuote = that.baseQuote.dataVersion;
        }

    }

    /**
     * 根据下标删除小项
     * @param index
     */
    // deleteItem(index) {
    //     this.materials = this.materials.filter((m, i) => {
    //         return i !== index;
    //     });
    // }

    /**
     * 复制小项(测试专用)
     * @param data
     */
    // copyTestItem(data: any, index: number) {
    //     this.materials.splice(index, 0, data);
    //     this.materials = this.copy(this.materials);
    // }

    /**
     * 本地复制大小项目
     * @param e
     * @param data 当前项目所有信息
     * @param {number} type 1：细项，2：大项
     * @param args
     */
    copyItem(e: any, data: any, type: number, i, index) {
        e.stopPropagation();
        e.preventDefault();
        if (type === 1) {
            const infos = this.material.infoMaps[index].infos;

            infos.splice(i, 0, data);


            this.material.infoMaps[index].infos = JSON.parse(JSON.stringify(infos))
        } else {
            if (data.name) {
                this.copyBranch(data);
            }
        }

    }

    /**
     * 实现深拷贝
     * @param arr
     * @returns {any[] | {}}
     */
    copy(arr): Array<any> {
        const obj = [];
        for (const i in arr) {
            if (typeof arr[i] === 'object' && arr[i] != undefined) {
                obj[i] = this.copy(arr[i]);
            } else {
                obj[i] = arr[i];
            }
        }
        return obj;
    }

    /**
     * 复制当前的项目
     * @param cd 当前项目信息
     */
    copyBranch(cd: any) {
        if (this.material && this.material.infoMaps && this.material.infoMaps.length > 0) {
            const infos = this.material.infoMaps.filter(map => map.id === cd.id);
            const index = this.material.infoMaps.findIndex(map => map.id === cd.id);
            const copyInfos = { id: this.getRenderId('c'), name: cd.name, infos: infos[0].infos };
            if (index === this.material.infoMaps.length - 1) {
                this.material.infoMaps.push(copyInfos);
            } else {
                this.material.infoMaps.splice(index + 1, 0, copyInfos);
            }
        }

        // this.material = this.copy(this.material);
        this.material = JSON.parse(JSON.stringify(this.material));

    }
    dep(data) {
        return JSON.parse(JSON.stringify(data))
    }

    //判断是不是套餐
    checkCombo(name) {
        return name == '套餐' ? true : false;
    }
    /**
     * 实现formula and num变换
     * @param e
     * @param data 当前变量
     */
    changeValue(e: any, data: any) {
        data.num = e.num;
        data.formula = e.formula;
        console.log(this.material)
    }

    /**
     * 分页时变化
     * @param index 当前页码
     * @param i 大项的具体数值（具体那个大项信息）
     */
    pageIndexChange(index, i) {
        // console.log(index);
        this.pageIndexs[i] = index;
    }

    /**
     * 删除细项
     * @param {number} i
     * @param {number} t
     */
    delItem(i: number, t: number) {
        console.log(this.material.infoMaps, i, t)
        this.material.infoMaps[t].infos.splice(i, 1);
        this.material.infoMaps[t].infos = this.material.infoMaps[t].infos.concat();
    }
    delCombo(t) {
        this.material.infoMaps.splice(t, 1)
    }

    computedBranchInfos(branch) {
        return branch.infos.slice((branch.pageNo - 1) * this.pageSize, branch.pageNo * this.pageSize);
    }
    /**
     * 备注信息
     * @param data
     */
    remarkItem(data: any) {
        this.markVisible = true;
        this.markItem = data;
        this.markInfo = data.remark;
    }
    editRemark(data) {
        this.markVisible = true;
        this.markItem = data.infos;
        if (data.separable == 1) {
            this.markInfo = data['infos'][0].remark;
        } else {
            this.markInfo = data['infos'][0].planRemark;
        }
    }
    markOk() {
        if (this.markItem.length > 0) {
            this.markItem.forEach(v => {

                v['planRemark'] = this.markInfo;
            });
        } else {
            if (this.markForm.valid) {
                this.markItem.remark = this.markInfo;
            }
        }
        this.markCancel();
    }
    numOk() {
        this.markItem.forEach(v => {
            v['planNum'] = this.comboNum;
        });
        this.numCancel();
    }
    editNum(data) {
        this.numVisible = true;
        this.markItem = data.infos;
        this.comboNum = data['infos'][0].planNum;
    }
    markCancel() {
        this.markForm.reset();
        this.markVisible = false;
    }
    numCancel() {
        this.numVisible = false;
        this.comboNum = ''
    }
    /**
     * 保存材料清单
     * @param e
     */
    saveMaterial(e: any) {
        e.stopPropagation();
        e.preventDefault();
        const map = this.getParamsByList(this.material);
        this.material.infoMaps.map(v => {
            if (v['separable'] == 1) {
                v.infos.map(item => {
                    map.split.push({
                        planId: v.planId,
                        num: item.num,
                        remark: item.remark,
                        detailId: item.id
                    })
                })
            }
        })
        if (this.justMaterial(this.material)) {
            if (this.cid) {
                this.request.doPost({
                    url: 'materialDetailSubmit',
                    data: {
                        quoteId: this.cid,
                        materialForms: map.detail,
                        planForms: map.plan,
                        splitPlanForms: map.split
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                            this.quote.loadSubmitInfo(this.cid);
                        } else {
                            this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });
            }
        } else {
            this.warn.onMsgError("至少在一个大项中添加细项");
        }
    }

    /**
     * 判断material是否有数据
     */
    justMaterial(material: any) {
        let bool = false;
        if (material && material.infoMaps && material.infoMaps.length > 0) {
            material.infoMaps.forEach(map => {
                if (map && map.infos && map.infos.length > 0) {
                    bool = true;
                    return;
                }
            });
        } else if (material && material.infoMaps.length == 0) {
            bool = true;
            return bool;
        }
        return bool;
    }

    /**
     * 整理提交数据
     * @param material
     * @returns {any[]}
     */
    getParamsByList(material) {
        const mp = { detail: [], plan: [], split: [] };
        if (material && material.infoMaps.length > 0) {
            material.infoMaps.forEach(map => {
                if (map && map.infos && map.infos.length > 0) {
                    const ts = [];
                    if (map.planId && map.separable == 0) { //套装数据的添加
                        mp.plan.push({
                            planId: map.infos[0].planId,
                            num: map.infos[0].planNum,
                            remark: map.infos[0].planRemark ? map.infos[0].planRemark : '',
                        })
                    }
                    else if (!map.planId) {
                        map.infos.map(info => {
                            mp.detail.push({
                                detailid: info.materialId,
                                num: info.num,
                                remark: info.remark ? info.remark : '',

                            });
                        });
                    }

                    // mp.push( ts );
                } else {
                    // mp.push( [] );
                }
            });
        }

        return mp;
    }

    //显示每栏的提示按钮
    showBtnByState() {
        return showMakeBtnByState(this.baseQuote) && showLockByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }


    /**
     * 重构项目渲染字段名称
     * @param infos
     * @returns {any}
     */
    changeMaterialById(infos) {
        if (infos && infos.length > 0) {
            for (const info of infos) {
                info['projectName'] = info['name'];
                info['modelNum'] = info['model'];
                info['id'] = info['infoId'];
            }
        }
        return infos;
    }




    /**
     * 回调选择细项
     * @param {number} bid
     */
    bubbleModalByBranch(bid: string) {
        const that = this;
        const branch = that.modalService.open(ItemBasicComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
            size: 'lg'
        });
        branch.componentInstance.type = 2;
        branch.componentInstance.dataVersion = 1;
        branch.componentInstance.sourceInfo = Default.SOURCE.BUDGET;
        // branch.componentInstance.multiple ='singel';
        branch.componentInstance.id = that.cid;
        branch.componentInstance.infoName = that.branchInfo;
        branch.componentInstance.title = Default.NAME.MATERIALS;

        that.branchCancel();
        branch.result.then((res) => {
            if (res && res.length > 0) {
                this.addMaterialInfos(res);
            }
        },
            (rea) => {
                console.log(rea);
            });
    }
    addCombo(data) {
        let lock = false;
        if (data && data.length > 0) {
            data.forEach(v => {
                v['details'].forEach(combo => {
                    combo['num']=combo['number']
                });
                this.material.infoMaps.forEach(item => {
                    if (item['planId'] == v['id']) {
                        if (v['separable'] == 1) {
                            item.infos = this.masterPack.computedPackNumByGroup(item.infos.concat(v.details), 'id', true)
                        }
                        item.infos[0].planNum = Number(v['number']) + Number(item.infos[0].planNum)
                        lock = true;
                    }
                });

                if (!lock) {
                    v['details'][0]['planNum'] = v['number']
                    v['details'][0]['supplierName'] = v['supplierName']
                    v['details'][0]['planExplainMsg'] = v['remark']
                    v['details'][0]['planId'] = v['id']
                    v['details'][0]['versionDetail'] = v['comboName']
                    v['details'][0]['planName'] = v['name']
                    v['details'][0]['planUnit'] = v['unit']
                    this.material.infoMaps.push({ categoryName: '套餐', separable: v['separable'], pageNo: 1, planId: v['id'], infos: v['details'] })
                }

            });
        }
    }
    pageChange(e: any, branch: any) {
        branch["pageNo"] = e;
        this.computedData(this.material);
    }
    computeWastage(num, unit, ratio) {
        return ((Math.pow(10, 2) * (num ? num : 0)) * (Math.pow(10, 2) * (unit ? unit : 0)) * ratio / Math.pow(10, 6)).toFixed(2)
    }

    computedData(data) {
        if (data.infoMaps && data.infoMaps.length > 0) {
            let itemNum = 0, start = 0, end = 0;
            for (let j = 0; j < data.infoMaps.length; j++) {
                start = (data.infoMaps[j].pageNo - 1) * this.pageSize;
                end = (data.infoMaps[j].pageNo) * this.pageSize;
                itemNum += data.infoMaps[j].infos.slice(start, end).length + 2;
                data.infoMaps[j]["cols"] = data.infoMaps[j].infos.length > 0 ? data.infoMaps[j].infos.slice(start, end).length : 1;
            }
        }
        return data;
    }

    bubbleModalByCombo() {
        const that = this;
        const conmbo = that.modalService.open(ItemPackComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static',
            size: 'lg'
        });

        that.branchCancel();
        conmbo.result.then((res) => {
            console.log(res)
            let [separableData, notseparableData] = [[], []]
            if (res) {
                res.forEach(data => {
                    data.number = 1;
                    if (data['separable'] == 1) {
                        separableData.push(data)
                    } else {
                        notseparableData.push(data)
                    }
                });
            }
            
            this.addCombo(this.masterPack.computedPackNumByGroup(notseparableData, 'id'))
            separableData.forEach(item => {
                item.details.forEach(v => {
                    v['num'] = 1;
                   v['offerExplain'] =v['remark'];
                   v['remark'] = '';
                })
            });
            this.addCombo(this.masterPack.computedPackComboByGroup(separableData, 'id'))
        },
            (rea) => {
                console.log(rea);
            });
    }

    /**
     * 添加细项到对应的大项中去
     * @param {number} bid
     * @param {Array<any>} infos
     */
    addMaterialInfos(infos: any) {
        infos.forEach(v => {
            v['materialId'] = v['id'];  //参数统一
            v['num'] = 1;
            v['pageNo'] = 1;
            v['offerExplain'] = v['remark'];
            v['remark'] = '';
            if (this.material.infoMaps && this.material.infoMaps.length > 0) {
                //判断是否同类别
                const infoMap = this.material.infoMaps.filter(map => map.categoryName == v.category
                );
                if (infoMap && infoMap.length === 1) {
                    infoMap[0]['expand'] = true;
                    const infoArray = v;
                    if (infoArray && infoArray.length > 0) {
                        infoArray.forEach(info => {
                            info['model'] = info['modelNum'];
                        });
                    }
                    if (infoMap[0]['infos'] && infoMap[0]['infos'].length > 0) {
                        infoMap[0]['infos'] = infoMap[0]['infos'].concat(infoArray);
                    } else {
                        infoMap[0]['infos'] = Array.of(infoArray);
                    }
                } else {
                    this.addNewMaterial(v);//不匹配时
                }
            } else {
                this.addNewMaterial(v); //一项都没时
            }
        });
    }
    //大项为空的时候添加
    addNewMaterial(v) {
        this.material.infoMaps.push({
            categoryName: v.category,
            expand: true,
            planId: null,
            pageNo: 1,
            infos: Array.of(v)
        })
        // this.resetPageIndex();
        this.computedData(this.material);
    }
    /**
     * 添加大项 取消
     */
    branchCancel() {
        this.branchVisible = false;
        this.branchInfo = null;
        this.branchEdit = false;
        this.branchId = null;
        this.branchTitle = '';
        this.branchForm.reset();
    }

    /**
     * 总计部分(分支计算)
     * @param source
     * @param type
     * @returns {number}
     */
    getTotal(source, type) {
        let total = 0;
        if (source && source.length > 0) {
            for (const s of source) {
                total += this.converseToDecimal(s[type] ? s[type] : 0, s['num'] ? s['num'] : 0);
            }
        }
        return total;
    }

    /**
     * 转换成小数
     * @param unit
     * @param num
     * @returns {any}
     */
    converseToDecimal(unit, num) {
        const result = this.changeToInt(unit, 2) * this.changeToInt(num, 2) / Math.pow(10, 4);
        return changeToDecimal(result);
    }

    /**
     * 将小数转化成正数
     * @param num
     * @param curve
     * @returns {number | any}
     */
    changeToInt(num, curve) {
        return toInteger(num, curve);
    }

    /**
     * 重置当前颜色组
     * @param {string} colours
     * @returns {Array<string>}
     */
    renderColors(colours: string): Array<string> {
        return renderColors(colours);
    }

    /**
     * 区别生成还是复制 id
     * @param {string} diff s：新建，r：已存在结果，c：复制
     * @returns {number}
     */
    getRenderId(diff: string) {
        this.countId += 2;
        return diff + this.countId;
    }
    /**
     * 加密url
     * @param {string} id m
     * @returns {any}
     */
    btoa(id: string) {
        return btoa(id);
    }


    ngOnDestroy() {
        //防止重复使用备注信息
        this.material = null;
        this.quote.setSubmitInfo(null);
    }


    //2.3.2
    /**
    * 相关操作上移下移等
    * @param data 列表数据
    * @param index 
    */
    moveItemUp(data, index) {
        [data.infos[index - 1], data.infos[index]] = [data.infos[index], data.infos[index - 1]];
    }

    moveItemDown(data, index) {
        [data.infos[index + 1], data.infos[index]] = [data.infos[index], data.infos[index + 1]];
    }
    moveItemTop(data, index) {
        [data.infos[0], data.infos[index]] = [data.infos[index], data.infos[0]];
    }
    showUp(data, index) {
        if (data.infos && data.infos.length > 0 && index > 0) {
            return true;
        } else {
            return false;
        }

    }
    showDown(data, index) {
        if (data.infos && data.infos.length > 1 && index != data.infos.length - 1) {
            return true;
        } else {
            return false;
        }
    }
    showTop(data, index) {
        if (data.infos && data.infos.length > 0 && index != 0) {
            return true;
        } else {
            return false;
        }
    }

}
