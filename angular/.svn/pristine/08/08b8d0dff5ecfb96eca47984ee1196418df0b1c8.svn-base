import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest} from '@angular/common/http';
import {UUID} from 'angular2-uuid';
import {ApiService} from "./api.service";
import {Default} from "../model/constant";



@Injectable({
    providedIn: 'root'
})
export class QiNiuService {

    private token: string;
    private dataUrl: string;

    constructor(private http: HttpClient,
                private api: ApiService) {

    }

    postFile(file: File, token: string) {
        let uploadUrl = "//upload.qiniup.com/";
        let formData = new FormData();
        formData.append("file", file);
        formData.append("key", "rev/" + file["uploadString"] + "/" + this.getEnvironment() + "/" + file["cid"] + "/" + UUID.UUID() + this.getImageType(file.name));
        formData.append("token", token);
        let request = new HttpRequest(
            'POST', uploadUrl, formData,
            {reportProgress: true});
        return this.http.request(request)
    }

    postImg(file: File, token: string) {
        let uploadUrl = "//upload.qiniup.com/";
        // if (window.location.protocol === "http:") {
        //     uploadUrl = "http://upload.qiniup.com/";
        // } else {
        //     uploadUrl = "https://upload.qiniup.com/";
        // };
        let formData = new FormData();
        formData.append("file", file);
        formData.append("key", "web/top/notice/img/" + UUID.UUID() + this.getImageType(file.name))
        formData.append("token", token);
        let request = new HttpRequest(
            'POST', uploadUrl, formData,
            {reportProgress: true});
        return this.http.request(request);
    }

    setToken(token: string) {
        this.token = token;
    }

    setDataUrl(url: string) {
        this.dataUrl = url;
    }

    getToken() {
        return this.token;
    }

    getDataUrl() {
        return this.dataUrl;
    }

    getImageType(name) {
        return name.substring(name.lastIndexOf("."));
    }

    getEnvironment() {
        let url = this.api.getHost();
        if (/test|\d|localhost/.test(url)) {
            return Default.ENVIRONMENTS.TEST;
        } else if (/pre/.test(url)) {
            return Default.ENVIRONMENTS.PREDICT;
        } else {
            return Default.ENVIRONMENTS.ONLINE;
        }
    }

}
