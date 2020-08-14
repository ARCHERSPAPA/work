import { offers } from './offers';

export const Default = {
    PAGE: {
        PAGE_NO: 1,
        PAGE_SIZE: 20,
        PAGE_TOTAL: 0,
        PAGE_SIZE_BY_ITEM: 10
    },
    DATA: {
        ITEM_STATE_MAX: 20,
        APPEND_MAX: 5,
        DESIGNER_MAX: 5
    },
    STATE: {
        ITEM_1: 1, //@@state = 1：未签单前报价处理（报价列表）
        ITEM_2: 2, //@@state = 2：收款性报价处理（收款管理列表）
        ITEM_3: 3, //@@state = 3: 增减按钮控制
        ITEM_4: 4, //@@state = 4: 签单后的报价处理（项目详情）
        ITEM_5: 5, //@@state = 5: 审核增减项目
        ITEM_6: 6, //@@state = 6: 成本核算详情的报价处理（成本核算）
        ITEM_7: 7, //@@state = 7: 保修卡详情中的头部head
        ITEM_8: 8, //@@state = 8: 控制通知显示
        ITEM_10: 10 //@@state = 10：新建报价
    },
    STAFF: {
        CLASS_2: 2, //@@class = 2 设计师
        CLASS_3: 3, //@@class = 3 工长
        CLASS_4: 4, //@@class = 4 监理
        CLASS_5: 5, //@@class = 5 总监
        CLASS_6: 6, //@@class = 6 复用人员
        CLASS_7: 7  //@@class = 7 查看人员在APP
    },
    //示例图片信息（企业）
    IMG: 'http://tqiniu.madrock.com.cn/rev/imgs/bba8fd15-119b-9143-21d5-8f3a46dc4319.png?imagelim',
    PERSONNEL:{
      //默认人头像
      DEFAULT_HEAD_IMG:"https://qiniu.madrock.com.cn/rev/imgs/435467b6-6b9e-2a36-a51b-bde1d77a31ce.png"
    },
    UPLOAD: {
        MAX_NUM: 9, //上传最多九张
        MAX_SIZE: 10, //上传最大10M
        CASE_MAX_SIZE: 2, //上传最大2M,CASE页面的上传图片
        MAX_DATA: 500,  //添加最大单量500（项目详情中报价预算、材料清单）
        FORMATTER: ['jpg', 'png', 'gif', 'webp']
    },
    VERSION: '2.2.6',
    NAME: {
        MATERIALS: '材料清单',
        SERIES: '装修类型',
        SPECIALS: '个性化项目',
        MAINS: '主材',
        OTHERS: '其它项目',
        GRAPH: '项目图纸',
        UPLOAD_IMG: '上传图片',
        ENGINEER_FEE: '工程管理费',
        DESIGN_FEE: '设计费'
    },
    OFFER_ITEM: {
        ITEM_1: 1, //装修类型
        ITEM_2: 2, //主材
        ITEM_3: 3, //个性化项目
        ITEM_4: 4, //其它项目
        ITEM_5: 5, //材料清单
        ITEM_6: 6, //工程管理费用
        ITEM_7: 7, //设计费
        ITEM_8: 8  //待定
    },
    ENVIRONMENTS: {
        ONLINE: 'ONLINE',
        PREDICT: 'PREDICT',
        TEST: 'TEST'
    },
    EXPIRE: {
        TIMER: 3000
    },
    TEMP_URL: {
        MASTER: 'https://qiniu.madrock.com.cn/model/Diy_Large_Main_Material_Template_20200701.xlsx', //主材模板
        BASE: 'https://qiniu.madrock.com.cn/template/Diy_Large_Base_Offer_Template.xlsx', //基模板
    }
};
//app权限相关
export const appTypes = [
    { id: 1, name: '仅参与项目' },
    { id: 2, name: '参与和子部门项目' },
     { id: 3, name: '参与和所在部门及子部门项目' },
     { id: 4, name: '全部数据' }
];
export const topProjectTypes = [
    { id: -1, name: '申请退单' },
    { id: -2, name: '已关闭' },
     { id: -3, name: '已撤回' },
     { id: 3, name: '已签单' },
     { id: 4, name: '待开工' },
     { id: 5, name: '待监理确认开工' },
     { id: 6, name: '施工中' },
     { id: 7, name: '待验收' },
     { id: 8, name: '已竣工' },
     { id: 10, name: '已保存' },
     { id: 11, name: '待派单' },
     { id: 12, name: '增减项目' },
     { id: 15, name: '待客户确认开工' },
     { id: 16, name: '待确认合同' },
];
export const modelRoleTypes = [
    { label: '销售统计', value: 9, checked: false  },
    { label: '工地考勤', value: 10, checked: false  },

];
export const qtTypes = [
    {
        id: '0', content: '===请选择质量标准==='
    },
    {
        id: '1', content: '《四川省成品住宅装修工程技术标准》DBJ51/015-2013'
    },
    {
        id: '2', content: '《住宅室内装饰装修工程质量验收规范》JGJ/T304-2013'
    },
    {
        id: '3', content: '其它规定'
    }
];

export const applyStatus = [
    {
        id: '-1', content: '全部类型'
    },
    {
        id: '1', content: '设计师申请'
    },
    {
        id: '2', content: '工长申请'
    },
];

export const drawingTypes = [
    {
        id: '0', content: '===请选择图纸提供方式==='
    },
    {
        id: '1', content: '甲方自行设计并提供施工图纸'
    },
    {
        id: '2', content: '甲方委托乙方设计施工图纸'
    },
    {
        id: '3', content: '设计施工图须经甲乙双方签字后生效'
    }
];

export const disputeTypes = [
    {
        id: '0', content: '===请选择解决方式==='
    },
    {
        id: '2', content: '向人民法院起诉'
    },
    {
        id: '1', content: '向有关单位仲裁'
    }
];

export const contractTypes = [
    {
        id: '0', content: '===请选择承包方式==='
    },
    {
        id: '1', content: '全包'
    },
    {
        id: '2', content: '半包'
    },
    {
        id: '3', content: '整装'
    },
    {
        id: '4', content: '陈设软包'
    }
];
/**
 *
 *成本页面图纸的审核状态

 */
export const imgStatus = [
    {
        id: '', content: '全部项目状态'
    },
    {
        id: '10', content: '已保存'
    },
    {
        id: '16', content: '待确认合同'
    },
    {
        id: '3', content: '已签单'
    },
    {
        id: '5', content: '待确认开工'
    },
    {
        id: '6', content: '施工中'
    },
    {
        id: '7', content: '待验收'
    },
    {
        id: '8', content: '已竣工'
    },
    {
        id: '2', content: '已关闭'
    },
];
/**
 * 0-未上传成本 1-已上传成本 2-已提交至工长，3-已被工长确认 4-已部署成本合同
 * @type {{id: string; content: string}[]}
 */
export const auditStatus = [
    {
        id: '-1', content: '全部状态'
    },
    {
        id: '0', content: '未上传成本'
    },
    {
        id: '1', content: '未提交'
    },
    {
        id: '2', content: '待确认成本'
    },
    {
        id: '3', content: '已确认成本'
    },
    {
        id: '4', content: '已签署合同'
    }
];

/**
 * 快速查询部门的选择信息
 * @type {{id: number; content: string}[]}
 * v.2020.04.10 修改文案
 * 0：全部部门；1：所在部门；2：所在及其子部门；==>
 * 0:全部数据；1：所在部门；2：所在部门及子部门；3:所在部门
 */
export const QUERY_DEPART_TYPES = [
    {
        id: 0, content: '全部数据'
    },
    {
        id: 1, content: '所在部门'
    },
    {
        id: 2, content: '所在部门及子部门'
    },
];

/**
 * 快速部门查询的数据
 * @type {{key: number; value: string}[]}
 */
export const QUERY_DEPART_DATA = [
    {
        key: 1, value: '与我相关'
    },
    {
        key: 2, value: '全部数据'
    }
];
/**
 * 默认五期数据
 * @type {{type: number}[]}
 */
export const PAY_ITEMS = [
    { type: 1 },
    { type: 2 },
    { type: 3 },
    { type: 4 },
    { type: 5 }
];

/**
 * 归属地
 * @type {{id: number; name: string}[]}
 */
export const NATIVE = [
    { id: '1', name: '中国大陆' },
    { id: '2', name: '香港澳门用户' },
    { id: '3', name: '台湾用户' },
    { id: '4', name: '外籍用户' }
];


export const NUMBER_ZH_CAPITALIZED = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
export const NUMBER_ZH_LOWERCASE = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/**
 * 默认的报价列表时显示数据
 * @type {{name: string; type: number; versionType: null; versionId: null; infoMaps: null; infos: null}[]}
 */
export const OFFER_DEFAULT_DATA = [
    new offers(Default.NAME.SERIES, Default.OFFER_ITEM.ITEM_1, null),
    new offers(Default.NAME.MAINS, Default.OFFER_ITEM.ITEM_2, null),
    new offers(Default.NAME.SPECIALS, Default.OFFER_ITEM.ITEM_3, null),
    new offers(Default.NAME.OTHERS, Default.OFFER_ITEM.ITEM_4, null),
    new offers(Default.NAME.MATERIALS, Default.OFFER_ITEM.ITEM_5, null),
    new offers(Default.NAME.ENGINEER_FEE, Default.OFFER_ITEM.ITEM_6, [{
        totalPrice: 0,
        num: 0.08,
        univalent: 0
    }]),
    new offers(Default.NAME.DESIGN_FEE, Default.OFFER_ITEM.ITEM_7, null)
];

/**
 *
 * @type {{id: number; name: string}[]}
 */
export const STAGES = [
    { id: 1, name: '前期' },
    { id: 2, name: '中期' },
    { id: 3, name: '后期' }
];

export const SESSION_STORAGE = {
    IS_LOGIN: 'SESSION_IS_LOGIN',
    IS_LOGIN_VALUE: 'TRUE'
};

/**
 * 设计图纸中类型选择
 * 原始平面图，原始顶棚图，平面设计图，吊顶设计图，客厅吊顶局部剖面图，客厅立面图，餐厅立面图，主卧立面图，次卧、书房、儿童房立面图；九个类型选择；
 * @type {{key: number; value: string}[]}
 */
export const GRAPH_TEPES = [
    {key: 1, value: '平层'},
    {key: 2, value: '多层'}
];

export const AUDIT_TYPES = [
    {key: 1, value:"项目设计师"},
    {key: 2, value:"项目工长"},
    {key: 3, value:"项目监理"},
    {key: 4, value:"客户"},
]

//活动版本的活动状态
export const ACTIVITY_STATE = [
    {key: -1, value:"已结束"},
    {key: 0, value:"未开始"},
    {key: 1, value:"进行中"}
]