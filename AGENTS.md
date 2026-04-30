[English] | [简体中文](AGENTS_zh.md)

# OpenResume Agent Instructions

## Tech Stack & Architecture
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **PDF Generation**: `@react-pdf/renderer`
- **PDF Parsing**: `pdfjs-dist`
- **Testing**: Jest (`npm run test` or `npm run test:ci`)

## Project Structure
- Code is heavily concentrated in `src/app`.
- **Key Entrypoints**:
  - Home: `src/app/page.tsx`
  - Builder: `src/app/resume-builder/page.tsx`
  - Parser: `src/app/resume-parser/page.tsx`
  - Import: `src/app/resume-import/page.tsx`

## Operational Quirks
- The application is entirely client-side for its core logic to prioritize privacy. No server backend is required to build/parse resumes.
- When working on the resume builder, changes to UI forms should dispatch Redux actions.
- The `react-pdf` dependency has specific styling and component structure requirements (using `<View>`, `<Text>`, etc., instead of HTML tags). Be careful not to mix standard DOM elements into `react-pdf` structures.
- `pdfjs-dist` is used for parsing PDFs. Ensure you handle the asynchronous operations carefully when reading document objects.

## Commands
- `npm run dev`: Start Next.js development server
- `npm run build`: Build Next.js app
- `npm run lint`: Run Next.js linting
- `npm run test`: Run Jest tests in watch mode
