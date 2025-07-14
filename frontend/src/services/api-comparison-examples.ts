// 不同HTTP客户端的API对比示例 (伪代码演示)

// ==================== 1. 我们的XHR封装 ====================
import { createHttpClient, interceptors } from "./base";

const xhrClient = createHttpClient("https://api.example.com");

// 设置拦截器
const cleanup1 = xhrClient.addRequestInterceptor(interceptors.requestLogger());
const cleanup2 = xhrClient.addRequestInterceptor(
	interceptors.authToken(() => getToken()),
);

// 发送请求
export async function xhrExample() {
	try {
		const response = await xhrClient.get("/users/1");
		console.log(response.data);
	} catch (error) {
		console.error("XHR Error:", error);
	}

	// 清理拦截器
	cleanup1();
	cleanup2();
}

// ==================== API设计对比 ====================

/**
 * 1. 创建客户端实例对比
 */
export const clientCreation = {
	// XHR封装 - 简洁明了
	xhr: `
    const client = createHttpClient('https://api.example.com', 10000);
  `,

	// Axios - 配置丰富
	axios: `
    const client = axios.create({
      baseURL: 'https://api.example.com',
      timeout: 10000,
      headers: { 'X-Custom-Header': 'foobar' }
    });
  `,

	// Fetch - 无客户端概念，每次都要配置
	fetch: `
    // 每次请求都需要完整配置
    fetch('https://api.example.com/users', { /* 配置 */ })
  `,

	// Ky - 现代语法
	ky: `
    const client = ky.create({
      prefixUrl: 'https://api.example.com',
      timeout: 10000
    });
  `,
};

/**
 * 2. 拦截器设置对比
 */
export const interceptorSetup = {
	// XHR封装 - 函数式，返回清理函数
	xhr: `
    const cleanup = client.addRequestInterceptor((config) => {
      console.log('Request:', config);
      return config;
    });
    
    // 清理：cleanup();
  `,

	// Axios - 传统方式，需要手动管理ID
	axios: `
    const interceptorId = client.interceptors.request.use(
      config => { console.log(config); return config; },
      error => Promise.reject(error)
    );
    
    // 清理：client.interceptors.request.eject(interceptorId);
  `,

	// Fetch - 不支持拦截器
	fetch: `
    // 不支持拦截器，需要手动封装
    async function fetchWithInterceptor(url, options) {
      console.log('Request:', url, options);
      return fetch(url, options);
    }
  `,

	// Ky - hooks方式
	ky: `
    const client = ky.create({
      hooks: {
        beforeRequest: [request => console.log(request)],
        afterResponse: [response => console.log(response)]
      }
    });
  `,
};

/**
 * 3. 请求发送对比
 */
export const requestSending = {
	// XHR封装 - 简洁统一
	xhr: `
    const response = await client.get('/users');
    const data = response.data; // 已解析的数据
  `,

	// Axios - 简洁统一
	axios: `
    const response = await client.get('/users');
    const data = response.data; // 已解析的数据
  `,

	// Fetch - 需要手动解析
	fetch: `
    const response = await fetch('/users');
    const data = await response.json(); // 手动解析
  `,

	// Ky - 链式调用
	ky: `
    const data = await client.get('users').json(); // 直接获取数据
  `,
};

/**
 * 4. 错误处理对比
 */
export const errorHandling = {
	// XHR封装 - 通过拦截器统一处理
	xhr: `
    client.addErrorInterceptor((error) => {
      console.error('统一错误处理:', error);
      return error;
    });
  `,

	// Axios - 丰富的错误信息
	axios: `
    try {
      await client.get('/users');
    } catch (error) {
      if (error.response) {
        // HTTP错误状态
        console.log(error.response.status, error.response.data);
      } else if (error.request) {
        // 网络错误
        console.log('网络错误');
      }
    }
  `,

	// Fetch - 需要手动检查状态
	fetch: `
    const response = await fetch('/users');
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
  `,

	// Ky - 自动处理HTTP错误
	ky: `
    try {
      await client.get('users');
    } catch (error) {
      // HTTP错误自动抛出异常
      console.log(error.response.status);
    }
  `,
};

/**
 * 5. 文件上传对比
 */
export const fileUpload = {
	// XHR封装 - 支持进度跟踪
	xhr: `
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // 可扩展进度回调
    });
  `,

	// Axios - 内置进度支持
	axios: `
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await client.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(\`上传进度: \${progress}%\`);
      }
    });
  `,

	// Fetch - 基础支持
	fetch: `
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
  `,

	// Ky - 简洁语法
	ky: `
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await client.post('upload', {
      body: formData
    });
  `,
};

/**
 * 6. 性能特点对比
 */
export const performanceCharacteristics = {
	xhr: {
		bundleSize: "~2KB",
		runtime: "最快 (无额外抽象)",
		memory: "最少",
		compatibility: "IE8+",
		features: "基础但可扩展",
	},

	axios: {
		bundleSize: "~13KB",
		runtime: "较慢 (多层抽象)",
		memory: "较多",
		compatibility: "IE8+",
		features: "功能最丰富",
	},

	fetch: {
		bundleSize: "0KB (原生)",
		runtime: "快 (原生实现)",
		memory: "少",
		compatibility: "Chrome 42+",
		features: "基础功能",
	},

	ky: {
		bundleSize: "~2KB",
		runtime: "快",
		memory: "少",
		compatibility: "Chrome 63+",
		features: "现代功能",
	},
};

/**
 * 7. 使用场景建议
 */
export const useCaseRecommendations = {
	// 高性能要求 + 完全控制
	highPerformance: "XHR封装",

	// 功能丰富 + 快速开发
	featureRich: "Axios",

	// 现代浏览器 + 轻量级
	modern: "Ky",

	// 原生优先 + 简单需求
	native: "Fetch",

	// 学习HTTP原理
	learning: "XHR封装",

	// 企业级项目
	enterprise: "Axios 或 XHR封装",

	// 组件库
	library: "XHR封装 或 Ky",
};

// 工具函数
function getToken(): string {
	return typeof window !== "undefined"
		? localStorage.getItem("token") || ""
		: "";
}

export { getToken };
