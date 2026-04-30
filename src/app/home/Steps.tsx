"use client";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export const Steps = () => {
  const language = useAppSelector(selectLanguage);

  const STEPS = [
    { title: language === "zh" ? "添加简历 PDF" : "Add a resume PDF", text: language === "zh" ? "或从头开始创建" : "or start from scratch" },
    { title: language === "zh" ? "预览设计" : "Preview design", text: language === "zh" ? "并进行编辑" : "and make edits" },
    { title: language === "zh" ? "下载新简历" : "Download new resume", text: language === "zh" ? "并充满信心地申请" : "and apply with confidence" },
  ];

  return (
    <section className="mx-auto mt-8 rounded-2xl bg-sky-50 bg-dot px-8 pb-12 pt-10 lg:mt-2">
      <h1 className="text-center text-3xl font-bold">{language === "zh" ? "3 个简单步骤" : "3 Simple Steps"}</h1>
      <div className="mt-8 flex justify-center">
        <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
          {STEPS.map(({ title, text }, idx) => (
            <div className="relative self-start pl-14" key={idx}>
              <dt className="text-lg font-bold">
                <div className="bg-primary absolute left-0 top-1 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-primary -mt-0.5 text-2xl">
                      {idx + 1}
                    </div>
                  </div>
                </div>
                {title}
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
