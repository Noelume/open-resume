"use client";
import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export const Features = () => {
  const language = useAppSelector(selectLanguage);

  const FEATURES = [
    {
      src: featureFreeSrc,
      title: language === "zh" ? "永久免费" : "Free Forever",
      text: language === "zh" ? "OpenResume 的创立理念是每个人都应该能够免费、轻松地获得现代专业的简历设计" : "OpenResume was created with the belief that everyone should have free and easy access to a modern professional resume design",
    },
    {
      src: featureUSSrc,
      title: language === "zh" ? "美国最佳实践" : "US Best Practices",
      text: language === "zh" ? "OpenResume 内置了美国就业市场的最佳实践，并与 Greenhouse 和 Lever 等顶级 ATS 平台良好兼容" : "OpenResume is built with US job market best practices in mind and is highly compatible with top ATS platforms like Greenhouse and Lever",
    },
    {
      src: featurePrivacySrc,
      title: language === "zh" ? "注重隐私" : "Privacy Focused",
      text: language === "zh" ? "OpenResume 将数据本地存储在您的浏览器中，因此只有您可以访问您的数据并拥有完全的控制权" : "OpenResume stores data locally in your browser, so only you have access to your data and have full control over it",
    },
    {
      src: featureOpenSourceSrc,
      title: language === "zh" ? "开源" : "Open Source",
      text: (
        <>
          {language === "zh" ? "OpenResume 是一个开源项目，任何人都可以通过其" : "OpenResume is an open-source project, and anyone can view its source code on its"}{" "}
          <Link href="https://github.com/xitanggg/open-resume">
            {language === "zh" ? "GitHub 仓库" : "GitHub repository"}
          </Link>
          {language === "zh" ? " 查看其源代码" : ""}
        </>
      ),
    },
  ];

  return (
    <section className="py-16 lg:py-36">
      <div className="mx-auto lg:max-w-4xl">
        <dl className="grid grid-cols-1 justify-items-center gap-y-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
          {FEATURES.map(({ src, title, text }) => (
            <div className="px-2" key={title}>
              <div className="relative w-96 self-center pl-16">
                <dt className="text-2xl font-bold">
                  <Image
                    src={src}
                    className="absolute left-0 top-1 h-12 w-12"
                    alt="Feature icon"
                  />
                  {title}
                </dt>
                <dd className="mt-2">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
