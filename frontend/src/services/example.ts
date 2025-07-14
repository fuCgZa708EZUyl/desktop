// API 直接调用示例
import { createHttpClient, interceptors } from "./base";

// 定义接口类型
interface User {
	id: number;
	name: string;
	email: string;
}

interface Post {
	id: number;
	title: string;
	content: string;
	userId: number;
}

interface Comment {
	id: number;
	content: string;
	postId: number;
	userId: number;
}

// 创建配置好的API客户端
const api = createHttpClient("https://api.example.com");

// 设置基础拦截器
api.addRequestInterceptor(interceptors.requestLogger());
api.addResponseInterceptor(interceptors.responseLogger());
api.addErrorInterceptor(interceptors.errorLogger());
api.addRequestInterceptor(
	interceptors.authToken(() => localStorage.getItem("token")),
);

// 直接的API调用函数
export async function getUsers(): Promise<User[]> {
	const response = await api.get<User[]>("/users");
	return response.data;
}

export async function getUser(id: number): Promise<User> {
	const response = await api.get<User>(`/users/${id}`);
	return response.data;
}

export async function createUser(userData: Omit<User, "id">): Promise<User> {
	const response = await api.post<User>("/users", userData);
	return response.data;
}

export async function updateUser(
	id: number,
	userData: Partial<User>,
): Promise<User> {
	const response = await api.put<User>(`/users/${id}`, userData);
	return response.data;
}

export async function deleteUser(id: number): Promise<void> {
	await api.delete(`/users/${id}`);
}

export async function uploadFile(file: File): Promise<{ url: string }> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await api.post<{ url: string }>("/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return response.data;
}

// 带错误处理的API调用
export async function getUserSafely(id: number): Promise<User | null> {
	try {
		return await getUser(id);
	} catch (error) {
		console.error("获取用户失败:", error);
		return null;
	}
}

// 批量操作示例
export async function getAllData(): Promise<{
	users: User[];
	posts: Post[];
	comments: Comment[];
}> {
	const [users, posts, comments] = await Promise.all([
		getUsers(),
		getPosts(),
		getComments(),
	]);

	return { users, posts, comments };
}

export async function getPosts(): Promise<Post[]> {
	const response = await api.get<Post[]>("/posts");
	return response.data;
}

export async function getComments(): Promise<Comment[]> {
	const response = await api.get<Comment[]>("/comments");
	return response.data;
}

// 带超时的请求
export async function getUsersWithTimeout(timeoutMs = 5000): Promise<User[]> {
	const response = await api.get<User[]>("/users", { timeout: timeoutMs });
	return response.data;
}

// 设置认证token
export function setAuthToken(token: string): void {
	api.setAuthToken(token);
}

// 移除认证token
export function removeAuthToken(): void {
	api.removeAuthToken();
}

// 使用示例函数
export async function exampleUsage(): Promise<void> {
	try {
		// 设置认证token
		setAuthToken("your-jwt-token");

		// 获取所有用户
		const users = await getUsers();
		console.log("用户列表:", users);

		// 创建新用户
		const newUser = await createUser({
			name: "John Doe",
			email: "john@example.com",
		});
		console.log("创建用户:", newUser);

		// 更新用户
		const updatedUser = await updateUser(newUser.id, {
			name: "Jane Doe",
		});
		console.log("更新用户:", updatedUser);

		// 获取单个用户（安全模式）
		const user = await getUserSafely(newUser.id);
		if (user) {
			console.log("获取用户成功:", user);
		}

		// 批量获取数据
		const allData = await getAllData();
		console.log("所有数据:", allData);

		// 删除用户
		await deleteUser(newUser.id);
		console.log("用户已删除");
	} catch (error) {
		console.error("操作失败:", error);
	}
}
