### 安装

`npm install koa-ik-validity --save`

### 使用方式

最基本的使用方式

> configs/error.js

```js
import table from "koa-ik-validity/table";
export default {
	5000200000: "加载个人中心页失败",
	5000200100: "获取个人基本资料失败",
	// ...
	// 你的错误码配置
	// ...
	...table
};
```

> middlewares/validate.js

```js
import Validity from "koa-ik-validity";
import ERROR_CODE from "../configs/error"
export default Validity((ctx, {code, comment}) => {
	//这里必须return掉，验证都不通过了自然不再继续后续的流程，否则你何苦校验半天
	return ctx.body = {
		code,
		message: `${comment ? `${comment}有误，` : ""}${ERROR_CODE(code)}`
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
		{
			name: "user", // （必须）接口参数名
			alias: "tel", // （非必需）被校验的方式，默认和参数名一致
			comment: "用户名", // （非必需）用作提示用户（及*写入日志）的参数名，会返回到中间件创建函数参数里。（*写入日志功能不属于这个中间件该做的事情，自己根据提供的返回参数操作）
			required: false // （非必需）是否为必须的参数，默认true
							// 如果你说了false，不必校验，但又偏偏传了这个键值对给服务端，还是会厚脸皮帮你进行校验，否则前端就不要乱传
		}
	],
	params: [], // 配置同上，不过假设你的接口都没有parmas，参数无效
	body: []// 配置同上，不过假设你的表单都没有被body中间件处理，参数无效
}), yourActionAfterValidatePassed);
```

### 其他

要还是看不懂不会用，或者提bug，可以在issue里写，也可以QQ806321554
