
# node版本号
FROM node:15-alpine
# 工作目录
WORKDIR /create-react-app
# 添加所有文件到create-react-app目录
ADD . /create-react-app
# 执行命令
RUN npm install && npm run build && npm install -g http-server
# 暴露端口号
EXPOSE 3000
# 容器启动之后, 执行http-server 注：./build是指打包后的文件
CMD http-server ./build -p 3000
