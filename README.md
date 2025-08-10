# PhotoVerse Gallery 📸

一个基于 Cloudflare Workers 的精美图片画廊，支持自定义加载数量和随机刷新功能。

![PhotoVerse Gallery](https://img.shields.io/badge/PhotoVerse-Gallery-blue?style=for-the-badge)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ 特性

- 🎨 **精美设计**: 淡蓝色主题，现代化界面
- 🔢 **自定义数量**: 支持加载 1-999 张图片
- 🎲 **随机刷新**: 每次访问看到不同的图片

## 🚀 快速部署

### 1. 获取图片链接

感谢 [linux.do 论坛](https://linux.do/t/topic/153136) 的 **zxd666** 大佬提供图片资源！



### 2. 配置图片源

在 `index.js` 文件中找到 `URL_SOURCES` 数组，替换为你的图片链接：

```javascript
const URL_SOURCES = [
  'https://raw.githubusercontent.com/你的用户名/你的仓库/main/1url.txt',
  'https://raw.githubusercontent.com/你的用户名/你的仓库/main/2url.txt',
  'https://raw.githubusercontent.com/你的用户名/你的仓库/main/3url.txt'
];
```

### 3. 部署到 Cloudflare Workers

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create Application** → **Create Worker**
4. 将 `index.js` 的完整内容复制粘贴到编辑器中
5. 点击 **Save and Deploy**
6. 访问分配的 `*.workers.dev` 域名即可使用
   <img width="1886" height="927" alt="image" src="https://github.com/user-attachments/assets/a7c778c4-5323-4d38-af85-be34e991fe7c" />




## 🎯 使用说明

### 基本操作

1. **设置图片数量**: 在输入框中输入想要显示的图片数量（1-9999）
2. **加载图片**: 点击"加载图片"按钮或按 Enter 键
3. **随机刷新**: 点击"随机刷新"按钮获取新的随机图片
4. **查看大图**: 点击任意图片进入全屏预览模式
5. **关闭预览**: 点击 ✕ 按钮或按 Esc 键退出预览

### 默认行为

- 🔢 默认加载 **100** 张随机图片
- 🔄 每次刷新页面显示不同的图片组合
- 💾 记住用户设置的图片数量（当前会话）


