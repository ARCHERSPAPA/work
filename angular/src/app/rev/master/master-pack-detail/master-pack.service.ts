import { Injectable } from '@angular/core';
import { RequestService } from "../../../service/request.service";
import { Messages } from "../../../model/msg";
import { equalZero } from "../../../model/methods";

@Injectable({
    providedIn: 'root'
})
export class MasterPackService {

    constructor(private req: RequestService) {
    }


    /**
     * 拉取套餐管理的数据列表
     * @param pramas
     * @returns {Promise<any>}
     */
    getPackList(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialList",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 新建或者编辑套餐
     * @param params
     * @returns {Promise<any>}
     */
    savePack(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialSave",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve([res.msg || Messages.SUCCESS.DATA, res.data]);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 提交套餐审核
     * @param {Array<any>} ids 需要审核时的id的数组
     * @returns {Promise<any>}
     */
    submitPacks(ids: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialSubmit",
                data: { ids: ids },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        if (res && res.code == 120) {
                            reject(res.msg || Messages.PACK_EMPTY_ITEM);
                        } else {
                            reject(res.msg || Messages.FAIL.DATA);
                        }
                    }
                })
            })
        })
    }

    /**
     * 删除套餐
     * @param {Array<any>} ids 需要删除套餐的id数组
     * @returns {Promise<any>}
     */
    deletePacks(ids: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialDelete",
                data: { ids: ids },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 撤回套餐
     * @param {Array<any>} ids
     * @returns {Promise<any>}
     */
    recallPacks(ids: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialRecall",
                data: { ids: ids },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 上下架套餐
     * @param {Array<any>} ids 需要上下架的套餐id
     * @param {number} putaway 未上架为0，上架为1
     * @returns {Promise<any>}
     */
    shelfPacks(ids: Array<any>, putaway: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packMaterialShelves",
                data: { ids: ids, putaway: putaway },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 拉取套餐的材料详情
     * @param params
     * @returns {Promise<any>}
     */
    getMaterialList(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packDetailMaterialsList",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 添加材料
     * @param {Array<any>} mids 材料id的集合
     * @param {number} pid 当前套餐id
     * @returns {Promise<any>}
     */
    addMaterials(pid: number, mids: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packDetailMaterialsAdd",
                data: { planId: pid, materialList: mids },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve([res.data, res.msg || Messages.SUCCESS.DATA]);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 删除材料
     * @param {Array<any>} mids
     * @param {number} pid
     * @returns {Promise<any>}
     */
    delMaterials(pid: number, mids: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "packDetailMaterialsDel",
                data: { planId: pid, materialIds: mids },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve([res.data, res.msg || Messages.SUCCESS.DATA]);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }

    /**
     * 合并单元格计算式
     * @param data
     * @returns {any}
     */
    renderPacks(data: any, plus: number = 1) {
        if (data && data.length > 0) {
            data.forEach(d => {
                if (d.details && d.details.length > 0) {
                    d["rows"] = d.details.length;
                    d["rows"] += plus ? plus : 0;

                } else {
                    d["rows"] = 1;
                    d["rows"] += plus ? plus : 0;
                }
            })
        }
        return data;
    }

    // 套餐颜色
    renderColors(data: any) {
        let colors = ['#DCDCDC', '#FFFAF0', '#FFFACD', '#F0FFF0', '#ADD8E6']
        if (data && data.length > 0) {
            let idx = 0;
            data.forEach(d => {
                if (idx >= colors.length) {
                    idx = 0;
                }
                d["color"] = colors[idx];
                idx++;
            })
        }
        return data;
    }

    /**
     * 修改材料数量 v2.3.3 (就此作废)
     * @param {Array<any>} mids
     * @param {number} pid
     * @param {number} number
     * @returns {Promise<any>}
     */
    // addAmountMaterials(pid: number, amount: number, mids: Array<any>): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.req.doPost({
    //             url: "packDetailMaterialsNumber",
    //             data: { planId: pid, materialIds: mids, number: amount },
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     resolve(res);
    //                 } else {
    //                     reject(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     })
    // }

    /**
     * 根据key值对当前数据进行分组管理(不可拆分按原有套餐处理)
     * @param data
     * @param {string} key
     * @returns {any[]}
     */
    computedPackNumByGroup(data: any, key: string, type = false) {
        const packs = [];
        if (data && data.length > 0) {
            const groups = {};
            data.forEach(d => {
                if (groups[d[key]]) {
                    groups[d[key]]['number'] += 1;
                } else {
                    groups[d[key]] = { number: type?Number(d.number):1, source: d };
                }
            })

            Object.keys(groups).map(g => {
                groups[g]["source"]['number'] = groups[g]['number'];
                packs.push(groups[g]["source"]);
            })
        }
        return packs;
    }
    // computedMatNumByGroup(data: any, key: string, type = false) {
    //     const packs = [];
    //     if (data && data.length > 0) {
    //         const groups = {};
    //         data.forEach(d => {
    //             console.log(groups[d[key]])
    //             if (groups[d[key]]) {
    //                 groups[d[key]]['number'] += 1;
    //             } else {
    //                 groups[d[key]] = { number: d.number ? d.number : 1, source: d };
    //             }
    //         })
    //         console.log(groups);
    //         Object.keys(groups).map(g => {
    //             groups[g]["source"]['number'] = groups[g]['number'];
    //             packs.push(groups[g]["source"]);
    //         })
    //     }
    //     return packs;
    // }
    computedPackComboByGroup(data: any, key: string) {
        const packs = [];
        if (data && data.length > 0) {
            const groups = {};
            data.forEach(d => {
                if (groups[d[key]]) {
                    groups[d[key]]['source']['details'] = groups[d[key]]['source']['details'].concat(d['details'])
                } else {
                    groups[d[key]] = { source: d };
                }
            })
            Object.keys(groups).map(g => {
                groups[g]["source"]['details'] = this.computedPackNumByGroup(groups[g]["source"]['details'], 'id')
                packs.push(groups[g]["source"]);
            })
        }
        return packs;
    }

    /**
     * 重构套餐中可拆分数据
     * @param data
     * @param {string} key
     * @returns {any[]}
     */
    computedPackNumByGroup2(data: any, key: string) {
        const packs = [];
        if (data && data.length > 0) {
            const groups = {};
            data.forEach(d => {
                if (groups[d[key]]) {
                    let source = groups[d[key]]["source"];
                    if (source && source["details"]) {
                        let index = source["details"].findIndex(s => s.id === d["details"][0].id);
                        if (index > -1) {
                            source["details"][index]["number"] += 1;
                        } else {
                            //全部数据置为1
                            if (d && d["details"] && d["details"].length === 1) {
                                d["details"][0]["number"] = 1;
                            }
                            source["details"].push(d["details"][0]);
                        }
                    }
                } else {
                    //全部数据置为1
                    if (d && d["details"] && d["details"].length === 1) {
                        d["details"][0]["number"] = 1;
                    }
                    groups[d[key]] = { source: d };
                }
            })

            Object.keys(groups).map(g => {
                packs.push(groups[g]["source"]);
            })
        }
        return packs;
    }
    /**
     * 对于数据为0 和 空的判断
     * @param num
     * @param {string} sign
     * @returns {number | string}
     */
    equalZero(num: any, sign: string = '--') {
        return equalZero(num, sign);
    }

    /**
     * 修改材料活动价 v2.2.3 作废
     * @param {number} pid
     * @param {Array<any>} materialList
     * @returns {Promise<any>}
     */
    // activityPriceModify(pid: number, materialList: Array<any>): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.req.doPost({
    //             url: "packDetailMaterialsPrice",
    //             data: { planId: pid, materialList: materialList },
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     resolve(res);
    //                 } else {
    //                     reject(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     })
    // }

    /**
     * 更新套餐中的活动价或者数量
     * @param params
     * @returns {Promise<any>}
     */
    updatePackInMaterials(params:any):Promise<any>{
        return new Promise((resolve,reject) =>{
            this.req.doPost({
                url:"packDetailMaterialsUpdate",
                data: params,
                success:(res =>{
                    if(res && res.code == 200){
                        resolve(res);
                    }else{
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }
}