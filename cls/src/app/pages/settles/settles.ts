export interface ISettle {
  accountingPeriod:number; //是否帐面过期
  materialOrderNo:string;
  id:number; //订单id
  quoteId: number; //报价 id
  checked: boolean;
  submitSettlementTime:number; //提交审核时间
  auditSettlementTime: number; //审核结算时间
  signingTime:number; //签单时间
  houseAddress:string;
  abbreviation:string;
  categorys: Array<any> | null;
  state:number;
  totalPrice: number | null,
  materialState:string;  //时间+文案
}


export enum ESettleState {
  STAY_SETTLED = 2, //待结算
  REVIEW_SETTLED = 0, //审核中
  FINISH_SETTLED = 1 //已结算
}

export enum ESettleStateName{
  STAY_SETTLED = "待结算",
  REVIEW_SETTLED = "审核中",
  FINISH_SETTLED = "已结算",
}

//结算列表时的结算状态名称
export enum ESettleStatusName {
  unsettled = "未过帐期",
  settleable = "可结算",
  settle_audit = "结算审核",
  settled = "已结算",
  settled_fail = "结算未通过"
}
