# webpack-dev-server-mocker
webpack-dev-server-mocker
# 仅仅是简单写一个自己用的webpack项目的 mock 模式,目前仅支持开发模式，后续需要再支持生产环境使用 mock 模式

依赖说明：
基于 webpack-dev-server 的 devServer.setupMiddleware的实现

使用说明：
1、npm install webpack-dev-server-mocker -D
2、webpage.config.js 配置
```javascript
const devServerMocker = require("webpack-dev-server-mocker");

module.exports = {
  devServer :{
    setupMiddlewares: devServerMocker()
  }
}
```
配置说明：
```javascript
module.exports = {
  devServer :{
    setupMiddlewares: devServerMocker({
      enable: boolean, // mock开关，默认开启
      mockPath: path.resolve(__dirname, 'mock'), // mock 文件目录，默认扫描根路径下 mock
      patterns: [/\/webapi./,'/\/api\//'], // api path命中匹配规则，默认全拦截（无 mock命中时放通）
      logger: true, // 是否打印响应日志
    })
  }
}
```

3、mock api 编写，在mockPath下添加js 文件
例如：mock/index.js
参数说明：
[key]:请求方法 + 空格 + api path
value:{
  delay:延时返回毫秒数，
  response: 响应 data（value 或者 函数）
}

```javascript
module.exports = {
  'GET /api/list': {
    delay: 200,
    response: {
      code: 0,
      data: {
        list: [
          {
            name: "syf",
            age: 99
          }
        ]
      }
    }
  },
  'POST /api/list': {
    delay: 2000,
    response: (req, res) => {
      // console.log(req, res);
      const query = req.query;
      if(!query){
        return {
          ret: 0,
          data:{}
        }
      }
      return {
        ret: 0,
        data: {
          list: [
            {
              name: 'guile',
              age: 777,
            },
          ],
        },
      };
    }
  },
};

```