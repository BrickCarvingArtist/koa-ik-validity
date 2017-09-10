const {isPlainObject, isUndefined, isNumber} = require("lodash");
const table = require("./table");
module.exports = {
	_test(key, value, isPlain){
		const expSetting = table[key];
		let result;
		if(!expSetting){
			result = table.unable.code;
		}else if(isUndefined(value)){
			result = table.required.code;
		}else if(value === ""){
			result = table.notEmpty.code;
		}else{
			result = expSetting.exp.test(value);
		}
		if(isPlain){
			return !isNumber(result) || result;
		}
		return result || expSetting.code;
	},
	test(parameterPairs){
		let result = {};
		if(!isPlainObject(parameterPairs)){
			throw table.keyValues;
		}
		for(let i in parameterPairs){
			let value = parameterPairs[i]
			result[i] = this._test(i, value, 1);
		}
		return result;
	},
	testForErrorCode(parameterPairs){
		if(!isPlainObject(parameterPairs)){
			throw table.keyValues;
		}
		for(let i in parameterPairs){
			const {
				value,
				comment
			} = parameterPairs[i],
				code = this._test(i, value);
			if(isNumber(code)){
				return {
					code,
					comment
				};
			}
		}
		return {};
	}
};