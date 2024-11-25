#!/bin/bash

# 设置 PATH，确保 cron 能找到命令
export PATH=/usr/local/bin:/usr/bin:/bin:$HOME/.nvm/versions/node/v18.0.0/bin

# 切换到项目目录
cd /Users/laurie/Documents/aboutme/jasonlong_laurie || exit

# 执行 npm 安装
npm install clone-response

# 运行 Node.js 脚本
node build-svg.js

# Git 提交和推送
git add .
git commit -m "update"
git push origin main

# 记录日志
echo "Script executed on $(date)" >> /tmp/update.log 2>&1
