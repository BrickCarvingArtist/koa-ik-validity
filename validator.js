const {isPlainObject, isNumber} = require("lodash");
const table = require("./table");
module.exports = {
	table,
	_test(key, value, isPlain){
		const {table} = this;
		const expSetting = table[key];
		if(!expSetting){
			throw table.unable;
		}
		let result = expSetting.exp.test(value);
		if(result || isPlain){
			return result;
		}
		value || (result = [table.required.code, table.notEmpty.code][+(value === "")]);
		return result || expSetting.code;
	},
	test(parameterPairs){
		let result = {};
		if(!isPlainObject(parameterPairs)){
			throw table.keyValues;
		}
		for(let i in parameterPairs){
			let value = parameterPairs[i]
			result[i] = this._test(i, value, "plain");
		}
		return result;
	},
	testForErrorCode(parameterPairs){
		if(!isPlainObject(parameterPairs)){
			throw table.keyValues;
		}
		for(let i in parameterPairs){
			const code = this._test(i, parameterPairs[i]);
			if(isNumber(code)){
				return {
					code,
					comment: parameterPairs.comment
				};
			}
		}
		return {};
	}
};