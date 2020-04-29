const VALID_REG = {
	phone: /^[1][3-9]\d+/,
	code: /\d/
}
const VALID_MSG = {
	phone: "手机号码输入格式不正确",
	code:"验证码输入格式不正确"
}

export default {
	validPhone: (phone) =>{
		if (!VALID_REG.phone.test(phone)) {
			return VALID_MSG.phone;
		}
	},
	ValidCode: (code) =>{
		if(!VALID_REG.code.test(code)){
			return VALID_MSG.code;
		}
	}
}
