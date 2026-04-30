import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import { selectLanguage } from "lib/redux/settingsSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText={language === 'zh' ? '添加工作' : 'Add Job'}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={language === 'zh' ? '删除工作' : 'Delete job'}
          >
            <Input
              label={language === 'zh' ? '公司' : 'Company'}
              labelClassName="col-span-full"
              name="company"
              placeholder={language === 'zh' ? '可汗学院' : 'Khan Academy'}
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label={language === 'zh' ? '职位' : 'Job Title'}
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder={language === 'zh' ? '软件工程师' : 'Software Engineer'}
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label={language === 'zh' ? '日期' : 'Date'}
              labelClassName="col-span-2"
              name="date"
              placeholder={language === 'zh' ? '2022年6月 - 至今' : 'Jun 2022 - Present'}
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <BulletListTextarea
              label={language === 'zh' ? '描述' : 'Description'}
              labelClassName="col-span-full"
              name="descriptions"
              placeholder={language === 'zh' ? '要点' : 'Bullet points'}
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
