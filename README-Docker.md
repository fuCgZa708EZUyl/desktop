# Desktop应用 Docker部署指南

这个项目包含了一个完整的前后端分离应用的Docker化部署方案。

## 项目结构

- `frontend/` - React + TypeScript前端应用，使用Bun作为包管理器
- `backend/` - Spring Boot后端应用，使用Maven构建
- `Dockerfile` - 多阶段构建配置
- `docker-compose.yml` - Docker Compose配置
- `docker-build.sh` - 构建和管理脚本

## 构建流程

Dockerfile采用多阶段构建：

1. **前端构建阶段**: 使用`oven/bun:1.1-alpine`镜像构建React应用
2. **后端构建阶段**: 使用`maven:3.9.9-openjdk-21-slim`镜像构建Spring Boot应用
3. **运行时阶段**: 使用`openjdk:21-jre-slim`镜像运行应用

## 快速开始

### 方法1: 使用构建脚本（推荐）

```bash
# 构建镜像
./docker-build.sh build

# 运行容器
./docker-build.sh run

# 查看日志
./docker-build.sh logs

# 停止容器
./docker-build.sh stop

# 清理资源
./docker-build.sh clean
```

### 方法2: 使用Docker Compose

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 完全清理
docker-compose down --rmi all --volumes
```

### 方法3: 使用原生Docker命令

```bash
# 构建镜像
docker build -t desktop-app:latest .

# 运行容器
docker run -d --name desktop-container -p 8080:8080 desktop-app:latest

# 查看日志
docker logs -f desktop-container

# 停止并删除容器
docker stop desktop-container && docker rm desktop-container
```

## 访问应用

应用启动后，可以通过以下地址访问：

- 主应用: <http://localhost:8080>
- 健康检查: <http://localhost:8080/actuator/health>

## 配置说明

### Dockerfile特性

- **多阶段构建**: 减小最终镜像大小
- **依赖缓存**: 利用Docker层缓存优化构建速度
- **安全性**: 使用非root用户运行应用
- **健康检查**: 内置应用健康状态监控
- **资源优化**: 配置JVM容器感知和内存限制

### 环境变量

可以通过环境变量自定义配置：

```bash
# 运行时传递环境变量
docker run -d \
  --name desktop-container \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=production \
  -e SERVER_PORT=8080 \
  desktop-app:latest
```

### 持久化存储

如果需要持久化数据，可以挂载卷：

```bash
docker run -d \
  --name desktop-container \
  -p 8080:8080 \
  -v /path/to/data:/app/data \
  desktop-app:latest
```

## 开发建议

### 构建优化

1. **缓存优化**: 先复制依赖文件，再复制源代码
2. **.dockerignore**: 排除不必要的文件，提高构建速度
3. **多阶段构建**: 分离构建环境和运行环境

### 安全最佳实践

1. 使用非root用户运行应用
2. 定期更新基础镜像
3. 扫描镜像安全漏洞
4. 限制容器资源使用

### 监控和日志

1. 配置健康检查端点
2. 使用结构化日志
3. 集成监控系统（如Prometheus）

## 故障排除

### 常见问题

1. **构建失败**

   ```bash
   # 检查Docker版本
   docker --version
   
   # 清理构建缓存
   docker builder prune
   ```

2. **容器启动失败**

   ```bash
   # 查看详细日志
   docker logs desktop-container
   
   # 进入容器调试
   docker exec -it desktop-container /bin/bash
   ```

3. **端口冲突**

   ```bash
   # 使用不同端口
   docker run -p 8081:8080 desktop-app:latest
   ```

### 性能调优

1. **JVM参数优化**

   ```bash
   # 自定义JVM参数
   docker run -e JAVA_OPTS="-Xmx512m -Xms256m" desktop-app:latest
   ```

2. **资源限制**

   ```bash
   # 限制容器资源
   docker run --memory=1g --cpus="1.0" desktop-app:latest
   ```

## 维护

### 定期更新

1. 更新基础镜像
2. 更新依赖包
3. 重新构建镜像
4. 测试部署

### 备份策略

1. 定期备份应用数据
2. 保存镜像版本
3. 记录配置变更

## 支持

如有问题，请检查：

1. Docker和Docker Compose版本兼容性
2. 系统资源是否充足
3. 网络连接是否正常
4. 日志文件中的错误信息
