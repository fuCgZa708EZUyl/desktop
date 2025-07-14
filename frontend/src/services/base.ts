// 基础类型定义
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
	url: string;
	method?: HttpMethod;
	data?: unknown;
	headers?: Record<string, string>;
	timeout?: number;
}

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	statusText: string;
	headers: Record<string, string>;
}

export interface ApiError {
	message: string;
	status?: number;
	response?: unknown;
}

// 拦截器类型
export type RequestInterceptor = (
	config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (
	response: ApiResponse,
) => ApiResponse | Promise<ApiResponse>;
export type ErrorInterceptor = (
	error: ApiError,
) => ApiError | Promise<ApiError>;

/**
 * 简化的HTTP客户端
 */
export class HttpClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;
	private defaultTimeout: number;
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];
	private errorInterceptors: ErrorInterceptor[] = [];

	constructor(baseURL = "", defaultTimeout = 10000) {
		this.baseURL = baseURL;
		this.defaultTimeout = defaultTimeout;
		this.defaultHeaders = {
			"Content-Type": "application/json",
		};
	}

	// 拦截器管理
	addRequestInterceptor(interceptor: RequestInterceptor): () => void {
		this.requestInterceptors.push(interceptor);
		return () => {
			const index = this.requestInterceptors.indexOf(interceptor);
			if (index > -1) this.requestInterceptors.splice(index, 1);
		};
	}

	addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
		this.responseInterceptors.push(interceptor);
		return () => {
			const index = this.responseInterceptors.indexOf(interceptor);
			if (index > -1) this.responseInterceptors.splice(index, 1);
		};
	}

	addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
		this.errorInterceptors.push(interceptor);
		return () => {
			const index = this.errorInterceptors.indexOf(interceptor);
			if (index > -1) this.errorInterceptors.splice(index, 1);
		};
	}

	clearInterceptors(): void {
		this.requestInterceptors = [];
		this.responseInterceptors = [];
		this.errorInterceptors = [];
	}

	setAuthToken(token: string): void {
		this.defaultHeaders.Authorization = `Bearer ${token}`;
	}

	removeAuthToken(): void {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { Authorization, ...rest } = this.defaultHeaders;
		this.defaultHeaders = rest;
	}

	// 应用拦截器
	private async applyRequestInterceptors(
		config: RequestConfig,
	): Promise<RequestConfig> {
		let result = config;
		for (const interceptor of this.requestInterceptors) {
			result = await interceptor(result);
		}
		return result;
	}

	private async applyResponseInterceptors(
		response: ApiResponse,
	): Promise<ApiResponse> {
		let result = response;
		for (const interceptor of this.responseInterceptors) {
			result = await interceptor(result);
		}
		return result;
	}

	private async applyErrorInterceptors(error: ApiError): Promise<ApiError> {
		let result = error;
		for (const interceptor of this.errorInterceptors) {
			result = await interceptor(result);
		}
		return result;
	}

	// 核心请求方法
	async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
		try {
			const finalConfig = await this.applyRequestInterceptors(config);

			return new Promise<ApiResponse<T>>((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const url = finalConfig.url.startsWith("http")
					? finalConfig.url
					: `${this.baseURL}${finalConfig.url}`;

				xhr.open(finalConfig.method || "GET", url, true);
				xhr.timeout = finalConfig.timeout || this.defaultTimeout;

				// 设置请求头
				const headers = { ...this.defaultHeaders, ...finalConfig.headers };
				for (const [key, value] of Object.entries(headers)) {
					xhr.setRequestHeader(key, value);
				}

				xhr.onload = async () => {
					try {
						const responseData = xhr.responseText
							? JSON.parse(xhr.responseText)
							: null;
						const response: ApiResponse<T> = {
							data: responseData,
							status: xhr.status,
							statusText: xhr.statusText,
							headers: this.parseHeaders(xhr),
						};

						if (xhr.status >= 200 && xhr.status < 300) {
							const finalResponse =
								await this.applyResponseInterceptors(response);
							resolve(finalResponse as ApiResponse<T>);
						} else {
							const error: ApiError = {
								message: `HTTP Error: ${xhr.status}`,
								status: xhr.status,
								response: responseData,
							};
							const finalError = await this.applyErrorInterceptors(error);
							reject(finalError);
						}
					} catch (err) {
						const error: ApiError = {
							message: err instanceof Error ? err.message : "Parse error",
						};
						const finalError = await this.applyErrorInterceptors(error);
						reject(finalError);
					}
				};

				xhr.onerror = async () => {
					const error: ApiError = { message: "Network Error" };
					const finalError = await this.applyErrorInterceptors(error);
					reject(finalError);
				};

				xhr.ontimeout = async () => {
					const error: ApiError = { message: "Request Timeout" };
					const finalError = await this.applyErrorInterceptors(error);
					reject(finalError);
				};

				// 发送请求
				if (finalConfig.data) {
					xhr.send(JSON.stringify(finalConfig.data));
				} else {
					xhr.send();
				}
			});
		} catch (err) {
			const error: ApiError = {
				message: err instanceof Error ? err.message : "Request failed",
			};
			const finalError = await this.applyErrorInterceptors(error);
			throw finalError;
		}
	}

	private parseHeaders(xhr: XMLHttpRequest): Record<string, string> {
		const headers: Record<string, string> = {};
		const headerString = xhr.getAllResponseHeaders();
		if (headerString) {
			for (const line of headerString.split("\r\n")) {
				const [key, value] = line.split(": ");
				if (key && value) headers[key.toLowerCase()] = value;
			}
		}
		return headers;
	}

	// 便捷方法
	get<T = unknown>(
		url: string,
		config?: Omit<RequestConfig, "url" | "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "GET" });
	}

	post<T = unknown>(
		url: string,
		data?: unknown,
		config?: Omit<RequestConfig, "url" | "method" | "data">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "POST", data });
	}

	put<T = unknown>(
		url: string,
		data?: unknown,
		config?: Omit<RequestConfig, "url" | "method" | "data">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "PUT", data });
	}

	delete<T = unknown>(
		url: string,
		config?: Omit<RequestConfig, "url" | "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "DELETE" });
	}
}

// 默认实例
export const httpClient = new HttpClient();

// 便捷方法
export const get = httpClient.get.bind(httpClient);
export const post = httpClient.post.bind(httpClient);
export const put = httpClient.put.bind(httpClient);
export const del = httpClient.delete.bind(httpClient);

// 实例创建函数
export const createHttpClient = (baseURL?: string, timeout?: number) =>
	new HttpClient(baseURL, timeout);

// 常用拦截器
export const interceptors = {
	// 请求日志
	requestLogger: (): RequestInterceptor => (config) => {
		console.log(`🚀 ${config.method?.toUpperCase() || "GET"} ${config.url}`);
		return config;
	},

	// 响应日志
	responseLogger: (): ResponseInterceptor => (response) => {
		console.log(`✅ ${response.status} Response`);
		return response;
	},

	// 错误日志
	errorLogger: (): ErrorInterceptor => (error) => {
		console.error(`❌ ${error.status || "Network"} Error: ${error.message}`);
		return error;
	},

	// 认证Token
	authToken:
		(getToken: () => string | null): RequestInterceptor =>
		(config) => {
			const token = getToken();
			if (token) {
				config.headers = {
					...config.headers,
					Authorization: `Bearer ${token}`,
				};
			}
			return config;
		},

	// 数据转换
	dataTransform:
		<T, R>(transformer: (data: T) => R): ResponseInterceptor =>
		(response) => {
			try {
				response.data = transformer(response.data as T) as unknown;
			} catch (err) {
				console.warn("Data transform failed:", err);
			}
			return response;
		},
};
