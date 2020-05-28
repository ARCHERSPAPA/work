import {Component, OnInit} from '@angular/core';
import {QuoteService} from "../../../service/quote.service";
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {atob, equalToSame, showGraphByState} from "../../../model/methods";
import {Default, GRAPH_TEPES} from "../../../model/constant";
import {UserService} from "../../../service/user.service";
import {ImgLargeComponent} from 'src/app/plugins/img-large/img-large.component';
import {HeaderService} from "../../../service/header.service";
import {UploaderMultisInfoComponent} from "../../../plugins/uploader-multis-info/uploader-multis-info.component";

@Component({
    selector: 'rev-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./../detail.scss', './graph.component.scss']
})
export class GraphComponent implements OnInit {

    public state: number = Default.STATE.ITEM_1;

    public cid: string;


    //上传信息
    public graphInfo: any;
    //客户确认信息
    public graphName: string = "客户未确认";
    public showBtnTextByState: boolean = false;

    public isVisible: boolean = false;
    public src: string

    public baseQuote: any;
    public designers: any;

    //类型选择v2.2.3.1
    public graphTypes: Array<any> = GRAPH_TEPES;
    //选择类型 平层或者多层;
    public type: number = this.graphTypes[0].key;
    public typeTitle: string = this.graphTypes[0].value;
    //状态锁定
    public locking: string = '0';

    //上传图片类型(前后)
    public uploadBeforeTypes: Array<any> = [];
    public uploadAfterTypes: Array<any> = [];

    public graphBeforeList: Array<any> = [];
    public graphAfterList: Array<any> = [];

    public graphDeleteList: Array<any> = [];

    constructor(private quote: QuoteService,
                private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private user: UserService,
                private header: HeaderService) {
    }

    ngOnInit() {
        this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
                this.reloadContract(this.cid);
            }
        });


        if (this.cid) {
            this.quote.loadSubmitInfo(this.cid);
        }

        this.loadPhotos(this.type);

    }

    ngDoCheck() {

        if (this.quote.getSubmitInfo()) {
            this.graphInfo = this.quote.getSubmitInfo();
            this.showBtnTextByState = this.graphInfo.submitedDrawing;
            if (this.showBtnTextByState) {
                this.graphName = (this.graphInfo.customConfirmDrawing ? '客户已确认' : '客户尚未确认');
            }
        }

        if (this.header && this.header.getHeaderInfo() && this.header.getHeadBool()) {
            this.header.setHeadBool(false);
            this.baseQuote = this.header.getHeaderInfo()["quoteBase"];
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
     * 添加上传图片（多张上传） v2.2.3
     */
    // addDrawList() {
    //     let upload = this.modalService.open(UploaderMultisComponent, {
    //         centered: true,
    //         keyboard: false,
    //         backdrop: "static"
    //     });
    //     upload.componentInstance.name = Default.NAME.GRAPH;
    //     upload.componentInstance.cid = this.cid;
    //     upload.componentInstance.split = "graph";
    //     upload.result.then(res => {
    //         if (res && res.length > 0) {
    //             this.graphList = this.graphList.concat(res);
    //         }
    //     }, err => {
    //         console.log(err);
    //     })
    // }

    /**
     * 分类上传图片
     * @param uploadName 上传图片类型名称
     * @param type 类型
     */
    addGraph(upload) {
        let uploadModal = this.modalService.open(UploaderMultisInfoComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });

        uploadModal.componentInstance.name = upload.imgType;
        uploadModal.componentInstance.cid = this.cid;
        uploadModal.componentInstance.split = "graph";
        uploadModal.result.then(
            res => {
                if (res && res.length > 0) {
                    res.forEach(img => {
                        img["url"] = img.src;
                        delete img.src;
                        img["fileName"] = img.name;
                        delete img.name;
                        img["imgType"] = upload.imgType;
                        img["designStage"] = upload.designStage;
                        //图片操作类型 1:添加
                        img["operationType"] = 1;
                    })
                    this.renderAddGraph(upload.imgType, upload.designStage, res);
                }


            },
            err => {
                console.log(err);
            });

    }

    /**
     * 图片分类处理
     * @param type 图片分类
     * @param stage 前后查看
     * @param imgs 图片源
     */
    renderAddGraph(type, stage, imgs) {
        console.log(stage);
        let graphList = [];
        if (stage === 0) {
            graphList = this.graphBeforeList;
        } else {
            graphList = this.graphAfterList;
        }

        if (graphList && graphList.length > 0) {
            let fi = graphList.findIndex(item => item["imgType"] === type);
            console.log(fi);
            if (fi < 0) {
                graphList = graphList.concat(imgs);
            } else {
                let si = graphList.filter(item => item["imgType"] === type);
                graphList.splice(fi + si.length, 0, ...imgs);
            }
        } else {
            graphList = graphList.concat(imgs);
        }
        if (stage === 0) {
            this.graphBeforeList = graphList;
        } else {
            this.graphAfterList = graphList;
        }
    }

    /**
     * 删除图片 v2.2.3
     * @param e
     * @param {number} index
     * @returns {boolean}
     */
    // delDraw(e: any, index: number) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     this.graphList.splice(index, 1);
    //     return false;
    // }

    /**
     *本地删除图片v2.2.3.1
     * @param e
     * @param {number} index 位置
     * @param {number} type 类型（前后）
     * @param {any} imgSource 图片源
     * @returns {boolean}
     */
    delGraph(e: any, index: number, type: number, imgSource: any) {
        e.stopPropagation();
        e.preventDefault();
        if (imgSource && imgSource.id) {
            imgSource["operationType"] = 2;
            this.graphDeleteList.push(imgSource);
        }
        if (type === 0) {
            this.graphBeforeList.splice(index, 1);
        } else {
            this.graphAfterList.splice(index, 1);
        }
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


    // showBtnByState() {
    //     return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    // }

    //显示提交可查阅
    showSubmitByState() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }

    //显示审核并提交
    showAuditByState() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state === Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }

    /**
     * 保存或者提交图片信息
     * @param e
     */
    doGraph(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(this.getGraphList());
        if (this.cid) {
            this.req.doPost({
                url: "submitDrawing",
                data: {
                    id: this.cid,
                    designType: this.type,
                    urls: this.getGraphList()
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.loadSubmitInfo(this.cid);
                        this.reloadContract(this.cid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getGraphList() {
        let urls = [];
        //付款前的
        if (this.graphBeforeList && this.graphBeforeList.length > 0) {
            this.graphBeforeList.forEach(graph => {
                //付款前客户可查看
                graph["showType"] = 1;
                urls.push(graph);
            });
        }
        //付款后的
        if (this.graphAfterList && this.graphAfterList.length > 0) {
            this.graphAfterList.forEach(graph => {
                //付款后客户可查看
                graph["showType"] = 0;
                urls.push(graph);
            })
        }
        //删除（只作已保存的）
        if (this.graphDeleteList && this.graphDeleteList.length > 0) {
            this.graphDeleteList.forEach(graph => {
                urls.push(graph);
            })
        }
        return urls;
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
        //删除历史
        this.graphDeleteList = [];
        this.req.doPost({
            url: "listDrawing",
            data: {id: cid},
            success: (res => {
                console.log(res);
                if (res && res.code == 200) {
                    if(res.data){
                        this.type = res.data["designType"];
                        this.locking = res.data["lockingDrawing"];

                        if (res.data["drawing"] && res.data["drawing"].length > 0) {
                            let drawings = res.data["drawing"];
                            this.graphBeforeList = drawings.filter(draw => {
                                draw["url"] = draw.content;
                                return draw.designStage === 0;
                            });
                            this.graphAfterList = drawings.filter(draw => {
                                draw["url"] = draw.content;
                                return draw.designStage === 1;
                            })
                        }else{
                            this.graphBeforeList = [];
                            this.graphAfterList = [];
                        }
                    }
                }
            })
        });
        // this.quote.loadQuoteContract(cid)
        //     .then(data => {
        //         if (data && data["drawings"] && data["drawings"].length > 0) {
        //             let drawings = data["drawings"];
        //             this.graphBeforeList = drawings.filter(draw => {
        //                 draw["url"] = draw.content;
        //                 return draw.designStage === 0;
        //             });
        //             this.graphAfterList = drawings.filter(draw =>{
        //                 draw["url"] = draw.content;
        //                 return draw.designStage === 1;
        //             })
        //
        //         } else {
        //             this.graphAfterList = [];
        //             this.graphAfterList = [];
        //         }
        //     })
        //     .catch(err => {
        //         this.warn.onError(err);
        //     })
    }

    /**
     * 单选类型
     * @param {number} type
     */
    selectType(type: number) {
        this.type = type;
        this.typeTitle = this.graphTypes.filter(item => item.key === type)[0].value;
        this.loadPhotos(type);
    }

    change(e: any) {
        console.log(e);
    }

    /**
     * 根据不同类型选择加载图片设置
     */
    loadPhotos(type) {
        this.req.doPost({
            url: "listPhotos",
            data: {
                designType: type
            },
            success: (res => {
                if (res && res.code == 200) {
                    // this.photoSettings = res.data;
                    if (res.data && res.data.length > 0) {
                        this.uploadBeforeTypes = res.data.filter(item => item.designStage === 0);
                        this.uploadAfterTypes = res.data.filter(item => item.designStage === 1);
                    } else {
                        this.uploadBeforeTypes = [];
                        this.uploadAfterTypes = [];
                    }
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }

            })
        })
    }


    ngOnDestroy() {
        this.graphBeforeList = [];
        this.graphAfterList = [];
        this.quote.setSubmitInfo(null);
    }
}
