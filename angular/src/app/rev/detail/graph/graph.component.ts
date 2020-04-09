import {Component, OnInit} from '@angular/core';
import {QuoteService} from "../../../service/quote.service";
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {atob, equalToSame, showGraphByState} from "../../../model/methods";
import {Default} from "../../../model/constant";
import {UserService} from "../../../service/user.service";
import {UploaderMultisComponent} from "../../../plugins/uploader-multis/uploader-multis.component";
import {ImgLargeComponent} from 'src/app/plugins/img-large/img-large.component';
import {HeaderService} from "../../../service/header.service";

@Component({
    selector: 'rev-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./../detail.scss', './graph.component.scss']
})
export class GraphComponent implements OnInit {

    public state: number = Default.STATE.ITEM_1;

    public cid: string;
    public graphList: Array<string> = [];

    //上传信息
    public graphInfo: any;

    public graphName: string = Default.NAME.GRAPH;
    public showBtnTextByState: boolean = false;

    public isVisible: boolean = false;
    public src: string

    public baseQuote: any;
    public designers: any;

    constructor(private quote: QuoteService,
                private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private user: UserService,
                private header:HeaderService) {
    }

    ngOnInit() {
        this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
                // this.quote.loadContract(this.cid);
                this.reloadContract(this.cid);
            }
        });


        if (this.cid) {
            this.quote.loadSubmitInfo(this.cid);
        }

    }

    ngDoCheck() {
        this.graphName = Default.NAME.GRAPH;
        if (this.quote.getSubmitInfo()) {
            this.graphInfo = this.quote.getSubmitInfo();
            this.showBtnTextByState = this.graphInfo.submitedDrawing;
            if (this.showBtnTextByState) {
                this.graphName = this.graphName + "  " + (this.graphInfo.customConfirmDrawing ? '客户已确认' : '客户尚未确认');
            }
        }

        if(this.header && this.header.getHeaderInfo() && this.header.getHeadBool()){
            this.header.setHeadBool(false);
            this.baseQuote =  this.header.getHeaderInfo()["quoteBase"];
            this.designers = this.header.getHeaderInfo()["designers"];
        }
    }

    /**
     * 重置图片
     * @param graphs
     * @returns {any[]}
     */
    resetGraph(graphs) {
        let images = [];
        if (graphs && graphs.length > 0) {
            for (let graph of graphs) {
                if (graph.content) {
                    images.push(graph.content);
                }
            }
        }
        return images;
    }

    /**
     * 添加上传图片（单张可裁剪）
     //  */
    // addDraw() {
    //     const modalRef = this.modalService.open(UploaderComponent, {
    //         centered: true,
    //         keyboard: false,
    //         backdrop: "static"
    //     });
    //     modalRef.componentInstance.name = Default.NAME.GRAPH;
    //     modalRef.componentInstance.width = 100;
    //     modalRef.componentInstance.height = 100;
    //     modalRef.result.then((result) => {
    //         if (result && result.image) {
    //             this.graphList.push(result.image);
    //         } else {
    //             this.warn.onWarn(Messages.ERROR.IMG_LARGE)
    //         }
    //     }, (reason) => {
    //         console.log(reason);
    //     });
    // }

    /**
     * 添加上传图片（多张上传）
     */
    addDrawList() {
        let upload = this.modalService.open(UploaderMultisComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });
        upload.componentInstance.name = Default.NAME.GRAPH;
        upload.componentInstance.cid = this.cid;
        upload.componentInstance.split = "graph";
        upload.result.then(res => {
            // console.log(res);
            if (res && res.length > 0) {
                this.graphList = this.graphList.concat(res);
                // console.log(this.graphList);
            }
        }, err => {
            console.log(err);
        })
    }

    /**
     * 删除图片
     * @param e
     * @param {number} index
     * @returns {boolean}
     */
    delDraw(e: any, index: number) {
        e.stopPropagation();
        e.preventDefault();
        this.graphList.splice(index, 1);
        // this.quote.setContract({drawing: this.graphList});
        return false;
    }

    /**
     * 放大图片
     * @param e
     * @param {string} src
     */
    openModal(e: any, src: string) {
        e.stopPropagation();
        e.preventDefault();
        let modal = this.modalService.open(ImgLargeComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static",
            size: "lg"
        });

        modal.componentInstance.title = "查看设计图纸";

        modal.componentInstance.src = src;

        modal.result.then(res => {
            console.log(res);
        }, rea => {
            console.log(rea);
        })


        // this.isVisible = true;
        // this.src = src;
    }

    handleCancel() {
        this.isVisible = false;
        this.src = null;
    }


    showBtnByState() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }

    /**
     * 保存或者提交图片信息
     * @param e
     */
    doGraph(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.cid) {
            this.req.doPost({
                url: "submitDrawing",
                data: {
                    id: this.cid,
                    urls: this.graphList
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.loadSubmitInfo(this.cid);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    /**
     * 显示设置
     * @param src
     * @returns {{"background-image": string; "background-size": string}}
     */
    styleBg(src) {
        return {
            "background-image": "url(" + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/160/h/160') + ")",
            "background-size": "100% 100%"
        }
    }

    /**
     * 拉取数据
     * @param cid
     */
    reloadContract(cid) {
        this.quote.loadQuoteContract(cid)
            .then(data =>{
                if(data && data["drawings"] && data["drawings"].length > 0){
                    data["drawings"].forEach(draw =>{
                        this.graphList.push(draw.content);
                    })
                }else{
                    this.graphList = [];
                }
            })
            .catch(err => {
                this.warn.onError(err);
            })
    }


    ngOnDestroy() {
        this.graphList = [];
        this.quote.setSubmitInfo(null);
    }
}
