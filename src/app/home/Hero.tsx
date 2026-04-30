"use client";
import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export const Hero = () => {
  const language = useAppSelector(selectLanguage);
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="text-primary pb-2 text-4xl font-bold lg:text-5xl">
          {language === "zh" ? "轻松创建" : "Create a professional"}
          <br />
          {language === "zh" ? "专业的简历" : "resume easily"}
        </h1>
        <p className="mt-3 text-lg lg:mt-5 lg:text-xl">
          {language === "zh" ? "使用这款免费、开源且强大的简历生成器" : "With this free, open-source, and powerful resume builder"}
        </p>
        <Link href="/resume-import" className="btn-primary mt-6 lg:mt-14">
          {language === "zh" ? "创建简历" : "Create Resume"} <span aria-hidden="true">→</span>
        </Link>
        <p className="ml-6 mt-3 text-sm text-gray-600">{language === "zh" ? "无需注册" : "No sign up required"}</p>
        <p className="mt-3 text-sm text-gray-600 lg:mt-36">
          {language === "zh" ? "已经有简历了？使用" : "Already have a resume? Test its ATS readability with the"}{" "}
          <Link href="/resume-parser" className="underline underline-offset-2">
            {language === "zh" ? "简历解析器" : "resume parser"}
          </Link>
          {language === "zh" ? " 测试其 ATS 可读性" : ""}
        </p>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <AutoTypingResume />
      </div>
    </section>
  );
};
