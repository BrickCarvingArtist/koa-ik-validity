const {isString, isUndefined, isNumber} = require("lodash");
const Validator = require("./validator");
module.exports = errorCodeHandler => options => async (ctx, next) => {
	try{
		let code;
		if(code = Object.entries(options).map(item => ((type, parameters) => {
			let payload = ({
				query: ctx.query,
				params: ctx.params,
				body: ctx.request.body
			})[type];
			if(!payload){
				throw 5009800098;
			}
			const code = Validator.testForErrorCode(parameters.reduce((parameterPairs, key) => {
				if(isString(key)){
					return Object.assign({
						[key]: payload[key]
					}, parameterPairs);
				}
				const {
					name,
					alias = name,
					required = true
				} = key,
					value = payload[name];
				if(required && name || (!required && !isUndefined(value))){
					return Object.assign({
						[alias]: value
					}, parameterPairs);
				}
				if(!required && !value){
					return parameterPairs;
				}
				throw 5009800099;
			}, {}));
			return code;
		})(...item)).find(item => isNumber(item))){
			throw code;
		}
	}catch(code){
		return ctx.body = errorCodeHandler(ctx, code);
	}
	await next();
};