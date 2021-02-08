export const States = {
  //v2.3.7 21-01-22修改标准单中的状态1，2，14，15
  itemState: [
    // {
    //   state: 1, content: "待审核"
    // },
    // {
    //   state: 2, content: "未通过"
    // },
    {
      state: 3, content: "待填写运费"
    },
    {
      state: 4, content: "待确认运费"
    },
    {
      state: 5, content: "待发货"
    },
    {
      state: 6, content: "已发货"
    },
    {
      state: 7, content: "已送达"
    },
    {
      state: 8, content: "已签收"
    },
    {
      state: 9, content: "结算审核"
    },
    {
      state: 10, content: "已结算"
    },
    {
      state: 11, content: "结算未通过"
    },
    {
      state: 12, content: "工长撤回"
    },
    {
      state: 13, content: "材料商撤回"
    },
    // {
    //   state: 14, content: "异常审核"
    // },
    // {
    //   state: 15, content: "异常审核不通过"
    // },
    {
      state: 16, content: "金额修改异常"
    },
    {
      state: 17, content: "材料商待接单"
    }],

  customizedState: [
    {
      state: 41, content: "待填写定制单"
    },
    {
      state: 42, content: "待确认定制单"
    },
    {
      state: 43, content: "待审核"
    },
    {
      state: 44, content: "审核未通过"
    },
    {
      state: 45, content: "待客户确认"
    },
    {
      state: 46, content: "客户确认不通过"
    },
    {
      state: 47, content: "待发货"
    },
    {
      state: 48, content: "已发货"
    },
    {
      state: 49, content: "已送达"
    },
    {
      state: 50, content: "已签收"
    },
    {
      state: 51, content: "结算审核"
    },
    {
      state: 52, content: "已结算"
    },
    {
      state: 53, content: "结算未通过"
    },
    {
      state: 54, content: "工长撤回"
    },
    {
      state: 55, content: "材料商撤回"
    },
    {
      state: 56, content: "客户撤回"
    },
    {
      state: 57, content: "异常审核"
    },
    {
      state: 58, content: "异常审核不通过"
    },
    {
      state: 59, content: "材料商待接单"
    }]


}
export const orderStates = {
  //v2.3.7 21-01-22修改标准单中的状态1，2，14，15
  itemState: [
    {
      state: 1, content: "待审核"
    },
    {
      state: 2, content: "未通过"
    },
    {
      state: 3, content: "待填写运费"
    },
    {
      state: 4, content: "待确认运费"
    },
    {
      state: 5, content: "待发货"
    },
    {
      state: 6, content: "已发货"
    },
    {
      state: 7, content: "已送达"
    },
    {
      state: 8, content: "已签收"
    },
    {
      state: 9, content: "结算审核"
    },
    {
      state: 10, content: "已结算"
    },
    {
      state: 11, content: "结算未通过"
    },
    {
      state: 12, content: "工长撤回"
    },
    {
      state: 13, content: "材料商撤回"
    },
    {
      state: 14, content: "异常审核"
    },
    {
      state: 15, content: "异常审核不通过"
    },
    {
      state: 16, content: "金额修改异常"
    },
    {
      state: 17, content: "材料商待接单"
    }],

  customizedState: [
    {
      state: 41, content: "待填写定制单"
    },
    {
      state: 42, content: "待确认定制单"
    },
    {
      state: 43, content: "待审核"
    },
    {
      state: 44, content: "审核未通过"
    },
    {
      state: 45, content: "待客户确认"
    },
    {
      state: 46, content: "客户确认不通过"
    },
    {
      state: 47, content: "待发货"
    },
    {
      state: 48, content: "已发货"
    },
    {
      state: 49, content: "已送达"
    },
    {
      state: 50, content: "已签收"
    },
    {
      state: 51, content: "结算审核"
    },
    {
      state: 52, content: "已结算"
    },
    {
      state: 53, content: "结算未通过"
    },
    {
      state: 54, content: "工长撤回"
    },
    {
      state: 55, content: "材料商撤回"
    },
    {
      state: 56, content: "客户撤回"
    },
    {
      state: 57, content: "异常审核"
    },
    {
      state: 58, content: "异常审核不通过"
    },
    {
      state: 59, content: "材料商待接单"
    }]


}

/**
 1-待审核(或异常待审核) , 2-未通过 , 3-待填写运费(审核通过) , 4-待确认运费 , 5-代发货 , 6-已发货 , 7-已送达 , 8-已签收 , 9-结算审核 , 10-已结算(结算通过) , 11-结算未通过 , 12-工长撤回 , 13-材料商撤回,      * 14-异常审核待处理,15-异常审核处理不通过      * 16-运费异常待处理      * <p>      * 定制订单状态:41-待填写定制单   42-待确认定制单 43-待审核  44-审核未通过 45-待客户确认(审核通过) 46-客户确认不通过 47-待发货(客户确认通过) 48-已发货  49-已送达 50-已签收 51-结算审核 52-已结算(结算通过)      * 53-结算未通过 , 54-工长撤回 , 55-材料商撤回,56-客户撤回      * 57-异常审核待处理 58-异常审核处理不通过
 **/
