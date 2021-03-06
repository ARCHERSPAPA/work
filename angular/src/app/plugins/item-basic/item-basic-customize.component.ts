import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
// import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'rev-item-basic-customize',
    template: `<rev-item-details-customize (ok)="handleItemOk($event)"
                            (cancel)="handleItemCancel()"></rev-item-details-customize>`,
})
export class ItemBasicCustomizeComponent implements OnInit {

    // public baseForm:FormGroup;
    // //字段名称
    // public name:string;
    // public brand:string;
    // public spec:string;
    // public model:string;
    // public num:number;
    // public sellingUnit:string;
    // public unitPrice:number;
    // public wastageRate:number;
    // public carpenterPrice:number;
    // public masonPrice:number;
    // public japannerPrice:number;
    // public utilityCharge:number;
    // public remark:string;

    // formatterPercent = (value: number) => { if (value) { return `${value} %` } };
    // parserPercent = (value: string) => value.replace(' %', '');

    constructor(public modal: NgbActiveModal) {}

    ngOnInit() {
        // this.baseForm = this.fb.group({
        //     sellingUnit: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     num: ['', [
        //         Validators.required,
        //         Validators.maxLength(10),
        //     ]],
        //     remark: ['', [
        //         Validators.maxLength(100),
        //     ]],
        //     name: ['', [
        //         Validators.required,
        //         Validators.maxLength(30),
        //     ]],
        //     brand: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     spec: ['', [
        //         Validators.maxLength(30),
        //     ]],
        //     model: ['', [
        //         Validators.maxLength(30),
        //     ]],
        //     wastageRate: ['', [
        //         Validators.maxLength(2),
        //     ]],
        //     carpenterPrice: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     masonPrice: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     japannerPrice: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     utilityCharge: ['', [
        //         Validators.maxLength(10),
        //     ]],
        //     unitPrice: ['', [
        //         Validators.required,
        //         Validators.maxLength(10),
        //     ]]
        // });
    }


    // cancelModal() {
    //     this.modal.dismiss();
    // }
    //
    // confirmModal(e: any) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if(this.baseForm.valid){
    //         this.modal.close([this.baseForm.value]);
    //     }
    //
    // }
    handleItemOk(e:any){
        this.modal.close(e);
    }

    handleItemCancel(){
        this.modal.dismiss();
    }

}
