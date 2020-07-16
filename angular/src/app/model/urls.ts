export const Urls = {
    login: '/large/sys/login',
    logout: '/large/sys/logout',
    checkLogin: '/large/sys/checkLogin',
    checkPhoneTimes: '/large/sys/checkUpPhoneTime',
    phoneCaptcha: '/large/sys/phoneCaptcha',
    codeMatching: '/large/sys/codeMatching',
    upUser: '/large/sys/upUser',
    loadCompany: '/large/sys/loadCompany',
    upCompany: '/large/sys/upCompany',
    loadArea: '/large/sys/loadArea',
    createCompany: '/large/sys/CreateCompany',
    loadAptitude: '/large/sys/loadAptitude',
    addAptitude: '/large/sys/addAptitude',
    delAptitude: '/large/sys/delAptitude',
    //找回密码
    findAccount: '/large/sys/GetisChild',
    findPassword: '/large/sys/FindPwd',

    //上传或者下载图文
    token: '/clouds/uptoken/typeId',
    down: '/clouds/private/down',

    // 设备管理
    deviceList: '/diy/large/clock/list/company',
    bindDevice: '/diy/large/clock/bind/company',
    unbindDevice: '/diy/large/clock/unbind/company',
    unbindProject: '/diy/large/clock/unbind/project',

    //来源信息
    listSource: '/large/sys/queryListSource',
    addSource: '/large/sys/addSource',
    delSource: '/large/sys/delSource',
    upSource: '/large/sys/upSource',
    querySource: '/large/sys/listSource',

    //职位
    listPosition: '/large/sys/queryListPosition',
    queryPosition: '/large/sys/listPosition', //专供添加时使用
    addPosition: '/large/sys/addPosition',
    delPosition: '/large/sys/delPosition',
    upPosition: '/large/sys/upPosition',
    setPosition: '/large/sys/setPosition',
    getCatalogs: '/large/sys/getCatalogs',

    listDepart: '/large/sys/queryListDepartment',
    listDepartAdd: '/large/sys/ListDepartmentAdd',
    listDepartAddEmp: '/large/sys/ListDepartmentAddEm',
    ListDepartmentTree: '/large/sys/ListDepartmentTree',
    listDepartSearch: '/large/sys/ListDepartmentSearch',
    listDepartTree: '/large/sys/ListDepartmentTree',

    //企业通讯录
    listDepartAddressBook: '/large/sys/queryListDepartmentByAddressBook',
    listDepartPositions: '/large/sys/addressBookList',
    setDepartPositions: '/large/sys/addressBookSet',
    loadEmployeeAddressBook: '/large/sys/loadEmployeeByAddressBook',

    addDepart: '/large/sys/addDepartment',
    upDepart: '/large/sys/upDepartment',
    delDepart: '/large/sys/delDepartment',
    moveDepart: '/large/sys/moveDepartment',

    listEmployee: '/large/sys/queryListEmployee',
    listEmployeeByPermit: '/large/sys/queryListEmployeeOther',


    //快捷查询部门信息
    listDepartAll: '/large/sys/ListDepAll',
    listDepartIn: '/large/sys/ListDepIn',
    listDepartSon: '/large/sys/ListDepSon',


    // 交接项目
    associateList: '/diy/large/project/selectQuoteAllByEm',
    submitAssociate: '/large/sys/turnoverHandover',

    //人员
    addEmp: '/large/sys/addDiyLargeEmployee',
    quitEmp: '/large/sys/quitEmployee',
    delEmp: '/large/sys/delEmployee',
    infoEmp: '/large/sys/loadEmployee',
    upEmp: '/large/sys/upDiyLargeEmployee',
    appEmp: '/large/sys/upAppJurisdiction', //APP权限接口
    checkEmp: '/large/sys/getEmployeeJoinInfo',

    // 审批流程
    examineList: '/large/quote/add/reduce/list',
    examineSelect: '/large/quote/add/reduce/select',
    examineSave: '/large/quote/add/reduce/save',



    // 工人管理
    workerList: '/large/sys/queryList_Worker',
    addWorker: '/large/sys/addWorker',
    quitWorker: '/large/sys/quitWorker',
    delWorker: '/large/sys/delWorker',
    loadWorker: '/large/sys/loadWorker',
    upWorker: '/large/sys/upWorker',
    queryUserByCode: '/large/sys/queryUserByCode',

    //首页待办事项
    indexLIst: '/large/sys/getAgendas',
    indexInfo: '/large/sys/loadEmployee',

    //客户
    addDemand: '/large/sys/addDemand',
    listDemand: '/large/sys/queryListDemand',
    infoDemand: '/large/sys/loadDemand',
    upDemand: '/large/sys/upDemand',
    upDemandState: '/large/sys/upDemandState',

    //报价
    listQuote: '/diy/large/quote/list',
    reqQuote: '/diy/large/quote/request',
    headQuote: '/diy/large/quote/detail/head',
    bodyQuote: '/diy/large/quote/detail/body',
    delQuote: '/diy/large/quote/delete',
    upQuote: '/diy/large/quote/modify',
    addOtherQuote: '/diy/large/quote/add/other',
    upOtherQuote: '/diy/large/quote/modify/other',
    configQuote: '/diy/large/quote/config',
    choiceVersion: '/diy/large/quote/choice/version',
    addBasicQuote: '/diy/large/quote/add/basic',
    //v2.1.9新增url
    addQuoteBranchItem: '/diy/large/quote/add/tip',
    copyQuoteBranchItem: '/diy/large/quote/copy',
    choiceQuoteColor: '/diy/large/quote/choice/color',

    modifyBasicQuote: '/diy/large/quote/modify/tip',
    delBasicQuote: '/diy/large/quote/delete/tip',
    detailPrice: '/diy/large/quote/detail/price',

    saveDepartQuote: '/diy/large/quote/save/department',
    saveDesignerQuote: '/diy/large/quote/save/designer',
    saveCustomerQuote: '/diy/large/quote/save/customer',
    savePriceOrRemark: '/diy/large/quote/save/priceOrRemark',
    saveRemarkPhotos: '/diy/large/quote/remark/photo',
    retreatQuote: '/diy/large/quote/retreat',

    submitQuote: '/diy/large/quote/submit',
    detailContractQuote: '/diy/large/quoteAgreement/detail',
    saveContractQuote: '/diy/large/quoteAgreement/save',
    submitContractQuote: '/diy/large/quoteAgreement/push',
    listPays: '/diy/large/quoteAgreement/listPays',
    // choicePayType: "/diy/large/quoteAgreement/chose/payType",
    changePayAmount: '/diy/large/quoteAgreement/change/amount',
    signQuote: '/diy/large/quoteAgreement/sign',
    settingQuote: '/diy/large/quote/setting',
    moduleListQuote: '/diy/large/offer/mouldInfoList_quote',
    moduleFoldIds: '/diy/large/offer/mouldInfoIds',

    addDrawQuote: '/diy/large/project/add/drawing',
    addPersonal: '/diy/large/project/add/personnel',

    listAssign: '/large/sys/queryList_Employee_Assign',
    historyDepartmentByAssign: '/large/sys/queryList_History_Department',

    //v2.2.4新增url
    submitCostReview: '/diy/large/quote/submitCostReview',
    selectPayTemplate: '/diy/large/quote/pay/template/selectList',
    updatePayTemplate: '/diy/large/quote/pay/template/updateTemplate',
    reSignQuote: '/diy/large/quoteAgreement/reSign',
    delPayTemplate: '/diy/large/quote/pay/template/deleteTemplate',

    //添加复用与查看人员
    addCustom: '/diy/large/project/save/custom',
    removeCustom: '/diy/large/project/remove/personnel',

    sortQuote: '/diy/large/quote/sorts',
    closeQuote: '/diy/large/quote/close',

    saveQuoteRemark: '/diy/large/quote/saveInfoRemark',

    //项目列表增加
    buildProject: '/diy/large/project/build',
    buildProjectByCustomer: '/diy/large/project/build/save/customer',
    buildProjectDesigner: '/diy/large/project/build/save/designer',
    buildProjectPersonal: '/diy/large/project/build/save/personnel',
    buildProjectSubmit: '/diy/large/project/build/confirm',

    //材料清单、设计图纸
    submitQuoteDetail: '/diy/large/quote/detail/submission',
    submitMaterial: '/diy/large/quote/submit/material',
    materialReduce: '/large/quote/add/reduce/useMaterial',
    detailMainReduce: '/large/quote/add/reduce/useDetailMain',
    //v2.2.3.1修改设计图纸
    listDrawing: '/diy/large/quoteAgreement/getDrawingInfo',
    submitDrawing: '/diy/large/quote/submit/drawing',
    makeRemark: '/diy/large/quote/info/remark',
    lockDrawing: '/diy/large/quote/locking/drawing',
    auditDrawing: '/diy/large/quote/examine/drawing',
    //v2.2.4 设计图纸(及时交互)
    addDrawings: '/diy/large/quote/drawingAdd',
    delDrawing: '/diy/large/quote/drawingDel',
    moveDrawing: '/diy/large/quote/drawingMove',
    showDrawing: '/diy/large/quote/drawingShow',

    //设计图纸v2.2.3.1
    listPhotos: '/diy/large/quote/listByAgreementDesignConfig',
    savePhotos: '/diy/large/quote/saveAgreementDesignConfig',
    updatePhotos: '/diy/large/quote/upAgreementDesignConfig',
    deletePhotos: '/diy/large/quote/delAgreementDesignConfig',

    //工程管理费用
    costEngineer: '/diy/large/quote/engineering/cost',
    cancelEngineer: '/diy/large/quote/engineering/categories/cancel',

    listDesign: '/diy/large/quote/design/list',
    choiceDesign: '/diy/large/quote/design/choice',
    costDesign: '/diy/large/quote/design/cost',

    //项目方量
    listQuantity: '/large/project/dynamic/releaseCapacity',
    deleteQuantity: '/large/project/dynamic/deleteCapacity',

    //考勤记录
    loadWorkAttendance: '/large/sys/loadWorkAttendance',
    workAttendanceRange: '/large/sys/workAttendanceTimeRange',
    loadAttendanceWorkers: '/large/sys/loadProjectWorkers',

    //新建(copy原来的报价)
    buildQuote: '/diy/large/quote/build',
    pushQuote: '/diy/large/quote/push',
    sendQuote: '/diy/large/quote/send',
    buildCustomer: '/diy/large/quote/buildCustomer',
    removeQuote: '/diy/large/quote/remove',

    //复用人员
    listReuseMember: '/diy/large/quote/reuseMember/listReuseMember',
    saveReuseMember: '/diy/large/quote/reuseMember/saveReuseMember',
    checkReuseMember: '/diy/large/quote/reuseMember/checkType',
    updateReuseMember: '/diy/large/quote/reuseMember/upReuseMember',
    deleteReuseMember: '/diy/large/quote/reuseMember/delReuseMember',

    //增减项目
    reqPause: '/diy/large/pause/request',
    historyPause: '/diy/large/pause/history',
    detailPause: '/diy/large/pause/detail',
    addPause: '/diy/large/pause/add',
    modifyPause: '/diy/large/pause/old/modify',
    modifyPause2: '/diy/large/pause/new/modify',
    otherPause: '/diy/large/pause/add/other',
    listPause: '/diy/large/pause/list',
    auditPause: '/diy/large/pause/audit',
    savePause: '/diy/large/pause/save',
    modifyPrice: '/diy/large/pause/new/modifyPrice',
    modifyPauseColor: '/diy/large/pause/modifyColor',
    delPause: '/diy/large/pause/delete',
    export: '/diy/large/cost/export',
    modifyPausePriceAndRemark: '/diy/large/pause/modifyRemark',
    singleRemark: '/diy/large/pause/singleRemark',
    repealPause: '/diy/large/pause/repeal',

    //日志
    getProductList: '/large/project/dynamic/list_logger',
    //查看合同
    viewQuoteContract: '/anxin/sign/view',
    webQuoteContract: '/diy/large/quoteAgreement/show',


    //收款
    listFinance: '/diy/large/quoteAccount/list',
    headFinance: '/diy/large/quoteAccount/detail/head',
    bodyFinance: '/diy/large/quoteAccount/detail/body',
    receiveFinance: '/diy/large/quoteAccount/receive',
    receiveFinanceDetail: '/diy/large/quoteAgreement/detail_receivables',

    addReceipt: '/diy/large/quoteAccount/receipt/add',
    modifyReceipt: '/diy/large/quoteAccount/receipt/modify',
    delReceipt: '/diy/large/quoteAccount/receipt/del',
    finishReceipt: '/diy/large/quoteAccount/receipt/over',

    //财务管理收款模板
    addFinanceTemp: '/diy/large/quote/pay/template/add',
    uptFinanceTemp: '/diy/large/quote/pay/template/updateTemplate',



    //成本
    listCost: '/diy/large/cost/list',
    listCostBySelf: '/diy/large/cost/myList',
    detailCost: '/diy/large/cost/detail',
    sendCost: '/diy/large/cost/send',
    importCost: '/diy/large/cost/import',
    distributeCost: '/diy/large/cost/distributionEmployee',
    saveCost: '/diy/large/cost/save',
    //成本2.2.4
    listReceivables: '/diy/large/quote/payReceipt',
    listGetRecord: '/diy/large/quote/budget/data/getRecord',
    lockContract: '/diy/large/quote/updateLockBudgetStatus',
    drawingConfigSet: '/diy/large/config/company/examineDrawingConfigSet',
    drawingConfigGet: '/diy/large/config/company/examineDrawingConfigGet',
    //成本合同
    getContractList: '/diy/large/quote/accessory/getAccessory',
    editContractTitle: '/diy/large/quote/accessory/change/name',
    addContractTitle: '/diy/large/quote/accessory/addAccessory',
    getContractdetail: '/diy/large/quote/accessory/getAccessory/detail',
    addContractImage: '/diy/large/quote/accessory/addOneAccessory',
    saveContractList: '/diy/large/quote/accessory/addAccessory',
    delContractFile: '/diy/large/quote/accessory/deleteOneAccessory',
    delContractList: '/diy/large/quote/accessory/deleteAccessory',
    uploadContractList: '/diy/large/quote/accessory/changeAccessory',
    editContractFile: '/diy/large/quote/accessory/addOneFile',
    //报价合同
    getOfferContractList: '/diy/large/quote/accessory/queryAccessory/list',
    getOfferContractListNew: '/diy/large/quote/accessory/getAccessoryList',
    currentOfferContractList: '/diy/large/quote/accessory/queryAccessory',
    submitOfferContractListFirst: '/diy/large/quote/accessory/batchAdd', //第一次提交
    addOfferContractList: '/diy/large/quote/accessory/batchAdd',
    getOfferContractListDetail: '/diy/large/quote/accessory/quote/getAccessory',
    addOfferContractListImage: '/diy/large/quote/accessory/putOneAccessory',
    delOfferContractListImage: '/diy/large/quote/accessory/removeOneAccessory',
    editOfferContractListTitle: '/diy/large/quote/accessory/quote/changeName',
    editOfferContractListFile: '/diy/large/quote/accessory/putOneFile',
    delOfferContractListFile: '/diy/large/quote/accessory/removeAccessory',
    getModifyPrice: '/diy/large/quoteAgreement/modifyPrice',
    withdrawalConfirmation:'/diy/large/quote/withdrawalConfirmation',
    //微信通知
    getQrcode: '/api/wx/account/getQrcodeByTop',
    submitWx: '/large/sys/setNotice',
    getWxInfo: '/large/sys/getWx',
    WxUnbundle: '/large/sys/unbundle',

    //核算成本时发布
    publishNoticeCost: '/diy/large/cost/notice',
    historyEmpCost: '/diy/large/cost/employee',
    delNoticeCost: '/diy/large/cost/delete',
    viewNoticeCost: '/diy/large/cost/select',

    //动态
    listDynamic: '/large/project/dynamic/list',
    examineDynamic: '/large/project/dynamic/examine',
    delDynamic: '/large/project/dynamic/del',
    listEvaluate: '/large/quote/evaluate/listByQuote',
    replyEvaluate: '/large/quote/evaluate/evaluateReply',
    //动态评论删除
    delDynamicComment: '/large/project/dynamic/delComment',

    //保修卡
    listCard: '/diy/large/service/card/list',
    infoCard: '/diy/large/service/card/info',
    modifyCard: '/diy/large/service/card/modify',
    recordCard: '/large/sys/queryList_WarrantyRecord',
    recordDynamicCard: '/large/sys/queryList_WarrantyRecordDynamic',
    recordAssignCard: '/large/sys/warrantyRecordAssign',

    configCompany: '/diy/large/config/company/warrantyDtl',
    modifyCompany: '/diy/large/config/company/warrantyUdp',


    //新增设计费和工程管理费
    configDesignFee: '/diy/large/config/mould/proPriceUdp',
    listDesignFee: '/diy/large/config/mould/proPriceList',
    delDesignFee: '/diy/large/config/mould/proPriceDel',
    configRatio: '/diy/large/config/project/ratioUdp',
    detailRatio: '/diy/large/config/project/ratioDtl',


    // 模板管理
    mouldList: '/diy/large/offer/mouldList',
    upExl: '/diy/large/offer/upExl',
    mouldUpd: '/diy/large/offer/mouldUpd',
    mouldRack: '/diy/large/offer/mouldRack',
    packageRack: '/diy/large/offer/packageRack',
    mouldInfoList: '/diy/large/offer/mouldInfoList',
    categoryList: '/diy/large/offer/mouldInfo/categoryList',
    downExl: '/diy/large/offer/downExl',
    mouldInfoUpd: '/diy/large/offer/mouldInfoUpd',
    packageUpd: '/diy/large/offer/packageUpd',
    packageInfo: '/diy/large/offer/packageInfo',
    mouldNameList: '/diy/large/offer/mouldNameList',
    packageList: '/diy/large/offer/packageList',
    packageInfoParentAdd: '/diy/large/offer/packageInfoParentAdd',
    packageInfoRemove: '/diy/large/offer/packageInfo/remove',
    packageInfoItemAdd: '/diy/large/offer/packageInfoItemAdd',
    packageInfoItemUpdate: '/diy/large/offer/packageInfo/update',

    // 成本部分上下架
    materRack: '/diy/large/offer/1/mouldRack', // 主材上下架
    baseRack: '/diy/large/offer/2/mouldRack', // 基装上下架
    mealBaseRack: '/diy/large/offer/3/mouldRack', // 套餐基装上下架
    wholeBaseRack: '/diy/large/offer/4/mouldRack', // 整装基装上下架
    mealRack: '/diy/large/offer/3/packageRack', // 套餐上下架
    wholeRack: '/diy/large/offer/4/packageRack', // 整装上下架
    wholeBaseCopy: '/diy/large/offer/copy',
    // top反馈调整
    offerExplainUpd: '/diy/large/offer/offerExplainUpd',
    offerMouldInfo: '/diy/large/offer/mouldInfo',

    //主材模板
    masterTempList: '/large/quote/add/reduce/material',
    masterTempDel: '/large/quote/add/reduce/deleteMain',
    masterTempDefault: '/large/quote/add/reduce/defaultMain',
    masterTempSave: '/large/quote/add/reduce/saveMain',
    masterTempTitle: '/large/quote/add/reduce/updateName',
    masterTempDetail: '/large/quote/add/reduce/detailMain',
    masterTempMaterialDel: '/large/quote/add/reduce/deleteData',
    masterTempMove: '/large/quote/add/reduce/moveData',
    masterTempTop: '/large/quote/add/reduce/firstData',

    // 价格范围
    priceList: '/diy/large/offer/package/price/list',
    priceDelete: '/diy/large/offer/package/price/delete',
    priceSortUdp: '/diy/large/offer/package/price/sortUdp',
    packagePriceUpd: '/diy/large/offer/packagePriceUpd',


    //项目管理
    listProject: '/diy/large/project/list',
    checkPersonnel: '/diy/large/project/check/personnel',



    //整改管理
    listNotice: '/large/sys/queryList_Notice',
    detailNotice: '/large/sys/loadNotice',
    handleNotice: '/large/sys/handleNotice',
    listStage: '/large/sys/queryList_Stage',
    addStage: '/large/sys/addStage',
    upStage: '/large/sys/upStage',
    delStage: '/large/sys/delStage',

    //工费审核
    listLabourExpenses: '/diy/large/project/labourExpenses/list',
    detailLabourExpenses: '/diy/large/project/labourExpenses/detail',
    agreeLabourExpenses: '/diy/large/project/labourExpenses/agree',
    rejectLabourExpenses: '/diy/large/project/labourExpenses/reject',

    //工费结算
    listLabourExpensesSettle: '/diy/large/project/labourExpenses/settlement/list',
    submitLabourExpensesSettle: '/diy/large/project/labourExpenses/settlement/submit',
    rejectLabourExpensesSettle: '/diy/large/project/labourExpenses/settlement/reject',
    costLabourExpensesSettle: '/diy/large/project/labourExpenses/settlement/cost',

    //工费通用
    headLabourExpenses: '/diy/large/project/labourExpenses/head/detail',
    recordLabourExpenses: '/diy/large/project/labourExpenses/request/list',

    //审核记录
    veriftyLabourExpenses: '/diy/large/project/labourExpenses/labourExpensesRecord',

    // 在线客服
    createCustom: '/diy/large/service/custom/create',
    customList: '/diy/large/service/custom/list',
    delCustom: '/diy/large/service/custom/del',
    udpOrderCustom: '/diy/large/service/custom/udpOrder',
    editCustom: '/diy/large/service/custom/update',

    // 产品管理
    productList: '/large/sys/queryList_Product',
    productInfo: '/large/sys/product/info',
    addProduct: '/large/sys/product/add',
    upProduct: '/large/sys/product/up',
    upperProduct: '/large/sys/product/upper',
    downProduct: '/large/sys/product/down',
    delProduct: '/large/sys/product/del',
    moveProduct: '/large/sys/product/move',
    topProduct: '/large/sys/product/top',
    productAddImg: '/large/sys/product/addImg',
    productDelImg: '/large/sys/product/delImg',
    productBaseInfo: '/large/sys/product/info',
    productImgInfo: '/large/sys/product/img',
    selectProductProject: '/large/sys/product/selectProductProject',
    selectProductToAddProject: '/large/sys/product/selectProductToAddProject',
    relationProject: '/large/sys/product/relationProject',
    removeProject: '/large/sys/product/removeProject',
    upProByCoverImg: '/large/sys/product/upProByCoverImg',

    // 素材管理
    noticeSourceAdd: '/diy/large/notice/source/add',
    noticeSourceDel: '/diy/large/notice/source/del',
    noticeSourceList: '/diy/large/notice/source/list',
    noticeSourceInfo: '/diy/large/notice/source/info',
    noticeSourceUpd: '/diy/large/notice/source/upd',

    // 通知管理
    noticeAdd: '/diy/large/notice/add',
    noticeDel: '/diy/large/notice/del',
    noticeList: '/diy/large/notice/list',
    noticeInfo: '/diy/large/notice/info',
    noticeUpd: '/diy/large/notice/upd',
    noticeObjList: '/diy/large/notice/obj/list',


    //考试管理（题库）
    createQuest: '/diy/large/exam/item/request',
    modifyQuest: '/diy/large/exam/item/modify',
    listQuest: '/diy/large/exam/item/list',
    deleteQuest: '/diy/large/exam/item/delete',
    detailQuest: '/diy/large/exam/item/detail',
    detailItemsQuest: '/diy/large/exam/item/question/list',
    deleteItemQuest: '/diy/large/exam/item/question/delete',
    choiceQuest: '/diy/large/exam/item/question/choice',
    clozeQuest: '/diy/large/exam/item/question/cloze',
    moveQuest: '/diy/large/exam/item/move',
    detailInfoQuest: '/diy/large/exam/item/question/detail',

    //考试
    createExam: '/diy/large/exam/request',
    modifyExam: '/diy/large/exam/modify',
    listExam: '/diy/large/exam/list',
    deleteExam: '/diy/large/exam/delete',
    detailExam: '/diy/large/exam/detail',
    detailItemExam: '/diy/large/exam/question/list',
    deleteItemExam: '/diy/large/exam/question/delete',
    choiceExam: '/diy/large/exam/question/choice',
    clozeExam: '/diy/large/exam/question/cloze',
    addExam: '/diy/large/exam/question/add',
    moveExam: '/diy/large/exam/move',
    detailInfoExam: '/diy/large/exam/question/detail',
    addMemberExam: '/diy/large/exam/members/add',
    detailMemberExam: '/diy/large/exam/members/list',

    //数据统计
    statisticalWhole: '/diy/large/quote/statistical/statisticalWhole',
    statisticalWholeInfo: '/diy/large/quote/statistical/statisticalWholeInfo',
    statisticalWholeInfoDw: '/diy/large/quote/statistical/statisticalWholeInfoDw',
    statisticalConstructionSite: '/diy/large/quote/statistical/statisticalConstructionSite',
    statisticalConstructionSiteInfo: '/diy/large/quote/statistical/statisticalConstructionSiteInfo',
    statisticalConstructionSiteInfoDw: '/diy/large/quote/statistical/statisticalConstructionSiteInfoDw',
    statisticalConstructionSiteTop:'/diy/large/quote/statistical/topStatisticalConstructionSite',
    statAttendanceDate:'/diy/large/quote/calendar',
    statAttendanceMap:'/diy/large/quote/mapView',
    statAttendanceTable:'/diy/large/user/board/data',
    statAttendanceEmp:'/diy/large/user/board/employee/list',
    //小程序案例
    smallProgramList: '/small/program/case/list',
    smallProgramDetails: '/small/program/case/details',
    smallProgramEdit: '/small/program/case/update',
    smallProgramSave: '/small/program/case/save',
    smallProgramRelease: '/small/program/case/release',
    smallProgramMaterls: '/small/program/case/brand',
    smallProgramStyle: '/small/program/case/style',
    smallDeleteBrand: '/small/program/case/delete/brand',
    smallAddBrand: '/small/program/case/add/brand',
    smallEditBrand: '/small/program/case/update/brand',
    //小程序案例新建
    newSmallProgramList: '/small/program/case/page/list',
    newSmallProgramDetails: '/small/program/case/page/details',
    newSmallProgramEdit: '/small/program/case/page/add',
    newSmallProgramDelet: '/small/program/case/page/delete',
    newSmallProgramSave: '/small/program/case/page/save',
    newSmallDeleteBrand: '/small/program/case/page/delete/brand',
    newSmallAddBrand: '/small/program/case/page/add/brand',
    newSmallEditBrand: '/small/program/case/page/update/brand',
    newSmallProgramMaterls: '/small/program/case/page/select/brand',
};

