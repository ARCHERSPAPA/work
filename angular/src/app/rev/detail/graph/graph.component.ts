import {Component, OnInit} from '@angular/core';
import {QuoteService} from '../../../service/quote.service';
import {Messages} from '../../../model/msg';
import {RequestService} from '../../../service/request.service';
import {WarningService} from '../../../service/warning.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {atob, getUrlName, showGraphByState} from '../../../model/methods';
import {Default} from '../../../model/constant';
import {UserService} from '../../../service/user.service';
import {ImgLargeComponent} from 'src/app/plugins/img-large/img-large.component';
import {HeaderService} from '../../../service/header.service';
import {UploaderMultisInfoComponent} from '../../../plugins/uploader-multis-info/uploader-multis-info.component';


// import * as JSZip from "jszip";
// import {saveAs} from "file-saver";
// import axios from 'axios';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {downloadFile, downloadFiles} from '../../../model/download-method';




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


    public isVisible = false;
    public src: string;

    public baseQuote: any;
    public designers: any;

    //状态锁定
    public locking = 0;

    //全部的图片信息
    public graphList: Array<any> = [];
    //全部文件信息
    public fileList: Array<any> = [];
    //删除图片信息
    // public graphDeleteList: Array<any> = [];

    //数据加载
    public isSpinning = false;
    public tip = '数据加载中';

    //提示
    public graphTips: string = Messages.GRAPH_TIP.NOT_FINISH_AUDIT;
    public graphAuditFinish = false;
    public okText: string;

    //图纸查阅
    public showGraph = false;
    public okReadText: string;
    public showGraphTips: string = Messages.GRAPH_TIP.READ_ALL;


    //客户提示
    public showCustomerTips: string;
    public okCustomerText: string;
    public switchCustomer = false;

    //客户确认信息
    public graphName: string;
    public showCustomerState = false;
    public confirmGraph = 0;


    constructor(private quote: QuoteService,
                private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private user: UserService,
                private header: HeaderService) {

    }

    ngOnInit() {
        this.state = parseInt(this.activatedRoute.snapshot.paramMap.get('state'));

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['cid']) {
                this.cid = atob(params['cid']);
                this.reloadContract(this.cid);
                this.quote.loadSubmitInfo(this.cid);
            }
        });

    }

    ngDoCheck() {

        if (this.quote.getSubmitInfo()) {
            this.graphInfo = this.quote.getSubmitInfo();
            if (this.graphList && this.graphList.length > 0) {
                let confirm = 0, total = 0;
                //客户确认数量
                confirm = this.graphList.filter(graph => graph.confirmState === 1).length;
                //已提交到客户的数量
                total = this.graphList.filter(graph => graph.submitted === 1).length;

                this.showCustomerState = total > 0 ? true : false;
                if (this.showCustomerState) {
                    this.confirmGraph = confirm;
                    if (confirm > 0 && confirm < total) {
                        this.graphName = `客户部分确认${confirm}/${total}`;
                    } else if (confirm === total) {
                        this.graphName = '客户已全部确认';
                    } else {
                        this.graphName = '客户尚未确认';
                    }
                }

            } else {
                this.showCustomerState = false;
            }
        }

        if (this.header && this.header.getHeaderInfo() && this.header.getHeadBool()) {
            this.header.setHeadBool(false);
            this.baseQuote = this.header.getHeaderInfo()['quoteBase'];
            this.designers = this.header.getHeaderInfo()['designers'];
        }

        if (this.showAuditByState()) {
            if (!this.locking) {
                this.graphAuditFinish = this.graphList.every(graph => graph['examineState'] === 1);
                this.graphTips = this.graphAuditFinish ? Messages.GRAPH_TIP.ALL_FINISH_AUDIT : Messages.GRAPH_TIP.NOT_FINISH_AUDIT;
                this.okText = this.graphAuditFinish ? '锁定' : '确定';
            } else {
                this.graphTips = Messages.GRAPH_TIP.RELEASE_LOCK;
                this.okText = '解除';
            }
        }

        if (this.graphList && this.graphList.length > 0) {
            this.showGraph = this.graphList.every(graph => graph['showType'] === 1);
            this.showGraphTips = this.showGraph ? Messages.GRAPH_TIP.READ_NOT_ALL : Messages.GRAPH_TIP.READ_ALL;
            this.okReadText = this.showGraph ? '不可阅' : '可阅';
            this.switchCustomer = this.justView(this.graphList);
            this.showCustomerTips = this.switchCustomer ? Messages.GRAPH_TIP.CUSTOMER_EXIST_VIEW : Messages.GRAPH_TIP.CUSTOMER_NOT_ALL;
            this.okCustomerText = this.switchCustomer ? '提交' : '确定';
        } else {
            this.showGraphTips = '请上传图纸';
            this.showCustomerTips = Messages.GRAPH_TIP.CUSTOMER_NOT_ALL;
            this.okReadText = '确定';
            this.okCustomerText = '确定';
        }


    }

    /**
     * 判定图片信息中至少有可查看的图片
     * @param {Array<any>} list
     */
    justView(list: Array<any>) {
        if (list && list.length > 0) {
            return list.some(img => img.showType === 1);
        }
        return false;
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
        // this.reloadContract(this.cid)
        const that = this;
        that.loadContract(that.cid).then(res => {
            if (res.data) {
                that.locking = res.data['lockingDrawing'];
            }
            if (that.locking) {
                that.warn.onMsgWarn(Messages.GRAPH_TIP.GRAPH_LOCK);
                return;
            } else {
                const uploadModal = that.modalService.open(UploaderMultisInfoComponent, {
                    centered: true,
                    keyboard: false,
                    backdrop: 'static'
                });

                uploadModal.componentInstance.name = '上传图纸';
                uploadModal.componentInstance.cid = that.cid;
                uploadModal.componentInstance.split = 'graph';
                uploadModal.componentInstance.total = 50;

                uploadModal.result.then(
                    res => {
                        if (res && res.length > 0) {
                            res.forEach(img => {
                                img['url'] = img.src;
                                delete img.src;
                                img['fileName'] = img.name;
                                delete img.name;
                                // img["showType"] = 0;
                                img['type'] = 2;
                            });

                            that.uploadGraphs(res);

                        }

                    },
                    err => {
                        console.log(err);
                    });
            }
        });



    }


    /**
     * 上传文件或者图片
     * @param imgs
     */
    uploadGraphs(imgs) {
        if (imgs && imgs.length > 0) {
            this.req.doPost({
                url: 'addDrawings',
                data: {
                    quoteId: this.cid,
                    imgs: imgs,
                },
                success: (res) => {
                    console.log(res);
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.reloadContract(this.cid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }

                },
                fail: (err) => {
                    console.log(err);
                }
            });
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
     * 设置图片审核状态
     * @param e
     * @param {number} i
     * @param {number} state
     */
    setGraph(e: any, graph: any, state: number) {
        e.stopPropagation();
        e.preventDefault();
        graph['examineState'] = state;
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
        graph['showType'] = graph['showType'] ? 0 : 1;
    }

    /**
     *本地删除图片v2.2.3.1
     * @param e
     * @param {number} index 位置
     * @param {any} imgSource 图片源
     * @returns {boolean}
     */
    // delGraph(e: any, index: number, imgSource: any) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if (imgSource && imgSource.id) {
    //         this.graphDeleteList.push(imgSource);
    //     }
    //     this.graphList.splice(index, 1);
    //     return false;
    // }

    /**
     * 删除图纸信息
     * @param e
     * @param {number} index 位置
     * @param img 图纸信息
     */
    delGraph(e: any, index: number, img: any) {
        e.stopPropagation();
        e.preventDefault();
        console.log(img);
        if (img && img.id) {
            this.req.doPost({
                url: 'delDrawing',
                data: {id: img.id},
                success: (res) => {
                    console.log(res);
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        if (img.type === 2) {
                            this.graphList.splice(index, 1);
                        } else if (img.type === 6) {
                            this.fileList.splice(index, 1);
                        } else {
                            this.reloadContract(this.cid);
                        }

                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                },
                fail: (err) => {
                    console.log(err);
                    this.warn.onMsgWarn(JSON.stringify(err));
                }
            });
        }
    }

    /**
     * 删除文件信息
     * @param e
     * @param {number} index
     * @param file
     * @returns {boolean}
     */
    // delFile(e: any, index: number, file: any) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if (file && file.id) {
    //         this.graphDeleteList.push(file);
    //     }
    //     this.fileList.splice(index, 1);
    //     return false;
    // }

    /**
     * 放大图片
     * @param e
     * @param {number} index
     * @param {Array<any>} imgs
     */
    openModal(e: any, index: number, imgs: Array<any>) {
        e.stopPropagation();
        e.preventDefault();
        const modal = this.modalService.open(ImgLargeComponent, {
            centered: true,
            keyboard: false,
            backdrop: 'static',
            size: 'lg'
        });

        modal.componentInstance.title = imgs[index].fileName ? imgs[index].fileName : '查看大图';

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
        return !showGraphByState(this.baseQuote)  && this.state !== Default.STATE.ITEM_6 && (this.baseQuote && this.baseQuote.retreat === 0);
    }

    //显示提交可查阅
    showSubmitByState() {
        return !showGraphByState(this.baseQuote) && this.state !== Default.STATE.ITEM_6 && (this.baseQuote && this.baseQuote.retreat === 0) && this.locking === 0;
    }

    //显示审核并提交
    showAuditByState() {
        return !showGraphByState(this.baseQuote) && this.state === Default.STATE.ITEM_6 && (this.baseQuote && this.baseQuote.retreat === 0);
    }

    /**
     * 是否显示功能
     * @returns {boolean} 状态关闭或者竣工或者撤回
     * v2.2.4 2020.06.09 dh 更新提交只限定于报价可提交
     */
    showEffectByState() {
        return !showGraphByState(this.baseQuote) && this.baseQuote && this.baseQuote.retreat === 0
            && this.state === Default.STATE.ITEM_1;
    }


    /**
     * 保存或者提交图片信息
     * @param e
     */
    // doGraph(e: any) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     if (this.cid) {
    //         this.req.doPost({
    //             url: "submitDrawing",
    //             data: {
    //                 id: this.cid,
    //                 urls: this.getGraphList()
    //             },
    //             success: (res => {
    //                 if (res && res.code == 200) {
    //                     this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
    //                     this.quote.loadSubmitInfo(this.cid);
    //                     this.reloadContract(this.cid);
    //                 } else {
    //                     this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
    //                 }
    //             })
    //         })
    //     }
    // }

    /**
     * 提交到客户
     * @param e
     */
    submitToCustomer() {
        if (this.cid && this.justView(this.graphList)) {
            this.req.doPost({
                url: 'submitDrawing',
                data: {id: this.cid},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.loadSubmitInfo(this.cid);
                        this.reloadContract(this.cid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        } else {
           this.warn.onModalInfo({
               title: '提示',
               content: Messages.GRAPH_TIP.CUSTOMER_NOT_ALL,
               ok: () => {
                   // console.log("success in here");
               }
           });
        }
        return false;
    }


    /**
     * 图片可查阅
     */
    viewGraph() {
        if (this.cid && this.graphList && this.graphList.length > 0) {
            const params = {
                quoteId: this.cid,
                operationType: 1
            };
            params['showType'] = this.showGraph ? 0 : 1;
            this.doGraph(params);
        } else {
            this.warn.onModalInfo({
                title: '提示',
                content: Messages.GRAPH_TIP.CUSTOMER_NOT_ALL,
                ok: () => {
                    this.addGraph();
                }
            });
        }
    }

    viewImage(e: any, img: any) {
        e.stopPropagation();
        e.preventDefault();

        if (this.cid && img.id) {
            img['showType'] = img.showType ? 0 : 1;
            const params = {
                quoteId: this.cid,
                operationType: 0,
                imgId: img.id
            };
            params['showType'] = img.showType;
            this.doGraph(params);
        } else {
            this.warn.onMsgWarn(Messages.PARAM_EMPTY);
        }
    }

    /**
     * 执行查阅
     * @param params
     */
    doGraph(params: any) {
        if (params.quoteId) {
            this.req.doPost({
                url: 'showDrawing',
                data: params,
                success: (res => {
                    console.log(res);
                    if (res && res.code == 200) {
                        if (params['operationType'] !== 0) {
                            this.reloadContract(this.cid);
                        }
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                        this.reloadContract(this.cid);
                    }
                })
            });
        }
    }

    /**
     * 图片上下移动和置顶
     * @param {number} type (1：置顶,0：左右移动)
     * @param args
     */
    moveItem(type: number, ...args) {
        console.log(type);
        const params = {
            operationType: type
        };
        console.log(args);
        if (this.graphList && this.graphList.length > 0) {
            if (type === 0) {
                if (args[1]) {
                    params['leftId'] = this.graphList[args[0] - 1].id;
                    params['rightId'] = this.graphList[args[0]].id;
                } else {
                    params['leftId'] = this.graphList[args[0]].id;
                    params['rightId'] = this.graphList[args[0] + 1].id;
                }
            } else {
                params['leftId'] = this.graphList[args[0]].id;
            }
            this.req.doPost({
                url: 'moveDrawing',
                data: params,
                success: (res => {
                    console.log(res);
                    if (res && res.code == 200) {
                        this.reloadContract(this.cid);
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });

        }
        // if(type === 0){
        //     params["leftId"] = args[0];
        // }else{
        //     params["leftId"] = args[0];
        //     params["rightId"] = args[1];
        // }
        //

    }


    /**
     * 提交时整理参数
     * @returns {any[]}
     */
    // getGraphList() {
    //     let urls = [];
    //
    //     //删除（只作已保存的）
    //     if (this.graphDeleteList && this.graphDeleteList.length > 0) {
    //         this.graphDeleteList.forEach(graph => {
    //             graph["operationType"] = 2;
    //             urls.push(graph);
    //         })
    //     }
    //     if (this.graphList && this.graphList.length > 0) {
    //         this.graphList.forEach(graph => {
    //             graph["operationType"] = 1;
    //             urls.push(graph);
    //         })
    //     }
    //
    //     if (this.fileList && this.fileList.length > 0) {
    //         this.fileList.forEach(file => {
    //             file["operationType"] = 1;
    //             file["showType"] = 0;
    //             urls.push(file);
    //         });
    //     }
    //
    //     return urls;
    // }

    /**
     * 审核
     * @param e
     */
    doAuditGraph(graph: any) {
        if (graph && graph.id) {
            this.req.doPost({
                url: 'auditDrawing',
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
            });
        }
    }

    /**
     * 锁定
     */
    doLockGraph() {
        if (this.cid) {
            this.req.doPost({
                url: 'lockDrawing',
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
            });
        }
    }


    /**
     * 显示设置
     * @param src
     * @returns {{"background-image": string; "background-size": string}}
     */
    styleBg(src) {
        return {
            'background-image': 'url(' + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/160') + ')',
            'background-size': 'cover',
            'background-position': 'center center',
            'background-repeat': 'no-repeat'
        };
    }

    /**
     * 拉取数据
     * @param cid
     */
    reloadContract(cid) {
        this.loadContract(cid).then(res => {
                if (res.data) {
                    this.locking = res.data['lockingDrawing'];
                    if (res.data['drawing'] && res.data['drawing'].length > 0) {
                        this.graphList = res.data['drawing'].filter(draw => {
                            draw['url'] = draw['content'];
                            return draw && draw.type === 2;
                        });
                        this.fileList = res.data['drawing'].filter(draw => {
                            draw['mineType'] = this.getStateByMineType(draw['content']);
                            return draw && draw.type === 6;
                        });

                    } else {
                        this.graphList = [];
                        this.fileList = [];
                    }
                }
        }).catch(err => {
            this.warn.onMsgError(err.msg || Messages.FAIL.DATA);
        });
    }


    //重构拉取设计图纸数据
    loadContract(cid): Promise<any> {
        const that = this;
        return new Promise((resolve, reject) => {
            if (cid) {
                that.req.doPost({
                    url: 'listDrawing',
                    data: {id: cid},
                    success: (res => {
                        if (res && res.code == 200) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    })
                });
            }
        });
    }


    // chunkDownImg(i, chunk, imgs) {
    //     let dsq = setTimeout(() => {
    //         let count = Math.ceil(imgs.length / chunk);
    //         if (i > count) {
    //             clearTimeout(dsq);
    //         }
    //         this.chunkDownload(imgs.slice(i * chunk, (i + 1) * chunk));
    //         i++;
    //         this.chunkDownImg(i, chunk, imgs);
    //     }, chunk * 1000)
    // }

    /**
     * 下载全部图片
     * @param e
     */
    download(e: any) {
        e.stopPropagation();
        e.preventDefault();
        this.isSpinning = true;
        this.tip = '数据下载中';
        if (this.graphList && this.graphList.length > 0) {
            const imgs = [];
            this.graphList.forEach(img => {
                imgs.push({
                    name: img['fileName'],
                    url: img['url']
                });
            });
            //下载多个文件
            downloadFiles(imgs, 'images.zip');
            setTimeout(() => {
                this.isSpinning = false;
                this.graphTips = null;
            }, 1000 * imgs.length);

        }


    }

    // chunkDownload(images: Array<string>) {
        // let zip = new JSZip(), that = this, ps = [];
        // that.isSpinning = true;
        // that.tip = "数据下载中";
        // for (let i = 0; i < imgs.length; i++) {
        //     let p = new Promise((resolve, reject) => {
        //         axios.get(imgs[i]["url"], {
        //             responseType: 'blob',
        //             headers: {
        //                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //             }
        //         }).then(function (res) {
        //             resolve({
        //                 data: res.data,
        //                 name: imgs[i]["fileName"] ? imgs[i]["fileName"] : getUrlName(imgs[i]["url"])
        //             });
        //         }).catch(function (error) {
        //             console.error(error);
        //             reject(error);
        //         });
        //     });
        //     ps.push(p);
        // }
        //
        // Promise.all(ps).then(data => {
        //     if (data && data.length > 0) {
        //         data.forEach((d, i) => {
        //             zip.file([i, d.name].join("."), d.data, {binary: true});
        //         });
        //         zip.generateAsync({
        //             type: "blob"
        //         }).then((blob) => {
        //             saveAs(blob, "graph.zip");
        //             that.isSpinning = false;
        //             that.tip = "数据加载中";
        //         }, err => {
        //             that.isSpinning = false;
        //             that.tip = "数据加载中";
        //             this.warn.onMsgError(JSON.stringify(err));
        //         })
        //     }
        // });

    // }


    getMineType(url: string) {
        const type = String(url.substring(url.lastIndexOf('.') + 1)).toLowerCase();
        switch (type) {
            case 'jpg':
                return 'image/jpg';
            case 'gif':
                return 'image/gif';
            case 'png':
                return 'image/png';
            default:
                return 'image/png';
        }
    }


    /**
     * 上传文件
     */
    addFile() {
        const modalFile = this.modalService.open(UploaderMultisInfoComponent, {
            centered: true,
            keyboard: false,
            backdrop: 'static'
        });
        modalFile.componentInstance.name = '上传文件';
        modalFile.componentInstance.cid = this.cid;
        modalFile.componentInstance.split = 'file';
        modalFile.componentInstance.type = 'file';
        modalFile.componentInstance.size = 300;
        modalFile.componentInstance.formatter = ['cdr', 'dwg'];
        modalFile.result.then((result) => {
            console.log(result);

            if (result && result.length > 0) {
                result.forEach(file => {
                    file['mineType'] = this.getStateByMineType(file.src);
                    file['type'] = 6;
                    file['fileName'] = file.name;
                    delete file.name;
                    file['url'] = file.src;
                    delete file.src;
                });
                this.uploadGraphs(result);
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
        // let that = this;
        // axios.get(fileObj.url, {
        //     responseType: 'blob',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     }
        // }).then(function (res) {
        //     saveAs(res.data, fileObj.fileName ? fileObj.fileName : getUrlName(fileObj.url));
        // }).catch(function (error) {
        //     console.error(error);
        //     that.warn.onMsgError(JSON.stringify(error));
        // });
        e.stopPropagation();
        e.preventDefault();
        downloadFile({url: fileObj.url, name: fileObj.fileName ? fileObj.fileName : getUrlName(fileObj.url)});

    }

    //判断上传文件类型
    getStateByMineType(url) {
        const type = String(url.substring(url.lastIndexOf('.') + 1)).toLowerCase();
        switch (type) {
            case 'cdr':
                return 1;
            case 'dwg':
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
