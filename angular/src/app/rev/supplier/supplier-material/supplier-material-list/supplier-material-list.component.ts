import { Component, OnInit } from '@angular/core';
import { btoa, getMaterialType } from '../../../../model/methods';
import { auditStatus, Default } from './../../../../model/constant';
import { RequestService } from '../../../../service/request.service';
import { WarningService } from '../../../../service/warning.service';
import { Messages } from '../../../../model/msg';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'rev-supplier-material-list',
    templateUrl: './supplier-material-list.component.html',
    styleUrls: ['./supplier-material-list.component.scss']
})
export class SupplierMaterialListComponent implements OnInit {
    public pageNo: number = Default.PAGE.PAGE_NO;
    public pageSize: number = Default.PAGE.PAGE_SIZE;
    public total: number = Default.PAGE.PAGE_TOTAL;
    //查询相关
    public query;
    public state;
    public querys;
    public companyName;
    public companyPhone;
    public serchType = 1;
    public isFirst = true;
    public legaLperson;
    public queryType = [{
        key: 1,
        text: '材料商名字'
    },
    {
        key: 2,
        text: '联系电话'
    },
    {
        key: 3,
        text: '法人'
    }];
    public radioSwitch = [
        {
            key: -1,
            text: '未添加'
        },
        {
            key: 0,
            text: '审核中'
        },
        {
            key: 1,
            text: '合作中'
        },
        {
            key: 2,
            text: '未通过'
        },
    ];
    public forms: Array<any> = [

        {
            type: "group",
            name: "group",
            placeholder: "请输入",
            cols: 6,
            data: [
                { label: "材料商名字", value: 1 },
                { label: "联系电话", value: 2 },
                { label: "法人", value: 3 }
            ],
            value: {
                select: 1,
                text: null
            }
        },
        {
            type: "button",
            name: "search",
            text: "查询"
        }
    ];
    public pageType = -1; //切换的tab，已创建，审核中，已通过，未通过
    public defaultPage = {};//默认tab
    public materialList;

    constructor(
        private req: RequestService,
        private router: Router,
        private warn: WarningService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.querys = 1;
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params['pageType']) {
                this.pageType = params['pageType'];
            }
        });
        if (this.pageType == -1) {
            this.defaultPage = this.radioSwitch[0]
        } else if (this.pageType == 0) {
            this.defaultPage = this.radioSwitch[1]
        }
        else if (this.pageType == 1) {
            this.defaultPage = this.radioSwitch[2]
        }
        else if (this.pageType == 2) {
            this.defaultPage = this.radioSwitch[3]
        }

        this.changePage();
    }

    //切换搜索框条件
    swichType(e) {
        this.serchType = e;
    }

    btoa(id: string) {
        return btoa(id);
    }

    //搜索回调
    handleForm(e: any) {
        this.serchType=e.value.get('group').select;
        this.query=e.value.get('group').text;
        this.changePage(1);

    }
    create(id) {
        this.req.doPost({
            url: 'companyAplly',
            data: {
                materialId: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changePage();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }

    //切换页面radio
    handleSwitch(type:number) {
        this.pageType = type;
        this.pageNo = Default.PAGE.PAGE_NO;
        this.query = "";
        this.changePage();
        this.router.navigate(['./'], { queryParams: { pageType: this.pageType }, relativeTo: this.activatedRoute });
    }

    changePage(e = 0) {
        if (e) {
            if (this.isFirst) {
                this.companyName = this.query;
            }
            this.pageNo = Default.PAGE.PAGE_NO;
            this.pageSize = Default.PAGE.PAGE_SIZE;
        }
        let param = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            state: this.pageType
        }

        if (this.query && this.query.trim()) {
            if (this.serchType == 1) {
                param['companyName'] = this.query.trim();
            } else if (this.serchType == 2) {
                param['companyPhone'] = this.query.trim();
            }
            else if (this.serchType == 3) {
                param['legaLperson'] = this.query.trim();
            }
        }

        this.req.doPost({
            url: 'materialList',
            data: param,
            success: res => {
                if (e) {
                    this.isFirst = false;
                }
                this.materialList = res.data.pageSet;
                this.total = res.data.total;
            }
        })
    }


    /**
     * 
     * @param material 材料的详情
     * @param type 区别材料类别主材辅材软装
     */
    goRoute(material: any, type: number) {
        localStorage.removeItem('materialHistory');
        //修改导航的面包屑
        this.activatedRoute.parent.routeConfig.children[3].data["breadcrumb"] = getMaterialType(type);

        this.router.navigate(["./../info"], {
            queryParams: {
                title: material.companyName,
                id: btoa(material.id),
                materialType: type
            },
            relativeTo: this.activatedRoute
        });
    }
    /**
     * @param id 材料商ID
     */
    cancelCooperation(id) {
        this.req.doPost({
            url: 'cancelCompanyAplly',
            data: {
                materialId: id
            },
            success: res => {
                if (res && res.code == 200) {
                    this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                    this.changePage();
                } else {
                    this.warn.onError(res.msg || Messages.FAIL.DATA);
                }
            }
        })
    }
}
