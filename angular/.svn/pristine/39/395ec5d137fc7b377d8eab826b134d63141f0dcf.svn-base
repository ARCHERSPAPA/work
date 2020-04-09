import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {WarningService} from "./warning.service";
import {Messages} from "../model/msg";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    /**
     * 主要拉取catalogs
     * @param {RequestService} request
     */

    public roleList: any;

    constructor(private request: RequestService) {

    }

    loadRoles(pid: number, resolve, reject) {
        this.request.doPost({
            url: "getCatalogs",
            data: {
                id: pid
            },
            success: (res => {
                if (res && res.code == 200) {
                    this.roleList = res.data;
                    resolve(res.data);
                } else {
                    reject(res.msg);
                }
            })
        });
    }

    getRoleList(){
        return this.roleList;
    }

}
