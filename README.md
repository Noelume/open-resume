# OpenResume

OpenResume 是一款基于浏览器运行的简历制作与简历解析工具。它帮助用户快速创建结构清晰、排版专业、适合求职投递的简历，并支持从已有 PDF 简历中提取内容，继续编辑和导出。

项目的核心目标是：让简历制作更简单、更稳定，也更注重隐私。用户的简历内容主要在本地浏览器中处理，无需后端服务即可完成填写、预览、导入、解析和 PDF 下载。

## 主要功能

### 简历制作

- 通过表单编辑个人信息、工作经历、教育经历、项目经历、技能和自定义内容。
- 右侧实时预览最终简历版式，方便边写边调整。
- 支持主题色、字体、字号、纸张尺寸和模块顺序配置。
- 支持将简历生成并下载为 PDF 文件。
- 下载前会准备最新 PDF，避免在简历内容较多时影响输入体验。

### PDF 简历导入

- 支持上传已有 PDF 简历并解析出可编辑的简历数据。
- 导入过程在浏览器本地完成，文件内容不会上传到服务器。
- 对 PDF 文件大小、页数和文本量进行合理限制，保证导入过程更可控。
- 导入失败时会在页面上给出提示，方便用户换用更合适的 PDF 文件。

### 简历解析器

- 可用于查看 PDF 简历被解析后的结构化结果。
- 适合检查简历是否足够清晰、是否容易被类似 ATS 的系统读取。
- 当前解析逻辑更适合单栏、文本结构清楚的英文简历。

## 技术栈

| 分类 | 技术 |
|---|---|
| Web 框架 | Next.js 13 App Router |
| UI | React + TypeScript |
| 样式 | Tailwind CSS |
| 状态管理 | Redux Toolkit |
| PDF 生成 | `@react-pdf/renderer` |
| PDF 解析 | `pdfjs-dist` |
| 测试 | Jest |

## 项目结构

主要代码位于 `src/app`：

| 路由 | 文件 | 说明 |
|---|---|---|
| `/` | `src/app/page.tsx` | 首页 |
| `/resume-import` | `src/app/resume-import/page.tsx` | 上传并导入已有 PDF 简历 |
| `/resume-builder` | `src/app/resume-builder/page.tsx` | 简历制作、预览和下载 |
| `/resume-parser` | `src/app/resume-parser/page.tsx` | PDF 简历解析演示与结果查看 |

关键模块：

- `src/app/components/ResumeForm`：简历编辑表单。
- `src/app/components/Resume`：简历预览、缩放控制和 PDF 下载。
- `src/app/components/ResumeDropzone.tsx`：PDF 上传与导入入口。
- `src/app/components/Resume/ResumePDF`：PDF 简历模板。
- `src/app/lib/redux`：Redux store、简历数据和设置状态。
- `src/app/lib/parse-resume-from-pdf`：PDF 文本读取、分行、分区和字段提取逻辑。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

构建生产版本：

```bash
npm run build
```

运行测试：

```bash
npm run test:ci
```

运行 lint：

```bash
npm run lint
```

## Docker 运行

构建镜像：

```bash
docker build -t open-resume .
```

启动容器：

```bash
docker run -p 3000:3000 open-resume
```

然后访问：

```text
http://localhost:3000
```

## 使用建议

- 如果从 PDF 导入简历，建议使用单栏、文本可复制、页数较少的简历文件。
- 如果简历内容较多，编辑时可以先专注填写内容，再点击下载按钮准备最新 PDF。
- 浏览器本地存储容量有限，超长简历或异常大的导入结果可能需要适当删减后再保存。

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
