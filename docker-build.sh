#!/bin/bash

# 构建和运行脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认配置
IMAGE_NAME="desktop-app"
TAG="latest"
CONTAINER_NAME="desktop-container"
PORT="8080"

# 函数：打印彩色输出
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  build     构建Docker镜像"
    echo "  run       运行Docker容器"
    echo "  stop      停止Docker容器"
    echo "  clean     清理Docker镜像和容器"
    echo "  logs      查看容器日志"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 build     # 构建镜像"
    echo "  $0 run       # 运行容器"
    echo "  $0 stop      # 停止容器"
}

# 函数：构建Docker镜像
build_image() {
    print_info "开始构建Docker镜像..."
    docker build -t ${IMAGE_NAME}:${TAG} .
    if [ $? -eq 0 ]; then
        print_info "镜像构建成功: ${IMAGE_NAME}:${TAG}"
    else
        print_error "镜像构建失败"
        exit 1
    fi
}

# 函数：运行Docker容器
run_container() {
    print_info "检查是否存在运行中的容器..."
    
    # 停止已存在的容器
    if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
        print_warning "发现运行中的容器，正在停止..."
        docker stop ${CONTAINER_NAME}
    fi
    
    # 删除已存在的容器
    if docker ps -aq -f name=${CONTAINER_NAME} | grep -q .; then
        print_info "删除已存在的容器..."
        docker rm ${CONTAINER_NAME}
    fi
    
    print_info "启动新容器..."
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:8080 \
        --restart unless-stopped \
        ${IMAGE_NAME}:${TAG}
    
    if [ $? -eq 0 ]; then
        print_info "容器启动成功"
        print_info "应用已在 http://localhost:${PORT} 上运行"
        print_info "使用 '$0 logs' 查看日志"
    else
        print_error "容器启动失败"
        exit 1
    fi
}

# 函数：停止容器
stop_container() {
    print_info "停止容器..."
    if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
        docker stop ${CONTAINER_NAME}
        print_info "容器已停止"
    else
        print_warning "未找到运行中的容器"
    fi
}

# 函数：查看日志
show_logs() {
    if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
        print_info "显示容器日志 (按 Ctrl+C 退出)..."
        docker logs -f ${CONTAINER_NAME}
    else
        print_error "容器未运行"
        exit 1
    fi
}

# 函数：清理
clean_up() {
    print_info "清理Docker资源..."
    
    # 停止并删除容器
    if docker ps -aq -f name=${CONTAINER_NAME} | grep -q .; then
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        print_info "容器已删除"
    fi
    
    # 删除镜像
    if docker images -q ${IMAGE_NAME}:${TAG} | grep -q .; then
        docker rmi ${IMAGE_NAME}:${TAG}
        print_info "镜像已删除"
    fi
    
    # 清理未使用的镜像
    print_info "清理未使用的Docker资源..."
    docker system prune -f
    
    print_info "清理完成"
}

# 主逻辑
case "${1:-help}" in
    build)
        build_image
        ;;
    run)
        run_container
        ;;
    stop)
        stop_container
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_up
        ;;
    help|*)
        show_help
        ;;
esac
