
import { Component, OnInit } from '@angular/core';
import { Default } from '../../../model/constant';
import { Messages } from '../../../model/msg';
import { RequestService } from '../../../service/request.service';
import { WarningService } from '../../../service/warning.service';
import { btoa, getCaseName } from '../../../model/methods';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'rev-case-list',
    templateUrl: './case-list.component.html',
    styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {


    public title: string;
    public radioSwitch = [{
        key: 0,
        text: 'TOP案例'
    }, {
        key: 1,
        text: '其他案例'
    }];
    //   审核状态(auditState:0->TOP案例，1->其他案例)
    public caseState = 0;
    public searchType: any;
    public type;

    //分页
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    //
    public caseList: any;
    public forms = [{
        type: "text",
        name: "name",
        value: null,
        placeholder: "请输入",
        cols: 6
    },
    {
        type: "button",
        name: "search",
        text: "查询"
    }]

    constructor(private request: RequestService,
        private warn: WarningService,
        private route: Router) {
    }

    ngOnInit() {

        this.title = '案例列表';
        this.changeData();
    }


    handleSwitch(status: number) {
        this.searchType='';
        this.forms[0].value='';
        this.selectAudit(status);
    }
    handleForm(e: any) {
        let maps = e.value;
        if (maps && maps.size > 0) {
            this.searchType = maps.get('name');
        }
        // this.searchType=e.value.get('group').value;
        this.changgePage(true);

    }
    changeData(type = false) {
        let pageNo;
        if (type) {
            pageNo = 1;
        } else {
            pageNo = this.pageNo;
        }
        this.request.doPost({
            url: 'smallProgramList',
            data: {
                page: pageNo,
                pageSize: this.pageSize,
                //   isDown: this.caseState,
                name: this.searchType
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.caseList = res.data.list;
                    this.total = res.data.total;

                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    newCase() {
        //传入判断
        this.route.navigate(['/rev/case/detail/real'], { queryParams: { newcase: true } });
    }
    changgePage(type=false) {
        if (this.caseState === 1) {
            this.newData(type);
        } else {
            this.changeData();
        }
    }
    //新建案例时的列表
    newData(type = false) {
        let pageNo;
        if (type) {
            pageNo = 1;
        } else {
            pageNo = this.pageNo;
        }
        this.request.doPost({
            url: 'newSmallProgramList',
            data: {
                page: pageNo,
                pageSize: this.pageSize,
                //   isDown: this.caseState,
                name: this.searchType
            },
            success: res => {
                if (res && res.code == 200) {
                    this.caseList = res.data.list;
                    this.total = res.data.total;

                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        });
    }

    selectAudit(state: number) {
        this.caseState = state;
        this.pageNo = Default.PAGE.PAGE_NO;
        this.pageSize = Default.PAGE.PAGE_SIZE;
        if (this.caseState === 1) {
            this.newData();
        } else {
            this.changeData();
        }
    }

    /**
     * url中加密
     * @param {string} id
     * @returns {any}
     */
    btoa(id: string) {
        return btoa(id);
    }
    getcaseName(state) {
        return getCaseName(state);
    }

    delCase(id) {
        this.request.doPost({
            url: 'newSmallProgramDelet',
            data: {
                id: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.newData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        });
    }
}
