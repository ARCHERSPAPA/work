import {Injectable} from '@angular/core';

import {User} from "../model/user";
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public key: string;
    //公司状态
    public companyState: number;
    //员工id
    public employeeId:number;
    //快速查询部门信息
    public quickQueryDepartType: number = 1;
    public user: User = new User();
    //公司名称
    public companyName:string;

    constructor(private cookie: CookieService) {
    }

    add(data: any) {
        // this.key = key;
        // this.user.account = data.account;
        // this.user.name = data.name;
        // this.user.id = data.id;
        // this.user.companyId = data.companyId;
        // this.user.phone = data.phone;
        // this.user.isChild = data.isChild;
        // this.user.createUserId = data.createUserId;
        // this.quickQueryDepartType = type;
        // this.cookie.set("userId", data.id);
        // this.cookie.set("userKey", key);
        this.key = data.key;
        this.quickQueryDepartType = data.departmentQueryType;
        this.employeeId = data.employeeId;
        this.companyState = data.companyState;
        this.companyName=data.companyName;

        //user相关
        let user = data.user;
        if(user && user.id){
            this.cookie.set("userId", user.id);
        }
        if(data && data.key){
            this.cookie.set("userKey", data.key);
        }
        // this.user.account = user.account;
        // this.user.name = user.name;
        // this.user.id = user.id;
        // this.user.companyId = user.companyId;
        // this.user.phone = user.phone;
        // this.user.isChild = user.isChild;
        // this.user.createUserId = user.createUserId;

        this.user = Object.assign(this.user,user);
    }

    clearCookie() {
        if (this.cookie.get("workerType")) {
            this.cookie.delete('workerType');
        }
        if (this.cookie.get("depart")) {
            this.cookie.delete('depart')
        }
        /**
         * 员工添加时选择部门信息清除
         */
        if (this.cookie.get("selectDeparts")) {
            this.cookie.delete('selectDeparts')
        }
        /**
         * 员工添加时选择的职位信息清除
         */
        if (this.cookie.get("positionId")) {
            this.cookie.delete('positionId')
        }

        if (this.cookie.get("basic2")) {
            this.cookie.delete("basic2");
        }
        if (this.cookie.get("basic3")) {
            this.cookie.delete("basic3");
        }
        if (this.cookie.get("basic5")) {
            this.cookie.delete("basic5");
        }

        if (this.cookie.get("userId")) {
            this.cookie.delete("userId");
        }

        if (this.cookie.get("userKey")) {
            this.cookie.delete("userKey");
        }

    }


    getId() {
        return this.user.id;
    }

    getKey() {
        return this.key;
    }
    getCompanyName() {
        return this.companyName;
    }

    getCompanyId() {
        return this.user.companyId;
    }

    getAccount() {
        return this.user.account;
    }


    getPhone() {
        return this.user.phone;
    }

    getName() {
        return this.user.name;
    }

    setKey(key){
        this.key = key;
    }

    setPhone(phone: string) {
        this.user.phone = phone;
    }

    setCompanyId(cid: number) {
        this.user.companyId = cid;
    }

    getChild() {
        return this.user.isChild;
    }

    getCreateUserId() {
        //-1为注册人，其它为非注册人
        return this.user.createUserId;
    }

    getCompanyState() {
        return this.companyState;
    }

    setCompanyState(state: number) {
        this.companyState = state;
    }

    setQuickQueryDepartType(type) {
        this.quickQueryDepartType = type;
    }

    getQuickQueryDepartType() {
        return this.quickQueryDepartType;
    }

    getEmployeeId(){
        return this.employeeId;
    }

    setEmployeeId(id:number){
        this.employeeId = id;
    }

}
