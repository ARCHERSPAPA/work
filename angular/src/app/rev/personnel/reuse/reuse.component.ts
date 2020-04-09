import { Component, OnInit } from '@angular/core';
import { Messages } from "../../../model/msg";
import { WarningService } from "../../../service/warning.service";
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from "../../../service/request.service";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { RelevantComponent } from "../../../plugins/relevant/relevant.component";

@Component({
    selector: 'rev-reuse',
    templateUrl: './reuse.component.html',
    styleUrls: ['./../personnel.component.scss', './../staff/staff.component.scss', './reuse.component.scss']
})
export class ReuseComponent implements OnInit {

    public title: string;
    public buttons: Array<any>;
    public showBtn: boolean = false;
    // list
    public reUsers: Array<any>;
    // 模块相关的
    public roleInfo: string = "";
    public name: string = "";
    public account: string = "";

    public sex: string;
    public employeeId: string;
    // 控制模块的打开
    public isVisible: boolean = false;
    public item: any;
    public userForm: FormGroup;


    /**
     * 员工类别判定 1：项目总监 2：其它
     * @type {number}
     */
    public type: number = 2;
    /**
     * 判断当前是否为只有工程总监
     * @type {boolean}
     */
    public checked: boolean = false;

    /**
     * 当前修改角色id
     */
    public reuseId: string;
    constructor(private req: RequestService,
        private warn: WarningService,
        private fb: FormBuilder,
        private modal: NgbModal) {
    }

    ngOnInit() {
        this.loadOfferUsers();
        this.title = "复用人员";
        this.buttons = [
            {
                name: "新建",
                color: "btn-primary"
            }
        ];

        this.userForm = this.fb.group({
            roleInfo: [this.roleInfo, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(10)
            ]],
            name: [this.name, [
                Validators.required
            ]]
        });

    }

    // ngDoCheck() {
    //     let url = this.activatedRoute.snapshot["_routerState"].url.toString();
    //     this.showBtn = url.indexOf("list") >= 0;
    // }

    loadOfferUsers() {
        this.req.doPost({
            url: "listReuseMember",
            data: {},
            success: (res => {
                // console.log(res);
                if (res && res.code == 200) {
                    this.reUsers = res.data;
                } else {
                    this.warn.onWarn(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    delItem(id) {
        if (id) {
            this.req.doPost({
                url: "deleteReuseMember",
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadOfferUsers();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }

                })
            })
        }
    }

    editItem(item) {
        this.isVisible = true;
        this.employeeId = item.employeeId;
        this.sex=item.sex+'';
        // item.sex === '0' ? this.sex = '2' : this.sex = '1';
        this.roleInfo = item.roleInfo;
        this.reuseId = item.reuseId;
        this.account = item.account;
        this.name = item.name;
        this.type = item.type;
        this.item=item;
    }

    handleName(e) {
        this.req.doPost({
            url: "checkReuseMember",
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.isVisible = true;
                    this.type = (res.data == 0 ? 1 : 2);
                    this.roleInfo = this.type === 1 ? "工程总监" : "";
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }


    handleCancel() {
        this.isVisible = false;
        this.account = null;
        this.employeeId = null;
        this.name = null;
        this.sex = "";
        this.roleInfo = null;
        this.reuseId = null;
        this.userForm.reset();

    }
    openModal() {
        this.isVisible = false;
        let info = this.modal.open(RelevantComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });
        info.componentInstance.type = 3;
        if (this.item && (this.item['employeeId'] || this.item['id'])) {
            info.componentInstance.user = {
                account: this.item.account,
                id: this.item['employeeId'] ? this.item['employeeId'] : (this.item['id'] ? this.item['id'] : null),
                name: this.item.name,
                phone: this.item.phone,
                checked:true,
                departmentName: this.item['departmentName'] ? this.item['departmentName'] : null
            };
        }
        info.result.then(res => {
            this.isVisible = true;
            if (res) {
                let user = JSON.parse(res);
                this.name = user.name;
                this.sex=user.sex+'';
                // user.sex === 0 ? this.sex = '2' : this.sex = '1';
                this.account = user.account;
                this.employeeId = user.id;
                this.item = user;
            }

        }, reason => {
            console.log(reason);
        });
    }

    submit(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.userForm.valid && this.employeeId) {
            this.req.doPost({
                url: "saveReuseMember",
                data: {
                    roleInfo: this.roleInfo,
                    type: this.type,
                    employeeId: this.employeeId
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.handleCancel();
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadOfferUsers();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    update(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.userForm.valid && this.reuseId) {
            this.req.doPost({
                url: "updateReuseMember",
                data: {
                    roleInfo: this.roleInfo,
                    id: this.reuseId,
                    employeeId: this.employeeId,
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.handleCancel();
                        this.loadOfferUsers();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

}
