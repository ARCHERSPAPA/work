import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestService } from "../../service/request.service";
import { Messages } from "../../model/msg";
import { UserService } from "../../service/user.service";
import { WarningService } from "../../service/warning.service";
import { GuardService } from "../../service/guard.service";


@Component({
    selector: 'rev-depart-tree',
    templateUrl: './depart-tree.component.html',
    styleUrls: ['./depart-tree.component.scss']
})
export class DepartTreeComponent implements OnInit {
    private departmentId: string;
    private departUrl: string;

    public nodes: Array<any>;

    /**
     * 控制权限
     */
    public permit: number;

    @Input() type: any;
    @Input() isPermit: boolean = false;
    @Input() isModal: boolean = true;

    @Output() handleChangeData: EventEmitter<any> = new EventEmitter<any>();


    constructor(private request: RequestService,
        private user: UserService,
        private warn: WarningService,
        private guard: GuardService) { }

    ngOnInit() {
        switch (this.user.getQuickQueryDepartType()) {
            case 0: this.departUrl = this.getParamUrl(10); break;
            case 1: this.departUrl = this.getParamUrl(11); break;
            case 2: this.departUrl = this.getParamUrl(12); break;
            default: this.departUrl = this.getParamUrl(this.type);
        }
        this.permit = this.isPermit ? 0 : this.user.getQuickQueryDepartType();
        if (this.guard.saftyGuard()) {
            this.loadDepartment();
        }
    }

    // 拉取部门信息
    loadDepartment() {
        let that = this;
        this.request.doPost({
            url: this.departUrl,
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    that.nodes = res.data;
                    that.nodes=this.renderList(that.nodes)
                    that.nodes[0].selected = true;
                    that.departmentId = that.nodes[0].value;

                    that.handleChangeData.emit(that.departmentId);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }
    renderList(items) {
        if (items && items.length > 0) {
            items.forEach(item => {
                item['key'] = item['id'];
                item['title'] = item['name'];
                item['value'] = item['id'];
                item['isLeaf'] = item.ownSubset;
                if (item['children']) {
                    item['children'] = this.renderList(item['children'])
                }
            })
        }
        return items
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
    changeDataClick(e): void {
        this.departmentId = e.node.origin.id;
        this.handleChangeData.emit(this.departmentId)
    }

    //获取相应的地址
    getParamUrl(type) {
        switch (Number(type)) {
            case 1:
                return "listDepart";
            case 2:
                return "listDepartAdd";
            case 3:
                return "listDepartAddEmp";
            case 4:
                return "listDepartSearch";
            case 10:
                return "listDepartAll";
            case 11:
                return "listDepartIn";
            case 12:
                return "listDepartSon";
            //企业通讯录
            case 100:
                return "listDepartAddressBook";
            default:
                return "listDepart";
        };
    }
}
