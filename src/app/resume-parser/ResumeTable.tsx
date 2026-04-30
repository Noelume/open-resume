"use client";
import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { cx } from "lib/cx";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cx("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => (
            <Fragment key={idx}>
              • {x}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const language = useAppSelector(selectLanguage);
  const educations =
    resume.educations.length === 0
      ? [deepClone(initialEducation)]
      : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0
      ? [deepClone(initialWorkExperience)]
      : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }
  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>{language === "zh" ? "个人资料" : "Profile"}</TableRowHeader>
        <TableRow label={language === "zh" ? "姓名" : "Name"} value={resume.profile.name} />
        <TableRow label={language === "zh" ? "电子邮件" : "Email"} value={resume.profile.email} />
        <TableRow label={language === "zh" ? "电话" : "Phone"} value={resume.profile.phone} />
        <TableRow label={language === "zh" ? "地点" : "Location"} value={resume.profile.location} />
        <TableRow label={language === "zh" ? "链接" : "Link"} value={resume.profile.url} />
        <TableRow label={language === "zh" ? "总结" : "Summary"} value={resume.profile.summary} />
        <TableRowHeader>{language === "zh" ? "教育经历" : "Education"}</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label={language === "zh" ? "学校" : "School"} value={education.school} />
            <TableRow label={language === "zh" ? "学位" : "Degree"} value={education.degree} />
            <TableRow label={language === "zh" ? "GPA" : "GPA"} value={education.gpa} />
            <TableRow label={language === "zh" ? "日期" : "Date"} value={education.date} />
            <TableRow
              label={language === "zh" ? "描述" : "Descriptions"}
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{language === "zh" ? "工作经历" : "Work Experience"}</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label={language === "zh" ? "公司" : "Company"} value={workExperience.company} />
            <TableRow label={language === "zh" ? "职位" : "Job Title"} value={workExperience.jobTitle} />
            <TableRow label={language === "zh" ? "日期" : "Date"} value={workExperience.date} />
            <TableRow
              label={language === "zh" ? "描述" : "Descriptions"}
              value={workExperience.descriptions}
              className={
                workExperiences.length - 1 !== 0 &&
                idx !== workExperiences.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {resume.projects.length > 0 && (
          <TableRowHeader>{language === "zh" ? "项目" : "Projects"}</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label={language === "zh" ? "项目" : "Project"} value={project.project} />
            <TableRow label={language === "zh" ? "日期" : "Date"} value={project.date} />
            <TableRow
              label={language === "zh" ? "描述" : "Descriptions"}
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{language === "zh" ? "技能" : "Skills"}</TableRowHeader>
        <TableRow label={language === "zh" ? "描述" : "Descriptions"} value={skills} />
      </tbody>
    </table>
  );
};
