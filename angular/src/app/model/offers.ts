export class offers {
    infoMaps: Array<any>;
    infos: Array<any>;
    name: string;
    offerExplain: string;
    remark: string;
    smallTotal: string;
    type: number;
    versionId: number;
    versionType: number;
    constructor(name:string,type:number,infos:any){
        this.name = name;
        this.type = type;
        this.infos = infos;
        this.infoMaps = [];
        this.offerExplain = null;
        this.remark = null;
        this.smallTotal = null;
        this.versionId = null;
        this.versionType = null;
    }
}

