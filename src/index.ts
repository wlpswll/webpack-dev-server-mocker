import { WatchEventType } from "fs";

const fs = require('fs');
const path = require('path');

interface MockConfig {
  mockPath?: string;
  patterns?: RegExp[];
  logger?: boolean;
}

interface DevServerMockerConfig extends MockConfig {
  enable: boolean;
}

interface MockResponse {
  path: string;
  method: string;
  sleep: number;
  callback: any;
}

// 该函数是一个延时函数
const delayFn = (sleep: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('sleep end');
    }, sleep);
  });
};
function mockServer(mockConfig: MockConfig) {
  const { mockPath, patterns = [], logger = false } = mockConfig;
  // 这里收mock数据的根目录，我们只认这目录下文件
  const mockDataPath = path.resolve(process.cwd(), mockPath || 'mock');
  //   判断根目录是否存在mock目录
  const existsMockDir = fs.existsSync(mockDataPath);
  logger && console.log('mockDataPath:', mockPath, mockDataPath);
  // 获取mock目录下的所有文件的mock数据
  const getMockData = () => {
    if (!existsMockDir) {
      console.warn('根目录不存在mock文件夹，请创建一个根目录创建一个mock文件夹，并在mock文件夹下创建mock数据文件');
      return {};
    }
    /**
     * 通过readdirSync获取mock目录下的所有文件名称
     * 再通过require取出数据
     */
    const modules = fs.readdirSync(mockDataPath);
    logger && console.log('getMockData modules:', modules);
    return modules.reduce((pre: any, module: string) => {
      return {
        ...pre,
        ...require(path.join(mockDataPath, `./${module}`)),
      };
    }, {});
  };

  // 该函数负责重新处理请求的路径
  const splitApiPath = (mockData: Record<string, { delay?: number, response: any }>): Record<string, MockResponse> => {
    const data = {} as Record<string, MockResponse>;
    for (const path in mockData) {
      const [method, apiPath] = path.split(' ');
      const newApiPath = (method.toLocaleUpperCase() + apiPath) as any;
      const { delay: sleep = 0, response } = mockData[path] || {};
      data[newApiPath] = {
        path: newApiPath,
        method,
        sleep,
        callback: response,
      };
    }
    return data;
  };

  let modules = getMockData();
  let mockData = splitApiPath(modules);
  // 监控mock目录下文件的变化
  fs.watch(mockDataPath, (eventType: WatchEventType, filename: string) => {
    console.log(`Mock file ${filename}: ${eventType}`);
    if (['change', 'add', 'unlink'].includes(eventType)) {
      if (filename) {
        logger && console.log(`文件${mockDataPath}/${filename} 变更，重新加载Mock数据`);
        try {
          delete require.cache[require.resolve(path.join(mockDataPath, `./${filename}`))];
          const newModules = require(path.join(mockDataPath, `./${filename}`));
          // 可以在这里重新加载mock数据或重新启动服务
          const newMockData = splitApiPath({ ...newModules });
          mockData = { ...mockData, ...newMockData };
        } catch (error) {
          console.error(`文件${mockDataPath}/${filename} 变更，重新加载Mock数据失败`);
          console.error(error);
        }

        logger && console.log('mockData update:', mockData);
      }
    }
  });

  // 最后返回一个函数
  return async (req: any, res: any, next: () => void) => {
    const { baseUrl, method } = req;
    // 判断baseUrl是否命中任意patterns的匹配规则
    // 如果没有任何匹配规则，则直接返回
    if (!patterns.some((pattern) => pattern.test && pattern.test(baseUrl))) {
      return next();
    }

    const path = method.toLocaleUpperCase() + baseUrl;
    const mockResponse = mockData[path] as MockResponse;
    if (!mockResponse) {
      console.warn(`没有找到${path}的mock数据`);
      return next();
    }
    const { callback, sleep } = mockResponse;
    const isFunction = typeof callback === 'function';
    // 如果mock api 有延时存在
    if (sleep && sleep > 0) {
      await delayFn(sleep);
    }
    let resp = callback;
    // 如果mock api 的值是一个函数
    if (isFunction) {
      resp = callback(req, res);
    }
    logger && console.log(`mock ${path} response:${JSON.stringify(resp)}`);
    res.json(resp);
  };
}

function devServerMocker(config: DevServerMockerConfig) {
  const { enable: isMock, ...mockConfig } = config;
  return (middlewares: any, devServer: any) => {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }

    if (!isMock) {
      return middlewares;
    }
    if (isMock && devServer?.app) {
      devServer.app.use('*', mockServer(mockConfig));
    } else {
      console.log('webpack-dev-server devServer.app is not defined');
    }
    return middlewares;
  };
}
module.exports = devServerMocker;
