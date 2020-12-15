import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {equalZero} from "../../../model/methods";

@Component({
  selector: 'rev-item-details-customize',
  templateUrl: './item-details-customize.component.html',
  styleUrls: ['./item-details-customize.component.scss']
})
export class ItemDetailsCustomizeComponent implements OnInit {

    public baseForm:FormGroup;


    //字段名称
    public name:string;
    public brand:string;
    public spec:string;
    public model:string;
    public num:number;
    public sellingUnit:string;
    public unitPrice:number;
    public wastageRate:number;
    public carpenterPrice:number;
    public masonPrice:number;
    public japannerPrice:number;
    public utilityCharge:number;
    public remark:string;

    formatterPercent = (value: number) => { if (equalZero(value,"none") !== "none") {
        return `${value} %` }
    };
    parserPercent = (value: string) => value.replace(' %', '');

    @Output() cancel:EventEmitter<any> = new EventEmitter<any>();
    @Output() ok:EventEmitter<any> = new EventEmitter<any>();


    constructor(private fb:FormBuilder) {
    }

    ngOnInit() {
        this.baseForm = this.fb.group({
            sellingUnit: ['', [
                Validators.maxLength(10),
            ]],
            num: ['', [
                Validators.required,
                Validators.maxLength(10),
            ]],
            remark: ['', [
                Validators.maxLength(100),
            ]],
            name: ['', [
                Validators.required,
                Validators.maxLength(30),
            ]],
            brand: ['', [
                Validators.maxLength(10),
            ]],
            spec: ['', [
                Validators.maxLength(30),
            ]],
            model: ['', [
                Validators.maxLength(30),
            ]],
            wastageRate: ['', [
                Validators.maxLength(2),
            ]],
            carpenterPrice: ['', [
                Validators.maxLength(10),
            ]],
            masonPrice: ['', [
                Validators.maxLength(10),
            ]],
            japannerPrice: ['', [
                Validators.maxLength(10),
            ]],
            utilityCharge: ['', [
                Validators.maxLength(10),
            ]],
            unitPrice: ['', [
                Validators.required,
                Validators.maxLength(10),
            ]]
        });
    }


    cancelModal() {
        // this.modal.dismiss();
        this.cancel.emit(null);
    }

    confirmModal(e: any) {
        e.stopPropagation();
        e.preventDefault();
        if(this.baseForm.valid){
            // this.modal.close([this.baseForm.value]);
            this.ok.emit([this.baseForm.value]);
        }

    }

}
