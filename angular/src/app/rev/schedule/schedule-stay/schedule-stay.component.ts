import {Component, OnInit} from '@angular/core';
import {RequestService} from '../../../service/request.service';
import {UserService} from '../../../service/user.service';
import {RoleService} from '../../../service/role.service';
import {Router, ActivatedRoute} from '@angular/router';
import {WarningService} from '../../../service/warning.service';
import {Messages} from '../../../model/msg';
import {User} from '../../../model/user';

@Component({
    selector: 'rev-schedule-stay',
    templateUrl: './schedule-stay.component.html',
    styleUrls: ['./schedule-stay.component.scss']
})
export class ScheduleStayComponent implements OnInit {

    public scheduleList: Array<any> = [];
    //  所有的列表数据
    public roleList;
    //ID加地址
    public Ids: Array<any> = [];

    public userInfo: any = new User();
    // public firstLoad: boolean = true;
    //公司名称
    public companyName: string;
    //员工ID
    public empID;
    //加锁节流
    public lock = true;

    constructor(private req: RequestService,
                private user: UserService,
                private role: RoleService,
                private router: Router,
                private warn: WarningService,
    ) {

    }

    ngOnInit() {
        this.loadDetail();
    }

    pageChange(pathId) {
        //项目列表
        const productList = [126, 127];
        if (productList.indexOf(pathId) != -1) {
            this.router.navigateByUrl('/rev/article/item/list');

        } else if (pathId == 87) {
            //工费审核
            this.router.navigateByUrl('/rev/settle/audit/list');
        } else if (pathId == 219) {
            //工费结算
            this.router.navigateByUrl('/rev/settle/wage/list');
        } else {
            this.Ids.forEach(item => {
                if (item.id == pathId) {
                    this.router.navigateByUrl('/rev/' + item.go);
                }
            });
        }
    }

    styleImg(src) {
        return {
            'background': 'linear-gradient(270deg, rgba(24, 144, 255, 0.8) 0%, rgba(24, 144, 255, 1) 100%), url(' + src + ')no-repeat  center',
            'background-size': 'cover'
        };
    }

    ngDoCheck() {
        if (this.userInfo) {
            this.userInfo.headImg = this.userInfo.headImg ? this.userInfo.headImg : (new User()).headImg;
        }
        //获取公司信息
        if (this.user.getCompanyName()) {
            this.companyName = this.user.getCompanyName();
        }
        if (this.user.getEmployeeId() && this.lock) {
            this.empID = this.user.getEmployeeId();
            this.loadInfo();
            this.lock = false;
        }
        if (!this.roleList) {
            this.roleList = this.role.getRoleList();
            if (this.roleList && this.roleList.length > 0) {
                this.roleList.forEach(item1 => {
                    if (item1.catalogs) {
                        item1.catalogs.forEach(item2 => {
                            if (item2.largePermissions) {
                                item2.largePermissions.forEach(item3 => {
                                        this.Ids.push( {id: item3.id, go: item2.go});

                                });
                            }
                        });
                    }
                    // this.firstLoad = false;
                });
            }
        }
    }

    loadInfo() {
        if (this.user.getEmployeeId()) {
            this.req.doPost({
                url: 'indexInfo',
                data: {
                    id: this.empID
                },
                success: (res => {
                    if (res && res.code === 200) {
                        this.userInfo = res.data;
                    } else {
                        this.warn.onError(res.msg || Messages.FAIL.DATA);
                    }

                })
            });
        }
    }

    loadDetail() {
        this.req.doPost({
            url: 'indexLIst',
            data: {
                companyId: this.user.getCompanyId()
            },
            success: (res => {
                if (res.data) {
                    this.scheduleList = res.data;
                }
            })
        });
    }
}
