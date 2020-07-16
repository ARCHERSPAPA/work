import {Component, OnInit} from '@angular/core';
import {RequestService} from '../../../service/request.service';
import {WarningService} from '../../../service/warning.service';
import {Messages} from '../../../model/msg';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as UserValidate from '../../../validate/user-validate';
import {getPayType, toInteger} from '../../../model/methods';

@Component({
    selector: 'rev-finance-temp',
    templateUrl: './finance-temp.component.html',
    styleUrls: ['./finance-temp.component.scss', '../finance.component.scss']
})
export class FinanceTempComponent implements OnInit {

    public tempList: any;

    public title: string;
    public buttons: Array<any>;


    //弹出框
    public tempTitle: string;
    public tempVisible = false;

    public tempForm: FormGroup;
    public tempName: string;
    public payList: Array<any>;
    public isEdit = false;
    public editId: number;


    constructor(private req: RequestService,
                private warn: WarningService,
                private fb: FormBuilder) {

    }

    ngOnInit() {
        this.title = '收款模板';
        this.tempForm = this.fb.group({
            tempName: [this.tempName, []]
        });

        this.buttons = [
            {
                name: '新建',
                color: 'btn-primary'
            }
        ];
        this.changeData();
    }

    delTemp(id) {
        this.req.doPost({
            url: 'delPayTemplate',
            data: {
                id: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);

                }
            }

        });
    }

    handleName(e: any) {
        if (e === this.buttons[0].name) {
            this.editTemp(null);
        }
    }


    /**
     * 获取数据源信息
     */
    changeData() {
        this.req.doPost({
            url: 'selectPayTemplate',
            success: res => {
                if (res && res.code == 200) {
                    this.tempList = res.data;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        });
    }

    /**
     * 获取期数
     * @param number
     */
    getNumber(number) {

       return `${number}期`;
    }

    /**
     * 设置默认
     *  * @param def 是否为默认0为非默认
     */
    defaultTemp(id: number, def: number) {
        this.req.doPost({
            url: 'updatePayTemplate',
            data: {
                defaultUse: 1,
                id: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);

                }
            }
        });
    }


    /**
     * 编辑模板或者新建模板
     * @param data
     */
    editTemp(data: any) {
        // console.log(data);
        this.isEdit = data ? true : false;
        this.tempTitle = this.isEdit ? '编辑模板' : '新增模板';
        this.tempVisible = true;
        this.payList = this.isEdit ? data.details : this.createPay();
        this.tempForm = this.fb.group(this.dramaticForm(this.payList, this.tempName));
        this.tempName = this.isEdit ? data.name : '';
        this.editId = this.isEdit ? data.id : null;
    }

    /**
     * 重新构建模板检测
     * @param pays
     * @returns {{}}
     */
    dramaticForm(pays, name) {
        const obj = {};
        if (pays && pays.length > 0) {
            for (let i = 0; i < pays.length; i++) {
                if (pays[i].type !== 9 ) {
                    obj['percentage' + i] = [pays[i].percentage, [
                        Validators.min(0),
                        Validators.max(100),
                        UserValidate.ValidateNumToInt
                    ]];
                }
                obj['payTime' + i] = [pays[i].payTime, [
                    Validators.maxLength(100)
                ]];
                obj['remark' + i] = [pays[i].remark, [
                    Validators.maxLength(100)
                ]];
            }
        }
        obj['tempName'] = [name, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(20)
        ]];
        return obj;
    }


    /**
     * 弹出框取消
     */
    tempCancel() {
        this.tempVisible = false;
        this.tempTitle = null;
        this.isEdit = false;
        this.tempName = null;
        this.changeData();
    }

    tempOk() {
        console.log(this.tempForm);
        if (this.tempForm.valid) {
            if (this.justPayIsEqaul(this.payList)) {
                const url = this.isEdit ? 'uptFinanceTemp' : 'addFinanceTemp';
                const params = {
                    name: this.tempName,
                    details: this.getDetails(this.payList)
                };
                if (this.isEdit) {
                    params['id'] =  this.editId;
                }

                this.req.doPost({
                    url: url,
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            this.warn.onMsgSuccess(res.msg || Messages.FAIL.DATA);
                            this.tempCancel();
                        } else {
                            this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                });

            } else {
                this.warn.onModalInfo({
                    title: '提示',
                    content: '请确保总比为100%',
                    ok: () => {
                        console.log('success');
                    }
                });
                return;
            }
        }
    }

    /**
     * 判定占比是否为1
     * @param list
     */
    justPayIsEqaul(list) {
        if (list && list.length > 0) {
            let total = 0;
            list.forEach(p => {
                total +=  Number(p.percentage);
            });
            return total === 100;
        }
        return false;
    }

    getDetails(list) {
        if (list && list.length > 0) {
            list.forEach(p => {
                p.percentage = p.percentage ? p.percentage : 0;
            });
            return list;
        }
        return list;
    }


    /**
     * 显示期数的中文
     * @param type
     * @returns {string}
     */
    getPayType(type) {
        return getPayType(type);
    }

    /**
     * 新建时默认值 设置
     * @returns {any[]}
     */
    createPay() {
        const pays = [];

        for (let i = 0; i < 9; i++) {
            if (i === 0) {
                pays.push({
                    type: 9,
                    percentage: null,
                    payTime: this.getPayTime(i),
                    remark: ''
                });
            } else {
                pays.push({
                    type: i,
                    percentage: null,
                    payTime: this.getPayTime(i),
                    remark: ''
                });
            }

        }
        return pays;
    }

    /**
     * 设置默认付款时间的期数
     * @param {number} i
     * @returns {string}
     */
    getPayTime(i: number) {
        switch (i) {
            case 0:
                return '合同签订之日';
            case 1:
                return '隐蔽工程验收3日内';
            case 2:
                return '竣工验收合格4日内';
            default:
                return '';
        }
    }


}
