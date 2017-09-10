const assert = require("assert");
const fetch = require("node-fetch");
const body = require("koa-bodyparser");
const {stringify} = require("querystring");
const ERROR_CODE = {
	5000200000: "加载个人中心页失败",
	5000200100: "获取个人基本资料失败",
	...(require("../table")).ERROR
};
const validate = require("../")((ctx, {code, comment}) => {
	return ctx.body = {
		code,
		message: `${comment ? `${comment}有误，` : ""}${ERROR_CODE[code]}`
	};
});
const SERVER = "http://localhost:2333";
(new (require("koa")))
	.use((new (require("koa-router")))
		// for all
		.get("/1", validate())
		.get("/2", validate({}), ctx => {
			ctx.body = 1;
		})
		.get("/3", validate({a: 1}))
		.get("/4", validate({
			query: 6666
		}))
		.get("/5", validate({
			query: [undefined]
		}))
		.get("/6", validate({
			query: [
				{
					a: undefined
				}
			]
		}))
		// for queries
		.get("/7", validate({
			query: [
				{
					name: "user"
				}
			]
		}), ctx => {
			ctx.body = 1;
		})
		.get("/8", validate({
			query: [
				{
					name: "user",
					alias: "tel"
				}
			]
		}), ctx => {
			ctx.body = 1;
		})
		.get("/9", validate({
			query: [
				{
					name: "user",
					alias: "tel",
					required: false
				}
			]
		}), ctx => {
			ctx.body = 1;
		})
		// for params
		.get("/:user", validate({
			params: [
				{
					name: "user",
					alias: "tel",
					required: false,
					comment: "迷之手机号"
				}
			]
		}))
		// for bodies
		.post("/", body(), validate({
			body: [
				{
					name: "user",
					alias: "tel",
					required: false,
					comment: "迷之手机号"
				}
			]
		}))
		// combination
		.post("/:user", body(), validate({
			query: [
				{
					name: "user",
					comment: "迷之用户名"
				},
				{
					name: "pwd",
					alias: "password",
					required: false
				}
			],
			params: [
				{
					name: "user"
				}
			],
			body: [
				{
					name: "user",
					alias: "tel",
					required: false,
					comment: "迷之手机号"
				}
			]
		}), ctx => {
			ctx.body = 1;
		})
		.routes())
	.listen(2333);
describe("# `koa-ik-validity` middleware for http requests.", () => {
	describe("# For all types, examples through query.", () => {
		describe("1. Nothing sets to option.", () => {
			it("should return code 5009800099", async () => {
				return assert.equal((await (await fetch(`${SERVER}/1`)).json()).code, 5009800099);
			});
		});
		describe("2. Empty object sets to option.", () => {
			it("should passes the validate and returns 1", async () => {
				return assert.equal(await (await fetch(`${SERVER}/2`)).text(), 1);
			});
		});
		describe("3. Invalid data source sets to option.", () => {
			it("should return code 5009800098", async () => {
				return assert.equal((await (await fetch(`${SERVER}/3`)).json()).code, 5009800098);
			});
		});
		describe("4. Invalid value of data source through query sets to option.", () => {
			it("should return code 5009800098", async () => {
				return assert.equal((await (await fetch(`${SERVER}/4`)).json()).code, 5009800098);
			});
		});
		describe("5. Invalid value of data source through query array sets to option.", () => {
			it("should return code 5009800098", async () => {
				return assert.equal((await (await fetch(`${SERVER}/5`)).json()).code, 5009800098);
			});
		});
		describe("6. Query name sets to validate beyond of validator's reach.", () => {
			it("should return code 5009800099", async () => {
				return assert.equal((await (await fetch(`${SERVER}/6`)).json()).code, 5009800099);
			});
		});
		describe("7. Query 'user' is in need but nothing was passed.", () => {
			it("should return code 5009800000", async () => {
				return assert.equal((await (await fetch(`${SERVER}/7`)).json()).code, 5009800000);
			});
		});
		describe("8. Query 'user' is in need but empty string was passed.", () => {
			it("should return code 5009800001", async () => {
				return assert.equal((await (await fetch(`${SERVER}/7?user=`)).json()).code, 5009800001);
			});
		});
		describe("9. Query 'user' is in need but invalid value was passed.", () => {
			it("should return code 5009800009", async () => {
				return assert.equal((await (await fetch(`${SERVER}/7?user=timoduizhangzhengzaisongming`)).json()).code, 5009800009);
			});
		});
	});
	describe("# For queries.", () => {
		describe("1. Query 'user' is in need and valid value was passed.", () => {
			it("should passes the validate and returns 1", async () => {
				return assert.equal(await (await fetch(`${SERVER}/7?user=timoduizhang`)).text(), 1);
			});
		});
		describe("2. Query 'user' is in need with an alias 'tel' but an invalid value was passed.", () => {
			it("should return code 5009800002", async () => {
				return assert.equal((await (await fetch(`${SERVER}/8?user=timoduizhang`)).json()).code, 5009800002);
			});
		});
		describe("3. Query 'user' is in need with an alias 'tel' and valid value was passed.", () => {
			it("should passes the validate and returns 1", async () => {
				return assert.equal(await (await fetch(`${SERVER}/8?user=13123456789`)).text(), 1);
			});
		});
		describe("4. Query 'user' is optional with an alias 'tel' and a client-passed empty string value.", () => {
			it("should return code 5009800001", async () => {
				return assert.equal((await (await fetch(`${SERVER}/9?user=`)).json()).code, 5009800001);
			});
		});
		describe("5. Query 'user' is optional with an alias 'tel' and an invalid client-passed value.", () => {
			it("should return code 5009800002", async () => {
				return assert.equal((await (await fetch(`${SERVER}/9?user=beiduijifengba`)).json()).code, 5009800002);
			});
		});
		describe("6. Query 'user' is optional with an alias 'tel' and a valid client-passed value.", () => {
			it("should passes the validate and returns 1", async () => {
				return assert.equal(await (await fetch(`${SERVER}/9`)).text(), 1);
			});
		});
		describe("7. Query 'user' is optional with an alias 'tel' and a comment for error message when there's an invalid client-passed value.", () => {
			it("should return right error code and a message with comment", async () => {
				const {
					code,
					message
				} = await (await fetch(`${SERVER}/9?user=beiduijifengba`)).json();
				return assert.equal(code, 5009800002) && assert.notEqual(~message.indexOf("迷之手机号"), 0);
			});
		});
	});
	describe("# For params", () => {
		describe("1. Param 'user' is optional with an alias 'tel' and a comment for error message when there's an invalid client-passed value", () => {
			it("should return right error code and a message with comment", async () => {
				const {
					code,
					message
				} = await (await fetch(`${SERVER}/beiduijifengba`)).json();
				return assert.equal(code, 5009800002) && assert.notEqual(~message.indexOf("迷之手机号"), 0);
			});
		});
	});
	describe("# For body", () => {
		describe("1. body 'user' is optional with an alias 'tel' and a comment for error message when there's an invalid client-passed value", () => {
			it("should return right error code and a message with comment", async () => {
				const {
					code,
					message
				} = await (await fetch(SERVER, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: stringify({
						user: "提莫队长正在送命"
					})
				})).json();
				return assert.equal(code, 5009800002) && assert.notEqual(~message.indexOf("迷之手机号"), 0);
			});
		});
	});
	describe("# For combination", () => {
		describe("1. So many conditions combine together but something is invalid", () => {
			it("should return right error code and a message with comment", async () => {
				const {
					code,
					message
				} = await (await fetch(`${SERVER}/亚索?user=约德尔人的一大步-提莫`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: stringify({
						user: 13123456789
					})
				})).json()
				return assert.equal(code, 5009800009) && assert.notEqual(~message.indexOf("迷之用户名"), 0);
			});
		});
		describe("2. So many conditions combine together and everything is valid", () => {
			it("should passes the validate and returns 1", async () => {
				return assert.equal(await (await fetch(`${SERVER}/${encodeURI("亚索")}?user=${encodeURI("提莫")}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: stringify({
						user: 13123456789
					})
				})).text(), 1);
			});
		});
	});
});