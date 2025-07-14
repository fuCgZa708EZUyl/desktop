// 拦截器使用示例
import { createHttpClient, interceptors } from "./base";

// 创建HTTP客户端
const apiClient = createHttpClient("https://api.example.com");

// 拦截器使用示例
export const InterceptorExamples = {
	/**
	 * 基础拦截器配置
	 */
	setupBasicInterceptors() {
		// 添加常用拦截器
		const removeRequestLog = apiClient.addRequestInterceptor(
			interceptors.requestLogger(),
		);
		const removeResponseLog = apiClient.addResponseInterceptor(
			interceptors.responseLogger(),
		);
		const removeErrorLog = apiClient.addErrorInterceptor(
			interceptors.errorLogger(),
		);

		// 添加认证Token
		const removeAuth = apiClient.addRequestInterceptor(
			interceptors.authToken(() => localStorage.getItem("token")),
		);

		console.log("✅ 基础拦截器已配置");

		// 返回清理函数
		return () => {
			removeRequestLog();
			removeResponseLog();
			removeErrorLog();
			removeAuth();
		};
	},

	/**
	 * 自定义拦截器示例
	 */
	setupCustomInterceptors() {
		// 添加设备信息
		const removeDeviceInfo = apiClient.addRequestInterceptor((config) => {
			config.headers = {
				...config.headers,
				"X-Device-Type": navigator.userAgent.includes("Mobile")
					? "mobile"
					: "desktop",
				"X-Language": navigator.language,
			};
			return config;
		});

		// 统一错误处理
		const removeErrorHandler = apiClient.addErrorInterceptor((error) => {
			switch (error.status) {
				case 401:
					console.warn("🚫 未授权，请重新登录");
					break;
				case 403:
					console.warn("🚫 权限不足");
					break;
				case 500:
					console.error("💥 服务器错误");
					break;
				default:
					console.error("❌ 请求失败:", error.message);
			}
			return error;
		});

		// 数据转换 - 提取 API 响应中的 data 字段
		const removeDataTransform = apiClient.addResponseInterceptor(
			interceptors.dataTransform<{ data: unknown }, unknown>((response) => {
				if (response && typeof response === "object" && "data" in response) {
					return response.data;
				}
				return response;
			}),
		);

		console.log("✅ 自定义拦截器已配置");

		return () => {
			removeDeviceInfo();
			removeErrorHandler();
			removeDataTransform();
		};
	},

	/**
	 * 清空所有拦截器
	 */
	clearAllInterceptors() {
		apiClient.clearInterceptors();
		console.log("🧹 所有拦截器已清空");
	},
};

// 使用示例
export async function demonstrateInterceptors() {
	console.log("🚀 开始拦截器演示...");

	// 配置拦截器
	const cleanupBasic = InterceptorExamples.setupBasicInterceptors();
	const cleanupCustom = InterceptorExamples.setupCustomInterceptors();

	try {
		// 发送测试请求
		console.log("\n📡 发送测试请求...");
		const response = await apiClient.get("/users/1");
		console.log("✅ 请求成功:", response.data);
	} catch (error) {
		console.error("❌ 请求失败:", error);
	}

	// 清理拦截器
	setTimeout(() => {
		cleanupBasic();
		cleanupCustom();
		console.log("🧹 拦截器已清理");
	}, 5000);
}

export { apiClient };
