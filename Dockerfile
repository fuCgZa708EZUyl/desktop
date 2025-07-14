# 多阶段构建 Dockerfile
# 阶段1: 构建前端应用
FROM oven/bun:alpine AS frontend-build

# 设置工作目录
WORKDIR /app/frontend

# 复制前端包管理文件
COPY frontend/package.json frontend/bun.lock* ./

# 安装前端依赖
RUN bun install --frozen-lockfile

# 复制前端源代码
COPY frontend/ ./

# 构建前端应用
RUN bun run build

# 阶段2: 构建后端应用
FROM maven:3.9.9-openjdk-21-slim AS backend-build

# 设置工作目录
WORKDIR /app

# 复制后端项目文件
COPY backend/pom.xml ./backend/
COPY backend/mvnw ./backend/
COPY backend/mvnw.cmd ./backend/
COPY backend/.mvn ./backend/.mvn

# 设置工作目录到backend
WORKDIR /app/backend

# 下载依赖（利用Docker缓存）
RUN ./mvnw dependency:go-offline -B

# 复制后端源代码
COPY backend/src ./src

# 从前端构建阶段复制静态文件到后端静态资源目录
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# 构建后端应用
RUN ./mvnw clean package -DskipTests -B

# 阶段3: 运行时镜像
FROM openjdk:21-jre-slim

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 从构建阶段复制jar文件
COPY --from=backend-build /app/backend/target/*.jar app.jar

# 更改文件所有者
RUN chown appuser:appuser app.jar

# 切换到非root用户
USER appuser

# 暴露端口（Spring Boot默认端口8080）
EXPOSE 8080

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
