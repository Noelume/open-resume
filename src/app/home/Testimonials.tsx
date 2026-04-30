"use client";
import heartSrc from "public/assets/heart.svg";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

const LG_TESTIMONIALS_CLASSNAMES = [
  "z-10",
  "translate-x-44 translate-y-24 opacity-40",
  "translate-x-32 -translate-y-28 opacity-40",
];
const SM_TESTIMONIALS_CLASSNAMES = ["z-10", "opacity-0", "opacity-0"];
const ROTATION_INTERVAL_MS = 8 * 1000; // 8s

export const Testimonials = ({ children }: { children?: React.ReactNode }) => {
  const language = useAppSelector(selectLanguage);

  const TESTIMONIALS = [
    {
      src: testimonialSpiegelSrc,
      quote: language === "zh" ? "学生们经常在简历上犯一些愚蠢的错误，比如使用不一致的要点或字体大小。OpenResume 的自动格式化功能对确保格式一致有很大帮助。" : "Students often make silly mistakes on their resumes, such as using inconsistent bullet points or font sizes. OpenResume's auto-formatting feature is a great help in ensuring consistent formatting.",
      name: language === "zh" ? "Spiegel 女士" : "Ms. Spiegel",
      title: language === "zh" ? "教育工作者" : "Educator",
    },
    {
      src: testimonialSantiSrc,
      quote: language === "zh" ? "我在上次求职时使用了 OpenResume，由于其流畅而专业的简历设计，我受邀参加了 Google 和 Amazon 等顶级科技公司的面试。" : "I used OpenResume for my last job search, and I was invited to interview at top tech companies like Google and Amazon thanks to its sleek and professional resume design.",
      name: "Santi",
      title: language === "zh" ? "软件工程师" : "Software Engineer",
    },
    {
      src: testimonialVivianSrc,
      quote: language === "zh" ? "在 OpenResume 上创建专业简历非常顺畅和容易！它为我节省了大量时间和头痛，不用再处理 Google 文档模板了。" : "Creating a professional resume on OpenResume is so smooth and easy! It saved me a lot of time and headaches from dealing with Google Docs templates.",
      name: "Vivian",
      title: language === "zh" ? "大学生" : "College Student",
    },
  ];

  const [testimonialsClassNames, setTestimonialsClassNames] = useState(
    LG_TESTIMONIALS_CLASSNAMES
  );
  const isHoveredOnTestimonial = useRef(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHoveredOnTestimonial.current) {
        setTestimonialsClassNames((preClassNames) => {
          return [preClassNames[1], preClassNames[2], preClassNames[0]];
        });
      }
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const { isLg } = useTailwindBreakpoints();
  useEffect(() => {
    setTestimonialsClassNames(
      isLg ? LG_TESTIMONIALS_CLASSNAMES : SM_TESTIMONIALS_CLASSNAMES
    );
  }, [isLg]);

  return (
    <section className="mx-auto -mt-2 px-8 pb-24">
      <h2 className="mb-8 text-center text-3xl font-bold">
        {language === "zh" ? "大家" : "People"}{" "}
        <Image src={heartSrc} alt="love" className="-mt-1 inline-block w-7" />{" "}
        OpenResume
      </h2>
      <div className="mx-auto mt-10 h-[235px] max-w-lg lg:h-[400px] lg:pt-28">
        <div className="relative lg:ml-[-50px]">
          {TESTIMONIALS.map(({ src, quote, name, title }, idx) => {
            const className = testimonialsClassNames[idx];
            return (
              <div
                key={idx}
                className={`bg-primary absolute max-w-lg rounded-[1.7rem] bg-opacity-30 shadow-md transition-all duration-1000 ease-linear ${className}`}
                onMouseEnter={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = true;
                  }
                }}
                onMouseLeave={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = false;
                  }
                }}
              >
                <figure className="m-1 flex gap-5 rounded-3xl bg-white p-5 text-gray-900 lg:p-7">
                  <Image
                    className="hidden h-24 w-24 select-none rounded-full lg:block"
                    src={src}
                    alt="profile"
                  />
                  <div>
                    <blockquote>
                      <p className="before:content-['“'] after:content-['”']">
                        {quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-3">
                      <div className="hidden gap-2 lg:flex">
                        <div className="font-semibold">{name}</div>
                        <div
                          className="select-none text-gray-700"
                          aria-hidden="true"
                        >
                          •
                        </div>
                        <div className="text-gray-600">{title}</div>
                      </div>
                      <div className="flex gap-4 lg:hidden">
                        <Image
                          className=" block h-12 w-12 select-none rounded-full"
                          src={src}
                          alt="profile"
                        />
                        <div>
                          <div className="font-semibold">{name}</div>
                          <div className="text-gray-600">{title}</div>
                        </div>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </section>
  );
};
