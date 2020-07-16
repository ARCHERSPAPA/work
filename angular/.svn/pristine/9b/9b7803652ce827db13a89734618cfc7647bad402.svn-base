import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getCostStateName, getStateName, getTypeName } from '../../../model/methods';
import { auditStatus, Default } from './../../../model/constant';
import { RequestService } from '../../../service/request.service';
import { WarningService } from '../../../service/warning.service';
import { Messages } from '../../../model/msg';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RelevantComponent } from '../../../plugins/relevant/relevant.component';

@Component({
    selector: 'rev-cost-list',
    templateUrl: './cost-list.component.html',
    styleUrls: ['./../cost.component.scss', './../../detail/list.scss', './cost-list.component.scss']
})
export class CostListComponent implements OnInit {

    public title: string;

    //查询条件
    public searchForm: FormGroup;
    public type = '';
    public info = '';

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    public costList: Array<any>;


    public auditStatus: Array<any>;

    public radioSwitch: any;
    public state = 0;
    constructor(private fb: FormBuilder,
        private req: RequestService,
        private warn: WarningService,
        private modal: NgbModal) {
    }

    ngOnInit() {
        this.title = '成本核算';
        this.radioSwitch = [
            { key: 1, text: '我负责的' },
            { key: 0, text: '全部' }
        ];

        this.searchForm = this.fb.group({
            info: [this.info, [
                Validators.maxLength(100)
            ]]
        });
        const audits = auditStatus.filter((item, index) => {
            if (index === 0) {
                item.id = '';
                item.content = '请选择成本状态';
            }
            return item;
        });
        this.auditStatus = audits;

        this.changeData();
    }


    getTypeName(type: number) {
        return getTypeName(type);
    }

    getStateName(state: number) {
        return getStateName(state);
    }

    getCostStateName(state: number) {
        return getCostStateName(state);
    }

    changeType() {
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changeData();
    }

    changeData(...args) {
        if (args && args.length > 0) {
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        const params = {
            page: this.pageNo,
            pageSize: this.pageSize,
            isResponsible: this.state
        };
        if (this.type) {
            params['type'] = this.type;
        }
        if (this.info) {
            params['info'] = this.info;
        }
        this.req.doPost({
            url: this.getUrlByState(this.state),
            data: params,
            success: (res => {
                this.costList = [];
                if (res && res.code == 200) {
                    this.costList = res.data && res.data.list ? res.data.list : null;
                    this.total = res.data && res.data.total ? res.data.total : 0;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }


    selectCost(s: number) {
        this.state = s;
        this.pageSize = Default.PAGE.PAGE_SIZE;
        this.changeData();
    }

    openModal(item) {
        const info = this.modal.open(RelevantComponent, {
            centered: true,
            keyboard: false,
            backdrop: 'static'
        });
        info.componentInstance.type = 4;
        if (item && item.responsibleUserId) {
            info.componentInstance.user = {
                name: item.responsibleName,
                id: item.responsibleUserId,
                phone: item.responsiblePhone
            };
        }
        info.result.then((res) => {
            if (res) {
                const user = JSON.parse(res);
                const params = {
                    costId: item.id
                };

                if (user && user.id) {
                    params['employeeId'] = user.id;
                }

                this.req.doPost({
                    url: 'distributeCost',
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            this.changeData();
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }

                    })
                });
            }
        }, (rea) => {
            console.log(rea);
        });
    }

    getUrlByState(st) {
        switch (st) {
            case 0:
                return 'listCost';
            case 1:
                return 'listCostBySelf';
            default:
                return 'listCost';
        }
    }

    handleSwitch(e: number) {
        this.state = e;
        this.pageNo = Default.PAGE.PAGE_NO;
        this.changeData();
    }

}
