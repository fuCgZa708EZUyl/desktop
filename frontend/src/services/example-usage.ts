// 精简版HTTP客户端使用示例
import { createHttpClient, interceptors } from "./base";

// 创建客户端实例
const api = createHttpClient("https://jsonplaceholder.typicode.com");

// 快速设置常用拦截器
function setupApi() {
	// 添加基础拦截器
	const cleanup = [
		api.addRequestInterceptor(interceptors.requestLogger()),
		api.addResponseInterceptor(interceptors.responseLogger()),
		api.addErrorInterceptor(interceptors.errorLogger()),
		api.addRequestInterceptor(
			interceptors.authToken(() => localStorage.getItem("token")),
		),
	];

	// 返回清理函数
	return () => {
		for (const fn of cleanup) {
			fn();
		}
	};
}

// 使用示例
export async function apiExample() {
	// 设置拦截器
	const cleanup = setupApi();

	try {
		// 发送请求
		const userResponse = await api.get("/users/1");
		console.log("用户数据:", userResponse.data);

		const postResponse = await api.post("/posts", {
			title: "测试标题",
			body: "测试内容",
			userId: 1,
		});
		console.log("创建帖子:", postResponse.data);

		// 设置Token
		api.setAuthToken("your-token-here");

		const protectedResponse = await api.get("/protected-endpoint");
		console.log("受保护的数据:", protectedResponse.data);
	} catch (error) {
		console.error("API错误:", error);
	} finally {
		// 清理拦截器
		cleanup();
	}
}

export { api };
