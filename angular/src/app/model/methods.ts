/**
 * 根据状态类型来显示状态名称
 * @param state 【-2已关闭 -1已申请关闭 0-待保存 1-已提交报价 2-已确认报价
 * 3-已签单 4-已派单 5-已申请开工 6-已同意开工 7-已申请验收 8-已竣工
 * 10-已保存 11-已提交派单 12-已派单(增减) 13-已申请开工(增减) 14-已同意开工(增减)】
 * @returns {string}
 */


export function getCaseName(state) {
    if ([6, 7, 14].indexOf(state) > -1) {
        return '进行中';
    } else if (state == -2) {
        return '已关闭';
    } else if (!state) {
        return '--';
    } else {
        return '已完工';
    }
}



import {CUSTOM_SEARCH_NAMES, STAGES} from './constant';


export function getStateName(state) {

    switch (state) {
        // case -1: return "申请关闭";
        case -1:
            return '申请退单';
        case -2:
            return '已关闭';
        case 0:
            return '已创建';
        case 1:
            return '已报价';
        case 2:
            return '待确认合同';
        case 3:
            /**
             * v2.1.8版本新改
             */
            // return "待派单";
            return '已签单';
        case 4:
            return '待开工';
        // case 5: return "待确认开工";
        /**
         * v2.1.5版本新增状态
         */
        case 5:
            return '待监理确认';
        // case 6: return "已同意开工";
        case 6:
            return '施工中';
        // case 7: return "已申请验收";
        case 7:
            return '待验收';
        case 8:
            return '已竣工';
        case 10:
            return '已保存';
        /**
         * v2.2.3  待派单--》待开工
		 * v2.2.4 dh 将待开工 修改成 待派单
         */
        case 11:
            return '待派单';
        // case 12: return "已派单";
        case 12:
            return '增减项目';
        // case 13: return "待开工";
        case 13:
            return '增减项目';
        // case 14: return "施工中";
        case 14:
            return '增减项目';
        /**
         * v2.1.5版本新增状态
         */
        case 15:
            return '待客户确认';
        /**
         * v2.1.9版本新增状态
          */
        case 16:
            return '待确认合同';
        //待定
        default:
            return '已创建';
    }
}

export function getProductState(state) {

    switch (state) {
        // case -1: return "申请关闭";
        case -1:
            return '已申请关闭';
        case -2:
            return '已关闭';
        case 0:
            return '待保存';
        case 1:
            return '已提交';
        case 2:
            return '已确认报价';
        case 3:
            return '已签单';
        case 4:
            return '已派单';
        // case 5: return "待确认开工";
        /**
         * v2.1.5版本新增状态
         */
        case 5:
            return '工长已申请开工';
        // case 6: return "已同意开工";
        case 6:
            return '已同意开工';
        // case 7: return "已申请验收";
        case 7:
            return '已申请验收';
        case 8:
            return '已竣工';
        case 10:
            return '已保存';
        case 11:
            return '已提交派单';
        // case 12: return "已派单";
        case 12:
            return '已派单(增减)';
        // case 13: return "待开工";
        case 13:
            return '已申请开工(增减)';
        // case 14: return "施工中";
        case 14:
            return '已同意开工';
        /**
         * v2.1.5版本新增状态
         */
        //待定
        default:
            return '已创建';
    }
}

/**
 * 编辑客户信息【0:已创建，1:已报价，2:待确认合同，10:已保存】
 * @param state
 * @returns {boolean}
 */
export function editUserByState(state) {
    if (state === null) { return true; }
    switch (state) {
        case 0:
            return true;
        case 1:
            return true;
        case 2:
            return true;
        case 10:
            return true;
        case 16:
            return true;
        default:
            return false;
    }
}

/**
 * 删除客户信息【-2：已关闭，0：已创建，10：已保存】
 * @param state
 * @returns {boolean}
 */
export function deleteUserByState(state) {
    if (state === null) { return true; }
    switch (state) {
        case -2:
            return true;
        case 0:
            return true;

        case 1:
            return true;
        case 2:
            return true;
        case 10:
            return true;
        case 16:
            return true;
        default:
            return false;
    }
}

export function getExamineName(type) {
    switch (type) {
        case 0:
            return '未审核';
        case 1:
            return '部分审核';
        case 2:
            return '全部审核';
        default:
            return '--';
    }
}
/**
 * 根据类型来设置装修类别
 * @param type
 * @returns {string}
 */
export function getTypeName(type) {
    switch (type) {
        case 1:
            return '基装';
        case 2:
            return '套装';
        case 3:
            return '整装';
        default:
            return '--';
    }
}

/**
 * 根据类型来设置装修类别
 * @param type
 * @returns {string}
 */
export function getStatsTypeName(type) {
    switch (type) {
        case 1:
            return '基装';
        case 2:
            return '套装';
        case 3:
            return '整装';
        default:
            return '';
    }
}

/**
 * 根据类型拉取对应的装修类型参数
 * @param type
 * @returns {number}
 */
export function getVersionType(type) {
    switch (type) {
        //选择主材的参数
        case 2:
            //主材类型
            return 1;
        case 3:
            return 2;
        case 5:
            return 1;
        default:
            return 2;
    }
}

/**
 *
 * @param state 0-未上传成本 1-已上传成本 2-已提交至工长，3-已被工长确认 4-已签署成本合同
 * @returns {string}
 */
export function getCostStateName(state) {
    switch (state) {
        case 0:
            return '未上传成本';
        case 1:
            return '未提交';
        case 2:
            return '待确认成本';
        case 3:
            return '已确认成本';
        case 4:
            return '已签署合同';
        default:
            return '--';
    }
}

/**
 * 根据当前客户状态来显示客户列表的签单状态(状态:0未签单,1已报价,2已签单,3已死单,4删除,5待确认合同)
 * @param state
 * @returns {string}
 */
export function getSignNameByState(state) {
    switch (state) {
        case 0:
            return '已创建';
        case 1:
            return '已报价';
        case 2:
            return '已签单';
        case 3:
            return '已死单';
        case 4:
            return '删除';
        case 5:
            return '待确认合同';
        default:
            return '其它';
    }
}

/**
 * 根据状态来显示当前是否显示增减项按钮
 * @param state
 * @returns {boolean}
 */
export function getAddAndDelByStatus(state) {
    switch (state) {
        case 3:
            return true;
        case 4:
            return true;
        case 5:
            return true;
        case 6:
            return true;
        case 11:
            return true;
        case 15:
            return true;
        // case 16:
        //     return true;
        // case 11:
        //     return true;
        // case 12:
        //     return true;
        // case 13:
        //     return true;
        default:
            return false;
    }
}

/**
 * 根据类型来设置相应的职权人
 * @param type
 * @returns {string}
 */
export function getPostName(type) {
    switch (type) {
        case 1:
            return '主设计师';
        case 2:
            return '助理设计师';
        case 3:
            return '工长';
        case 4:
            return '监理';
        case 5:
            return '工程总监';
        default:
            return '其它';
    }
}

/**
 * 根据状态来显示当前的结算状态
 * @param state  1-工长待审核，2-工长未通过，3-工长已通过，4-部门已通过，5-部门已回拒，6-财务已结束 7-财务已忽略'<初始版>
 * 1-工长审核,2-工长未通过,3-考勤审核,4-财务审核,5-考勤未通过,6-已结算,7-未通过结算<修改版>
 * @returns {string}
 */
// 2.20版本更改了状态
export function getWageState(state) {
    switch (state) {
        case 1:
            return '工长审核';
        case 2:
            return '工长未通过';
        case 3:
            return '工长已通过';
        case 4:
            return '考勤已通过';
        case 5:
            return '考勤未通过';
        case 6:
            return '已结算';
        case 7:
            return '已忽略';
        default:
            return '其它功能';
    }
}

/**
 * 根据类型码来显示当前的结算资质
 * @param type
 * @returns {string}
 */
export function getWageType(type) {
    switch (type) {
        case 1:
            return '借支';
        case 2:
            return '结算';
        default:
            return '其它';
    }
}

/**
 * 根据状态来显示当前状态下的按钮（主要用于预算和合同）
 * @param bs baseQuote对象
 * @@state:【-2已关闭 -1已申请关闭 0-待保存 1-已提交报价 2-已确认报价 3-已签单 4-已派单 5-已申请开工(待监理确认)
 *6-已同意开工 7-已申请验收 8-已竣工 10-已保存
 * 11-已提交派单 12-已派单(增减) 13-已申请开工(增减) 14-已同意开工(增减) 15-待客户确认 16-已提交合同】
 * @returns {boolean}
 */
export function showBtnByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 1:
                return true;
            case 3:
                return true;     //2.2.3版本修改测试说需要加上
            case 10:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return bs && bs.state == 0 ? true : false;
}

/**
 * 根据状态编辑合同相关信息
 * @param bs
 * @returns {boolean}
 * v2.2.4 已签单时不可编辑合同
 */
export function editContractByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 1:
                return true;
            case 2:
                return true;

            // case 3:
            //     return true;
            case 10:
                return true;
            case 15:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return (bs && bs.state === 0) ? true : false;
}

/**
 * 根据页面状态编辑合同相关信息
 * @param sb
 * @returns {boolean}
 */
export function editContractPageByState(sb) {
    if (sb) {
        switch (sb) {
            case 1:
                return true;
            case 10:
                return true;
            default:
                return false;
        }
    }
}

/**
 * 根据项目详情中状态来判定当前合同是否可以临时保存
 * @param bs
 * @returns {any}
 */
export function saveTempContractByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 10: return true;
            case 15: return true;
            case 16: return true;
            default: return false;
        }
    }
    return (bs && bs.state === 0) ? true : false;
}

/**
 * 根据状态显示当前导出和预览功能
 * @param bs
 * @returns {any}
 */
export function showExpressByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                return true;
            // case 4:
            //     return true;
            case 10:
                return true;
            case 11:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return bs && bs.state == 0 ? true : false;
}

/**
 * 根据报价状态显示当前材料清单可否编辑
 * @param bs
 * @returns {boolean}
 */
export function showMakeBtnByState(bs) {
    // if(bs && bs.state){
    //     switch(bs.state){
    //         case -1:
    //             return true;
    //         case 1:
    //             return true;
    //         case 2:
    //             return true;
    //         case 3:
    //             return true;
    //         case 4:
    //             return true;
    //         case 5:
    //             return true;
    //         case 6:
    //             return true;
    //         case 7:
    //             return true;
    //         case 10:
    //             return true;
    //         case 11:
    //             return true;
    //         case 12:
    //             return true;
    //         case 13:
    //             return true;
    //         default:
    //             return false;
    //     }
    // }
    // return bs && bs.state === 0? true:false;
    /**
     * 关闭和竣工时，不能再次修改材料清单(2019-08-27)
     */
    return bs && !(bs.state == -2 || bs.state == 8);
}

/**
 * 根据状态来显示保存按钮
 * @param bs
 * @returns {boolean}
 */
export function showSaveByState(bs) {
    // if(bs && bs.state){}
    return bs && (bs.state == 0 || bs.state == 10);
}

/**
 * 根据状态来显示增减按钮
 * @param bs baseQuote对象
 * @returns {boolean}
 */
export function showAddOrDelByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 3:
                return true;
            case 4:
                return true;
            case 5:
                return true;
            case 6:
                return true;
            case 11:
                return true;
            case 15:
                return true;
            // case 16:
            //     return true;
            default:
                return false;
        }
    }
    return false;
}


/**
 * 显示增减项目详情
 * @param bs
 * @returns {boolean}
 */
export function showRegularByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case -1:
                return true;
            case -2:
                return true;
            case 3:
                return true;
            case 4:
                return true;
            case 5:
                return true;
            case 6:
                return true;
            case 7:
                return true;
            case 8:
                return true;
            case 11:
                return true;
            case 12:
                return true;
            case 13:
                return true;
            case 14:
                return true;
            case 15:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return false;
}

/**
 * 当前角色是否显示
 * @param bs 对象
 * @returns {boolean}
 */
export function showRoleByState(bs) {
    return bs && bs.state >= 0 && bs.state != 10;
}

/**
 * 根据报价状态显示角色数据列表 v2.1.5新增在未关闭或者未竣工之前均可修改
 * @param bs
 * @returns {boolean}
 */
export function showRoleEditByState(bs) {
    switch (bs.state) {
        case 1:
            return true;
        case 2:
            return true;
        case 3:
            return true;
        case 4:
            return true;
        case 5:
            return true;
        case 6:
            return true;
        case 7:
            return true;

        case 10:
            return true;
        case 11:
            return true;
        case 12:
            return true;
        case 13:
            return true;
        case 14:
            return true;
        case 15:
            return true;
    }
    return bs && bs.state == 0 ? true : false;
}

/**
 * 审核状态判断
 * @param state 【0-未保存 10-设计师已申请，11-工长已申请，20-工长审核通过,21-工长审核失败,
 * 30-部门审核通过，31-部门审核失败，40-客户审核通过，41-客户审核失败】
 * @returns {string}
 */
export function getAuditStateName(state) {
    switch (state) {
        case 10:
            return '未审核';
        case 11:
            return '未审核';
        case 20:
            return '工长同意';
        case 21:
            // return "工长未同意";
            return '未通过';
        case 30:
            return '部门同意';
        case 31:
            // return "部门未同意";
            return '未通过';
        case 40:
            // return "客户同意";
            return '通过';
        case 41:
            // return "客户未同意";
            return '未通过';
        default:
            return '其它';
    }
}

/**
 * 根据状态显示提交与否按钮
 * @param state 【0-未保存 10-设计师已申请，11-工长已申请，20-工长审核通过,21-工长审核失败,
 * 30-部门审核通过，31-部门审核失败，40-客户审核通过，41-客户审核失败】
 * @returns {boolean}
 */
export function showAddOrDelSubmitByState(state) {
    switch (state) {
        case 0:
            return true;
        case 10:
            return true;
        default:
            return false;
    }
}

/**
 * 根据工长审核通过显示部门是否需要审核v2.1.9调整（取消工长审核申请）
 * @param state 【0-未保存 10-设计师已申请，11-工长已申请，20-工长审核通过,21-工长审核失败,
 * 30-部门审核通过，31-部门审核失败，40-客户审核通过，41-客户审核失败】
 * @returns {boolean}
 */
export function showAuditBtnByState(state) {
    if (state) {
        switch (state) {
            // case 11:
            //     return true;
            // case 20:
            //     return true;
            case 10:
                return true;
            case 11:
                return true;
            default:
                return false;
        }
    }
    return false;
}

export function showDetailByState(state) {
    switch (state) {
        case 0:
            return true;
        case 10:
            return true;
        case 20:
            return true;
        case 30:
            return true;
        case 40:
            return true;
        default:
            return false;
    }
}

/**
 * 审核失败时
 * @param state
 * @returns {boolean}
 */
export function hideAuditFailureByState(state) {
    switch (state) {
        case 21:
            return true;
        case 31:
            return true;
        case 41:
            return true;
        default:
            return false;
    }
}

/**
 *
 * @param level 评价等级:-1-差评 0-中评 1-好评
 * @returns {string}
 */
export function getEvaluateLevel(level) {
    switch (level) {
        case -1:
            return '差评';
        case 0:
            return '中评';
        case 1:
            return '好评';
        default:
            return '无评';
    }
}

/**
 * 返回设置费设置的title信息
 * @param type（1：基装，2：整装，3：套餐）
 * @returns {string}
 */
export function getDesignTitle(type) {
    switch (type) {
        case 2:
            return '基装';
        case 3:
            return '套餐';
        case 4:
            return '整装';
        default:
            return '其它';
    }
}

/**
 * 根据选中的报价类型，显示相应的设计费用类型【2：基装，3：套装，4：整装】
 * @param type
 * @returns {number}
 */
export function getDesignType(type) {
    switch (type) {
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 4;
        default:
            return 2;
    }
}

/**
 * 根据当前成本状态来显示导入与提交到工长按钮
 * @param state
 * @returns {boolean}
 */
export function showCostByState(state) {
    switch (state) {
        case 2:
            return true;
        case 3:
            return true;
        case 4:
            return true;
        default:
            return false;
    }
}

/**
 * 是否有资格查看或者填写合同信息
 * @param bs 对象
 * @returns {boolean}
 */
export function showContract(bs) {
    if (bs && bs.state) {
        return bs.state > 0 && bs.state != 10;
    }
}

/**
 * 返回户型的配制,如果不设置,默认设置为0
 * @param params
 * @returns {any}
 */
export function houseType(params) {
    params['roomNumber'] = params['roomNumber'] ? params['roomNumber'] : '';
    params['roomType'] = params['roomType'] ? params['roomType'] : '';
    // params["parlourType"] = params["parlourType"]? params["parlourType"]:0;
    params['toiletType'] = params['toiletType'] ? params['toiletType'] : '';
    // params["kitchenType"] = params["kitchenType"]?params["kitchenType"]:0;
    // params["balcony"] = params["balcony"]?params["balcony"]:0;
    return params;
}

/**
 * 根据报价状态来控制手机号码可输入
 * @param state
 * @returns {boolean}
 */
export function controlPhoneByState(state) {
    if (state === null) { return false; }
    switch (state) {
        case 1:
            return true;
        case 2:
            return true;
        default:
            return false;
    }
}

/**
 * 根据报价状态来控制户型和面积
 * @param state
 * @returns {boolean}
 */
export function controlHouseTypeByState(state) {
    if (!state) { return false; }
    switch (state) {
        case 2:
            return true;
        default:
            return false;
    }
}

/**
 * 根据报价状态来控制当前head的相关信息【0：待保存，10：已保存，1:已报价】
 * @param bs
 * @returns {any}
 */
export function controlHeadInfo(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 0:
                return true;
            case 1:
                return true;
            case 2:
                return true;
            case 10:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return bs && bs.state == 0 ? true : false;
}


/**
 * 项目列表中新建控件 v2.1.5新增状态管理（除已经关闭和已经竣工均可）
 * @param bs
 * @returns {any}
 */
export function controlBuildInfo(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                return true;
            case 4:
                return true;
            case 5:
                return true;
            case 6:
                return true;
            case 7:
                return true;

            case 10:
                return true;
            case 11:
                return true;
            case 12:
                return true;
            case 13:
                return true;
            case 14:
                return true;
            case 15:
                return true;
            case 16:
                return true;
            default:
                return false;
        }
    }
    return bs && bs.state == 0 ? true : false;
}


export function controlBuildUser(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            // case 4: return true;
            case 10:
                return true;
            // case 11: return true;
            default:
                return false;
        }
    }
    return bs && bs.state == 0 ? true : false;
}

/**
 * 判定当前是否为设计师
 * @param uphone 当前登录用户
 * @param designs 当前项目中的所有设计师
 * @returns {boolean}
 */
export function equalToSame(uphone, designs) {
    let flag = false;
    if (uphone && designs && designs.length > 0) {
        for (const design of designs) {
            if (design['phone'] == uphone) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}

/**
 * 返回付款期数或者全款
 * @param type
 * @returns {string}
 */
export function getPayType(type) {
    switch (type) {
        case 0:
            return '全款';
        case 1:
            return '第一期';
        case 2:
            return '第二期';
        case 3:
            return '第三期';
        case 4:
            return '第四期';
        case 5:
            return '第五期';
        case 6:
            return '第六期';
        case 7:
            return '第七期';
        case 8:
            return '第八期';
        case 9:
            return '定金';
        default:
            return '其它';

    }
}


export function getReciveType(type) {

}

/**
 * 返回付款方式
 * @param type
 * @returns {string}
 */
export function getPayItem(type) {
    switch (type) {
        case 0:
            return '全额付款';
        case 1:
            return '一期付款';
        case 2:
            return '二期付款';
        case 3:
            return '三期付款';
        default:
            return '付款方式未定';
    }
}

/**
 * 根据项目状态展示是否上传项目图片信息
 * @param bs【-2已关闭 -1已申请关闭 0-待保存 1-已提交报价 2-已确认报价 3-已签单 4-已派单 5-已申请开工
 *6-已同意开工 7-已申请验收 8-已竣工 10-已保存 11-已提交派单 12-已派单(增减) 13-已申请开工(增减) 14-已同意开工(增减)】
 * @returns {any}
 */
export function showGraphByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case -2:
                return true;
            case 8:
                return true;
            default:
                return false;
        }
    }

    // if (!bs || bs.state === 0) return false;
}

/**
 * 根据状态来显示结算与否
 * @param state 【1：工长待审，2：工长未通过，3：工长已通过，4：部门已通过，5：部门已回绝，
 * 6：账务已通过，7：账务已回绝】
 * @returns {boolean}
 */
export function showSettleByState(state) {
    if (state) {
        switch (state) {
            case 4:
                return true;
            case 6:
                return true;
            case 7:
                return true;
            default:
                return false;
        }
    }
    return false;
}

/**
 * 显示客户提交并修改
 */
export function showCustomerByState(bs) {
    if (bs && bs.state) {
        switch (bs.state) {
            case -2: return false;
            case 8: return false;
            default: return true;
        }
    }
    return true;
}

/**
 * 根据当前绑定状态来显示是否已经绑定
 * @param state
 * @returns {string}
 */
export function showBindNameByState(state) {
    switch (state) {
        case 0:
            return '已绑定';
        case 1:
            return '已解绑';
        default:
            return '已解绑';
    }
}

/**
 * 获取快捷查询部门时的配制
 * @param type
 * @returns {number}
 */
export function transformQuickDepartType(type) {
    switch (type) {
        case 0:
            return 10;
        case 1:
            return 11;
        case 2:
            return 12;
        default:
            return 12;
    }
}

export function getPositionState(state) {
    switch (state) {
        case 0:
            return '在职';
        case 1:
            return '离职';
        case 2:
            return '删除';
        default:
            return '--';
    }
}

/**
 * 根据自定义状态来显示设计师栏（201：项目列表新建）
 * @param type
 * @returns {boolean}
 */
export function showDesigner(type) {
    switch (type) {
        case 2:
            return true;
        case 201:
            return true;
        default:
            return false;
    }
}

/**
 * 根据自定义状态来显示各自人员（xx1：项目列表中新建）
 * @param type
 * @returns {boolean}
 */
export function showPersonal(type) {
    switch (type) {
        case 3:
            return true;
        case 301:
            return true;
        case 4:
            return true;
        case 401:
            return true;
        case 5:
            return true;
        case 501:
            return true;
        case 6:
            return true;
        case 7:
            return true;
        case 15:
            return true;
        case 13:
            return true;
        case 14:
            return true;
        default:
            return false;
    }
}

/**
 * 显示工长
 * @param type
 * @returns {boolean}
 */
export function showChiefs(type) {
    switch (type) {
        case 3:
            return true;
        case 301:
            return true;
        default:
            return false;
    }
}

/**
 * 显示监理
 * @param type
 * @returns {boolean}
 */
export function showSupervisors(type) {
    switch (type) {
        case 4:
            return true;
        case 401:
            return true;
        default:
            return false;
    }
}

/**
 * 显示总监
 * @param type
 * @returns {boolean}
 */
export function showLeaders(type) {
    switch (type) {
        case 5:
            return true;
        case 501:
            return true;
        default:
            return false;
    }
}

/**
 * 调用复用人员
 * @param type
 * @returns {boolean}
 */
export function showReusers(type) {
    switch (type) {
        case 6:
            return true;
        default:
            return false;
    }
}
export function showpriceUser(type) {
    switch (type) {
        case 13:
            return true;
        default:
            return false;
    }
}

export function showchecker(type) {
    switch (type) {
        case 14:
            return true;
        default:
            return false;
    }
}

/**
 * 自定义type,根据type来显示当前用户
 * @param {number} type
 */
export function showUsers(type: number) {
    switch (type) {
        case 9:
            return true;
        case 10:
            return true;
        case 11:
            return true;
        case 12:
            return true;
        default:
            return false;
    }
}

/**
 * 整理个性化项目的拖动问题
 * @param infos
 * @returns {any[]}
 */
export function getSortIds(infos: any) {
    const ids = [];
    if (infos && infos.length > 0) {
        for (const info of infos) {
            ids.push(info.id);
        }
    }
    return ids;
}

/**
 * 将小数转化为正数
 * @param num 当前数据
 * @param curve 转化位数
 * @returns {any}
 */
export function toInteger(num, curve) {
    const c = Math.pow(10, curve);
    if (Math.floor(num) == num) { return num * c; } else {
        const n = parseInt(String(num * c + 0.5 * Math.pow(-1, Math.abs(num) == num ? 2 : 1)), 10);
        return n;
    }
}

/**
 * 将object图像对像转换成图片数组
 * @param o
 * @returns {any[]}
 * @constructor
 */
export function ObjToArrByImg(o) {
    const imgs = [];
    if (o && o.length > 0) {
        for (const img of o) {
            imgs.push(img.content);
        }
    }
    return imgs;
}

/**
 * 选项或答案描述
 */
export function getOptionTag(type) {
    switch (type) {
        case 1:
        case 3:
            return '选项';
        case 2:
        case 4:
            return '答案';
        default:
            break;
    }
}

/**
 * 返回中文数字
 * @param index
 * @returns {string}
 */
export function getOptionName(index) {
    switch (index) {
        case 0:
            return '一';
        case 1:
            return '二';
        case 2:
            return '三';
        case 3:
            return '四';
        case 4:
            return '五';
        case 5:
            return '六';
        default:
            return;
    }
}

// 返回大写字母
export function getOptionLetters(index) {
    switch (index) {
        case 0:
            return 'A';
        case 1:
            return 'B';
        case 2:
            return 'C';
        case 3:
            return 'D';
        case 4:
            return 'E';
        case 5:
            return 'F';
        default:
            return;
    }
}

/**
 * 两位小数的精度处理
 * @param unit
 * @param num
 * @returns {number}
 */
export function changeToDecimal(result) {
    const rs = String(result);
    return Number(rs.indexOf('.') > 0 ? rs.substring(0, rs.indexOf('.') + 3) : rs);
}

/**
 * 返回对应的整数数组
 * @param {number} total 总数
 * @param {number} st 开始值
 * @param {number} radio 比率
 * @returns {any[]}
 */
export function getIntByTotal(total: number = 10, st: number = 0, radio: number = 1) {
    const h = [];
    for (let i = st; i < total; i++) {
        h.push(i * radio);
    }
    return h;
}

/**
 * 解决textarea的空格问题
 * @param str
 * @returns {any}
 */
export function getComputedSize(str) {
    return str.replace(/\r/g, ' ').replace(/\n/g, ' ').length;
}

/**
 * 租用canvas转base64
 * @param args
 * @returns {any}
 */
function getBase64Image(...args) {
    const canvas = document.createElement('canvas');
    canvas.width = args[1] ? args[1] : args[0].width;
    canvas.height = args[2] ? args[2] : args[0].height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(args[0], 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    return dataURL.replace('data:image/png;base64,', '');

}

/**
 * 图片转成base64
 * @param url
 * @param resolve
 * @param reject
 */
export function imageBase64(url, resolve, reject) {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;
    // console.log(url);
    if (url) {
        image.onload = function () {
            resolve(getBase64Image(image));
        };
        image.onerror = function () {
            reject('图片异常');
        };
    }
}

/**
 * 获取图片地址名称
 * @param url
 * @returns {any}
 */
export function getUrlName(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * 展示图片缩略图
 * @param src
 * @returns {{"background-image": string; "background-size": string}}
 */
export function styleBg(src) {
    return {
        'background-image': 'url(' + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/160/h/160') + ')',
        'background-size': '100% 100%'
    };
}

export function setStyleBg(src, w = 160, h = 160) {
    return {
        'background-image': 'url(' + (src.indexOf('?') > 0 ? src : src + '?imageView2/2/w/' + w + '/h/' + h + '') + ')',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center center'
    };
}

/**
 * 根据类型展示其对应的名称
 * @param {number} type
 * @returns {string}
 */
export function getTipByType(type: number) {
    switch (type) {
        case 2:
            return '主材';
        case 3:
            return '个性化项目';
        case 4:
            return '其它项目';
        default:
            return '其它';
    }
}

/**
 * 根据对应的id进行编译
 * @param {number} id 模板id
 * @param {num} num 模板编译的位数
 */
export function compiledTplId(id: number, ...args) {
    const num = args && args[0] ? args[0] : 6;
    return ('0'.repeat(num) + id).substr(-num);
}

/**
 * 根据url来判断当前显示tab
 * @param url 当前url
 * @param tabs tabs集合
 */
export function getIndexByUrl(url, tabs) {
    if (url && tabs && tabs.length > 0) {
        for (let i = 0; i < tabs.length; i++) {
            if (url.indexOf(tabs[i].url) > -1) { return i; }
        }
    }
    return 0;
}

/**
 * 根据预算状态显示
 * @param {number} state
 * @returns {boolean}
 */
export function getBudgetByState(state: number) {
    switch (state) {
        case 0:
            return '未提交';
        case 1:
            return '待确认';
        case 2:
            return '已确认';
        default:
            return '其它';
    }

}

/**
 * 根据预算状态来显示
 * @param bs
 * @returns {boolean}
 */
export function showConfirmByState(bs) {
    if (bs && bs.confirmState) {
        switch (bs && bs.confirmState) {
            case 1: return true;
            default: return false;
        }
    }
    return bs && bs.confirmState == 0 ? true : false;
}

/**
 * 成本审核是否锁定
 * @param bs 0:未锁定，1：已锁定
 */
export function showLockByState(bs) {
    return bs && bs.lockingBudget ? false : true;
}


/**
 * url导航栏密码
 * @param {string} param
 * @returns {any}
 */
export function btoa(param: any) {
    const params = typeof param === 'string' ? param : String(param);
    return window.btoa(params);
}

/**
 * url 导航栏数据解密
 * @param {string} btoa
 * @returns {any}
 */
export function atob(btoa: string) {
    if (btoa) {
        return window.atob((btoa));
    }
    return;
}

export function getStageName(stage: number) {
    return STAGES.filter(s => s.id === stage)[0].name;

}
/**
 * 根据增减项状态展示对应名称
 * @param state
 * 0-未保存，10-设计师已申请，11-工长已申请，40-客户审核通过，41-客户审核失败;50-节点审核通过，51-节点审核失败,-1-撤回
 * @returns string
 */
export function showExamineState(state) {
    switch (state) {

        case 0:
            return '审核中';
        case 1:
            return '申请';
        case 2:
            return '审核通过';
        case 3:
            return '审核失败';
        case -1:
            return '撤回';
        default:
            return '空';
    }
}
/**
 * 根据增减项状态展示撤回
 * @param state
 * 0-未保存，10-设计师已申请，11-工长已申请，40-客户审核通过，41-客户审核失败;50-节点审核通过，51-节点审核失败,-1-撤回
 * @returns {boolean}
 */
export function showRecallByState(state) {
    switch (state) {
        case 0:
            return true;
        case 10:
            return true;
        case 11:
            return true;
        case 50:
            return true;
        default:
            return false;
    }
}

/**
 * 根据活动状态显示活动文案
 * @param {number} status
 * @returns {string}
 */
export function getPromotionStateName(status:number){
    switch(status){
        case 1: return "进行中";
        case 2: return "已结束";
        default: return "未开始";
    }
}

/**
 * 根据时间来显示活动状态
 * @param d
 * @returns {number}
 */
export function getPromotionState(d:any){
    let state = 0,time = new Date().getTime();
    if(d && d["startTime"] && d["endTime"]){
        if(d["startTime"] < time && d["endTime"] > time) state = 1;
        else if(d["startTime"] < time && d["endTime"] < time) state = 2;
        else state = 0;
    }else{
       if(d && d["startTime"] && d["startTime"] > time) state = 0;
       else state = 1;
    }
    return state;
}

export function getMaterialType(type: number) {
    switch (type) {
        case 1:
            return "主材详情";
        case 2:
            return "辅材详情";
        case 3:
            return "软装详情";
        default:
            return "其它";
    }
}

/**
 * 根据当前数据来获得该条数据的合并行
 * @param {Array<any>} ms
 * @param {number} index
 */
export function getRows(ms:Array<any>,index:number){
    let current = ms[index];
    let next = ms[index + 1];
    if (next) {
        if (current.spu === next.spu) {
            if (current["rows"]) {
                current["rows"] = current["rows"] + 1;
            } else {
                current["rows"] = 2;
            }
            next["rows"] = current["rows"];
            current["rows"] = 0;
        } else {
            if (!current["rows"]) {
                current["rows"] = 1;
            }
            if (!next["rows"]) {
                next["rows"] = 1;
            }
        }
    }else{
        if(!current["rows"]){
            current["rows"] = 1;
        }
    }

    return ms;
}

/**
 * 根据套系数据，获取套系总名称
 * @param combos
 * @returns {any}
 */
export  function getComboNames(combos:any,sign:string = ","){
    let names = [];
    if(combos && combos.length > 0){
        combos.forEach(combo =>{
            names.push(combo.comboName);
        })
    }

    if(names && names.length > 0){
        return names.join(sign);
    }
    return null;
}

/**
 * 根据公司id查询出相应的公司名称
 * @param cid 公司id
 * @param companys 所有公司信息
 * @returns {any}
 */
export function getCompanyNameById(cid,companys){
    let name = null;
    if(companys && companys.length > 0){
        let find = companys.filter(c => c.id === cid);
        if(find && find.length > 0){
            name = find[0].companyName;
        }
    }
    return name;
}

/**
 * 自定义查询类型
 * @param {Array<string>} names
 * @returns {any[]}
 */
export function getCustomTypeByNames(names:Array<string>){
      let o = [],object = CUSTOM_SEARCH_NAMES;
      if(names && names.length > 0){
          names.forEach(name =>{
              if(object[name]){
                  o.push(object[name]);
              }
          })
      }
      return o;
}

/**
 * 根据项目材料状态展示名称
 * @param state
 * 1-待审核 , 2-未通过 , 3-待填写运费(审核通过) , 4-待确认运费 , 5-代发货 , 6-已发货 , 7-已送达 , 8-已签收 , 9-结算审核 , 10-已结算(结算通过) , 11-结算未通过 , 12-工长撤回 , 13-材料商撤回
 * @returns {string}
 */
export function getMaterialState(state:number){
    switch (state) {
        case 1:
            return '待审核';
        case 2:
            return '未通过';
        case 3:
            return '待填写运费';
        case 4:
            return '待确认运费';
        case 5:
            return '待发货';
        case 6:
            return '已发货';
        case 7:
            return '已送达';
        case 8:
            return '已签收';
        case 9:
            return '结算审核';
        case 10:
            return '已结算';
        case 11:
            return '结算未通过';
        case 12:
            return '工长撤回';
        case 13:
            return '材料商撤回';
        default:
            return '空';
    }
}

/**
 * 根据需求截取字符串长度
 * @param {string} name 需要截取的字符串
 * @param {number} num 截取长度
 * @param {string} sign 截取后的替代符号
 * @returns {string}
 */
export function subItemName(name:string,num:number,sign:string="…"){
    if(name && name.length > 0){
        if(name.length <= num) return name;
        else return name.substring(0,num)+''+sign;
    }
    return name;
}


/**
 * 根据显示删除是否显示当前文案
 * @param title
 * @param {number} survival 0:已删除，1：未删除
 */
export function showTitleBySurvival(title,survival:number = 1){
    if(survival === 1){
        return title? title: '';
    }
    return '已失效';
}

/**
 * 根据选中的数据导出相应的id的集合
 * @param items 选中的数据
 * @param args 需要导出的对象的字段名
 * @returns {any[]}
 */
export function getIdsBySelectedByField(items,...args){
    let ids = [];

    if(items && items.length > 0){
        items.forEach(item =>{
            ids.push(item[args && args.length > 0?args[0]+'':'id']);
        })
    }
    return ids;
}