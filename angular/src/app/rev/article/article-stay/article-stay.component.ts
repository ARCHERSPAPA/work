import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../service/request.service';
import { WarningService } from '../../../service/warning.service';
import { Default } from '../../../model/constant';
import { Messages } from '../../../model/msg';
import { House } from '../../../model/house';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
@Component({
    selector: 'rev-article-stay',
    templateUrl: './article-stay.component.html',
    styleUrls: ['./../../detail/detail.scss', './../article.component.scss', './article-stay.component.scss']
})
export class ArticleStayComponent implements OnInit {

    public title: string;

    public num: number;
    public stays: Array<any>;
    public isFocus: boolean;
    public _albums = [];

    //查询条件
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;

    //放大图片
    public isVisible = false;
    public src: string;

    constructor(private req: RequestService,
        private warn: WarningService,
        private _LightboxConfig: LightboxConfig,
        private _lightbox: Lightbox) {
    }


    ngOnInit() {
        // console.log(this)
        this.changeData();
        this.title = '待审项目';
        this._LightboxConfig.showImageNumberLabel = true;
        this._LightboxConfig.albumLabel = '';
    }


    IsAudit(img: any, state: number) {
        img['state'] = state ? true : false;
    }

    openModal(src, index) {
        this._albums = [];
        // this.isVisible = true;
        // this.src = src;
        src.forEach((i) => {
            this._albums.push({ src: i.imgUrl });
        });
        this._lightbox.open(this._albums, index);
    }

    handleCancel() {
        this.isVisible = false;
        this.src = null;
    }

    submit(dynamic) {
        const params = {
            id: dynamic.id,
            imgList: dynamic.imgList
        };
        this.req.doPost({
            url: 'examineDynamic',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.removeItemById(dynamic.id);
                    this.changeData();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    delItem(id) {
        if (id) {
            this.req.doPost({
                url: 'delDynamic',
                data: { id: id },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.removeItemById(id);
                        this.changeData();
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }
    }

    removeItemById(id) {
        if (id && this.stays && this.stays.length > 0) {
            for (let i = 0; i < this.stays.length; i++) {
                if (this.stays[i].id == id) {
                    this.stays.splice(i, 1);
                    break;
                }
            }
        }
    }

    changeData() {
        if (this.stays && this.stays.length == 0) {
            this.pageNo = this.pageNo - 1;
            if (this.pageNo <= 0) {
                this.pageNo = Default.PAGE.PAGE_NO;
            }
        }
        const params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize
        };
        this.req.doPost({
            url: 'listDynamic',
            data: params,
            success: (res => {
                if (res && res.code == 200) {
                    this.stays = this.renderDynamic(res.data.pageSet);
                    // let imgs=[];
                    // this.stays.forEach(v=>{
                    //     if(v.imgList && v.imgList.length>0){
                    //         imgs=imgs.concat(v.imgList);
                    //     }
                    //     console.log(imgs)
                    // })

                    this.num = res.data.pageCount;
                    this.total = res.data.pageCount;
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }
    getUrl(url) {
        // console.log(url)
        // let img = new Image();
        // img.src = url;
        // if (img.complete) {
        //     // 是否已经加载过了
            return url + '?imageView2/2/w/160/h/160';
        // }else{
        //     return 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2129805766,2176296396&fm=26&gp=0.jpg'
        // }
    }
    renderDynamic(data) {
        if (data && data.length > 0) {
            data = data.filter(d => {
                if (d.imgList && d.imgList.length > 0) {
                    d.imgList.forEach(img => {
                        if (img.verifyState === 0) {
                            img['state'] = false;
                            img.verifyState = 1;
                        }
                    });
                }
                return d;
            });
        }
        return data;
    }


    // combineParams(imgs) {
    //     if (imgs && imgs.length > 0) {
    //         for (let img of imgs) {
    //             if (img["verifyState"] === 0) {
    //                 img["verifyState"] = 1;
    //             } else {
    //                 img["verifyState"] = img["verifyState"] === true ? 1 : 2;
    //             }
    //         }
    //         return imgs;
    //     }
    //     return null;
    // }

    showHouseType(stay) {
        let houseType = '';
        houseType += (stay.roomType ? stay.roomType : (typeof stay.roomType === 'number' && !isNaN(stay.roomType)) ? 0 : '') + ((typeof stay.roomType === 'number' && !isNaN(stay.roomType)) ? House.ROOM : '');
        houseType += (stay.toiletType ? stay.toiletType : (typeof stay.toiletType === 'number' && !isNaN(stay.toiletType)) ? 0 : '') + ((typeof stay.toiletType === 'number' && !isNaN(stay.toiletType)) ? House.TOILET : '');
        return houseType;
    }

    //显示img的标准合格与否
    showImgMark(img, bool) {
        img.state = bool;
    }

    auditImg(img, i) {
        img.verifyState = i;
        img.state = false;
    }

}
