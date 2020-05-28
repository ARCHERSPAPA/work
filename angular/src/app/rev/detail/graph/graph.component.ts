import {Component, OnInit} from '@angular/core';
import {QuoteService} from "../../../service/quote.service";
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {atob, equalToSame, getUrlName, showGraphByState} from "../../../model/methods";
import {Default} from "../../../model/constant";
import {UserService} from "../../../service/user.service";
import {ImgLargeComponent} from 'src/app/plugins/img-large/img-large.component';
import {HeaderService} from "../../../service/header.service";
import {UploaderMultisInfoComponent} from "../../../plugins/uploader-multis-info/uploader-multis-info.component";


import * as JSZip from "jszip";
import {saveAs} from "file-saver";
import axios from 'axios';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
    public graphName: string;
    public showBtnTextByState: boolean = false;

    public isVisible: boolean = false;
    public src: string

    public baseQuote: any;
    public designers: any;

    //状态锁定
    public locking: number = 0;

    //全部的图片信息
    public graphList: Array<any> = [];
    //全部文件信息
    public fileList: Array<any> = [];
    //删除图片信息
    public graphDeleteList: Array<any> = [];

    //数据加载
    public isSpinning: boolean = false;
    public tip: string = "数据加载中";

    //提示
    public graphTips: string = Messages.GRAPH_TIP.NOT_FINISH_AUDIT;
    public graphAuditFinish: boolean = false;
    public okText: string;

    constructor(private quote: QuoteService,
                private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private user: UserService,
                private header: HeaderService,
                private http: HttpClient) {
    }

    ngOnInit() {
        this.state = parseInt(this.activatedRoute.snapshot.paramMap.get("state"));

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params["cid"]) {
                this.cid = atob(params["cid"]);
                this.reloadContract(this.cid);
                this.quote.loadSubmitInfo(this.cid);
            }
        });

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

        if (this.showAuditByState()) {
            if (!this.locking) {
                this.graphAuditFinish = this.graphList.every(graph => graph["examineState"] === 1);
                this.graphTips = this.graphAuditFinish ? Messages.GRAPH_TIP.ALL_FINISH_AUDIT : Messages.GRAPH_TIP.NOT_FINISH_AUDIT;
                this.okText = this.graphAuditFinish ? '锁定' : '确定';
            } else {
                this.graphTips = Messages.GRAPH_TIP.RELEASE_LOCK;
                this.okText = "解除";
            }

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
    addGraph() {
        let uploadModal = this.modalService.open(UploaderMultisInfoComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });

        uploadModal.componentInstance.name = '上传图纸';
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
                        img["showType"] = 0;
                        img["type"] = 2;
                    });
                    this.graphList = this.graphList.concat(res);
                }

            },
            err => {
                console.log(err);
            });

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
     * 设置图片审核状态
     * @param e
     * @param {number} i
     * @param {number} state
     */
    setGraph(e: any, graph: any, state: number) {
        e.stopPropagation();
        e.preventDefault();
        graph["examineState"] = state;
        this.doAuditGraph(graph);
    }


    /**
     * 客户查看编辑
     * @param e
     * @param graph
     */
    seeGraph(e: any, graph: any) {
        e.stopPropagation();
        e.preventDefault();
        graph["showType"] = graph["showType"] ? 0 : 1;
    }

    /**
     *本地删除图片v2.2.3.1
     * @param e
     * @param {number} index 位置
     * @param {any} imgSource 图片源
     * @returns {boolean}
     */
    delGraph(e: any, index: number, imgSource: any) {
        e.stopPropagation();
        e.preventDefault();
        if (imgSource && imgSource.id) {
            this.graphDeleteList.push(imgSource);
        }
        this.graphList.splice(index, 1);
        return false;
    }

    /**
     * 删除文件信息
     * @param e
     * @param {number} index
     * @param file
     * @returns {boolean}
     */
    delFile(e: any, index: number, file: any) {
        e.stopPropagation();
        e.preventDefault();
        debugger
        if (file && file.id) {
            this.graphDeleteList.push(file);
        }
        this.fileList.splice(index, 1);
        return false;
    }

    /**
     * 放大图片
     * @param e
     * @param {number} index
     * @param {Array<any>} imgs
     */
    openModal(e: any, index: number, imgs: Array<any>) {
        e.stopPropagation();
        e.preventDefault();
        let modal = this.modalService.open(ImgLargeComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static",
            size: "lg"
        });

        modal.componentInstance.title = imgs[index].fileName?imgs[index].fileName:'查看大图';

        modal.componentInstance.index = index;

        modal.componentInstance.imgs = imgs;

        modal.componentInstance.isAudit = this.showAuditByState();

        modal.result.then(res => {
            console.log(res);
        }, rea => {
            console.log(rea);
        });
    }

    handleCancel() {
        this.isVisible = false;
        this.src = null;
    }


    // showBtnByState() {
    //     return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    // }

    /**
     * 展示查看
     * @returns {boolean}
     */
    showViewByState() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }

    //显示提交可查阅
    showSubmitByState() {
        return !showGraphByState(this.baseQuote) && equalToSame(this.user.getPhone(), this.designers) && this.state !== Default.STATE.ITEM_6 && this.baseQuote.retreat === 0 && this.locking === 0;
    }

    //显示审核并提交
    showAuditByState() {
        return !showGraphByState(this.baseQuote)  && this.state === Default.STATE.ITEM_6 && this.baseQuote.retreat === 0;
    }

    /**
     * 保存或者提交图片信息
     * @param e
     */
    doGraph(e: any) {
        e.stopPropagation();
        e.preventDefault();
        if (this.cid) {
            this.req.doPost({
                url: "submitDrawing",
                data: {
                    id: this.cid,
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

    /**
     * 提交时整理参数
     * @returns {any[]}
     */
    getGraphList() {
        let urls = [];

        //删除（只作已保存的）
        if (this.graphDeleteList && this.graphDeleteList.length > 0) {
            this.graphDeleteList.forEach(graph => {
                graph["operationType"] = 2;
                urls.push(graph);
            })
        }
        if (this.graphList && this.graphList.length > 0) {
            this.graphList.forEach(graph => {
                graph["operationType"] = 1;
                urls.push(graph);
            })
        }

        if (this.fileList && this.fileList.length > 0) {
            this.fileList.forEach(file => {
                file["operationType"] = 1;
                file["showType"] = 0;
                urls.push(file);
            });
        }

        return urls;
    }

    /**
     * 审核
     * @param e
     */
    doAuditGraph(graph: any) {
        if (graph && graph.id) {
            this.req.doPost({
                url: "auditDrawing",
                data: {
                    imgId: graph.id,
                    examineState: graph.examineState
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        this.reloadContract(this.cid);
                    }
                })
            })
        }
    }

    /**
     * 锁定
     */
    doLockGraph() {
        if (this.cid) {
            this.req.doPost({
                url: "lockDrawing",
                data: {
                    quoteId: this.cid,
                    locking: this.locking ? 0 : 1
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.reloadContract(this.cid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
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
        if (cid) {
            //删除历史
            this.isSpinning = true;
            this.graphDeleteList = [];
            this.req.doPost({
                url: "listDrawing",
                data: {id: cid},
                success: (res => {
                    this.isSpinning = false;
                    if (res && res.code == 200) {
                        if (res.data) {
                            this.locking = res.data["lockingDrawing"];

                            if (res.data["drawing"] && res.data["drawing"].length > 0) {
                                this.graphList = res.data["drawing"].filter(draw => {
                                    draw["url"] = draw["content"];
                                    return draw && draw.type === 2;
                                });
                                this.fileList = res.data["drawing"].filter(draw => {
                                    draw["mineType"] = this.getStateByMineType(draw["content"]);
                                    return draw && draw.type === 6;
                                });
                            } else {
                                this.graphList = [];
                                this.fileList = [];
                            }
                        }
                    }
                })
            });
        }

    }


    chunkDownImg(i, chunk, imgs) {
        let dsq = setTimeout(() => {
            let count = Math.ceil(imgs.length / chunk);
            if (i > count) {
                clearTimeout(dsq);
            }
            this.chunkDownload(imgs.slice(i * chunk, (i + 1) * chunk));
            i++;
            this.chunkDownImg(i, chunk, imgs);
        }, chunk * 1000)
    }

    /**
     * 下载全部图片
     * @param e
     */
    download(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.isSpinning = true;
        // let imgs = [];
        this.tip = "数据下载中";
        // if (this.graphList && this.graphList.length > 0) {
        //     this.graphList.forEach(graph => {
        //         imgs.push(graph);
        //     })
        // }
        if(this.graphList && this.graphList.length > 0){
            this.chunkDownload(this.graphList);
        }


    }

    chunkDownload(imgs: Array<string>) {
        let zip = new JSZip(), that = this, ps = [];
        // let headers = new HttpHeaders({
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        // })
        that.isSpinning = true;
        that.tip = "数据下载中";
        for (let i = 0; i < imgs.length; i++) {
          let p =  new Promise((resolve,reject) =>{
                axios.get(imgs[i]["url"], {
                    responseType: 'blob',
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function(res){
                    resolve({
                        data:res.data,
                        name:imgs[i]["fileName"]?imgs[i]["fileName"]:getUrlName(imgs[i]["url"])
                    });
                }).catch(function(error){
                    console.error(error);
                    reject(error);
                });
            });
          ps.push(p);
        }

        Promise.all(ps).then(data =>{
            if(data && data.length > 0){
                data.forEach((d,i) =>{
                    zip.file([i,d.name].join("."), d.data, {binary: true});
                });
                zip.generateAsync({
                    type:"blob"
                }).then((blob) =>{
                    saveAs(blob,"graph.zip");
                    that.isSpinning = false;
                    that.tip = "数据加载中";
                },err =>{
                    that.isSpinning = false;
                    that.tip = "数据加载中";
                    this.warn.onMsgError(JSON.stringify(err));
                })
            }
        });

    }


    getMineType(url: string) {
        let type = String(url.substring(url.lastIndexOf(".") + 1)).toLowerCase();
        switch (type) {
            case "jpg":
                return "image/jpg";
            case "gif":
                return "image/gif";
            case "png":
                return "image/png";
            default:
                return "image/png";
        }
    }


    /**
     * 上传文件
     */
    addFile() {
        const modalFile = this.modalService.open(UploaderMultisInfoComponent, {
            centered: true,
            keyboard: false,
            backdrop: "static"
        });
        modalFile.componentInstance.name = '上传文件';
        modalFile.componentInstance.cid = this.cid;
        modalFile.componentInstance.split = "file";
        modalFile.componentInstance.type = "file";
        modalFile.componentInstance.size = 300;
        modalFile.componentInstance.formatter = ["cdr", "dwg"];
        modalFile.result.then((result) => {
            console.log(result);

            if (result && result.length > 0) {
                result.forEach(file => {
                    file["mineType"] = this.getStateByMineType(file.src);
                    file["type"] = 6;
                    file["fileName"] = file.name;
                    delete file.name;
                    file["url"] = file.src;
                    delete file.src;

                });
                this.fileList = this.fileList.concat(result);
            }

        }, (reason) => {
            console.log(reason);
        });
    }

    /**
     * 下载文件
     * @param e
     * @param fileObj 文件
     */
    downFile(e: any, fileObj: any) {
        // let form = document.createElement("form");
        // form.setAttribute("method", "POST");
        // form.setAttribute("action", fileObj.url);
        // form.setAttribute("target", "_blank");
        // document.body.appendChild(form);
        // form.submit();
        // document.body.removeChild(form);
        let that = this;
        axios.get(fileObj.url, {
            responseType: 'blob',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function(res){
            saveAs(res.data,fileObj.fileName?fileObj.fileName:getUrlName(fileObj.url));
        }).catch(function(error){
            console.error(error);
            that.warn.onMsgError(JSON.stringify(error));
        });

    }

    //判断上传文件类型
    getStateByMineType(url) {
        let type = String(url.substring(url.lastIndexOf(".") + 1)).toLowerCase();
        switch (type) {
            case "cdr":
                return 1;
            case "dwg":
                return 2;
            case 'jpg':
            case 'png':
            case 'gif':
            case 'jpeg':
                return 3;
            default:
                return 4;
        }
    }

    //销毁
    ngOnDestroy() {
        this.graphList = null;
        this.fileList = null;
        this.quote.setSubmitInfo(null);
    }
}
