"use client";
import { useState, useEffect } from "react";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

const defaultFileUrl = "resume-example/laverne-resume.pdf";

export default function ResumeParser() {
  const language = useAppSelector(selectLanguage);
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  const RESUME_EXAMPLES = [
    {
      fileUrl: "resume-example/laverne-resume.pdf",
      description: (
        <span>
          {language === "zh" ? "借用于拉文大学职业中心 - " : "Borrowed from University of La Verne Career Center - "}
          <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
            {language === "zh" ? "链接" : "Link"}
          </Link>
        </span>
      ),
    },
    {
      fileUrl: "resume-example/openresume-resume.pdf",
      description: (
        <span>
          {language === "zh" ? "使用 OpenResume 简历生成器创建 - " : "Created with OpenResume resume builder - "}
          <Link href="/resume-builder">{language === "zh" ? "链接" : "Link"}</Link>
        </span>
      ),
    },
  ];

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
            <div className="aspect-h-[9.5] aspect-w-7">
              <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
            </div>
          </section>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
        </div>
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <Heading className="text-primary !mt-4">
              {language === "zh" ? "简历解析器测试区" : "Resume Parser Playground"}
            </Heading>
            <Paragraph smallMarginTop={true}>
              {language === "zh"
                ? "此测试区展示了 OpenResume 简历解析器及其从简历 PDF 中解析信息的能力。点击下方的 PDF 示例，观察不同的解析结果。"
                : "This playground showcases the OpenResume resume parser and its ability to parse information from a resume PDF. Click around the PDF examples below to observe the different parsing results."}
            </Paragraph>
            <div className="mt-3 flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                    example.fileUrl === fileUrl
                      ? "border-blue-400"
                      : "border-gray-300"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      setFileUrl(example.fileUrl);
                  }}
                  tabIndex={0}
                >
                  <h1 className="font-semibold">
                    {language === "zh" ? `简历示例 ${idx + 1}` : `Resume Example ${idx + 1}`}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {example.description}
                  </p>
                </article>
              ))}
            </div>
            <Paragraph>
              {language === "zh" ? "您也可以 " : "You can also "}
              <span className="font-semibold">
                {language === "zh" ? "在下方添加您的简历" : "add your resume below"}
              </span>
              {language === "zh"
                ? "，以评估您的简历在求职申请中被类似的申请追踪系统 (ATS) 解析的效果。它能解析出的信息越多，说明简历的格式越好，越容易阅读。至少准确解析出姓名和电子邮件是非常有益的。"
                : " to assess how well your resume would be parsed by similar Applicant Tracking Systems (ATS) used in job applications. The more information it can parse out, the better formatted and easier to read your resume is. It is highly beneficial to have at least the name and email accurately parsed."}
            </Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(fileUrl) =>
                  setFileUrl(fileUrl || defaultFileUrl)
                }
                playgroundView={true}
              />
            </div>
            <Heading level={2} className="!mt-[1.2em]">
              {language === "zh" ? "简历解析结果" : "Resume Parsing Results"}
            </Heading>
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
            <div className="pt-24" />
          </section>
        </div>
      </div>
    </main>
  );
}
