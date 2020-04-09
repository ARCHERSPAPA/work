import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestService} from "../../service/request.service";
import {WarningService} from "../../service/warning.service";
import {Default} from "../../model/constant";
import {showBindNameByState} from "../../model/methods";

@Component({
    selector: 'rev-equip',
    templateUrl: './equip.component.html',
    styleUrls: ['./equip.component.scss']
})
export class EquipComponent implements OnInit {

    public title: string;

    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    public equipList: any;

    public selectId: number;

    constructor(private modal: NgbActiveModal,
                private req: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {
        this.title = "绑定设备";
        this.changeData();
    }

    changeData() {
        this.req.doPost({
            url: "listEquip",
            data: {
                page: this.pageNo,
                pageSize: this.pageSize
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.equipList = res.data.list;
                    this.total = res.data && res.data.total ? res.data.total : this.total;
                }
            })
        })
    }

    cancel() {
        this.modal.dismiss();
    }

    send() {
        this.modal.close({bindId: this.selectId});
    }

    selectEquip(id: number) {
        this.selectId = id;
    }

    showBindNameByState(state) {
        return showBindNameByState(state);
    }

}
