//材料数据
export interface IMaterial {
  sku: string;
  brand: string;
  category: string;
  name: string;
  spec: string;
  model: string;
  material: string;
  color: string;
  origin: string;
  unit: string;
  supplyPrice: number;
  num: number
}

//订单数据
export interface IOrder {
  expand: boolean;
  checked: boolean;
  materialOrderNo: string;
  state: number;
  freight: string;
  totalPrice: string;
  consigneeName: string;
  consigneePhone: string;
  submitSettlementTime: number;
  createTime: number;
  customerName: string;
  customerHouseAddress: string;
  customerRoomNumber: string;
  supplierName: string;
  companyName: string;
  list: IMaterial;
}
