import {Component, OnInit} from '@angular/core';
import {Messages} from "../../../model/msg";
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {ActivatedRoute} from '@angular/router';
import {QuoteService} from "../../../service/quote.service";
import {atob, controlBuildInfo} from "../../../model/methods";
import {HeaderService} from "../../../service/header.service";


declare var AMap: any;

@Component({
    selector: 'rev-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

    /**
     * 部门id
     */
    public departmentId: number;

    /**
     * 报价id或者项目id
     */
    public cid: string;

    public listData: Array<any> = [];

    public map: any;
    public center: Array<any> = [];
    public defaultPosition: Array<any> = [104.065756, 30.659868];
    public centerMarker: any;
    /**
     * 所有数据的图标显示信息
     */
    public markers: Array<any> = [];
    /**
     * 当前选中的人
     */
    public selectUser: any;

    /**
     * 部门数据
     */
    public nodes: any;
    public value: number;
    public expandKeys: any;

    /**
     * 获取当前项目详情
     */
    public quoteBase: any;
    /**
     * 获取已添加员工列表
     */
    public members:any

    /**
     * 排序处理
     * @type {{projectCount: null; meanDistance: null; identicalCount: null}}
     */
    public sortMap = {
        projectCount: null,
        meanDistance: null,
        identicalCount: null
    };
    public sortName: string;
    public sortValue: string;


    constructor(private req: RequestService,
                private warn: WarningService,
                private activatedRoute: ActivatedRoute,
                private quote: QuoteService,
                private header:HeaderService) {
    }

    ngOnInit() {
        let that = this;
        that.map = new AMap.Map('container', {
            resizeEnale: true,
            zoom: 10,
            center: that.defaultPosition
        });
        if (that.center.length == 0) {
            that.locateAddress(that.defaultPosition,'默认项目位置');
        }

        that.map.plugin(['AMap.ToolBar'], function () {
            let tool = new AMap.ToolBar({
                position: "RB",
                offset: new AMap.Pixel(10, 100),
                autoPosition: false,
            });
            tool.hideDirection();
            that.map.addControl(tool);
        })

        that.activatedRoute.queryParams.subscribe(params => {
            if (params && params["cid"]) {
                that.cid = atob(params["cid"]);
            }
        });

        //加载选择部门信息
        that.loadDepartment()
            .then(res => {
            if (res && res.length > 0) {
                this.nodes = this.renderDepartTree(res);
                if (!this.departmentId) {
                    this.departmentId = this.nodes[0].id;
                }
                if (!this.value) {
                    this.value = (this.nodes[0].id);
                }

                this.expandKeys = [this.nodes[0].id];
                this.loadStaffList();
            }

        })
            .catch(err => {
                that.warn.onError(err);
        });

    }


    ngDoCheck() {
        // if (this.quote && this.quote.getSelectQuoteMembers()) {
        //     let members = this.quote.getSelectQuoteMembers();
        //     let user = members.filter(m => {
        //         return this.selectUser && this.selectUser.id == m.memberId;
        //     });
        //     if (user && user.length > 0 && this.selectUser) {
        //         this.selectUser["type"] = user[0].type;
        //     } else {
        //         if (this.selectUser) {
        //             this.selectUser["type"] = null;
        //         }
        //     }
        // }
        // if (this.quote && this.quote.getQuoteInfo()) {
        //     if (this.quote.getQuoteInfo()["quoteBase"]) {
        //         this.quoteBase = this.quote.getQuoteInfo()["quoteBase"];
        //         let base = this.quoteBase;
        //         if (base["longitude"] && base["latitude"] && this.center.length == 0) {
        //             this.center = [base["longitude"], base["latitude"]];
        //             this.locateAddress(this.center,base.customerHouseAddress?base.customerHouseAddress:'暂无项目名称');
        //         }
        //     }
        // }
        if(this.header && this.header.getHeaderInfo()){
            // this.header.setHeadBool(false);
            this.members = this.header.getHeaderInfo()["members"];
            this.quoteBase = this.header.getHeaderInfo()["quoteBase"];
            this.justUserInMember(this.selectUser);
        }

    }




    sort(name: string, value: string) {
        this.sortName = name;
        this.sortValue = value;
        for (let key in this.sortMap) {
            this.sortMap[key] = (key === this.sortName ? value : null);
        }
        this.searchData();
    }

    searchData() {
        if (this.sortName && this.sortValue) {
            this.listData = this.listData.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
        }
    }

    /**
     * 渲染当前项目位置
     * @param pos
     */
    locateAddress(pos,name) {
        if (this.map) {
            if (this.centerMarker) {
                this.map.remove(this.centerMarker);
            }
            if (this.markers) {
                this.map.remove(this.markers);
            }
            this.centerMarker = new AMap.Marker({
                position: pos,
                // 将 html 传给 content
                content: `<dl style="${this.getDlCenter()}">
                            <dt style="${this.getDdCenter()}" title="${name}">${name}</dt>
                            <dd style="${this.getDdCenterAngle()}"></dd>
                         </dl>`,
                // 以 icon 的 [center bottom] 为原点
                offset: new AMap.Pixel(-13, -30)
            });
            this.map.add(this.centerMarker);
            this.renderMarkers(this.listData);
        }
    }

    /**
     * 渲染marker
     * @param list
     */
    renderMarkers(list) {
        let that = this;
        if (list && list.length > 0 && this.map) {
            let temp = "", marker = "", num = 40;
            that.markers = [];
            list.forEach((item, index) => {
                let click = (this.selectUser && this.selectUser.id === item.id) ? true : false;
                num = click ? 40 : 32;
                temp = `<dl style="${this.getDlStyle(num,click)}" class="dispatch-marker" >
                            <dt style="${this.getDtStyle(num, click)}">
                                <img src="${item.headImg}" style="width:100%;height:100%;border-radius:100%;"/>
                            </dt>
                            <dd style="${this.getDdStyle(num,click)}" title="${item.name}">${item.name}</dd>
                            <dd style="${this.getDdAngle(num,click)}"></dd>
                      </dl>`;

                if (item && item.coordinates.length > 0) {
                    item.coordinates.forEach((cood, i) => {
                        marker = new AMap.Marker({
                            map: that.map,
                            position: [cood.longitude, cood.latitude],
                            content: temp,
                            offset: new AMap.Pixel(-13 + that.computedPixel(index, i), -30 + that.computedPixel(index, i)),
                            topWhenClick: click,
                            zIndex: click ? (1000 + i + 1) : 100
                        });
                        AMap.event.addListener(marker, 'click', function (e) {
                            that.select(item);
                        });
                        that.markers.push(marker);
                    })

                }
            });
            if (that.markers.length > 0) {
                that.map.add(that.markers);
            }
        }
    }

    computedPixel(i, j) {
        return (i + 1) + (j + 1) * 5;
    }

    /**
     * marker的总体box样式
     * @param num
     * @returns {string}
     */
    getDlStyle(num,bool) {
        return `width:100px;height:24px;position:relative;
                border-radius:24px;${bool?'background:rgba(24,144,255,1)':'background:rgba(186,231,255,1)'};
                border:1px solid rgba(24,144,255,1);
                box-shadow:0px 2px 4px rgba(0,0,0,0.32)`;
    }

    /**
     * marker的图像样式
     * @param num
     * @returns {string}
     */
    getDtStyle(num, bool) {
        return `position:absolute;left:0;top:-${(num - 24) / 2}px;
        z-index:10;width:${num}px;height:${num}px;background:rgba(0,0,0,0);
        opacity:1;border-radius:24px;border-color:rgba(24,144,255,1);border-style:solid;
        ${bool ? 'border-width:2px':'border-width:1px'} `;
    }

    /**
     * marker的文案样式
     * @param num
     * @returns {string}
     */
    getDdStyle(num,bool) {
        return `overflow:hidden;font-size:14px;text-align:left;text-indent:${num+2}px;
                font-family:'PingFang SC';font-weight:400;line-height:22px;
                ${bool?'color:rgba(255,255,255,1)':'color:rgba(0,0,0,0.65)'};
                white-space:nowrap;text-overflow:ellipsis`;
    }

    /**
     * marker的文案中三角形图标
     * @param num
     * @param bool
     * @returns {string}
     */
    getDdAngle(num,bool) {
        return `position:absolute;left:${(num/4)+(bool?0:-2)}px;top:${((num-24)/2)+20}px;z-index:9;
                width:0;height:0;border-right:10px solid transparent;
                border-left: 10px solid transparent;
                border-top:10px solid rgba(24,144,255,1)`;
    }

    /**
     * 中心坐标
     * @returns {string}
     */
    getDlCenter(){
        return `width:100px;height:40px;position:relative;
                border-radius:24px;background:rgba(24,144,255,1);
                border:1px solid rgba(24,144,255,1);
                box-shadow:0px 2px 4px rgba(0,0,0,0.32)`;
    }

    getDdCenter(){
        return `overflow:hidden;font-size:14px;text-align:center;
                font-family:'PingFang SC';font-weight:400;line-height:40px;
                color:rgba(255,255,255,1);white-space:nowrap;text-overflow:ellipsis`;
    }

    getDdCenterAngle(){
        return `position:absolute;left:40px;top:36px;z-index:9;
                width:0;height:0;border-right:10px solid transparent;
                border-left: 10px solid transparent;
                border-top:10px solid rgba(24,144,255,1)`;
    }


    /**
     * 指派为某个具体的职能人员
     * @param {number} type 职能人员区别
     */
    dispatchTo(type: number) {
        if (this.selectUser && this.cid) {
            this.req.doPost({
                url: "buildProjectPersonal",
                data: {
                    id: this.cid,
                    userId: this.selectUser.id,
                    type: type,
                    departmentId: this.departmentId
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.warn.onSuccess(res.msg || Messages.SUCCESS.DATA);
                        this.quote.setTypeByParam("head",true);
                        // let member = this.componentMember(type, this.selectUser);
                        // if (member) {
                        //     this.quote.updateSelectQuoteMembers(member);
                        // }

                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    // componentMember(type: number, user: any) {
    //     if (type && user && user.id) {
    //         return {
    //             memberId: user.id,
    //             memberName: user.name,
    //             phone: user.phone,
    //             type: type,
    //             quoteId: this.cid
    //         }
    //     }
    //     return null;
    // }

    showDispatchByState() {
        return !(this.selectUser && this.selectUser["type"]) && controlBuildInfo(this.quoteBase);
    }

    /**
     * 地图上面选人
     * @param user
     */
    select(user: any) {
        this.selectUser = user;
        this.justUserInMember(user);
        let index = -1;
        this.listData.forEach((item, i) => {
            if (item.id === user.id) {
                index = i;
            }
        })
        this.listData.splice(index, 1);
        this.listData.unshift(user);
        this.map.remove(this.markers);
        this.renderMarkers(this.listData);
    }

    /**
     * 左侧导航栏选择人员
     * @param user
     */
    selectData(user: any) {
        this.selectUser = user;
        if (this.selectUser.coordinates.length === 0) {
            this.warn.onMsgWarn(Messages.NOT_DISPATCH_LOCATION);
        }
        this.justUserInMember(user);

        this.map.remove(this.markers);
        this.renderMarkers(this.listData);
    }

    /**
     * 判断选中的人是否在已存在的人员中
     * @param user
     */
    justUserInMember(user:any){
        if(user && user.typpe){
            user.type = null;
        }
        // console.log(user);
        if(user && this.members && this.members.length > 0){
            let find = this.members.filter(m => m.memberId === user.id);
            // console.log(find);
            if(find && find.length === 1){
                user["type"] = find[0]["type"];
            }
        }
    }

    // 拉取部门信息
    loadDepartment(): Promise<any[]> {
        let that = this;
        let params = {};
        return new Promise((resolve, reject) => {
            that.req.doPost({
                url: "listDepartTree",
                data: params,
                success: (res => {
                    if (res && res.code == 200) {
                        resolve(res.data);
                    } else {
                        reject(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        })

    }

    /**
     * 渲染department tree
     * @param data
     * @returns {any}
     */
    renderDepartTree(data) {
        let that = this;
        if (data && data.length > 0) {
            let nodes = data.filter(d => {
                return d.state === 0;
            });
            nodes.forEach((node) => {
                node["title"] = node.name;
                node["value"] = node.id;
                node["key"] = node.id;
                if (node.history) {
                    that.value = node.id;
                    that.departmentId = node.id;
                }
                if (node.children && node.children.length > 0) {
                    node["children"] = that.renderDepartTree(node.children);
                } else {
                    node["isLeaf"] = !node.ownSubset;
                    delete node["children"];
                }
            });
            return nodes;
        }
    }


    // 根据id拉取部门信息
    onChange(e: any) {
        if (e && this.departmentId !== e) {
            this.value = e;
            this.departmentId = e;
            this.map.remove(this.markers);
            this.map.setZoom(10);
            this.loadStaffList();
        }

    }

    /**
     * 拉取人员列表
     */
    loadStaffList() {
        if (this.departmentId) {
            this.req.doPost({
                url: "listAssign",
                data: {
                    departmentId: this.departmentId,
                    quoteId: this.cid
                },
                success: (res => {
                    if (res && res.code == 200) {
                        this.listData = res.data.filter(item => {
                            item.headImg = item.headImg ? item.headImg : 'http://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png';
                            return item;
                        });
                        this.selectUser = null;
                        this.renderMarkers(this.listData);
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }
                })
            })
        }
    }

    getDispatchByType(type: number) {
        switch (type) {
            case 3:
                return "工长";
            case 4:
                return "监理";
            case 5:
                return "总监";
            case 6:
                return "复用人员";
            case 7:
                return "查看人员";
            default:
                return "其它成员";
        }
    }


    ngOnDestroy() {
        this.selectUser = null;
        this.center = [];
        // this.quote.setQuoteInfo(null);
    }

}
