import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {RequestService} from "../../../service/request.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {UploaderComponent} from "../../../plugins/uploader/uploader.component";
import {WarningService} from "../../../service/warning.service";
import {Messages} from "../../../model/msg";
import {UserService} from "../../../service/user.service";
import {BaseService} from "../../../service/base.service";
import {Default, NATIVE} from "../../../model/constant";

@Component({
    selector: 'rev-step-three',
    templateUrl: './step-three.component.html',
    styleUrls: ['./../steps.component.scss']
})
export class StepThreeComponent implements OnInit {
    public infoForm: FormGroup;

    public native: any;

    public params: any;
    /**
     * 默认示例图片
     */
    public src: any;

    public businessLicense: string = "";
    public companyName: string = "";
    public code: string = "";
    public place: string = "1";
    public legaLperson: string = "";
    public idCard: string = "";

    public state: number;

    public isVisible: boolean = false;
    public showImg: string = "";

    constructor(private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private request: RequestService,
                private warn: WarningService,
                private userInfo: UserService,
                private base: BaseService) {
    }


    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            // console.log(params);
            this.params = params;
        });

        this.src = Default.IMG;

        this.native = NATIVE;

        this.initData();

        this.infoForm = this.fb.group({
            businessLicense: [this.businessLicense, [
                Validators.required
            ]],
            companyName: [this.companyName, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            code: [this.code, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            place: [this.place, [
                Validators.required
            ]],
            legaLperson: [this.legaLperson, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            idCard: [this.idCard, [
                Validators.required,
                Validators.maxLength(20)
            ]]
        });
    }

    initData() {
        let that = this;
        if (that.userInfo.getCompanyId()) {
            if (!that.base.getBaseCompanyId()) {
                that.base.loadCompany();
            }
            that.code = Messages.LOADING;
            that.companyName = Messages.LOADING;
            that.legaLperson = Messages.LOADING
            that.idCard = Messages.LOADING;

        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            let that = this;
            if (that.userInfo.getCompanyId()) {
                that.businessLicense = that.base.getLicense();
                that.code = that.base.getCode();
                that.companyName = that.base.getCompanyName();
                that.place = that.base.getPlace();
                that.legaLperson = that.base.getLegal();
                that.idCard = that.base.getIdCard();
            }
        }, 1000);
    }

    // openModal() {
    //     const modalRef = this.modalService.open(UploaderComponent, {
    //         centered: true,
    //         keyboard: false
    //     });
    //     modalRef.componentInstance.name = "上传企业营业执照";
    //     modalRef.componentInstance.width = 9;
    //     modalRef.componentInstance.height = 16;
    //     modalRef.result.then((result) => {
    //         if (result && result.image) {
    //             this.businessLicense = result.image;
    //         } else {
    //             this.warn.onError(Messages.ERROR.IMG_LARGE);
    //         }
    //
    //     }, (reason) => {
    //         console.log(reason);
    //     });
    // }

    fileChange(e: any) {
        let that = this;
        if(e.target.files[0]){
            let modal = that.modalService.open(UploaderComponent,{
                centered: true,
                keyboard: false
            });
            console.log(e.target.files[0]);
            modal.componentInstance.name = "上传企业营业执照";
            modal.componentInstance.width = 9;
            modal.componentInstance.height = 16;
            modal.componentInstance.fileData = e.target.files[0];

            // e.target.value = "";
            modal.result.then(res =>{
                if(res && res.image){
                    console.log(res);
                    // this.imageListener.emit(res.image);
                    this.businessLicense = res.image;
                }else{
                    this.warn.onWarn(Messages.UPLOAD.FAIL);
                }
            },rea =>{
                console.log(rea);
            })
        }


    }


    submit(e) {
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        if (that.infoForm.valid) {
            let info = that.infoForm.value;
            let params = Object.assign(info, that.params);
            if (that.userInfo.getCompanyId()) {
                params["companyId"] = that.userInfo.getCompanyId();
            }
            that.request.doPost({
                url: "createCompany",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        that.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        that.userInfo.setCompanyId(res.data.companyId);
                        that.state = 0;
                        that.resetByParam(params);
                        that.router.navigateByUrl("/rev/schedule/stay");
                    } else {
                        that.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    resetByParam(res) {
        this.base.setCompanyPhone(res["companyPhone"]);
        this.base.setPoint({
            lat: res["latitude"],
            lng: res["longitude"]
        });
        this.base.setAddress(res["address"]);
        this.base.setCityName(res["serviceCityName"]);
        this.base.setCityId(res["serviceCityId"]);
        this.base.setAreaId(res["serviceAreaId"]);
        this.base.setAreaName(res["serviceAreaName"]);

        this.base.setCompanyName(res["companyName"]);
        this.base.setLicense(res["businessLicense"]);
        this.base.setCode(res["code"]);
        this.base.setLegal(res["legaLperson"]);
        this.base.setPlace(res["place"]);
        this.base.setState(this.state);
        this.base.setIdCard(res["idCard"]);

    }


    uploadImg(img) {
        this.businessLicense = img;
    }

    deleteImg(e){
        e.stopPropagation();
        e.preventDefault();
        this.businessLicense = "";
        return false;
    }

    handleOk(src){
        this.isVisible = true;
        this.showImg = src;
    }

    handleCancel(){
        this.isVisible = false;
        this.showImg = null;
    }

    styleLicense(src){
        return {'background-image':'url('+((src.indexOf('?') > -1)?src:src+'?imageView/2/h/180')+')'};
    }

    placeChange(val:string){
        this.place = val;
    }
}
