import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {RequestService} from "../../../../service/request.service";
import {WarningService} from "../../../../service/warning.service";
import {Messages} from "../../../../model/msg";
import {SectorComponent} from "../../../../plugins/sector/sector.component";
import * as UserValidate from "../../../../validate/user-validate";
import {ModalComponent} from "../../../../plugins/modal/modal.component";
import {RelevantComponent} from "../../../../plugins/relevant/relevant.component";
import {DepartService} from "../../../../service/depart.service";
import {atob, controlHouseTypeByState, controlPhoneByState, houseType} from "../../../../model/methods";
import {UserService} from "../../../../service/user.service";


@Component({
    selector: 'rev-detail-add',
    templateUrl: './detail-add.component.html',
    styleUrls: ['./../client-detail.component.scss']
})
export class DetailAddComponent implements OnInit {

    public title: string;


    public sourceList: Array<any>;
    // public depart-tree:any;

    public areas: Array<any> = [];
    public districts: Array<any> = [];

    public clientForm: FormGroup;

    //参数
    public sourceId: string;
    public sourceInfo: string;

    public designerName: string;
    public designerId: number;

    public personLiableName: string
    public personLiableId: number;

    public customerPhone: string;
    public cityId: string = "";
    public cityName: string;
    public areaId: string = "";
    public areaName: string;
    public address: string;

    public gpsAddress: string;
    public point: any;
    //辨别当前区域
    public adcode: string;

    public roomNumber: string;
    public roomType: number;
    // public restaurant:number;
    // public parlourType:number;
    public toiletType: number;
    // public kitchenType:number;
    // public balcony:number;
    public houseArea: number;
    public departmentId: string;
    public departmentName: string

    //拉取部门数据信息的列表代号:
    public doDepartUrl: number = 2;
    // public doDepartList:any;

    public customerName: string;
    public remarks: string;

    public id: string;
    public isEdit: boolean = false;
    public quoteState: any;


    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private request: RequestService,
                private warn: WarningService,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private depart: DepartService,
                private user: UserService) {
    }

    ngOnInit() {
        this.title = "新建客户";
        this.loadSource();
        // this.selectArea();
        this.loadDepart();

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["id"]) {
                this.id = atob(params.id);
            }
        });
        if (Number.parseInt(this.id) > 0) {
            this.title = "编辑客户";
            this.isEdit = true;
            this.loadDetail(this.id);
        } else {
            this.personLiableId = this.user.getId();
            this.personLiableName = this.user.getName();
        }


        this.clientForm = this.fb.group({
            sourceId: [this.sourceId, [
                Validators.required
            ]],
            sourceInfo: [this.sourceInfo, [
                Validators.required
            ]],
            designerId: [this.designerId, []],
            designerName: [this.designerName, []],
            personLiableName: [this.personLiableName, []],
            personLiableId: [this.personLiableId, []],
            customerPhone: [this.customerPhone, [
                Validators.required,
                UserValidate.ValidatePhone
            ]],
            // cityId:[this.cityId,[
            //     Validators.required
            // ]],
            // cityName:[this.cityName,[
            //     Validators.required
            // ]],
            // areaId:[this.areaId,[
            //     Validators.required
            // ]],
            // areaName:[this.areaName,[
            //     Validators.required
            // ]],
            address: [this.address, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(30),
                UserValidate.ValidateAccount
            ]],
            roomNumber: [this.roomNumber, [
                Validators.minLength(1),
                Validators.maxLength(10)
            ]],
            gpsAddress: [this.gpsAddress, []],
            roomType: [this.roomType, [
                Validators.maxLength(3),
                Validators.min(0),
                Validators.max(100),
                UserValidate.ValidateMinNum
            ]],
            // restaurant:[this.restaurant,[
            //     Validators.maxLength(1),
            //     UserValidate.ValidateMinNum
            // ]],
            // parlourType:[this.parlourType,[
            //     Validators.maxLength(1),
            //     UserValidate.ValidateMinNum
            // ]],
            toiletType: [this.toiletType, [
                Validators.maxLength(3),
                Validators.min(0),
                Validators.max(100),
                UserValidate.ValidateMinNum
            ]],
            // kitchenType:[this.kitchenType,[
            //     Validators.maxLength(1),
            //     UserValidate.ValidateMinNum
            // ]],
            // balcony:[this.balcony,[
            //     Validators.maxLength(1),
            //     UserValidate.ValidateMinNum
            // ]],
            houseArea: [this.houseArea, [
                Validators.required,
                Validators.min(1),
                Validators.max(999999),
                UserValidate.ValidateNumDecimal
            ]],
            departmentId: [this.departmentId, [
                Validators.required
            ]],
            departmentName: [this.departmentName, [
                Validators.required
            ]],
            customerName: [this.customerName, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                UserValidate.ValidateText
            ]],
            remarks: [this.remarks, [
                Validators.maxLength(120),
            ]]


        })
    }

    ngDoCheck() {

        if (this.depart.getDepartList(this.doDepartUrl) && !this.departmentId) {
            let doDepartList = this.depart.getDepartList(this.doDepartUrl);
            if (doDepartList && doDepartList.length > 0) {
                if (doDepartList.length === 1) {
                    this.departmentId = doDepartList[0].id;
                    this.departmentName = doDepartList[0].name;
                }
            }
        }
    }

    loadDetail(id) {
        let that = this;
        that.request.doPost({
            url: "infoDemand",
            data: {id: id},
            success: (res => {
                if (res && res.code == 200) {
                    let data = res.data;
                    that.sourceId = data.sourceId;
                    that.sourceInfo = data.sourceInfo;
                    that.customerName = data.customerName;
                    that.customerPhone = data.customerPhone;
                    // that.cityId = data.cityId;
                    // that.selectArea(that.cityId);
                    // that.cityName = data.cityName;
                    // that.areaId = data.areaId;
                    // that.areaName = data.areaName;
                    that.address = data.address;
                    that.quoteState = data.quoteState;

                    that.designerName = data.designerName;
                    that.designerId = data.designerId;
                    that.personLiableName = data.personLiableName;
                    that.personLiableId = data.personLiableId;

                    if (data.gpsAddress) {
                        that.gpsAddress = data.gpsAddress;
                        that.point = {
                            lat: data.latitude,
                            lng: data.longitude
                        };
                        that.adcode = data.adcode;
                    }

                    that.roomNumber = data.roomNumber;
                    that.roomType = data.roomType;
                    // that.parlourType = data.parlourType;
                    that.toiletType = data.toiletType;
                    // that.kitchenType = data.kitchenType;
                    // that.balcony = data.balcony;
                    that.houseArea = data.houseArea;
                    // that.restaurant = data.restaurant;

                    that.departmentId = data.departmentId;
                    that.departmentName = data.departmentName;
                    that.remarks = data.remarks;

                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })
    }

    exist() {
        this.router.navigate(["./../list"], {relativeTo: this.activatedRoute});
    }

    submit() {
        if (this.clientForm.valid) {
            let params = this.clientForm.value;

            if (params["gpsAddress"]) {
                params["longitude"] = this.point["lng"] + "";
                params["latitude"] = this.point["lat"] + "";
                params["adcode"] = this.adcode;
            }
            params = houseType(params);
            this.request.doPost({
                url: "addDemand",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.router.navigate(["./../list"], {relativeTo: this.activatedRoute});
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    modify() {
        if (this.clientForm.valid) {
            let params = this.clientForm.value;
            if (params["gpsAddress"]) {
                params["longitude"] = this.point["lng"] + "";
                params["latitude"] = this.point["lat"] + "";
                params["adcode"] = this.adcode;
            }
            params["id"] = this.id;
            params = houseType(params);
            this.request.doPost({
                url: "upDemand",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        this.router.navigate(["./../list"], {relativeTo: this.activatedRoute});
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    loadSource() {
        this.request.doPost({
            url: "querySource",
            data: {},
            success: (res => {
                if (res && res.code == 200) {
                    this.sourceList = res.data;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        })

    }

    selectDepart() {
        if (this.departmentName && this.departmentId) {
            this.depart.setDisplayDeparts([{
                name: this.departmentName,
                id: this.departmentId
            }])
        }
        const modalRef = this.modalService.open(SectorComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.type = "radio";
        modalRef.componentInstance.url = 12;
        modalRef.result.then(res => {
            if (res && res.length == 1) {
                this.departmentId = res[0].id;
                this.departmentName = res[0].name;
            } else {
                this.warn.onWarn(Messages.SELECT_NOT_EMPTY);
            }
        }, reason => {
            console.log(reason);
        });
    }

    loadDepart() {
        this.depart.loadDepart(0, this.doDepartUrl);
    }

    selectRelateMan() {
        const modalRef = this.modalService.open(SectorComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.type = "radio";
        modalRef.componentInstance.url = 2;
        modalRef.result.then(res => {
            if (res && res.length == 1) {
                this.departmentId = res[0].id;
                this.departmentName = res[0].name;
            } else {
                this.warn.onWarn(Messages.SELECT_NOT_EMPTY);
            }
        }, reason => {
            console.log(reason);
        });
    }

    openModal(type, val) {
        let that = this;
        const modalRef = this.modalService.open(ModalComponent, {
            centered: true,
            keyboard: true
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.value = val;
        modalRef.componentInstance.name = "选择";
        if (type === "address") {
            modalRef.componentInstance.point = that.point;
        }

        modalRef.result.then((result) => {
            let res = JSON.parse(result);
            if (type === "address") {
                that.gpsAddress = res.address;
                that.point = res.point;
                that.adcode = res.adcode;
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    /**
     * 选择地区(市级)
     * @param arg
     */
    // selectArea(...arg){
    //       let that = this,params = {level:2};
    //       that.districts = [];
    //       if(arg[0]){
    //           params["level"] = 3;
    //           params["parentId"] = arg[0];
    //           that.getAreaName();
    //       }
    //       that.request.doPost({
    //           url:"loadArea",
    //           data:params,
    //           success:(res =>{
    //               if(res && res.code == 200){
    //                   // that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
    //                   if(params["level"] == 2){
    //                       that.areas = res.data;
    //                   }else if(params["level"] == 3){
    //                       that.districts = res.data;
    //                   }
    //               }else{
    //                   that.warn.onError(res.msg || Messages.FAIL.DATA);
    //               }
    //           })
    //       })
    // }

    getAreaName() {
        let that = this;
        if (that.areas && that.areas.length > 0) {
            for (let area of that.areas) {
                if (area.id == that.cityId) {
                    that.cityName = area.name;
                }
            }
        }
    }

    /**
     * 选择地区(县)
     */
    // selectDistrict(){
    //     let that = this;
    //     if(that.districts && that.districts.length > 0){
    //         for(let d of that.districts){
    //             if(d.id == that.areaId){
    //                 that.areaName = d.name;
    //             }
    //         }
    //     }
    // }

    selectSource() {
        let that = this;
        if (that.sourceList && that.sourceList.length > 0) {
            for (let source of that.sourceList) {
                if (source.id == that.sourceId) {
                    that.sourceInfo = source.name;
                }
            }
        }
    }

    controlPhoneByState() {
        return controlPhoneByState(this.quoteState) && this.isEdit;
    }

    controlHouseTypeByState() {
        return controlHouseTypeByState(this.quoteState) && this.isEdit;
    }

    //负责人和设计师
    selectRelevant(type: number) {
        const modalRef = this.modalService.open(RelevantComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.type = type;
        modalRef.result.then(res => {
            res = JSON.parse(res)
            if (type === 1) {
                this.personLiableName = res.name;
                this.personLiableId = res.sysUserId;
            } else if (type === 2) {
                this.designerName = res.name;
                this.designerId = res.sysUserId;
            }
        }, reason => {
            console.log(reason);
        });
    }

}
