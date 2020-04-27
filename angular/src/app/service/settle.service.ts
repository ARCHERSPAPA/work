import { Injectable } from '@angular/core';
import { RequestService } from "./request.service";
import { WarningService } from "./warning.service";
import { Messages } from "../model/msg";

@Injectable({
    providedIn: 'root'
})
export class SettleService {

    private settleData: any;
    private settleChange = {
        head: false
    };

    constructor(private req: RequestService,
        private warn: WarningService) {
    }

    loadSettleHead(aid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "headLabourExpenses",
                data: { id: aid },
                success: (res => {
                    if (res && res.code == 200) {
                        // this.settle = res.data;
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        })

    }
    newLoadCaseHead(id, type) {
        // console.log(id)
        return new Promise((resolve, reject) => {
            var param = {};
            if (type === 1) {
              
                param['id'] = id;
            } else {
                param['quoteId'] = id;
                // console.log(param)
            }
            this.req.doPost({
                url: "newSmallProgramDetails",
                data: param,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                        // this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        })
    }
    loadCaseHead(quoteNo): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "smallProgramDetails",
                data: { quoteNo: quoteNo },
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                        // this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        })

    }

    // getSettle() {
    //     return this.settle;
    // }
    //
    // setSettle(settle) {
    //     this.settle = settle;
    // }

    /**
     * 获取打卡时间区间
     * @param cid
     */
    loadAttendRange(cid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "workAttendanceRange",
                data: {
                    quoteId: cid
                },
                success: (res => {
                    // console.log(res);
                    if (res && res.code == 200) {
                        // this.rangeTime = res.data;
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })
    }


    // getRangeTime() {
    //     return this.rangeTime;
    // }
    //
    // setRangeTime(rangeTime) {
    //     this.rangeTime = rangeTime;
    // }

    /**
     * 加载工人数据
     * @param cid
     * @returns {Promise<any>}
     */
    loadAttendWorkers(cid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.req.doPost({
                url: "loadAttendanceWorkers",
                data: { id: cid },
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


    // getWorkers(){
    //     return this.workers;
    // }
    //
    // setWorkers(workers){
    //     this.workers = workers;
    // }
    //
    // ngOnDestroy() {
    //     this.settle = null;
    //     this.rangeTime = null;
    //     this.workers = null;
    // }

    setSettleData(data) {
        this.settleData = data;
    }

    setCaseData(data) {
        this.settleData = data;
    }

    getCaseData() {
        return this.settleData;
    }
    getSettleData() {
        return this.settleData;
    }

    setTypeByParam(type: string, bool: boolean) {
        this.settleChange[type] = bool;
    }

    getTypeByParam(type: string) {
        return this.settleChange[type];
    }
}
