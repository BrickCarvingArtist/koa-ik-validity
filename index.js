const {isString, isUndefined, isNumber} = require("lodash");
const {
	unable,
	source,
	keyValues
} = require("./table");
const Validator = require("./validator");
module.exports = errorCodeHandler => options => async (ctx, next) => {
	try{
		let result;
		if(result = Object.entries(options).map(item => ((type, parameters) => {
			let payload = ({
				query: ctx.query,
				params: ctx.params,
				body: ctx.request.body
			})[type];
			if(!payload){
				throw table.source;
			}
			return Validator.testForErrorCode(parameters.reduce((parameterPairs, key) => {
				const {
					name,
					alias = name,
					required = true,
					comment = "信息"
				} = key,
					value = payload[name];
				if(required && name || (!required && !isUndefined(value))){
					return Object.assign({
						[alias]: value,
						comment
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