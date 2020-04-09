import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from "../../../../service/request.service";
import { WarningService } from "../../../../service/warning.service";
import { Messages } from "../../../../model/msg";
import { getOptionName, getOptionTag,getOptionLetters,atob } from "../../../../model/methods";
import { Reg } from "../../../../model/reg";

@Component({
    selector: 'rev-question-detail',
    templateUrl: './question-detail.component.html',
    styleUrls: ['./../question.component.scss','./question-detail.component.scss'],

})
export class QuestionDetailComponent implements OnInit {

    public title: string;
    public switch: string;
    public atags: Array<any>;
    public nums: Array<any>;
    public isDetail: number;
    //题库id
    public qid: string;
    public quests: Array<any>;
 
    //查询条件
    // public content: string;
    // public searchForm: FormGroup;
    
    public editList;//编辑时传递数据到topic-title
    private initTitle: string;
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private req: RequestService,
        private warn: WarningService) {
    }

    ngOnInit() {
        this.title = "题库标题";
        this.nums = [
            {
                name: "选择题",
                count: 0
            },
            {
                name: "填空题",
                count: 0
            }
        ];

        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params["qid"]) {
                this.qid = atob(params["qid"]);
                this.isDetail = params['isDetail']
                this.atags = [
                    {
                        name: "添加选择题",
                        type: "click",
                        color: "btn-primary",
                    },
                    {
                        name: "添加填空题",
                        type: "click",
                        color: "btn-primary",
                    }
                ];
            }
        })
        this.loadQuest(this.qid);
        this.loadQuestDetail(this.qid);
        this.atags = [
            {
                name: "添加选择题",
                type: "click",
                color: "btn-primary",
            },
            {
                name: "添加填空题",
                type: "click",
                color: "btn-primary",
            }
        ];
    }

    ngDoCheck() {
        this.getQuestAmout();
    }

    changeTitle(e) {
        if (e == 'isSubmit') {
            this.loadQuestDetail(this.qid);
        } else {
            if (e) {
                this.req.doPost({
                    url: "modifyQuest",
                    data: {
                        id: this.qid,
                        title: e
                    },
                    success: (res => {
                        if (res && res.code == 200) {
                            this.title = e;
                            this.initTitle = e;
                            this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        } else {
                            this.warn.onError(res.msg || Messages.FAIL.DATA);
                        }
                    })
                })
            } else {
                this.title = this.initTitle;
            }
        }
    }

    loadQuest(id) {
        if (id) {
            this.req.doPost({
                url: "detailQuest",
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        let data = res.data;
                        this.title = data.title ? data.title : '标题名称';
                        this.initTitle = data.title ? data.title : '标题名称';
                        this.nums[0].count = data.choiceNum;
                        this.nums[1].count = data.clozeNum;
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    loadQuestDetail(id) {
        if (id) {
            this.req.doPost({
                url: "detailItemsQuest",
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.quests = res.data ? res.data : [];
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }


    getOptionName(index) {
        return getOptionName(index);
    }

    getOptionTag(type) {
        return getOptionTag(type);
    }

    getOptionLetter(index){
        return getOptionLetters(index);
    }

    getQuestAmout() {
        if (this.quests && this.quests.length > 0) {
            this.nums[0].count = 0;
            this.nums[1].count = 0;
            this.quests.forEach(quest => {
                if (quest.type === 1) {
                    this.nums[0].count++;
                } else if (quest.type === 2) {
                    this.nums[1].count++;
                }
            })
        }
    }


    /**
     * 编辑
     * @param type: 1->选择题,2->填空题
     * @param id
     */
    editItem(i) {
        this.editList=i;
    }

    /**
     * 删除
     * @param id
     */
    deleteItem(id) {
        if (id) {
            this.req.doPost({
                url: "deleteItemQuest",
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadQuestDetail(this.qid);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 上移或者下移
     * @param id
     * @param bool: true->上移,false->下移
     */
    moveItem(id, bool) {
        if (id) {
            this.req.doPost({
                url: "moveQuest",
                data: {
                    id: id,
                    type: bool ? 1 : -1
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.loadQuestDetail(this.qid);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    styleItem(item) {
        let divide = 1;
        if (item.title) {
            if (item.title.match(Reg.ALPHA_NUM_ZH_BLANK).join("").length > 60) {
                divide = item.title ? Math.ceil(item.title.length / 110) : 1;
            } else {
                divide = item.title ? Math.ceil(item.title.length / 60) : 1;
            }
        }
        if (item.type === 1) {
            if (item.options.length <= 2) return ((divide * 24) / 2) + "px";
            else
                return ((Math.abs(item.options.length - divide) * 24) / 2) + "px";
        } else if (item.type === 2) {
            if (item.answers.length <= 2) return ((divide * 24) / 2) + "px";
            else
                return ((Math.abs(item.answers.length - divide) * 24) / 2) + "px";
        }
    }

    getDecode(item) {
        return decodeURIComponent(item);
    }

}
