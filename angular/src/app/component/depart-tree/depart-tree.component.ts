import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RequestService} from '../../service/request.service';
import {Messages} from '../../model/msg';
import {UserService} from '../../service/user.service';
import {WarningService} from '../../service/warning.service';
import {GuardService} from '../../service/guard.service';


@Component({
    selector: 'rev-depart-tree',
    templateUrl: './depart-tree.component.html',
    styleUrls: ['./depart-tree.component.scss']
})
export class DepartTreeComponent implements OnInit {
    private departmentId: string;
    // private departUrl: string;

    public nodes: Array<any>;

    /**
     * 控制权限
     */
    public permit: number;
    public p: any;
    //分类型判定拉取数据标准
    @Input() type: any;

    @Input() isPermit = false;


    /**
     * 区别是页面显示还是弹出框内显示
     * @type {boolean}
     */

    @Input() isModal = true;

    @Output() handleChangeData: EventEmitter<any> = new EventEmitter<any>();

    // @Output() isHandleChangeData: EventEmitter<any> = new EventEmitter<any>();

    //用于回显的部门数据
    @Input() displayDepartmentId: string;

    //拉取数据接口
    private loading = false;


    constructor(private request: RequestService,
                private user: UserService,
                private warn: WarningService,
                private guard: GuardService) {
    }

    ngOnInit() {
        // if(!this.type){
        // switch (this.user.getQuickQueryDepartType()) {
        //     case 0: this.departUrl = this.getParamUrl(10); break;
        //     case 1: this.departUrl = this.getParamUrl(11); break;
        //     case 2: this.departUrl = this.getParamUrl(12); break;
        //     default: this.departUrl = this.getParamUrl(this.type);
        // }

        // }


        if (this.guard.saftyGuard() && !this.loading) {
            this.loadDepartment();
        }

        // this.permit = this.isPermit ? 0 : this.user.getQuickQueryDepartType();
        // console.log(this.displayDepartmentId);
    }

    // 拉取部门信息
    loadDepartment() {
        const that = this;
        that.loading = true;
        this.request.doPost({
            url: that.getParamUrl(that.type),
            data: {},
            success: (res => {
                that.loading = false;
                if (res && res.code == 200) {
                    that.nodes = this.renderList(res.data);
                    // console.log(that.nodes);
                    if (that.displayDepartmentId) {
                        if (this.displayDepartmentId === '-1') {
                            that.handleChangeData.emit({
                                initial: false,
                                id: that.nodes[0].value
                            });
                        } else {
                            // that.renderIndex(that.nodes, that.displayDepartmentId);
                            that.renderById(that.nodes, that.displayDepartmentId);
                            that.departmentId = that.displayDepartmentId;
                            that.handleChangeData.emit({
                                initial: true,
                                id: that.departmentId
                            });
                        }
                    } else {
                        that.departmentId = that.nodes[0].value;
                        that.nodes[0].selected = true;
                        that.handleChangeData.emit({
                            selected: true,
                            id: that.departmentId
                        });
                    }
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }

            })
        });
    }

    ngOnChanges(e) {
        // console.log(e);
        if (e.displayDepartmentId && e.displayDepartmentId.currentValue) {
            if (this.nodes && this.nodes.length > 0) {
                // this.renderIndex(this.nodes, e.displayDepartmentId.currentValue);
                this.renderById(this.nodes, e.displayDepartmentId.currentValue);
            } else {
                this.displayDepartmentId = e.displayDepartmentId.currentValue;
                if (!this.loading) {
                    this.loadDepartment();
                }
            }

        }
    }

    // renderIndex(items, did) {
    //     // let params = JSON.parse(sessionStorage.getItem('params'));
    //     console.log(items,did);
    //     if (items && items.length > 0) {
    //         items.forEach((item, i) => {
    //             if (item.id == did) {
    //                 this.nodes[i].selected = true;
    //             } else {
    //                 if (item.children) {
    //                     item.children.forEach((secondItem, secondeIdx) => {
    //                         if (secondItem.id == did) {
    //                             this.nodes[i].expanded = true;
    //                             this.nodes[i]["children"][secondeIdx].selected = true
    //                         } else {
    //                             if (secondItem.children) {
    //                                 secondItem.children.forEach((thirdItem, thirdIdx) => {
    //                                     if (thirdItem.id == did) {
    //                                         this.nodes[i].expanded = true;
    //                                         this.nodes[i]["children"][secondeIdx].expanded = true;
    //                                         this.nodes[i]["children"][secondeIdx]["children"][thirdIdx].selected = true;
    //                                     } else {
    //                                         if (thirdItem.children) {
    //                                             thirdItem.children.forEach((fourItem, fourIdx) => {
    //                                                 if (fourItem.id == did) {
    //                                                     this.nodes[i].expanded = true;
    //                                                     this.nodes[i]["children"][secondeIdx].expanded = true;
    //                                                     this.nodes[i]["children"][secondeIdx]["children"][thirdIdx].expanded = true;
    //                                                     this.nodes[i]["children"][secondeIdx]["children"][thirdIdx]["children"][fourIdx].selected = true;
    //                                                 }
    //                                             })
    //                                         }
    //                                     }
    //                                 })
    //                             }
    //                         }
    //
    //                     })
    //                 }
    //             }
    //
    //         });
    //     }
    // }

    renderById(items, id) {
        id = Number(id);
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    items[i]['selected'] = true;
                    this.findParentById(items[i]['superiorDepartmentId'], items[i]['topDepartmentId'], this.nodes);
                    break;
                } else {
                    if (items[i]['children'] && items[i]['children'].length > 0) {
                        this.renderById(items[i]['children'], id);
                    }
                }
            }
        }
    }

    /**
     *根据当前的父类pid查找出相应的children数据
     * @param pid 父类id
     * @param rId 当前根id
     * @param roots 当前从根数据查找
     */
    findParentById(pid, rid, roots) {
        if (roots && roots.length > 0) {
            for (let i = 0; i < roots.length; i++) {
                if (roots[i].id === pid) {
                    roots[i]['expanded'] = true;
                    this.findParentById(roots[i]['superiorDepartmentId'], roots[i]['topDepartmentId'], this.nodes);
                } else {
                    this.findParentById(pid, rid, roots[i]['children']);
                }
            }
        }
    }

    renderList(items) {
        if (items && items.length > 0) {
            items.forEach(item => {
                item['key'] = item['id'];
                item['title'] = item['name'];
                item['value'] = item['id'];
                item['isLeaf'] = item['children'] && item['children'].length > 0 ? false : true;
                if (item['children'] && item['children'].length > 0) {
                    item['children'] = this.renderList(item['children']);
                }
            });
        }
        return items;
    }


    // 根据id拉取部门信息
    // onExpandChange(e): void {
    //     if (e.node.getChildren().length === 0 && e.node.isExpanded) {
    //         this.request.doPost({
    //             url: this.departUrl,
    //             data: {
    //                 superiorDepartmentId: e.node.key
    //             },
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     for (let i = 0; i < res.data.length; i++) {
    //                         res.data[i]['title'] = res.data[i].name;
    //                         res.data[i]['value'] = res.data[i].id;
    //                         res.data[i]['key'] = res.data[i].id;
    //                         res.data[i]['isLeaf'] = !res.data[i].ownSubset
    //                     }
    //                     e.node.addChildren(res.data)
    //                 } else {
    //                     this.warn.onError(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         });
    //     }
    // }

    // 拉取工人列表
    changeClick(e): void {
        this.departmentId = e.node.origin.id;
        this.handleChangeData.emit({
            selected: true,
            id: this.departmentId
        });
    }


    //获取相应的地址
    getParamUrl(type) {
        switch (Number(type)) {
            // case 1:
            //     return "listDepart";
            // case 2:
            //     return "listDepartAdd";
            // case 3:
            //     return "listDepartAddEmp";
            // case 4:
            //     return "listDepartSearch";
            case 10:
                return 'listDepartAll';
            case 11:
                return 'listDepartIn';
            case 12:
                return 'listDepartSon';
            //企业通讯录
            case 100:
                return 'listDepartAddressBook';
            default:
                return 'listDepartAll';
        }
    }
}
