
interface IURL {
  [key: string]: string
}

//用户模块
const User_Module = {
  "login": "diy/login",
  "checkLoginStatus": "/qr/login/status",
  "qrCode": "/qr/login/id",
  "logout": "/login/out",
  "userHomeInfo": "/supplier/material/order/getHomeInfo"
};

const Supplier_Module = {
  "supplierList": "/supplier/print/order/company/list",
  "supplierPrintList": "/supplier/print/order/print/list",
}

//订单模块
const Order_Module = {
  "orderPrintList": "/supplier/print/order/list", //打印订单列表
  "orderList": "/supplier/material/order/orderList", //订单列表
  "orderDetailHead": "/supplier/material/order/deliveryInfo",
  "orderDetailList": "/supplier/material/order/orderInfo",
  "orderDetailListSpe": "/supplier/material/order/getCustomizationOrderDetails",
  "getMaterialOrderNode": "/supplier/material/order/getMaterialOrderNode",
  "materialSelectionList": "/supplier/material/order/materialSelectionList",
  "upFreight": "/supplier/material/order/upFreight",
  "upCustomersIncreasePrice": "/supplier/material/order/upCustomersIncreasePrice",
  "upTotalPrice": "/supplier/material/order/upTotalPrice",
  "upDetailCount": "/supplier/material/order/upDetailCount",
  "deleteDetailByCustomization": "/supplier/material/order/deleteDetailByCustomization",
  "delMaterialOrderPause": "/supplier/material/order/delMaterialOrderPause",
  "withdraw": "/supplier/material/order/withdraw",
  "setLockingBudget": "/supplier/material/order/setLockingBudget",
  "receivingOrder": "/supplier/material/order/receivingOrder",
  "deliverGoods": "/supplier/material/order/deliverGoods",
  "saveMaterialOrderDeliveryInfo": "/supplier/material/order/saveMaterialOrderDeliveryInfo",
  "submitFreightForWorder": "/supplier/material/order/submitFreightForWorder",
  "addDetailByCustomization": "/supplier/material/order/addDetailByCustomization",
  "getCategoryList": "/supplier/material/order/categoryList",
  "getMaterialImgDetails": "/supplier/material/order/getMaterialImgDetails",
  "upMaterialImgByCustomization": "/supplier/material/order/upMaterialImgByCustomization",
  "upFreightByCustomization": "/supplier/material/order/upFreightByCustomization",
  "submitCustomizationOrderByMaterialSupplier": "/supplier/material/order/submitCustomizationOrderByMaterialSupplier",
  "upMaterialDetailCount": "/supplier/material/order/upMaterialDetailCount",
  "getDeliveryPhone":"/supplier/material/order/getMaterialOrderDeliveryInfo"
}

//结算模块
const Settle_Module = {
  "settleList": "/supplier/material/order/settlementList",
  "settleApply": "/supplier/material/order/applySettlement"
}






//所有接口的url
const URLs: IURL = Object.assign({}, User_Module, Supplier_Module, Order_Module, Settle_Module);


export { URLs };
