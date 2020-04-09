import { Directive } from '@angular/core';
import { NG_VALIDATORS,FormControl,AbstractControl} from '@angular/forms';
import {Reg} from "../model/reg";

/***用户验证***/
export function ValidateAccount(fc:FormControl){
  let acc = Reg.ALPHA_NUM_UNDERLINE_ZH;
  if(!fc.value) return true;
  else return acc.test(fc.value)?null:{
    account:{valid:false}
  };
}


/***密码验证***/
export function ValidatePassword(fc:FormControl){
  let pwd = Reg.ALPHA_AND_NUM_UNDERLINE;
  if(!fc.value) return true;
  return pwd.test(fc.value)?null:{
    pwd:{valid:false}
  };
}


/***验证密码组***/
export function ValidatePasswordGroup(fc:FormControl){
  const initPwd = fc.get("pwd").value as FormControl;
  const chgPwd = fc.get("repwd").value as FormControl;
  const isEqual = (initPwd === chgPwd);
  return isEqual?null:{
    pass:{valid:false}
  }
}


/***验证码***/
export function ValidateCode(fc:FormControl){
  let code = Reg.ALPHA_NUM;
  if(!fc.value) return true;
  return code.test(fc.value)?null:{
    code:{valid:false}
  };
}


/***联系电话（固定座机）***/
export function ValidateMobile(fc:FormControl){
  let mobile = Reg.MOBILE;
  if(!fc.value) return true;
  return mobile.test(fc.value)?null:{
    mobile:{valid:false}
  };
}

/***手机号码（无线通信）***/
export function ValidatePhone(fc:FormControl){
  let phone = Reg.PHONE;
  if(!fc.value) return true;
  else return phone.test(fc.value)?null:{
    phone:{valid:false}
  };
}

/***坐机和手机共用***/
export function ValidateCommunicate(fc:FormControl){
  let com = Reg.MOBILE_PHONE;
  if(!fc.value) return true;
  return com.test(fc.value)?null:{
    communicate:{valid:false}
  }
}

/***
 * @用户验证，不添加下划线
 * ***/
export function ValidateName(fc:FormControl){
  let acc = Reg.ALPHA_NUM_ZH;
  if(!fc.value) return true;
  return acc.test(fc.value)?null:{
    name:{valid:false}
  };
}


export function ValidateDecimal(fc:FormControl){
  let dec = Reg.NUM_DECIMAL_ONE;
  if(!fc.value) return true;
  return dec.test(fc.value)?null:{
    decimal:{valid:false}
  }
}

/***
 * @报价，只能输入数字或者小数点后两位
 * ***/
export function ValidatePrice(fc:FormControl){
    let reg = Reg.NUM_MONEY_DECIMAL;
    if(!fc.value) return true;
    return Reg.NUM_MONEY_DECIMAL.test(fc.value)?null:{
        price:{valid:false}
    };
}

/***
 * @整数，只能输入正整数+0
 * ***/
export function ValidateInt(fc:FormControl){
    let reg = /^\d+(\.\d{1,2})?$/;
    if(!fc.value) return true;
    return reg.test(fc.value)?null:{
        validateInt:{valid:false}
    };
}

/***
 * @成本，只能输入数字或者小数点后两位
 * ***/
export function ValidateCost(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_MONEY_DECIMAL.test(fc.value)?null:{
        cost:{valid:false}
    };
}

/***
 * @验证文字格式，只能输入中文和英文
 * ***/
export function ValidateText(fc:FormControl){
    if(!fc.value) return true;
    return Reg.ALPHA_ZH.test(fc.value)?null:{
        text:{valid:false}
    };
}

/**
 * 输入数据必须大于1
 * @param {} fc
 * @returns {{number: {valid: boolean}}}
 * @constructor
 */
export function ValidateNum(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_NOT_MIN.test(fc.value)?null:{
        number:{valid:false}
    }
}

/**
 * 验证输入两位非0小数
 * @param {} fc
 * @returns {any}
 * @constructor
 */
export function ValidateNumDecimal(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_DECIMAL.test(fc.value)?null:{
        decimal:{valid:false}
    }
}

export function ValidateNumInt(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_DECIMAL_INT.test(fc.value)?null:{
        decimal:{valid:false}
    }
}

/**
 * 输入非负整数
 * @param {} fc
 * @returns {{numberMin: {valid: boolean}}}
 * @constructor
 */
export function ValidateMinNum(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_MIN.test(fc.value)?null:{
        numberMin:{valid:false}
    }
}

/**
 * 非0正整数
 * @param {} fc
 * @returns {{numberMin: {valid: boolean}}}
 * @constructor
 */
export function ValidateNonInt(fc:FormControl){
    let reg = /^[1-9]\d*$/;
    if(!fc.value) return true;
    return reg.test(fc.value)?null:{
        nonInt:{valid:false}
    };
}


/**
 * 身份证验证
 */
export function ValidateIdCard(fc:FormControl){
    if(!fc.value) return true;
    return Reg.ID_CARD.test(fc.value)?null:{
        idCard:{valid:false}
    }
}

/**
 * 验证小数规则（只能是0-1的小数）小数精确到后两位
 * @param {} fc
 * @returns {any}
 * @constructor
 */
export function ValidateNumDecimalPoint(fc:FormControl){
    if(!fc.value) return true;
    return Reg.NUM_DECIMAL_POINT.test(fc.value)?null:{
        numberPoint:{valid:false}
    }
}

/**
 * 验证规则是数字、字母、下划线
 * @param {} fc
 * @returns {any}
 * @constructor
 */
export function ValidateNumAlphaUnderline(fc:FormControl){
    if(!fc.value)  return true;
    return Reg.ALPHA_NUM_UNDERLINE.test(fc.value)?null:{
        number:{valid:false}
    }
}

/**
 * 验证输入数据是否为空白字符
 * @param {} fc
 * @returns {any}
 * @constructor
 */
export function ValidateInputTrim(fc:FormControl){
    return !Reg.TRIM.test(fc.value)?null:{
        trim:{valid:false}
    }
}

/**
 * 过滤安信签中对于特殊字符的处理
 * @param {} fc
 * @returns {{special: {valid: boolean}}}
 * @constructor
 */
export function ValidateAnxinSign(fc:FormControl){
    return !Reg.AN_XIN_SIGN.test(fc.value)?null:{
        special:{valid:false}
    }
}