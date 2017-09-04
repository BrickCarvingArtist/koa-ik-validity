### 安装

`npm install koa-ik-validity --save`

### 使用方式

最基本的使用方式

> configs/error.js

```js
export default {
	5009800000: "缺少查询字段",
	5009800001: "查询字段的值不能为空",
	5009800002: "手机号格式应该是11位数字",
	5009800003: "密码长度应该在6至16位内",
	5009800004: "正确邮箱格式为：用户名@域名.后缀，如10000@qq.com",
	5009800005: "验证码应该是6位数字",
	5009800006: "网址url格式有误",
	5009800007: "数字类型参数格式有误",
	5009800008: "时间类型参数格式有误",
	5009800097: "没有对用户自定义格式的参数的校验能力",
	5009800098: "数据来源类别(query,params,body)设置有误",
	5009800099: "参数键值对设置有误"
};
```

> middlewares/validate.js

```js
import Validity from "koa-ik-validity";
import ERROR_CODE from "../configs/error"
export default Validity((ctx, code) => {
	//这里必须return掉，验证都不通过了自然不再继续后续的流程，否则你何苦校验半天
	return ctx.body = {
		code,
		message: ERROR_CODE(code)
	};
});
```

> app.js

```js
import Koa from "koa";
import body from "koa-bodyparser"; // 如果你不需要做表单处理，完全可以不要
import validate from "../middlewares/validate";
new Koa().use(body()/* 如果你不需要做表单处理，完全可以不要 */, validate({
	query: [
		// 配置方式1
		{
			name: "user", // （必须）接口参数名
			alias: "tel", // （非必需）被校验的方式，默认和参数名一致
			required: false // （非必需）是否为必须的参数，默认true
							// 如果你说了false，不必校验，但又偏偏传了这个键值对给服务端，还是会厚脸皮帮你进行校验，否则前端就不要乱传
		},
		// 配置方式2
		"tel", // 基本用法，相当于{name: "tel", alias: "tel", required: true}
	],
	params: [], // 配置同上，不过假设你的接口都没有parmas，参数无效
	body: []// 配置同上，不过假设你的表单都没有被body中间件处理，参数无效
}), yourActionAfterValidatePassed);
```

### 其他

要还是看不懂不会用，或者提bug，可以在issue里写，也可以QQ806321554
