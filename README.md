迷你应用开发框架
----

## 生成新应用的步骤

* `$git clone https://github.com/renrousousuo/mini-app.git`
* `$cd mini-app`
* 按需求修改 `tools/values.json`。
* `$node tools/clone.js`
* 在 `apps` 目录拿走。

## values 替换规则

### json 格式

```json
{
	"name": "value"
}
```

### 文件中表达式

* `__name__` 原样替换
* `__@name__` 处理 HTML 编码
* `__#name__` 处理 JSON 编码