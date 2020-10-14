import { Component, OnInit } from '@angular/core';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { RequestService } from '../../../../service/request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rev-settle-detail-schedule',
  templateUrl: './settle-detail-schedule.component.html',
  styleUrls: ['./settle-detail-schedule.component.scss']
})
export class SettleDetailScheduleComponent implements OnInit {

    public nodeList:Array<any> = []; // 节点列表
    public imgsArr:Array<any> = []; //显示大图的图片
    public index = 0; //图片索引

    constructor(private req: RequestService,
        private warn: WarningService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['id']) {
                let orderId = atob(params.id);
                this.getProgressList(orderId);
            }
        });
    }
    
    getProgressList(orderId){
        this.req.doPost({
            url: 'orderMaterialProcess',
            data:{orderId},
            success: (res => {
                if (res && res.code == 200) {
                    this.nodeList = res.data
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /** 
     * 颜色展示
     * @param {number} state  0-未到达节点, 1-当前节点，2-已完成节点
     * type 11-撤回
     * @returns {string}
     */
    showColor(state,type){
        if(state == 0){
            return '#818181';
        }else if(state == 1){
            return 'blue'
        }else{
            if(type == 11){
                return 'red'
            }else{
                return 'green';
            }
        }
    }
	
	// 显示大图
    openBigImg(img){
        this.imgsArr = [];
        this.imgsArr.push({ src: img, thumb: img });
    }

}
