//下载图片
import {getUrlName} from './methods';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver';
import axios from 'axios';

//多张下载图片（files = [{url:文件url,name:文件名称}]）;
export function downloadFiles(files: Array<string>, name: string = 'images.zip') {
    const zip = new JSZip(), ps = [];
    for (let i = 0; i < files.length; i++) {
        const p = new Promise((resolve, reject) => {
            axios.get(files[i]['url'], {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (res) {
                resolve({
                    data: res.data,
                    name: files[i]['name'] ? files[i]['name'] : getUrlName(files[i]['url'])
                });
            }).catch(function (error) {
                console.error(error);
                reject(error);
            });
        });
        ps.push(p);
    }
    Promise.all(ps).then(data => {
        if (data && data.length > 0) {
            data.forEach((d, i) => {
                zip.file([i, d.name].join('.'), d.data, {binary: true});
            });
            zip.generateAsync({
                type: 'blob'
            }).then((blob) => {
                saveAs(blob, name);
            }, err => {
                this.warn.onMsgError(JSON.stringify(err));
            });
        }
    });
}


export function downloadFile(file: any) {
    axios.get(file.url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }).then(function (res) {
        saveAs(res.data, file.name ? file.name : getUrlName(file.url));
    }).catch(function (error) {
        console.error(error);
        this.warn.onMsgError(JSON.stringify(error));
    });
}

