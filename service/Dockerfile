
# node版本号
FROM node:15-alpine
# 工作目录
WORKDIR /live-sql-service
# 添加所有文件到create-react-app目录
ADD . /live-sql-service
# 安装项目依赖
RUN npm install --production

# 暴露端口号
EXPOSE 5000

# 设置容器启动命令，运行 dist 目录下的 app.js
CMD [ "node", "dict/app.js" ]