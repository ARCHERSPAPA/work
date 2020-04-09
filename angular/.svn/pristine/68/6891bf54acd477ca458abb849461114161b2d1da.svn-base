import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as UserValidate from "../../../../validate/user-validate";
import { Messages } from "../../../../model/msg";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectorComponent } from "../../../../plugins/sector/sector.component";
import { Md5 } from 'ts-md5';
import { DepartService } from "../../../../service/depart.service";
import { UploaderComponent } from "../../../../plugins/uploader/uploader.component";
import { CookieService } from "ngx-cookie-service";
import { User } from "../../../../model/user";
import {atob} from "../../../../model/methods";
@Component({
    selector: 'rev-staff-add',
    templateUrl: './staff-add.component.html',
    styleUrls: ['./../staff.component.scss']
})
export class StaffAddComponent implements OnInit {
    public content: string = '上传照片';
    public staffForm: FormGroup;
    public isEdit: boolean = false;
    public id: string;

    /**设置默认的头像图片**/
    public headImg: string;
    public name: string;
    public idCard: string;
    public nativePlace: string;
    public sex: string = '1';


    public account: string = "";
    // public realname:string;
    public phone: string = "";
    public pwd: string = "";

    /***职位id和职位数据列表***/
    public positionId: string = "";
    public postList: any;

    public no: string;

    /**提取码**/
    public pickCode: number;
    public pickStatus: boolean = false;
    /**是否按照提取码编辑用户**/
    public externalSigns: string = "";

    /***部门id字符串***/
    public departs: Array<any> = [];

    public departNames: string;

    public remarks: string;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private request: RequestService,
        private warn: WarningService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private depart: DepartService,
        private cookie: CookieService) {
    }


    ngOnInit() {
        this.loadPosition();
        this.getHistory();
       this.activatedRoute.queryParams.subscribe(params =>{
            if(params && params["id"]){
                this.id = atob(params.id);
                this.isEdit = true;
                this.loadStaff(this.id);
            }
        });
        // this.activatedRoute.queryParams.subscribe(params => {
        //     if (params && params["id"]) {
        //         this.title = "编辑员工";
        //         this.isEdit = true;
        //         this.id = params["id"];
        //         this.loadStaff(this.id);
        //     }
        // });

        this.staffForm = this.fb.group({

            name: [this.name, [
                Validators.required,
                Validators.minLength(2),
                UserValidate.ValidateText
            ]],
            idCard: [this.idCard, [
                // Validators.required,
                UserValidate.ValidateIdCard
            ]],
            nativePlace: [this.nativePlace, [
                // Validators.required
            ]],
            account: [this.account, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                UserValidate.ValidateNumAlphaUnderline
            ]],
            // realname:[this.realname,[
            //     Validators.required,
            //     Validators.minLength(2),
            //     // Validators.maxLength(20),
            //     UserValidate.ValidateText
            // ]],
            no: [this.no, [
                Validators.maxLength(20),
                UserValidate.ValidateNumAlphaUnderline
            ]],
            sex: [this.sex, [
                // Validators.required
            ]],
            phone: [this.phone, [
                Validators.required,
                UserValidate.ValidatePhone
            ]],
            depart: [this.departNames, [
                Validators.required
            ]],
            positionId: [this.positionId, [
                Validators.required
            ]],
            remarks: [this.remarks, [
                Validators.maxLength(120)
            ]]
        });

        // if(this.isEdit){
        // this.staffForm.addControl("pwdGroup", this.fb.group({
        //     pwd:['',[]],
        //     repwd:['',[
        //     ]]},{
        //     validator:UserValidate.ValidatePasswordGroup
        // }))
        // }
        if (!this.isEdit) {
            this.staffForm.addControl("pwdGroup", this.fb.group({
                pwd: [this.pwd, [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(32),
                    UserValidate.ValidatePassword
                ]],
                repwd: ['', [
                    Validators.required
                ]]
            }, {
                validator: UserValidate.ValidatePasswordGroup
            }))
        }
    }

    /**
     * 拉取员工数据信息
     * @param id
     */

    loadStaff(id) {
        let that = this;
        if (id) {
            that.request.doPost({
                url: "infoEmp",
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        let data = res.data;
                        that.account = data.account;
                        // that.realname = data.name;
                        that.name = data.name;
                        that.no = data.empNo;
                        that.sex = String(data.sex);
                        that.phone = data.phone;
                        that.departs = [];
                        data.deps.forEach(item => {
                            that.departs.push(item["id"])
                        })
                        // that.departs = data.deps;
                        that.departNames = that.getDepartName(data.deps);
                        that.positionId = data.positionId;
                        that.remarks = data.remarks;
                        that.idCard = data.idCard;
                        that.nativePlace = data.nativePlace;
                        that.headImg = data.headImg ? data.headImg : that.headImg;
                        that.pickStatus = data.wokerSupplier ? true : false;
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })

            })
        }
    }

    /**
     * 返回上一页
     */
    exist() {
        this.router.navigate(["../list"], { relativeTo: this.activatedRoute });
    }

    /**
     * 提交员工数据
     */
    submit() {
        let that = this;
        if (this.staffForm.valid) {
            let paramNames = ['idCard', 'nativePlace', 'password', 'account', 'passwordTo', 'name', 'phone', 'positionId', 'positionName', 'sex', 'empNo', 'departmentIds', 'remarks'];
            let params = {}, values = that.staffForm.value;
            for (let name of paramNames) {
                params[name] = values[name] ? values[name] : "";
            }
            // params['name'] = values["realname"];
            params['password'] = Md5.hashStr(values['pwdGroup'].pwd);
            params['passwordTo'] = Md5.hashStr(values['pwdGroup'].repwd);
            params['positionName'] = that.getPostName(params['positionId']);
            params['empNo'] = values['no'];
            params['departmentIds'] = that.getDepartIds();
            params["headImg"] = that.headImg ? that.headImg : (new User()).headImg;
            params["sex"] = values["sex"];
            params["externalSigns"] = that.externalSigns;
            that.request.doPost({
                url: "addEmp",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.cookie.set("positionId", params["positionId"]);
                        that.depart.clearDisplayDeparts();
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.router.navigate(["../list"], { relativeTo: this.activatedRoute });
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 修改数据提交
     */
    modify() {
        let that = this;
        if (this.staffForm.valid) {
            let paramNames = ['idCard', 'nativePlace', 'password', 'passwordTo', 'name', 'phone', 'positionId', 'positionName', 'sex', 'empNo', 'departmentIds', 'remarks'];
            let params = {}, values = that.staffForm.value;
            for (let name of paramNames) {
                params[name] = values[name] ? values[name] : "";
            }
            ;
            // params['name'] = values["realname"];
            if (!this.isEdit && values['pwdGroup'].pwd && values['pwdGroup'].repwd) {
                params['password'] = Md5.hashStr(values['pwdGroup'].pwd);
                params['passwordTo'] = Md5.hashStr(values['pwdGroup'].repwd);
            }
            params['positionName'] = that.getPostName(params['positionId']);
            params['empNo'] = values['no'];
            params['departmentIds'] = that.getDepartIds();
            params["id"] = this.id;
            params["sex"] = values["sex"];
            params["headImg"] = that.headImg;
            params["externalSigns"] = that.externalSigns;

            that.request.doPost({
                url: "upEmp",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.router.navigate(["./../../staff/list"], { relativeTo: that.activatedRoute });
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    //加载职位信息
    loadPosition() {
        let that = this;
        that.request.doPost({
            url: "queryPosition",
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    that.postList = res.data;
                    // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    //选择部门信息
    selectDepart(departs) {
        const modalRef = this.modalService.open(SectorComponent, {
            centered: true,
            keyboard: false
        });
        this.depart.setDisplayDeparts(departs);
        modalRef.componentInstance.type = "checkbox";
        modalRef.componentInstance.url = 10;
        modalRef.componentInstance.id = this.departs;
        modalRef.result.then(res => {
            this.cookie.set("selectDeparts", JSON.stringify(res)); //返回id+name
            let arr = []; 
            res.forEach(item => {
                arr.push(item['id']);
            })
            this.departs = arr;
            this.departNames = this.getDepartName(res);
        }, reason => {
            console.log(reason);
        });
    }

    /**
     * 根据部门id获取相关的部门名称
     * @param departs
     * @returns {any}
     */
    getDepartName(departs) {
        let names = [];
        if (departs && departs.length > 0) {
            for (let d of departs) {
                names.push(d.name);
            }
        }
        ;
        return names.join(",");
    }

    /**
     * 根据职位id获取相关的职位名称
     * @param pid
     * @returns {any}
     */
    getPostName(pid) {
        if (pid && this.postList) {
            for (let p of this.postList) {
                if (p.id == pid) return p.name;
            }
        }
        return '';
    }

    /**
     * 组装部门id到参数
     * @returns {any}
     */
    getDepartIds() {
        let ids, that = this;
        if (that.departs && that.departs.length > 0) {
            ids = [];
            for (let depart of that.departs) {
                ids.push(depart);
            }
        }
        return ids;
    }

    /**
     * 上传图片
     */
    openModal() {
        let modal = this.modalService.open(UploaderComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });
        modal.componentInstance.name = "修改头像信息";
        modal.componentInstance.width = 10;
        modal.componentInstance.height = 10;
        modal.result.then((result) => {
            if (result && result.image) {
                this.headImg = result.image;
            } else {
                this.warn.onError(Messages.ERROR.IMG_LARGE);
            }

        }, (reason) => {
            console.log(reason);
        });
    }

    /**
     * 获取提取码
     */
    handlePick() {
        let that = this;
        if (that.pickCode) {
            that.request.doPost({
                url: "queryUserByCode",
                data: { code: that.pickCode },
                success: (res => {
                    if (res && res.code == 200) {
                        that.pickStatus = true;
                        that.headImg = res.data && res.data.faceimg ? res.data.faceimg : that.headImg;
                        that.name = res.data && res.data.userName ? res.data.userName : "";
                        that.idCard = res.data && res.data.idcard ? res.data.idcard : "";
                        that.sex = res.data && String(res.data.sex) ? String(res.data.sex) : "0";
                        that.nativePlace = res.data && res.data.natives ? res.data.natives : "";
                        that.externalSigns = res.data && res.data.userId ? res.data.userId : "";
                    } else {
                        that.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    /**
     * 查看历史信息
     */
    getHistory() {
        let departs, positionId;
        if (this.cookie.get("selectDeparts")) {
            departs = JSON.parse(this.cookie.get("selectDeparts"));
        }
        if (this.cookie.get("positionId")) {
            positionId = this.cookie.get("positionId");
        }
        if (departs && departs.length > 0) {
            departs.forEach(id=>{
            this.departs.push(id['id']);
            })
            this.departNames = this.getDepartName(departs);
        }
        if (positionId) {
            this.positionId = positionId;
        }
    }

    ngOnDestroy() {
        this.departs = null;
    }
}

