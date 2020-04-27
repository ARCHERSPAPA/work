export const Reg = {
    ALPHA_NUM_UNDERLINE_ZH:/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    ALPHA_NUM_UNDERLINE:/^[a-zA-Z0-9_]+$/,
    ALPHA_AND_NUM_UNDERLINE:/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9_]+$/,//(字母和數字均為必填項目二者)
    ALPHA_NUM_ZH:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
    NUM_DECIMAL_ONE:/(^([1-9]?|[1][0]?)(\.\d{1})?$)|(^[0](?:\.\d{1})$)/,
    ALPHA_NUM:/^[a-zA-Z0-9]+$/,
    MOBILE:/(^(0\d{2}\-?)?(\d{8})$)|(^(0\d{3}\-?)?(\d{7,8})$)/,//(固定电话)
    PHONE:/^[1][3-9]\d{9}$/, //(手机号码)
    MOBILE_PHONE:/(^(0\d{2}\-?)?(\d{8})$)|(^(0\d{3}\-?)?(\d{7,8})$)|(^[1][3,5,6,7,8,9]\d{9}$)/,//(固定电话和手机号码一并)
    ALPHA_ZH:/^[a-zA-Z|\u4e00-\u9fa5]+$/,
    NUM_NOT_MIN:/^[1-9](\d+)?(?:\.\d{1,4})?$/,
    NUM_MIN:/^\d+$/,
    NUM_MONEY_DECIMAL:/^\d+(\.\d{1,2})?$/,
    NUM_DECIMAL:/^\d+(\.\d{1,4})?$/,
    NUM_DECIMAL_INT:/^(-)?\d+(\.\d{1,2})?$/,
    NUM_DECIMAL_POINT:/(^[0](\.\d{1,2})?$)|(^[1](\.[0]{1,2})?$)/,
    NUM_NOT_MIN_DECIMAL:/(^[0]$)|(^[1-9]\d+(\.\d{1,2})?$)/,
    //格式如：0.12 0 1.25
    NUM_INT_AND_DECIMAL:/(^[0](\.\d{1,2})?$)|(^[1-9]\d*(\.\d{1,2})?$)/,
    // ID_CARD:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    ID_CARD:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
    TRIM:/^\s+/,
    ALPHA_NUM_ZH_BLANK:/[A-Za-z0-9\s+]*/g,
    ALPHA:/^[a-zA-Z]$/,
    OPERATOR_SYMBOL:/[\+|\-|\*|\/]/,
    // FOUR_OPERATOR:/(^(\(((\d+(\.\d{1,2})?))([\+\-\*\/]\d+(\.\d{1,2})?)*\))*(([\+\-\*\/])?\d+(\.\d{1,2})?)*(([\+\-\*\/])?(\(\d+([\+\-\*\/]\d+(\.\d{1,2})?)*\)))*(([\+\-\*\/])?\d+(\.\d{1,2})?)*$)/,
    FOUR_OPERATOR:/^(\(?\d+(\.\d{1,2})?\)?(\+|-|\*|\/))+\d+(\.\d{1,2})?\)?$/,
    AN_XIN_SIGN:/[\/|\\|\%|\&|\<|\>]/g,
    //整数
    NUM_INT:/^([0]|[1-9][0-9]*)$/
}
