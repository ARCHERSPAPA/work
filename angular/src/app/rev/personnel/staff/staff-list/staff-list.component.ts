import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../../service/request.service';
import { WarningService } from '../../../../service/warning.service';
import { Default, appTypes, topProjectTypes } from '../../../../model/constant';
import { Messages } from '../../../../model/msg';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { transformQuickDepartType, btoa } from '../../../../model/methods';




@Component({
    selector: 'rev-staff-list',
    templateUrl: './staff-list.component.html',
    styleUrls: ['./../staff.component.scss']
})
export class StaffListComponent implements OnInit {

    /***查询***/

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    public searchInfo = "";
    //查询部门id
    public departmentId: string;
    //初始化部门id
    public initialId: string;

    public departType: number;
    public isVisible: Boolean = false;
    public appType = 1;
    public permissionList;
    public id: Array<any> = [];

    //标题文字
    public showTitle: string;
    //取消按钮的文字
    public CancelText: string;
    //离职状态
    public quitState: number;
    public state: number;
    public lock = false;
    //离职状态126需要去交接项目
    public isAllDisplayDataChecked: boolean;

    public indeterminate = false;
    // public APPids:Array<any>;


    public staffList: any;
    public appState;
    public contractRole;//合同权限
    public topProjectState = [];//   装修TOP项目展示状态
    public topProjectList;
    // public showAppState:boolean=true;


    constructor(private request: RequestService,
        private warn: WarningService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private user: UserService) { }

    ngOnInit() {
        this.permissionList = appTypes;
        this.topProjectList = topProjectTypes;
        this.departType = transformQuickDepartType(this.user.getQuickQueryDepartType());
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params) {
                if (params["page"]) {
                    this.pageNo = params["page"] > 0 ? params["page"] : Default.PAGE.PAGE_NO;
                }
                if (params["did"]) {
                    this.departmentId = params["did"];
                }
                if (params["searchInfo"]) {
                    this.searchInfo = params["searchInfo"];
                }
                if ((this.departmentId && this.departmentId !== "-1") || this.searchInfo) {
                    this.changeData();
                }
            }
        })
    }
    checkType() {
        this.lock = true;
    }


    /**
     * 监听部门回显
     * @param e
     */
    changeDepart(e: any) {
        if (e.selected) {
            this.departmentId = e.id;
            this.pageNo = Default.PAGE.PAGE_NO;
            this.searchInfo = "";
            this.router.navigate(['./'], {
                queryParams: {
                    page: this.pageNo,
                    did: this.departmentId,
                    searchInfo: this.searchInfo,
                }, relativeTo: this.activatedRoute
            })
        } else if (e.initial) {
            this.departmentId = e.id;
            this.searchInfo = "";
        }
        if (!this.initialId) {
            this.initialId = e.id;
        }
    }

    /**
     * 搜索框查询
     */
    searchData() {
        this.pageNo = Default.PAGE.PAGE_NO;
        if (this.searchInfo) {
            this.departmentId = "-1";
        } else {
            this.departmentId = this.initialId;
        }
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                searchInfo: this.searchInfo
            }, relativeTo: this.activatedRoute
        })
    }

    /**
     * 分页查询
     */
    changePage() {
        this.router.navigate(['./'], {
            queryParams: {
                page: this.pageNo,
                did: this.departmentId,
                searchInfo: this.searchInfo
            }, relativeTo: this.activatedRoute
        })
    }

    ngDoCheck() {
        if (this.lock && this.quitState === 0) {
            this.quitState = null;
        }
    }

    appPermission(data) {
        this.isVisible = true;
        if (data === 1) {
            this.appType = 1;
            this.topProjectState = [];
            this.contractRole=0;
            // this.showAppState=false;
            this.staffList.forEach(v => {
                if (v['checked']) {
                    this.id.push(v['id']);
                }
            });
        } else {
            // this.showAppState=true;
            this.id.push(data.id);
            this.topProjectState = [];
            this.appType = data.appJurisdiction;
            if(data.topShowState){
                let nums = data.topShowState.split(",");
                if(nums && nums.length > 0){
                    nums.forEach(v=>{
                        v = parseInt(v);
                        console.log(typeof v)
                        this.topProjectState.push(v);
                    })
                }
            }else{
                this.topProjectState=[]
            }
            this.contractRole=data.createContract;
        }

    }
    //单个选择
    refreshStatus() {
        const allChecked = this.staffList.filter(value => value.state != 1).every(value => value.checked === true);
        const allUnChecked = this.staffList.filter(value => value.state != 1).every(value => !value.checked);
        this.isAllDisplayDataChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }
    showButton() {
        if (this.staffList && this.staffList.length > 0) {
            return this.staffList.every(v => {
                return v['checked'] == false;
            });
        } else {
            return true
        }
    }
    checkAll(event) {
        if (event) {
            this.staffList.filter((item, i) => {
                if (item['state'] === 0) {
                    item['checked'] = true;
                }
            });
        } else {
            this.staffList.filter(item => {
                item['checked'] = false;
            });
        }
        this.indeterminate = false;
    }
    handleCancel() {
        this.isVisible = false;
        this.id.length = 0;
    }
    /**
     *     APP新建合同权限
     */
    configContractRole(e) {
        this.contractRole=e?1:0;
    }
    /**
   * 装修TOP项目展示范围
 */
    handleAPPType(e) {
        this.appType = e;
    }
    /**
     * 装修TOP项目展示状态
     */
    handleTOPState(e) {
        // this.contractRole=e?1:0;
        // console.log(this.contractRole)
    }
    checkState(state) {
        if (state == null || state == 3) {
            return "确定"
        } else {
            return "交接项目"
        }
    }
    submit() {
        this.request.doPost({
            url: 'appEmp',
            data: {
                id: this.id,
                appJurisdiction: this.appType,
                topShowState:this.topProjectState?this.topProjectState.join(','):'',
                createContract:this.contractRole
            }, success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.isAllDisplayDataChecked = false;
                    this.isVisible = false;
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        });
    }

    changeData(...args) {
        const that = this;
        if (args && args.length > 0) {
            this.pageNo = Default.PAGE.PAGE_NO;
        }
        const params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
        };
        if (this.searchInfo) {
            params['searchInfo'] = this.searchInfo;
        } else {
            params['departmentId'] = this.departmentId;
        }
        // console.log(params)
        this.request.doPost({
            url: 'listEmployee',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    that.staffList = res.data.pageSet;
                    this.isAllDisplayDataChecked = false;
                    this.indeterminate = false;
                    this.id = [];
                    that.staffList.filter(v => {
                        v['checked'] = false;
                    });
                    that.total = res.data.total;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    checkStaff(id) {
        // return new Promise((resolve, reject) => {
        this.request.doPost({
            url: 'checkEmp',
            data: {
                id: id
            },
            success: res => {
                if (res && res.code === 200) {
                    this.quitState = res.data;
                    if (this.quitState === 0) {
                        this.showTitle = '确认离职该员工吗！';
                        this.CancelText = '取消';
                    } else if (this.quitState === 2) {
                        this.showTitle = '该员工负责有已结束的项目！';
                        this.CancelText = '离职';
                    } else if (this.quitState === 1) {
                        this.showTitle = '该员工负责有进行中的项目！！';
                        this.CancelText = '关闭';
                    }
                    else if (this.quitState === 3) {
                        this.showTitle = '该员工有正在进行的审批项目';
                        this.CancelText = '关闭';
                    }
                } else {
                    this.showTitle = '网络异常！！';
                    this.CancelText = '关闭';
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }

            }
        });
        // })
    }

    //交接项目时的跳转。2.2.3版本修改之前的126时跳转
    //确认触发函数
    quitPage(id) {
        //当直接离职时二次确认判断
        if (this.quitState === 3) {
            return
        }
        if (!this.quitState) {
            // console.log(id)
            this.quitStaff(id);
        } else {
            this.router.navigate(['../associate'], { queryParams: { id: btoa(id) }, relativeTo: this.activatedRoute });
        }
    }
    //取消触发函数
    checkQuit(id) {
        if (this.quitState === 2) {
            this.quitStaff(id);
        } else if (this.quitState == 0) {
            this.quitState = null;
            // console.log( this.quitState)
        }
    }

    quitStaff(id) {
        const that = this;
        if (id) {
            // console.log(this.quitState,id)
            that.request.doPost({
                url: 'quitEmp',
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.state = res.code;
                        this.changeData();
                        this.quitState = null;
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    delStaff(id) {
        const that = this;
        if (id) {
            that.request.doPost({
                url: 'delEmp',
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.changeData();
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    btoa(id: string) {
        return btoa(id);
    }
}
