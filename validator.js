const {isPlainObject, isUndefined, isNumber} = require("lodash");
const table = require("./table");
module.exports = {
	/**
	 * 数据值是否通过校验规则
	 * @param {String} key 校验规则名
	 * @param {String} value 数据值
	 * @returns {Boolean} 检验是否通过
	 */
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
	/**
	 * 校验各键所对应的值对是否通过校验规则
	 * @public
	 * @param {Object} parameterPairs 需要校验的键值对，键：校验规则名，值：数据值
	 * @returns {Object} 各校验的结果
	 */
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
	/**
	 * 校验各键所对应的值对是否通过校验规则
	 * @public
	 * @param {Object} parameterPairs 需要校验的键值对，键：校验规则名，值：数据值
	 * @returns {Object} 各校验的结果。如果某条校验不通过，则返回错误码对象；如果通过，则返回空对象
	 */
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