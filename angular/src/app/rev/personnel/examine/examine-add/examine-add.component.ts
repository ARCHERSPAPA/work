import {Component, OnInit} from '@angular/core';
import {InfoComponent} from '../../../../plugins/info/info.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from '../../../../service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Messages} from '../../../../model/msg';
import {WarningService} from '../../../../service/warning.service';

import {NzModalService} from 'ng-zorro-antd';
import {ExaminePersonComponent} from '../../../../plugins/examine-person/examine-person.component';
import {Default, AUDIT_TYPES} from '../../../../model/constant';
import {PersonnelExamineService} from "../personnel-examine.service";


@Component({

    selector: 'app-examine-add',
    templateUrl: './examine-add.component.html',
    styleUrls: ['./examine-add.component.scss'],
    providers:[PersonnelExamineService]
})
export class ExamineAddComponent implements OnInit {
    public examineId: any;
    public examineName: string;
    public personList: Array<any> = []; // 全量更新集合
    public examinePersonList: Array<any> = [];  // 项目人员
    public radioValue = 2;  // 默认不允许修改审批人

    // 项目人员类型
    public auditTypes: Array<any> = [];
    // 选择人员类型并设置默认值为固定人员
    public chooseType = 1;
    // 设置人员类型为设计师
    public chooseProject: number;

    constructor(private modal: NgbModal,
                private request: RequestService,
                private activatedRoute: ActivatedRoute,
                private warn: WarningService,
                private modalService: NzModalService,
                private router: Router,
                private personnelExamine:PersonnelExamineService) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.examineId) {
                this.examineId = params.examineId;
                this.loadExamineSelect();
                this.auditTypes = AUDIT_TYPES;
            }
            if (params && params.examineName) {
                this.examineName = '编辑' + params.examineName;
            }
        });
    }

    handleClose(index) {
        this.personList.splice(index, 1);
    }


    /**
     * 添加人员
     * @param item 人员信息
     * @param {number} i 当前位置
     */
    handleAddPerson(item: any, i: number) {
        const that = this;
        const info = that.modal.open(InfoComponent, {
            centered: true,
            keyboard: true,
            backdrop: 'static'
        });
        info.componentInstance.type = 15;
        info.componentInstance.memberList = this.personList;
        if (i !== undefined && i !== null) {
            // 兼容弹出框显示文案v2.2.5
            item['memberName'] = item['approver'];
            item['positionName'] = item['position'];
            info.componentInstance.member = item;
        }
        info.result.then((res) => {
            const {id: employeeId, name, positionName, headImg} = res[0];
            console.log(i);
            if (i !== undefined && i !== null) {
                this.personList.splice(i, 1, {
                    headImg,
                    employeeId,
                    approver: name,
                    position: positionName,
                    chooseType: this.chooseType,
                    chooseProject: this.chooseProject
                });
            } else {
                this.personList.push({
                    headImg,
                    employeeId,
                    approver: name,
                    position: positionName,
                    chooseType: this.chooseType,
                    chooseProject: this.chooseProject
                });
            }
            console.log(this.personList);
        }, (err) => {
            console.log(err);
        });
    }

    // 项目人员
    handleAddProjectPerson(item, index) {
        // const item = this.examinePersonList[i];
        this.chooseType = 2;

        const modal = this.modalService.create({
            nzTitle: '选择项目人员',
            nzContent: ExaminePersonComponent,
            nzComponentParams: {items: this.auditTypes, index: item && item['chooseProject'] ? item['chooseProject'] : 1},
            nzFooter: [{
                label: '关闭',
                onClick: (componentInstance) => {
                    console.log(componentInstance);
                    modal.destroy();
                }
            }, {
                label: '提交',
                type: 'primary',
                onClick: (instance) => {
                    console.log(instance);
                    this.chooseProject = instance['index'];
                    if (this.handleRepeatPerson(this.personList, this.chooseProject)) {
                        this.warn.onMsgWarn('请勿提交重复职位');
                        return;
                    } else {
                        const headImg = Default.PERSONNEL.DEFAULT_HEAD_IMG;
                        if (index !== undefined && index !== null) {
                            this.personList.splice(index, 1, {
                                headImg,
                                position: this.getPostionName(this.chooseProject),
                                chooseType: this.chooseType,
                                chooseProject: this.chooseProject
                            });
                        } else {
                            this.personList.push({
                                headImg,
                                position: this.getPostionName(this.chooseProject),
                                chooseType: this.chooseType,
                                chooseProject: this.chooseProject
                            });
                        }
                        modal.destroy();
                    }
                }
            }]
        });
    }


    // 判断当前项目人员是否有重复
     handleRepeatPerson(list, choose) {
        if (list && list.length > 0) {
            const ps = list.filter(item => item.chooseType === 2);
            if (ps && ps.length > 0) {
                return ps.some(p => p.chooseProject === choose);
            }
            return false;
        }
        return false;
     }


    // 修改流程人员配置
    handleChange(item, index) {
        // todo 2.区分两种情况 固定人员和项目人员
        const type = !item['chooseType'] || item['chooseType'] === 1;
        this.chooseType = type ? 1 : 2;
        if (this.chooseType === 2) {
            this.chooseProject = item['chooseProject'];
        }

        if (type) {
            this.handleAddPerson(item, index);
        } else {
            this.handleAddProjectPerson(item, index);
        }
    }

    /**
     * 根据类型新增
     * @param {number} type
     */
    selectItemType(type: number) {
        this.chooseType = type;
        if (type === 1) {
            this.handleAddPerson(null, null);
        } else {
            this.handleAddProjectPerson(null, null);
        }
    }

    /**
     * 根据key来显示职位
     * @param {number} key
     */
    getPostionName(key: number) {
        if (this.auditTypes && this.auditTypes.length > 0) {
            const audit = this.auditTypes.filter(audit => audit.key === key);
            if (audit && audit.length > 0) {
                return audit[0].value;
            }
        }
        return null;
    }



    // 拉取审批流程详情
    loadExamineSelect() {
        this.personnelExamine.getExamineSelected(this.examineId).then(data =>{
            this.personList = data.selectByExample;
            if (this.personList && this.personList.length > 0) {
                this.personList.filter(person => {
                    person['headImg'] = person['headImg'] ? person['headImg'] : Default.PERSONNEL.DEFAULT_HEAD_IMG;
                });
            }
            this.radioValue = data && data.state?data.state: 2;
        }).catch(err =>{
            this.warn.onMsgError(err);
        })


        // this.request.doPost({
        //     url: 'examineSelect',
        //     data: {
        //         id: this.examineId
        //     },
        //     success: (res => {
        //         if (res && res.code === 200) {
        //             that.personList = res.data.selectByExample;
        //             if (this.personList && this.personList.length > 0) {
        //                 this.personList.filter(person => {
        //                     person['headImg'] = person['headImg'] ? person['headImg'] : Default.PERSONNEL.DEFAULT_HEAD_IMG;
        //                 });
        //             }
        //             if (res.data && res.data.state) {
        //                 that.radioValue = res.data.state;
        //             }
        //         } else {
        //             that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
        //         }
        //     })
        // });
    }


    back(e) {
        e.stopPropagation();
        e.preventDefault();
        this.router.navigate(['./../list'], {relativeTo: this.activatedRoute});
    }

    // 全量提交
    handleExamineSave() {
        const redactList = this.personList.map((item, index) => {
            item['orderAddress'] = index + 1;
            if (item.chooseType === 1) {
                delete item['chooseProject'];
            }
            return item;
        });

        const params = {id: this.examineId,redactList,state: this.radioValue};

        this.personnelExamine.saveExamineAudit(params).then(msg =>{
            this.warn.onMsgSuccess(msg);
            this.loadExamineSelect();
        }).catch(err =>{
            this.warn.onMsgError(err);
        })

        // this.request.doPost({
        //     url: 'examineSave',
        //     data: {
        //         id: this.examineId,
        //         redactList,
        //         state: this.radioValue
        //     }, success: res => {
        //         if (res.code && res.code === 200) {
        //             that.loadExamineSelect();
        //             that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
        //         }
        //     }
        // });
    }
}

