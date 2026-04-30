"use client";
import { Link } from "components/documentation";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export const QuestionsAndAnswers = () => {
  const language = useAppSelector(selectLanguage);

  const QAS = [
    {
      question: language === "zh" ? "Q1. 什么是简历生成器？为什么简历生成器比简历模板文档更好？" : "Q1. What is a resume builder? And why is a resume builder better than a resume template doc?",
      answer: (
        <>
          <p>
            {language === "zh" ? "今天有两种创建简历的方法。一种选择是使用简历模板，例如 Office/Google 文档，并根据您的需求进行自定义。另一种选择是使用简历生成器，这是一种在线工具，允许您输入信息并自动为您生成简历。" : "There are two ways to create a resume today. One option is to use a resume template, such as an Office/Google doc, and customize it to your needs. The other option is to use a resume builder, an online tool that allows you to input your information and automatically generates a resume for you."}
          </p>
          <p>
            {language === "zh" ? "使用简历模板需要手动进行格式化工作，例如复制和粘贴文本部分以及调整间距，这既耗时又容易出错。很容易遇到格式问题，例如在复制和粘贴后使用不同的要点或字体样式。另一方面，像 OpenResume 这样的简历生成器通过自动格式化简历来节省时间并防止格式错误。它还提供了只需简单点击即可轻松更改字体类型或大小的便利。总之，与简历模板相比，简历生成器更易于使用。" : "Using a resume template requires manual formatting work, such as copying and pasting text sections and adjusting spacing, which can be time-consuming and error-prone. It is easy to run into formatting issues, such as using different bullet points or font styles after copying and pasting. On the other hand, a resume builder like OpenResume saves time and prevents formatting errors by automatically formatting the resume. It also offers the convenience of easily changing font types or sizes with a simple click. In summary, a resume builder is much easier to use compared to a resume template."}
          </p>
        </>
      ),
    },
    {
      question: language === "zh" ? "Q2. 是什么让 OpenResume 区别于其他简历生成器和模板？" : "Q2. What makes OpenResume different from other resume builders and templates?",
      answer: (
        <>
          <p>
            {language === "zh" ? "除了 OpenResume 之外，还有一些很棒的免费简历生成器，例如" : "There are some great free resume builders out there besides OpenResume, such as"} <Link href="https://rxresu.me/">Reactive Resume</Link>{language === "zh" ? "、" : ", "}
            <Link href="https://flowcv.com/">FlowCV</Link>{language === "zh" ? "。然而，OpenResume 以 2 个独特的特点脱颖而出：" : ". However, OpenResume stands out with 2 unique features:"}
          </p>{" "}
          <p>
            <span className="font-semibold">
              {language === "zh" ? "1. OpenResume 专为美国就业市场和最佳实践而设计。" : "1. OpenResume is designed specifically for the US job market and best practices."}
            </span>
            <br />
            {language === "zh" ? "与其他面向全球受众并提供许多自定义选项的简历生成器不同，OpenResume 故意只提供符合美国最佳实践的选项。例如，它排除了添加个人资料照片的选项，以避免偏见和歧视。它只提供核心部分，例如个人资料、工作经验、教育和技能，同时省略了推荐人等不必要的部分。此外，OpenResume 只提供自上而下的单列简历设计，而不是双列设计，因为单列设计最适合 ATS。" : "Unlike other resume builders that cater to a global audience and offer many customization options, OpenResume intentionally only provides options that are aligned with US best practices. For example, it excludes the option to add a profile picture to avoid bias and discrimination. It only provides core sections like profile, work experience, education, and skills, while omitting unnecessary sections like references. Furthermore, OpenResume only offers a top-down single column resume design as opposed to two column design, because single column design is the best for ATS."}<br />{" "}
          </p>
          <p>
            <span className="font-semibold">
              {language === "zh" ? "2. OpenResume 非常注重隐私。" : "2. OpenResume is highly privacy-focused."}
            </span>{" "}
            <br />
            {language === "zh" ? "虽然其他简历生成器可能需要电子邮件注册并将用户数据存储在其数据库中，但 OpenResume 认为简历数据应保持私密，并且只能在用户的本地机器上访问。因此，OpenResume 不需要注册即可使用该应用程序，并且所有输入的数据都存储在用户的浏览器中，只有用户可以访问。" : "While other resume builders may require email sign up and store user data in their databases, OpenResume believes that resume data should remain private and accessible only on the user's local machine. Therefore, OpenResume does not require sign up to use the app, and all inputted data is stored in the user's browser, accessible only to the user."}
          </p>
        </>
      ),
    },
    {
      question: language === "zh" ? "Q3. 谁创建了 OpenResume，为什么？" : "Q3. Who created OpenResume and why?",
      answer: (
        <p>
          {language === "zh" ? "OpenResume 由" : "OpenResume is created by"}{" "}
          <Link href="https://github.com/xitanggg">Xitang Zhao</Link> {language === "zh" ? "创建，并由" : "and designed by"} <Link href="https://www.linkedin.com/in/imzhi">Zhigang Wen</Link> {language === "zh" ? "设计，作为一个周末项目。作为美国的移民，我们在创建第一份简历以及申请实习和工作时犯了许多错误。我们花了很长时间才学到一些最佳实践。在指导第一代学生并审查他们的简历时，我们注意到学生们正在犯我们以前犯过的同样错误。这让我们思考如何利用我们获得的知识和技能提供帮助。我们开始在周末聊天和工作，这促成了 OpenResume 的诞生，我们将最佳实践和我们的知识整合到这个简历生成器中。我们希望 OpenResume 能够帮助任何人轻松创建遵循最佳实践的现代专业简历，并使任何人都能充满信心地申请工作。" : "as a weekend project. As immigrants to the US, we made many mistakes when creating our first resumes and applying for internships and jobs. It took us a long time to learn some of the best practices. When mentoring first-generation students and reviewing their resumes, we noticed that students were making the same mistakes we had made before. This led us to think about how we could help using the knowledge and skills we had acquired. We started chatting and working on weekends, which led to the creation of OpenResume, where we integrated best practices and our knowledge into this resume builder. We hope that OpenResume can help anyone easily create a modern professional resume that follows best practices and enable anyone to apply for jobs with confidence."}
        </p>
      ),
    },
    {
      question: language === "zh" ? "Q4. 我该如何支持 OpenResume？" : "Q4. How can I support OpenResume?",
      answer: (
        <>
          <p>
            {language === "zh" ? "支持 OpenResume 的最佳方式是与我们分享您的想法和反馈，以帮助进一步改进它。您可以发送电子邮件至" : "The best way to support OpenResume is to share your thoughts and feedback with us to help further improve it. You can send an email to"}{" "}
            <Link href="mailto:hello@open-resume.com">hello@open-resume.com</Link>{" "}
            {language === "zh" ? "或在我们的 Github 仓库中" : "or"}{" "}
            <Link href="https://github.com/xitanggg/open-resume/issues/new">
              {language === "zh" ? "提出 issue" : "raise an issue"}
            </Link>
            {language === "zh" ? "。无论您是否喜欢它，我们都很乐意听取您的意见。" : " in our Github repository. We would love to hear from you whether you like it or not."}
          </p>
          <p>
            {language === "zh" ? "支持 OpenResume 的另一种好方法是宣传。与您的朋友、在社交媒体平台上或与您学校的职业中心分享它。我们的目标是接触更多在创建简历方面遇到困难的人，我们将非常感激您的口碑支持。如果您使用 Github，您也可以通过" : "Another great way to support OpenResume is by spreading the word. Share it with your friends, on social media platforms, or with your school's career center. Our goal is to reach more people who are struggling with creating their resumes, and we would greatly appreciate your word-of-mouth support. If you use Github, you can also show your support by"}{" "}
            <Link href="https://github.com/xitanggg/open-resume">
              {language === "zh" ? "给项目点赞 (star)" : "giving the project a star"}
            </Link>{" "}
            {language === "zh" ? "来表达您的支持，以帮助提高其知名度和影响力。" : "to help increase its visibility and reach."}
          </p>
        </>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-3xl divide-y divide-gray-300 lg:mt-4 lg:px-2">
      <h2 className="text-center text-3xl font-bold">{language === "zh" ? "常见问题与解答" : "Questions & Answers"}</h2>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6">
            <h3 className="font-semibold leading-7">{question}</h3>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
