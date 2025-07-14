// 简单直接的API调用示例
import {
	createUser,
	deleteUser,
	exampleUsage,
	getUser,
	getUserSafely,
	getUsers,
	setAuthToken,
	updateUser,
} from "./example";

// 在组件或其他地方直接使用
export async function handleUserOperations() {
	// 设置认证
	setAuthToken("your-jwt-token");

	try {
		// 获取用户列表
		const users = await getUsers();
		console.log("用户列表:", users);

		// 获取单个用户
		const user = await getUser(1);
		console.log("用户详情:", user);

		// 创建用户
		const newUser = await createUser({
			name: "张三",
			email: "zhangsan@example.com",
		});
		console.log("创建成功:", newUser);

		// 更新用户
		const updatedUser = await updateUser(newUser.id, {
			name: "李四",
		});
		console.log("更新成功:", updatedUser);

		// 安全获取用户（不会抛出错误）
		const safeUser = await getUserSafely(999); // 不存在的用户ID
		if (safeUser) {
			console.log("用户存在:", safeUser);
		} else {
			console.log("用户不存在");
		}

		// 删除用户
		await deleteUser(newUser.id);
		console.log("删除成功");
	} catch (error) {
		console.error("操作失败:", error);
	}
}

// React组件中的使用示例
export function useUserData() {
	const loadUsers = async () => {
		try {
			const users = await getUsers();
			return users;
		} catch (error) {
			console.error("加载用户失败:", error);
			return [];
		}
	};

	const createNewUser = async (name: string, email: string) => {
		try {
			const user = await createUser({ name, email });
			console.log("创建用户成功:", user);
			return user;
		} catch (error) {
			console.error("创建用户失败:", error);
			throw error;
		}
	};

	return {
		loadUsers,
		createNewUser,
	};
}

// 一键运行所有示例
export async function runAllExamples() {
	console.log("🚀 开始运行API示例...");

	await handleUserOperations();
	await exampleUsage();

	console.log("✅ 所有示例运行完成");
}
