import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BufferService {

    public bufferObj: object = new Object();
    //默认的时间间隔 5分钟
    public defaultTimes:number = 300000;
    constructor() {
    }

    /**
     * 存储当前所要的值（供调用）
     * @param {string} key
     * @param data 存储对象
     * @param args 毫秒数据
     */
    setBuffer(key: string, data: any, ...args) {
        let timestamp = new Date().getTime(),
            times = this.defaultTimes;
        if (args && args.length > 0) {
            times = args[0];
        }
        this.bufferObj[key] = {data: data, expireTime: timestamp + times};
        // console.log(this.bufferObj);
    }

    /**
     * 获取存储对象值域
     * @param key 相当于key
     * @returns {any}
     */
    getBuffer(key:string) {
        let timeStamp = new Date().getTime();
        if(this.bufferObj[key] && this.bufferObj[key].expireTime - timeStamp > 0){
            return this.bufferObj[key].data;
        }else return null;
    }


    /**
     * 生成随机key
     * @param args 区别参数
     * @returns {any}
     */
    getRandKey(...args){
        let keys = ["KEY"];
        if(args && args.length > 0){
            args.forEach(arg =>{
                keys.push(arg);
            });
        }
        return keys.join("-CACHE-");
    }


    clearBuffer(key:string){
        this.bufferObj[key] = null;
    }


}
