import { Component, OnInit, ViewChild, Input, Renderer, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from "../../../service/request.service";
import { WarningService } from "../../../service/warning.service";
import * as UserValidate from "./../../../validate/user-validate";
import { Messages } from "../../../model/msg";
import { getOptionName, getOptionTag, getOptionLetters,atob } from "../../../model/methods";
@Component({
    selector: 'rev-topic-title',
    templateUrl: './topic-title.component.html',
    styleUrls: ['./../../detail/detail.scss', './topic-title.component.scss']
})
export class TopicTitleComponent implements OnInit {

    @ViewChild("btns")
    private btns: ElementRef;
    /**
     * 传递title
     */
    @Input() title: string;
    /**
     * 右侧buttons
     * [{
        name:"按钮名称",
        type:"按钮事件",
        color:"按钮样式",
        method:() =>{
          执行函数
        }
      }]
     */
    @Input() buttons: Array<any>;

    @Input() atags: Array<any>;

    @Input() show: Boolean;

    //显示的数据
    @Input() nums: Array<any>;

    @Output() titleListener = new EventEmitter<any>();
    @Input() editListener;
    public addVisible: boolean = false;
    public modifyForm: FormGroup;
    public isVisible: boolean = false;
    public name: string;
    /**
         * type:1=>选择题,2=>填空题
         */
    public type: number;
    /**
     * 从一页添加过来
     */
    // public title: string;

    public switch: string;

    public questForm: FormGroup;
    /**
     * 题库id
     */
    public qid: string;
    /**
     * 具体题型id
     */
    public tid: string;
    //问题名称
    public questName: string;

    //问题类型(1:单选，2：多选)
    public radioValue: string = '1';
    //问题选择
    public isExam: boolean;//判断来源
    public checkboxOptions: Array<any>;
    constructor(private render: Renderer,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private req: RequestService,
        private warn: WarningService) { }

    ngOnInit() {
        this.renderList();                //初始化默认3个，不然要报错
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.eid) {
                this.qid = atob(params.eid);
                this.isExam = true;
            } else {
                this.qid = atob(params.qid);
            }
        })
        this.modifyForm = this.fb.group({
            name: [this.title, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100)
            ]]
        })
        this.questForm = this.fb.group({
            questName: [this.questName, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                UserValidate.ValidateInputTrim
            ]],
            radioValue: [this.radioValue, [
            ]],
        });
        this.getOptionControl();
    }

    renderList(i = 3, e = 0) {
        this.checkboxOptions = []
        this.checkboxOptions[0] = { 'content': '', 'checked': true }
        for (e; e < i - 1; e++) {
            this.checkboxOptions.push({ 'content': '', 'checked': false })
        }
    }

    getOptionTag(type) {
        return getOptionTag(type);
    }

    getOptionName(index) {
        return getOptionName(index);
    }

    getOptionLetter(index) {
        return getOptionLetters(index);
    }

    ngAfterViewInit() {
        if (this.buttons && this.buttons.length > 0) {
            let buttons = this.buttons;
            let btns = this.btns.nativeElement;
            for (let i = 0; i < buttons.length; i++) {
                let b = btns.querySelectorAll(".btn-me")[i];
                this.render.listen(b, buttons[i].type, buttons[i].method);
            }
        }
    }

    open() {
        this.isVisible = true;
        this.name = this.title;
    }
    ngDoCheck() {
        if (this.editListener) {
            this.addVisible = true;
            this.tid = this.editListener.id;
            this.questName = this.editListener.title;
            this.clearQuestForm();
            // 判断是填空还是选择
            if (this.editListener.options && this.editListener.options.length > 0) {
                this.editListener.rightType === 2 ? this.radioValue = '2' : this.radioValue = '1';  /*编辑的时候判断是单选还是多选*/
                if (this.isExam) {
                    this.type = 3;
                } else {
                    this.type = 1;
                }
                this.renderList(this.editListener.options.length);
                this.getOptionControl();
                this.editListener.options.forEach((i, index) => {
                    this.checkboxOptions[index].content = i.answer;
                    this.checkboxOptions[index].checked = i.right;
                })
            } else {

                this.renderList(this.editListener.answers.length);
                this.getOptionControl();
                if (this.isExam) {
                    this.type = 4;
                } else {
                    this.type = 2;
                }
                this.editListener.answers.forEach((i, index) => {
                    this.checkboxOptions[index].content = i;
                })
            }
            this.editListener = '';
        }
    }

    cancel() {
        this.isVisible = false;
        this.titleListener.emit(null);
        this.questName = '';
        this.titleListener.emit('isSubmit');
        this.addVisible = false;
        this.questForm.reset();
    }

    ok() {
        if (this.modifyForm.valid) {
            this.isVisible = false;
            this.titleListener.emit(this.modifyForm.value.name);
        }
    }
    /**
         * 添加新的验证服务
         */
    getOptionControl() {
        this.checkboxOptions.forEach((option, index) => {
            this.questForm.addControl('option' + index, this.fb.control(option.content,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(30),
                    UserValidate.ValidateInputTrim
                ])
            );
        })
    }

    getName() {
        let s = this.tid ? '编辑' : '添加';
        switch (this.type % 2) {
            case 1:
                return s + "选择题";
            case 0:
                return s + "填空题";
            default:
                return "";
        }
    }

    exist() {
        this.switch = "up";
        setTimeout(() => {
            if (this.type < 3) {
                this.router.navigate(["./../../detail"], { queryParams: { qid: this.qid }, relativeTo: this.activatedRoute });
            } else {
                this.router.navigate(["./../../../exam/detail"], { queryParams: { eid: this.qid }, relativeTo: this.activatedRoute });
            }
        }, 500)
    }

    /**
     * 本地添加选项
     * @param type
     */
    addOptions(type) {
        if (this.checkboxOptions.length >= 5 && (type === 1 || type === 3)) {
            this.warn.onWarn("添加选项最多5个");
            return;
        }
        if (this.checkboxOptions.length >= 3 && (type === 2 || type === 4)) {
            this.warn.onWarn("添加答案最多3个");
            return;
        }
        this.checkboxOptions.push({
            content: '',
            checked: false
        });
        let i = this.checkboxOptions.length - 1;
        this.questForm.addControl('option' + i, this.fb.control(
            this.checkboxOptions[i].content, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(30),
            UserValidate.ValidateInputTrim
        ])
        );
    }

    /**
     * 本地删除选项
     * @param i
     */
    removeOptions(i) {
        this.checkboxOptions.splice(i, 1);
        this.questForm.removeControl("option" + i);
    }

    check(option) {
        option.checked = !option.checked;
    }

    submit() {
        if (this.qid) {
            let params = {
                id: this.qid,
                title: this.questName.trim()
            };
            if (this.tid) {
                params["questionId"] = this.tid;
            }
            if (!this.justRadioByOptions() && this.type % 2 == 1) {
                this.warn.onWarn(Messages.SELECT_RADIO_EMPTY);
                return;
            }
            if (this.type === 1) {
                params["answerType"] = this.radioValue;
                params["options"] = this.getAnswers(this.checkboxOptions);
                this.req.doPost({
                    url: "choiceQuest",
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            this.titleListener.emit('isSubmit');
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            this.addVisible = false;

                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })

            }
            else if (this.type === 2) {
                params["answers"] = this.getOptions(this.checkboxOptions);
                this.req.doPost({
                    url: "clozeQuest",
                    data: params,
                    success: (res => {
                        this.titleListener.emit('isSubmit');
                        if (res && res.code == 200) {
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                            this.addVisible = false;
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }
            else if (this.type === 3) {
                params["answerType"] = this.radioValue;
                params["options"] = this.getAnswers(this.checkboxOptions);
                this.req.doPost({
                    url: "choiceExam",
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            this.titleListener.emit('isSubmit');
                            this.addVisible = false;

                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }
            else if (this.type === 4) {
                params["answers"] = this.getOptions(this.checkboxOptions);
                this.req.doPost({
                    url: "clozeExam",
                    data: params,
                    success: (res => {
                        if (res && res.code == 200) {
                            this.titleListener.emit('isSubmit');
                            this.addVisible = false;
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);

                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            }
        } else {
            this.warn.onWarn(Messages.PARAM_EMPTY);
        }
        this.renderList();
        this.getOptionControl();
        this.questForm.reset();
    }


    /**
     * 获取选择的选项内容
     * @param options
     * @returns {any[]}
     */
    getAnswers(options) {
        let answers = [];
        if (options && options.length > 0) {
            options.forEach(option => {
                answers.push({
                    answer: option.content.trim(),
                    right: option.checked
                });
            })
        }
        return answers;
    }

    /**
     * 获取填空选项内容
     * @param options
     * @returns {any[]}
     */
    getOptions(options) {
        let answers = [];
        if (options && options.length > 0) {
            options.forEach(option => {
                answers.push(option.content);
            })
        }
        return answers;
    }

    /**
     * 设置默认选项
     * @param num
     * @returns {any[]}
     */
    createDefaultOption(num) {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push({
                content: '',
                checked: i == 0 ? true : false
            });
        }
        return arr;
    }


    loadOptions(id) {
        if (id) {
            this.req.doPost({
                url: this.getOptionUrl(this.type),
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        let data = res.data;
                        this.questName = data.title ? data.title : "";
                        this.radioValue = data.rightType ? String(data.rightType) : "1";
                        if (this.type % 2 === 1) {
                            this.checkboxOptions = this.setOptions(data.options);
                        } else {
                            this.checkboxOptions = this.setAnswers(data.answers);
                        }
                        this.getOptionControl();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getOptionUrl(type) {
        switch (type) {
            case 1:
            case 2:
                return "detailInfoQuest";
            case 3:
            case 4:
                return "detailInfoExam";
            default:
                break;

        }
    }

    setOptions(options) {
        let arr = [];
        if (options && options.length > 0) {
            options.forEach(option => {
                arr.push({
                    content: option.answer,
                    checked: option.right
                })
            })
        }
        return arr;
    }

    setAnswers(answers) {
        let arr = [];
        if (answers && answers.length > 0) {
            answers.forEach(answer => {
                arr.push({
                    content: answer,
                    checked: false
                });
            })
        }
        return arr;
    }

    /**
     * 根据选择类型，判定是否单选或者多选
     */
    justRadioByOptions() {
        let radioCount = 0;
        if (this.checkboxOptions && this.checkboxOptions.length > 0) {
            this.checkboxOptions.forEach(option => {
                if (option.checked) {
                    radioCount++;
                }
            });
        }
        if (this.radioValue === '1') {
            if (radioCount === 1) return true;
            else return false;
        } else if (this.radioValue === '2') {
            if (radioCount >= 2) return true;
            else return false;
        }

    }


//    清空Form的formcontrol
    clearQuestForm() {
        for (let i = 0; i < 5; i++) {
            this.questForm.removeControl('option' + i)
        }
    }

    // 判断是考试还是题库，选择还是填空（1是填空）
    openAdd(btnType: number) {
        this.tid = '';
        if (this.isExam) {
            if (btnType === 1) {
                this.type = 4
                this.renderList(2, 1);
            } else {
                this.type = 3;
                this.renderList(3, 0);
                this.radioValue = '1';
            }
        } else {
            if (btnType === 1) {
                this.type = 2;
                this.renderList(2, 1);
            } else {
                this.type = 1;
                this.renderList(3, 0);
                this.radioValue = '1';
            }
        }
        this.addVisible = true;
        this.clearQuestForm();    // 先清空form，再添加
        this.getOptionControl();
    }

}
