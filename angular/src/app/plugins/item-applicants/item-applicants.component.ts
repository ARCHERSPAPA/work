import {Component, OnInit, Input} from '@angular/core';
import {RequestService} from '../../service/request.service';
import {WarningService} from '../../service/warning.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ExamService} from '../../service/exam.service';

@Component({
    selector: 'rev-item-applicants',
    templateUrl: './item-applicants.component.html',
    styleUrls: ['./item-applicants.component.scss']
})
export class ItemApplicantsComponent implements OnInit {
    /**
     * 考试id
     */
    @Input() eid: string;
    public title: string;
    public switch: string;


    //查询
    public name: string;
    public items: Array<any> = [];

    public total = 0;
    public notPass = 0;
    public notPassItems: Array<any> = [];

    public pass = 0;
    public passItems: Array<any> = [];

    public notTest = 0;
    public notTestItems: Array<any> = [];

    public activeId = 0;
    public loading = true;


    constructor(private request: RequestService,
                private warn: WarningService,
                public modal: NgbActiveModal,
                private exam: ExamService) {
    }

    ngOnInit() {
        this.title = '查看人员';
        this.switch = 'up';
        this.exam.loadExamList(this.eid, 0);
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.switch = 'down';
            if (this.exam.getExamList()) {
                this.loading = false;
                this.items = this.exam.getExamList();
                this.notTestItems = this.getItemByState(1);
                this.passItems = this.getItemByState(3);
                this.notPassItems = this.getItemByState(2);
                this.items.forEach(item => {
                    if (item.state === 1) {
                        this.notTest ++;
                    } else if (item.state === 3) {
                        this.pass ++;
                    } else if (item.state === 2) {
                        this.notPass ++;
                    }
                });
                this.total = this.items.length;
            }
        }, 1500);
    }

    cancel() {
        this.modal.dismiss(null);
    }

    selectItem(id) {
        this.activeId = id;
    }

    getItemByState(state) {
        return this.items.filter(item => {
            if (item.state === state) { return item; }
        });
    }

}
