[简体中文] | [English](AGENTS.md)

# OpenResume 代理指令

## 技术栈与架构
- **框架**: Next.js 13 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Redux Toolkit
- **PDF 生成**: `@react-pdf/renderer`
- **PDF 解析**: `pdfjs-dist`
- **测试**: Jest (`npm run test` 或 `npm run test:ci`)

## 项目结构
- 代码高度集中在 `src/app`。
- **关键入口点**:
  - 首页: `src/app/page.tsx`
  - 生成器: `src/app/resume-builder/page.tsx`
  - 解析器: `src/app/resume-parser/page.tsx`
  - 导入: `src/app/resume-import/page.tsx`

## 运行特性
- 应用程序的核心逻辑完全在客户端运行，以优先保护隐私。构建/解析简历不需要服务器后端。
- 在开发简历生成器时，UI 表单的更改应分发 Redux action。
- `react-pdf` 依赖项有特定的样式和组件结构要求（使用 `<View>`、`<Text>` 等，而不是 HTML 标签）。注意不要在 `react-pdf` 结构中混入标准 DOM 元素。
- `pdfjs-dist` 用于解析 PDF。在读取文档对象时，请确保仔细处理异步操作。

## 命令
- `npm run dev`: 启动 Next.js 开发服务器
- `npm run build`: 构建 Next.js 应用
- `npm run lint`: 运行 Next.js lint 检查
- `npm run test`: 以监听模式运行 Jest 测试
