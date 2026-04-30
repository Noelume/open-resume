[简体中文] | [English](README.md)

# OpenResume

OpenResume 是一款功能强大的开源简历生成器和简历解析器。

OpenResume 的目标是让每个人都能免费获得现代化的专业简历设计，并让任何人都能自信地申请工作。

官方网站：[https://open-resume.com](https://open-resume.com)

## ⚒️ 简历生成器

OpenResume 的简历生成器允许用户轻松创建现代化的专业简历。

![简历生成器演示](https://i.ibb.co/jzcrrt8/resume-builder-demo-optimize.gif)

它有 5 个核心功能：
| <div style="width:285px">**功能**</div> | **描述** |
|---|---|
| **1. 实时 UI 更新** | 简历 PDF 会在您输入简历信息时实时更新，因此您可以轻松查看最终输出。 |
| **2. 现代专业简历设计** | 简历 PDF 采用现代专业设计，符合美国最佳实践，并且对 Greenhouse 和 Lever 等顶级 ATS 平台友好。它会自动格式化字体、大小、边距、项目符号，以确保一致性并避免人为错误。 |
| **3. 隐私关注** | 该应用程序仅在您的浏览器本地运行，这意味着无需注册，且任何数据都不会离开您的浏览器，让您对个人数据感到放心。（有趣的事实：仅在本地运行意味着即使断开互联网，该应用程序仍然可以工作。） |
| **4. 从现有简历 PDF 导入** | 如果您已经有现有的简历 PDF，您可以选择直接导入，这样您就可以在几秒钟内将简历设计更新为现代专业设计。 |
| **5. 成功的往绩记录** | OpenResume 用户已获得 Dropbox、Google、Meta 等顶级公司的面试和录用通知。事实证明，它行之有效，并受到招聘人员和招聘经理的青睐。 |

## 🔍 简历解析器

OpenResume 的第二个组件是简历解析器。对于那些已有简历的人，简历解析器可以帮助测试和确认其 ATS 可读性。

![简历解析器演示](https://i.ibb.co/JvSVwNk/resume-parser-demo-optimize.gif)

您可以在 [“简历解析器算法深入探讨”部分](https://open-resume.com/resume-parser) 了解更多关于简历解析器算法的信息。

## 📚 技术栈

| <div style="width:140px">**类别**</div> | <div style="width:100px">**选择**</div> | **描述** |
|---|---|---|
| **语言** | [TypeScript](https://github.com/microsoft/TypeScript) | TypeScript 是具有静态类型检查的 JavaScript，有助于在编码时捕获许多愚蠢的错误。 |
| **UI 库** | [React](https://github.com/facebook/react) | React 的声明式语法和基于组件的架构使得开发响应式可重用组件变得简单。 |
| **状态管理** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Redux Toolkit 减少了设置和更新中央 Redux store 的样板代码，该 store 用于管理复杂的简历状态。 |
| **CSS 框架** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Tailwind 通过提供有用的 CSS 实用程序并消除在 tsx 和 css 文件之间切换上下文的需求来加速开发。 |
| **Web 框架** | [NextJS 13](https://github.com/vercel/next.js) | Next.js 支持静态站点生成，并有助于构建支持 SEO 的高效 React 网页。 |
| **PDF 阅读器** | [PDF.js](https://github.com/mozilla/pdf.js) | PDF.js 从 PDF 文件中读取内容，简历解析器在第一步使用它来读取简历 PDF 的内容。 |
| **PDF 渲染器** | [React-pdf](https://github.com/diegomura/react-pdf) | React-pdf 创建 PDF 文件，简历生成器使用它来创建可下载的 PDF 文件。 |

## 📁 项目结构

OpenResume 使用 NextJS Web 框架创建，并遵循其项目结构。源代码可以在 `src/app` 中找到。共有 4 个页面路由，如下表所示。（代码路径相对于 `src/app`）

| <div style="width:115px">**页面路由**</div> | **代码路径** | **描述** |
|---|---|---|
| / | /page.tsx | 首页，包含 hero、自动打字简历、步骤、证言、徽标云等 |
| /resume-import | /resume-import/page.tsx | 简历导入页面，您可以选择从现有简历 PDF 导入数据。使用的主要组件是 `ResumeDropzone` (`/components/ResumeDropzone.tsx`) |
| /resume-builder | /resume-builder/page.tsx | 简历生成器页面，用于构建和下载简历 PDF。使用的主要组件是 `ResumeForm` (`/components/ResumeForm`) and `Resume` (`/components/Resume`) |
| /resume-parser | /resume-parser/page.tsx | 简历解析器页面，用于测试简历的 AST 可读性。使用的主要库工具是 `parseResumeFromPdf` (`/lib/parse-resume-from-pdf`) |

## 💻 本地开发

### 方法 1：npm

1. 下载仓库 `git clone https://github.com/xitanggg/open-resume.git`
2. 进入目录 `cd open-resume`
3. 安装依赖 `npm install`
4. 启动开发服务器 `npm run dev`
5. 打开浏览器并访问 [http://localhost:3000](http://localhost:3000) 以查看运行中的 OpenResume

### 方法 2：Docker

1. 下载仓库 `git clone https://github.com/xitanggg/open-resume.git`
2. 进入目录 `cd open-resume`
3. 构建容器 `docker build -t open-resume .`
4. 启动容器 `docker run -p 3000:3000 open-resume`
5. 打开浏览器并访问 [http://localhost:3000](http://localhost:3000) 以查看运行中的 OpenResume
