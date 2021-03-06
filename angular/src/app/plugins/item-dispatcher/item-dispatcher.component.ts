import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Default } from '../../model/constant';
import { Messages } from '../../model/msg';
import { RequestService } from '../../service/request.service';
import { WarningService } from '../../service/warning.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'rev-item-dispatcher',
    templateUrl: './item-dispatcher.component.html',
    styleUrls: ['./item-dispatcher.component.scss']
})
export class ItemDispatcherComponent implements OnInit {

    public title: string;


    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    public departmentId = 0;

    public userType = 1;
    public workerList: Array<any> = [];


    //部门
    public nodes: Array<any> = [];

    //选中
    public selectData: any;

    public searchForm: FormGroup;
    public content: string;


    constructor(public modal: NgbActiveModal,
        private req: RequestService,
        private warn: WarningService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.title = '选择人员';
        this.loadDepartment();

        this.searchForm = this.fb.group({
            userType: [this.userType, [

            ]],
            content: [this.content, [
                Validators.maxLength(30)
            ]]
        });
    }

    /**
     * 根据姓名和手机号码查询
     */
    searchData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changeData();
    }


    // 根据id拉取部门人员列表
    onClick(e): void {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.pageSize = Default.PAGE.PAGE_SIZE;
        this.departmentId = e.node.origin.id;
        this.changeData();
    }

    changeData() {
        const params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            //员工或者工人是否在职
            state: 0
        };
        if (this.departmentId) {
            params['departmentId'] = this.departmentId;
        }
        let url;
        if (this.userType === 1) {
            url = 'listEmployee';
        } else if (this.userType === 2) {
            url = 'workerList';
        }

        if (this.content) {
            params['searchInfo'] = this.content;
            if (params['departmentId']) {
                delete params['departmentId'];
            }
        }

        this.req.doPost({
            url: url,
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.workerList = res.data.pageSet;
                    this.workerList.filter(item => {
                        item['checked'] = false;
                        if (this.selectData && this.selectData[0] && this.selectData[0].id == item.id) {
                            item['checked'] = this.selectData[0]['checked'];
                        }
                    });
                    this.total = res.data.total;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }
    selectRelevant(design: any) {
        this.workerList.forEach(item => {
            if (item.id == design.id) {
                this.selectData = [design];
            } else {
                item['checked'] = false;
                return item;
            }
        });
        if (this.workerList.every(i => {
            return i['checked'] === false;
        })) {
            this.selectData = [];
        }
    }

    // 切换工人、员工
    handleUserType() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changeData();
    }


    // 拉取部门信息
    loadDepartment() {
        this.req.doPost({
            url: 'listDepartAddEmp',
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.nodes = res.data;

                    for (let i = 0; i < this.nodes.length; i++) {
                        this.nodes[i]['title'] = this.nodes[i].name;
                        this.nodes[i]['value'] = this.nodes[i].id;
                        this.nodes[i]['key'] = this.nodes[i].id;
                        this.nodes[i]['isLeaf'] = !this.nodes[i].ownSubset;
                    }
                    this.nodes[0].selected = true;
                    this.departmentId = this.nodes[0].value;
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    // 拉取子部门
    onExpandChange(e): void {
        if (e.node.getChildren().length === 0 && e.node.isExpanded) {
            this.req.doPost({
                url: 'listDepartSearch',
                data: {
                    superiorDepartmentId: e.node.key
                },
                success: (res => {
                    if (res && res.code == 200) {

                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i]['title'] = res.data[i].name;
                            res.data[i]['value'] = res.data[i].id;
                            res.data[i]['key'] = res.data[i].id;
                            res.data[i]['isLeaf'] = !res.data[i].ownSubset;
                            // this.allStoreData.set(res.data[i].id,[])
                        }
                        e.node.addChildren(res.data);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    selectChange(data) {
        this.selectData = [data];
    }
    removeData() {
        this.selectData = [];
        this.workerList.filter(item => {
            item['checked'] = false;
        });
    }

    submit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (this.selectData.length > 0) {
            this.selectData[0]['userType'] = this.userType;
            this.modal.close(this.selectData);
        } else {
            this.warn.onWarn(Messages.SELECT_NOT_EMPTY);
        }
    }

    ngOnDestroy() {
        this.selectData = [];
        this.workerList = [];
        this.content = '';
        this.departmentId = null;
    }

}
