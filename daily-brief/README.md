# 每日热点 · Daily Brief

## 项目结构

```
daily-brief/
├── api/
│   └── news.js        ← Vercel 后端函数（在境外服务器抓取 Google News）
├── public/
│   └── index.html     ← 前端页面
├── vercel.json        ← Vercel 配置
└── README.md
```

## 部署步骤

### 1. 注册 Vercel
前往 https://vercel.com 注册账号（免费，用 GitHub 登录最方便）

### 2. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 3. 登录
```bash
vercel login
```

### 4. 部署
在 daily-brief 文件夹里执行：
```bash
vercel
```
按提示操作，全部默认回车即可。

### 5. 完成
Vercel 会给你一个域名，例如：
https://daily-brief-xxx.vercel.app

打开这个地址，填入 API Key，点分类按钮即可使用。

## 以后更新
修改文件后重新执行 `vercel` 即可，或者连接 GitHub 仓库实现自动部署。
