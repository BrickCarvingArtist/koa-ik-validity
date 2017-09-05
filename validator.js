const {isPlainObject, isNumber} = require("lodash");
module.exports = {
	reg: {
		tel: {
			exp: /^1[3-9]\d{9}$/,
			code: 5009800002
		},
		password: {
			exp: /^.{6,16}$/,
			code: 5009800003
		},
		email: {
			exp: /^[a-zA-Z\d][\w\d]+[a-zA-Z\d]@[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*\.[a-zA-Z]+$/,
			code: 5009800004
		},
		captcha: {
			exp: /^\d{6}$/,
			code: 5009800005
		},
		url: {
			exp: /^https?:\/{2}(?:[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*\.)*[a-zA-Z]+(?:\:\d{0,5})?(?:\/.*)?$/,
			code: 5009800006
		},
		number: {
			exp: /^\d+$/,
			code: 5009800007
		},
		time: {
			exp: /^\d{13}$/,
			code: 5009800008
		},
		user: {
			exp: /^\S{1,12}$/,
			code: 5009800009
		}
	},
	_test(key, value, isPlain){
		const expSetting = this.reg[key];
		if(!expSetting){
			throw 5009800097;
		}
		let result = expSetting.exp.test(value);
		if(result || isPlain){
			return result;
		}
		value || (result = [5009800000, 5009800001][+(value === "")]);
		return result || expSetting.code;
	},
	test(parameterPairs){
		let result = {};
		if(!isPlainObject(parameterPairs)){
			throw 5009800099;
		}
		for(let i in parameterPairs){
			let value = parameterPairs[i]
			result[i] = this._test(i, value, "plain");
		}
		return result;
	},
	testForErrorCode(parameterPairs){
		if(!isPlainObject(parameterPairs)){
			throw 5009800099;
		}
		for(let i in parameterPairs){
			let result = this._test(i, parameterPairs[i]);
			if(isNumber(result)){
				return result;
			}
		}
	}
};