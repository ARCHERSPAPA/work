export const Messages = {
    SUCCESS: {
        LOGIN: '登录成功',
        DATA: '接口数据拉取成功'
    },
    FAIL: {
        LOGIN: '登录失败',
        DATA: '接口数据拉取失败'
    },
    ERROR: {
        CODE: '验证码错误',
        IMG_LARGE: '上传图片过大或者图片不规则',
        IMG_MAX: '最多可添加10张图片',
        CASE_IMG_MAX: '最多可添加5张图片',
        UPLOAD_IMG_MAX: '批量操作单次最多选择9张照片',
        DESIGNER_MAX: '最多可以添加5位不同的设计师人选',
        RADIO: '输入的比例值已超过最值或不足',
        DATA_STAGE_MAX: '最多添加20个验收阶段',
        PAY: '请保证提交金额等于报价金额',
        INPUT: '输入的值不能为空或者输入格式不正确',
        QUOTE_ID: '当前报价信息有误',
        FILE_EXIST: '当前文件已存在',
        SUBMIT_FREQUENTLY: '请勿频繁操作',
        SUBMIT_VALIDATE: '输入格式不正确或者输入不能为空',
        NOT_VALUE_ZERO: '输入值不能小于0',
        SELECT_NOT_VALUE: '选择不能为空',
        EDIT_ERROR: '当前状态不能编辑',
        uploadMax(num) {
            return `批量操作单次最多选择${num}张照片`;
        }
    },
    EMPTY: '此项为必填项，输入不能为空',
    SELECT_RADIO_EMPTY: '单选时，必须标记一个;多选时，至少标记两个',
    SELECT_NOT_EMPTY: '此项为必选项,选择不能为空',
    PACK_EMPTY_ITEM:"请至少选择一款以上的材料",
    LOADING: '页面数据加载中...',
    CLICK_VIEW: '点击查看详细信息',
    PARAM_EMPTY: '获取的参数不能为空，请联系客服',
    ERROR_TEXT: '当前系统出现异常，如有需要，请您及时联系客服',
    UPLOAD: {
        IMG_MAX: '请选择大小在2M以内的图片',
        FAIL: '上传图片失败',
        NET_BUSY: '网络繁忙，请稍后再试',
        NOT_AUTH: '上传失败，请重新上传', //2.2.2版本更改
        EMPTY: '上传内容不能为空'
    },
    selectUser(max) {
        return '选择人员最多不能超过' + max + '人';
    },
    AREAS: '请确保适用面积范围后面数据大于前面',
    NOT_VALID: '公司在审核中或者审核未通过，暂无法查看',
    NOT_DISPATCH_LOCATION: '地图上暂无该员工的项目数据',
    GRAPH_TIP: {
        NOT_FINISH_AUDIT: '请完成所有图纸审核才能进行锁定',
        ALL_FINISH_AUDIT: '锁定后设计师将无法编辑设计图纸',
        RELEASE_LOCK: '解除锁定后设计师将可以编辑设计图纸',
        READ_ALL: '确定将全部图纸设为可阅',
        READ_NOT_ALL: '确定将全部图纸设为不可阅',
        CUSTOMER_NOT_ALL: '请至少点亮一张图纸供客户查阅',
        CUSTOMER_EXIST_VIEW: '图纸提交至客户后，客户即可查阅',
        GRAPH_LOCK: '设计图纸已锁定'
    },
    DESIGNER_TIP: {
        DOING: '设计师正在进行增减项，请等待完成后再派单操作'
    },
    SWITCH_POS:{
        NO_MOVE:"当前无发生位置的移动"
    }

};
