import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as UserValidate from '../../../validate/user-validate';
import {RequestService} from '../../../service/request.service';
import {WarningService} from '../../../service/warning.service';
import {Messages} from '../../../model/msg';

@Component({
    selector: 'rev-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

    public title: string;
    //TAB选择
    public radioSwitch: Array<any> = [
        {
            key: 1,
            text: '平层'
        },
        {
            key: 2,
            text: '多层'
        }
    ];
    //默认选择平层
    public type = 1;

    //图片设置结果
    public photoSettings: Array<any>;

    //弹出框
    public photoVisible = false;
    public photoForm: FormGroup;
    public photoName: string;
    public photoNum: number;
    public photoView = 0;
    public photoId: string;
    public photoTitle: string;


    constructor(private fb: FormBuilder,
                private req: RequestService,
                private warn: WarningService) {
    }

    ngOnInit() {
        this.title = '图片设置';

        this.photoForm = this.fb.group({
            photoName: [
                this.photoName,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(30)
                ]
            ],
            photoView: [this.photoView],
            photoNum: [this.photoNum, [
                UserValidate.ValidateNumToInt
            ]]
        });

        //初始化加载数据
        this.loadPhotos();
    }

    /**
     * switch 切换
     * @param e
     */
    handleSwitch(e) {
        this.type = e;
        this.loadPhotos();
    }

    //添加图片
    addPhoto() {
        this.photoVisible = true;
        this.photoTitle = '新增设置';
        this.photoView = 0;
    }

    //编辑图片
    editPhoto(item: any) {
        this.photoVisible = true;
        this.photoTitle = '编辑设置';
        this.photoName = item.imgType;
        this.photoView = item.designStage;
        this.photoNum = item.imgCount;
        this.photoId = item.id;
    }

    //删除图片
    delPhoto(id) {
        if (id) {
            this.req.doPost({
                url: 'deletePhotos',
                data: {id: id},
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                        if (this.photoSettings && this.photoSettings.length > 0) {
                            const index =  this.photoSettings.findIndex(item => item.id === id);
                            this.photoSettings.splice(index, 1);
                        }
                    } else {
                        this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                    }
                })
            });
        }

    }

    //关闭弹出框
    photoCancel() {
        this.photoVisible = false;
        this.photoTitle = null;
        this.photoId = null;
        this.photoForm.reset();
    }

    //保存图片信息
    photoOk() {
        if (this.photoForm.valid) {
            const values = this.photoForm.value;
            const photo = {
                imgType: values.photoName,
                designStage: values.photoView,
                imgCount: values.photoNum,
                designType: this.type
            };

            if (this.photoId) {
                photo['id'] = this.photoId;
                this.updatePhotos(photo);
            } else {
                this.savePhotos(photo);
            }
            this.photoCancel();
        }

    }

    /**
     * 保存图片
     * @param photos
     */
    savePhotos(photo) {
        this.req.doPost({
            url: 'savePhotos',
            data: photo,
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.loadPhotos();
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    /**
     * 编辑或者修改
     * @param photo
     */
    updatePhotos(photo) {
        this.req.doPost({
            url: 'updatePhotos',
            data: photo,
            success: (res => {
                if (res && res.code == 200) {
                    this.warn.onMsgSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.loadPhotos();
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }
            })
        });
    }

    //拉取
    loadPhotos() {
        this.req.doPost({
            url: 'listPhotos',
            data: {
                designType: this.type
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.photoSettings = res.data;
                } else {
                    this.warn.onMsgError(res.msg || Messages.FAIL.DATA);
                }

            })
        });
    }
}
