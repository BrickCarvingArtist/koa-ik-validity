const {fromPairs} = require("lodash");
const table = {
	required: {
		code: 5009800000,
		message: "缺少查询字段",
		exp: /^undefined$/
	},
	notEmpty: {
		code: 5009800001,
		message: "查询字段的值不能为空",
		exp: /^.+$/m
	},
	tel: {
		code: 5009800002,
		message: "手机号格式应该是11位数字",
		exp: /^1[3-9]\d{9}$/
	},
	password: {
		code: 5009800003,
		message: "密码长度应该在6至16位内",
		exp: /^.{6,16}$/
	},
	email: {
		code: 5009800004,
		message: "正确邮箱格式为：用户名@域名.后缀，如10000@qq.com",
		exp: /^[a-zA-Z\d][\w\d]+[a-zA-Z\d]@[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*\.[a-zA-Z]+$/
	},
	captcha: {
		code: 5009800005,
		message: "验证码应该是6位数字",
		exp: /^\d{6}$/
	},
	url: {
		code: 5009800006,
		message: "网址url格式有误",
		exp: /^https?:\/{2}(?:[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*\.)*[a-zA-Z]+(?:\:\d{0,5})?(?:\/.*)?$/
	},
	number: {
		code: 5009800007,
		message: "数字类型参数格式有误",
		exp: /^\d+$/
	},
	time: {
		code: 5009800008,
		message: "时间类型参数格式有误",
		exp: /^\d{13}$/
	},
	user: {
		code: 5009800009,
		message: "用户名最多12个字且不能包含空格",
		exp: /^\S{1,12}$/
	},
	title: {
		code: 5009800010,
		message: "标题最多40个字且不能包含空格",
		exp: /^\S{1,40}$/
	},
	unable: {
		code: 5009800097,
		message: "没有对用户自定义格式的参数的校验能力"
	},
	source: {
		code: 5009800098,
		message: "数据来源类别(query,params,body)或其值设置有误"
	},
	keyValues: {
		code: 5009800099,
		message: "参数键值对设置有误"
	}
};
table.ERROR = fromPairs(Object.values(table).map(item => Object.values(item)));
module.exports = table;