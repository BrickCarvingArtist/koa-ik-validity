const {isUndefined, isArray, isNumber, isPlainObject} = require("lodash");
const {
	source,
	keyValues
} = require("./table");
const Validator = require("./validator");
module.exports = errorCodeHandler => options => async (ctx, next) => {
	try{
		if(isUndefined(options)){
			throw keyValues;
		}
		let result;
		if(result = Object.entries(options).map(item => ((type, parameters) => {
			let payload = ({
				query: ctx.query,
				params: ctx.params,
				body: ctx.request.body
			})[type];
			if(!payload || !isArray(parameters)){
				throw source;
			}
			return Validator.testForErrorCode(parameters.reduce((parameterPairs, key) => {
				if(!isPlainObject(key)){
					throw source;
				}
				const {
					name,
					alias = name,
					required = true,
					comment = "信息"
				} = key,
					value = payload[name];
				if((required && name) || (!required && !isUndefined(value))){
					return Object.assign({
						[alias]: {
							value,
							comment
						}
					}, parameterPairs);
				}
				if(!required && !value){
					return parameterPairs;
				}
				throw keyValues;
			}, {}));
		})(...item)).find(({code}) => isNumber(code))){
			throw result;
		}
	}catch(result){
		return ctx.body = errorCodeHandler(ctx, result);
	}
	await next();
};