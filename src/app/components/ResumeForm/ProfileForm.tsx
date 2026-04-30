import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { selectLanguage } from "lib/redux/settingsSlice";
import { ResumeProfile } from "lib/redux/types";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);
  const { name, email, phone, url, summary, location } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label={language === 'zh' ? '姓名' : 'Name'}
          labelClassName="col-span-full"
          name="name"
          placeholder={language === 'zh' ? '张三' : 'Jane Doe'}
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label={language === 'zh' ? '求职意向' : 'Summary'}
          labelClassName="col-span-full"
          name="summary"
          placeholder={language === 'zh' ? '致力于让所有人都能免费接受教育的企业家和教育工作者' : 'Entrepreneur and educator dedicated to providing a free, world-class education for anyone, anywhere.'}
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label={language === 'zh' ? '邮箱' : 'Email'}
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label={language === 'zh' ? '电话' : 'Phone'}
          labelClassName="col-span-2"
          name="phone"
          placeholder={language === 'zh' ? '13812345678' : '(123)456-7890'}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={language === 'zh' ? '个人网站' : 'Website'}
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={language === 'zh' ? '所在地' : 'Location'}
          labelClassName="col-span-2"
          name="location"
          placeholder={language === 'zh' ? '北京' : 'New York, NY'}
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
