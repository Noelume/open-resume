"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const language = useAppSelector(selectLanguage);
  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  return (
    <main>
      <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              {language === 'zh' ? '从现有简历导入数据' : 'Import data from an existing resume'}
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading={language === 'zh' ? '还没有简历？' : "Don't have a resume yet?"}
                  buttonText={language === 'zh' ? '从头开始创建' : 'Create from scratch'}
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                <SectionWithHeadingAndCreateButton
                  heading={language === 'zh' ? '您的浏览器中保存了上次会话的数据' : 'You have data saved in browser from prior session'}
                  buttonText={language === 'zh' ? '继续上次的进度' : 'Continue where you left off'}
                />
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold text-gray-900">
              {language === 'zh' ? '使用新简历覆盖数据' : 'Override data with a new resume'}
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
              className="mt-5"
            />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => {
  const language = useAppSelector(selectLanguage);
  return (
    <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
      <div className="flex-grow border-t border-gray-200" />
      <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">{language === 'zh' ? '或' : 'or'}</span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
  );
};

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <>
      <p className="font-semibold text-gray-900">{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          className="outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
