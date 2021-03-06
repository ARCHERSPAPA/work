import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from '../../model/msg';
import { DepartService } from '../../service/depart.service';
import { Default } from '../../model/constant';
import { RequestService } from '../../service/request.service';
import { WarningService } from '../../service/warning.service';
import { getComputedSize } from '../../model/methods';
// import { Array } from 'core-js';

@Component({
    selector: 'rev-item-publish',
    templateUrl: './item-publish.component.html',
    styleUrls: ['./item-publish.component.scss', './../info/info.component.scss', './../info/info-designers/info-designers.component.scss']
})
export class ItemPublishComponent implements OnInit {
    /**
     * 当前成本id
     */
    @Input() cid: string;

    public title: string;
    /**
     * 批注内容
     */
    public note: string;


    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE_BY_ITEM;
    public total: number = Default.PAGE.PAGE_TOTAL;

    public staffList: any;
    public departmentId: any;

    public designs: Array<any> = [];
    public allChecked: boolean;


    public switch = {
        note: true,
        publish: false
    };

    constructor(public modal: NgbActiveModal,
        private depart: DepartService,
        private request: RequestService,
        private warn: WarningService) {
    }

    ngOnInit() {
        this.title = '发布批注';
        this.depart.loadDepart(0, 3);
    }

    changeData() {
        const that = this;
        that.request.doPost({
            url: 'listEmployeeByPermit',
            data: {
                pageNo: that.pageNo,
                pageSize: that.pageSize,
                departmentId: that.departmentId,
                state: 0
            },
            success: (res => {
                if (res && res.code == 200) {
                    // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.staffList = res.data.pageSet;
                    that.total = res.data.total;
                    that.staffList.filter(item => {
                        item['checked'] = false;
                        if (this.designs) {
                            this.designs.forEach(item1 => {
                                if (item1.id == item.id) {
                                    item['checked'] = item1['checked'];
                                }
                            });
                        }
                        if (that.staffList.every(v => {
                            return v['checked'] == true;
                        })) {
                            this.allChecked = true;
                        } else {
                            this.allChecked = false;
                        }
                        // this.designs = new Array(that.staffList.length)
                    });
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    //回显数据
    fixed() {
        this.designs = this.designs.filter(item => {
            return item;
        });
    }

    /**
     * 交互选中的deparment id
     * @param id
     */
    selectDepart(e: any) {
        if (e.id) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.total = Default.PAGE.PAGE_TOTAL;
            this.changeData();
        }
    }

    /**
     * 选择当前的人员
     * @param design
     */
    selectDesign(design: any) {
        this.staffList.forEach((item) => {
            if (design.id === item.id) {
                if (item['checked']) {
                    if (this.designs.length == 0 || this.designs.find(v => v.id != design.id)) {
                        this.designs.push(item);
                    } else {
                        this.designs.forEach((v, i) => {
                            if (v.id == design.id) {
                                this.designs.splice(i, 1, item);
                            }
                        });
                    }
                } else {
                    this.designs.forEach((v, i) => {
                        if (v.id == design.id) {
                            this.designs.splice(i, 1, '');
                        }
                    });
                }
            }
        });
        this.fixed();
    }

    /**
     * 移除当前人员
     * @param e
     * @param {number} index
     */
    removeDesign(e: any, index: number, design) {
        e.stopPropagation();
        e.preventDefault();
        console.log(this.designs);
        this.designs.splice(index, 1);
        this.staffList.forEach((item, i) => {
            if (design.id === item['id']) {
                item['checked'] = false;
            }
        });
        this.fixed();
    }

    /**
     * 判断当前人员是否已经存在此选中的数据中
     * @param design
     * @returns {boolean}
     */
    existDesign(design) {
        let flag = false;
        if (this.designs && this.designs.length > 0) {
            for (let i = 0; i < this.designs.length; i++) {
                if (this.designs[i].id === design.id) {
                    flag = true;
                    break;
                }
            }
        }

        return flag;
    }

    /**
     * 下一步执行
     * @param e
     */
    next(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.switch.note = false;
        this.switch.publish = true;
        if (this.departmentId) {
            this.changeData();
        } else {
            this.departmentId = this.depart.getDepartFirstId(3);
            this.depart.setQuickDepartId(this.departmentId);
            this.changeData();
        }
        this.loadHistoryEmp(this.cid);
    }

    /**
     * 返回
     * @param e
     */
    back(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.switch.note = true;
        this.switch.publish = false;
    }

    /**
     * 发布
     * @param e
     */
    publish(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.modal.close({ empIds: this.mergeId(this.designs), content: this.note });
    }


    mergeId(array) {
        const ids = [];
        if (array && array.length > 0) {
            array.forEach(a => {
                ids.push(a.id);
            });
        }
        return ids.join(',');
    }

    loadHistoryEmp(id) {
        console.log(id);
        if (id) {
            this.request.doPost({
                url: 'historyEmpCost',
                data: { costId: id },
                success: (res => {
                    if (res && res.code == 200) {
                        if (res.data && res.data.length > 0) {
                            this.designs = res.data;
                        } else {
                            this.designs = [];
                        }
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    getComputedSize(st) {
        return getComputedSize(st);
    }

}
