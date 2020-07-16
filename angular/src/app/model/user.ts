export class User {
    id = 0;
    companyId = 0;
    account = '';
    name = '';
    phone = '';
    isChild = 0;
    createUserId = 0;
    headImg = 'https://qiniu.madrock.com.cn/rev/imgs/435467b6-6b9e-2a36-a51b-bde1d77a31ce.png';
    positionName = '';
    empNo = '';
    idCard = '';
    deps: Array<any> = [];
    //快捷查询时部门数据
    quoteQueryType = 1;
    //快捷查询时的部门列表
    departmentQueryType = 1;
}
