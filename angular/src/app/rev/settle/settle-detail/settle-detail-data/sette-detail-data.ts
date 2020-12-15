export interface IQuoteData {
    materialOrderNo: string;
    state: string;
    quoteNo: string;
    abbreviation: string;
    houseAddress: string;
    workerName: string;
    workerPhone: string;
    totalPrice: string;
    createTime: string;
    workerRemark: string;
    flag: string;
    customerName: string;
    workers: any;
    freightRemark:any;
}


export interface IPay {
    payType: string;
    receivePrice: number;
    receivePriceRatio: number;
    applyPrice: number;
    applyPriceRatio: number;
    materialPrice: number;
    ratio: number;
    orderPrice: number;
    materialRatio: number;
    applyOrderPrice: number;
    applyOrderPriceRatio: number;
    totalPrice: number;
    totalPriceRatio: number;
    allPrice: number;
    allPriceRatio: number;
    agencyPrice: number;
}
export interface IPrice {
    agreementPrice: string,
    beforePrice: string,
    afterPrice: string,
    totalPrice: string,
    materialPrice: string,
    agencyPrice: string
}
/**
 { materialOrderNo: '--', state: '', quoteNo: '', abbreviation: '', houseAddress: '', workerName: '', workerPhone: '', totalPrice: '', createTime: '', workerRemark: '', flag: '', customerName: '', workers: null };
 { payType: '', receivePrice: 0, receivePriceRatio: '', applyPrice: '', applyPriceRatio: '', materialPrice: '', ratio: 0, orderPrice: '', materialRatio: '', applyOrderPrice: '', applyOrderPriceRatio: '', totalPrice: 0, totalPriceRatio: '', allPrice: '', allPriceRatio: '', agencyPrice: '' }

 **/