import {Component, OnInit} from '@angular/core';
import {Messages} from '../../../../model/msg';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as UserValidate from '../../../../validate/user-validate';

import {WarningService} from '../../../../service/warning.service';
import {RequestService} from '../../../../service/request.service';
import {setStyleBg} from 'src/app/model/methods';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import pinyin from 'js-pinyin'
import {UploaderComponent} from '../../../../plugins/uploader/uploader.component';

@Component({
    selector: 'rev-supplier-material-add',
    templateUrl: './supplier-material-add.component.html',
    styleUrls: ['./supplier-material-add.component.scss']
})
export class SupplierMaterialAddComponent implements OnInit {
    public materialForm;
    public SocialCreditCode: number;
    public phone: number;
    public companyName: string;
    public companyShortName: string;
    public juridicalPerson;
    public juridicalCode;
    public license;
    public serveCode;
    //监听code 是否已经修改过
    public serveCodeMonitor:boolean = false;
    public codeFace;
    public codeBackFace;
    public cooperationAgreement;
    public _albums = [];
    public index = 0;

    constructor(
        private fb: FormBuilder,
        private req: RequestService,
        private warn: WarningService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        this.materialForm = this.fb.group({
            SocialCreditCode: [this.SocialCreditCode, [
                Validators.required,
                Validators.minLength(18),
            ]],
            phone: [this.phone, [
                Validators.required,
                Validators.maxLength(11),
                UserValidate.ValidatePhone
            ]],
            companyName: [this.companyName, [
                Validators.required,
                Validators.maxLength(30),
            ]],
            companyShortName: [this.companyShortName, [
                Validators.required,
                Validators.maxLength(10),
            ]],
            juridicalPerson: [this.juridicalPerson, [
                Validators.required,
                Validators.maxLength(10),
                Validators.minLength(2),
            ]],
            juridicalCode: [this.juridicalCode, [
                Validators.required,
                Validators.minLength(15),
                Validators.maxLength(18),
                UserValidate.ValidateIdCard
            ]],
            serveCode: [this.serveCode, [
                Validators.required,
                Validators.minLength(3),
                UserValidate.ValidateServeCard
            ]],
        });
    }

    addVerify(type) {
        let name
        switch (type) {
            case 1:
                name = '上传身份证正面'
                break;
            case 2:
                name = '上传身份证背面'
                break;
            case 3:
                name = '上传营业执照'
                break;
            case 4:
                name = '上传合作协议'
                break;
            default:
                break;
        }
        const modalRef = this.modalService.open(UploaderComponent, {
            centered: true,
            keyboard: false
        });
        modalRef.componentInstance.name = name + "(请选择2M以内的图片)";
        modalRef.componentInstance.width = 10;
        modalRef.componentInstance.height = 10;
        modalRef.componentInstance.size = 2;
        modalRef.result.then((result) => {
            switch (type) {
                case 1:
                    this.codeFace = result.image;
                    break;
                case 2:
                    this.codeBackFace = result.image;
                    break;
                case 3:
                    this.license = result.image;
                    break;
                case 4:
                    this.cooperationAgreement = result.image;
                    break;
                default:
                    break;
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    check(e, v) {
        let param = {};
        let url
        if (e == 1 && v) {
            param['code'] = v;
            url = 'codeRepeatVerify'
        }

        if (e == 2 && v) {
            url = 'shortCodeVerify'  //校验编号
            pinyin.setOptions({checkPolyphone: false, charCase: 0});
            if(!this.serveCodeMonitor){
                if (v.length > 1) {
                    this.serveCode = pinyin.getCamelChars(v).substr(0, 3).toLocaleUpperCase();
                } else {
                    this.serveCode = '';
                }
            }
            param['supplierNumber'] = this.serveCode
        }
        if (e == 3 && v) {
            param['companyPhone'] = v;
            url = 'companyPhoneVerify'  //校验手机号

        }
        if (e == 4 && v) {
            this.serveCodeMonitor = true;
            param['supplierNumber'] = pinyin.getCamelChars(v).substr(0, 3).toLocaleUpperCase();
            url = 'shortCodeVerify'  //校验简称

        }
        if (v) {
            this.req.doPost({
                url: url,
                data: param,
                success: res => {
                    if (res && res.code == 200) {
                        if (res.data && res.data.code != 200) {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                }
            })
        }
    }

    checkImg() {
        if (this.codeFace && this.codeBackFace && this.license && this.cooperationAgreement && this.materialForm.valid) {
            return false;
        } else {
            return true;
        }
    }

    openLarge(src) {
        this._albums = [];
        this._albums.push({src: src, thumb: src});
        ;
    }

    handleOk($event) {
        this.req.doPost({
            url: 'createCompanyMateriail',
            data: {
                companyName: this.companyName,
                abbreviation: this.companyShortName,
                companyPhone: this.phone,
                code: this.SocialCreditCode,
                businessLicense: this.license,
                idCardImgPositive: this.codeFace,
                idCardImgback: this.codeBackFace,
                cooperationAgreement: this.cooperationAgreement,
                legaLperson: this.juridicalPerson,
                idCard: this.juridicalCode,
                supplierNumber: this.serveCode
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    history.back()
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }

        })
    }

    delImg(type) {
        switch (type) {
            case 1:
                this.codeFace = ''
                break;
            case 2:
                this.codeBackFace = ''
                break;
            case 3:
                this.license = ''
                break;
            case 4:
                this.cooperationAgreement = ''
                break;
            default:
                break;
        }
    }

    handleCancel() {
        history.back();
    }

    styleImg(img) {
        return setStyleBg(img, 96, 96);
    }
}
