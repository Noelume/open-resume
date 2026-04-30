"use client";
import { isBold } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import {
  Badge,
  Heading,
  Link,
  Paragraph,
  Table,
} from "components/documentation";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
  TextScores,
} from "lib/parse-resume-from-pdf/types";
import { extractProfile } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

export const ResumeParserAlgorithmArticle = ({
  textItems,
  lines,
  sections,
}: {
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
}) => {
  const language = useAppSelector(selectLanguage);

  const getBadgeContent = (item: TextItem) => {
    const X1 = Math.round(item.x);
    const X2 = Math.round(item.x + item.width);
    const Y = Math.round(item.y);
    let content = `X₁=${X1} X₂=${X2} Y=${Y}`;
    if (X1 === X2) {
      content = `X=${X2} Y=${Y}`;
    }
    if (isBold(item)) {
      content = `${content} ${language === "zh" ? "加粗" : "Bold"}`;
    }
    if (item.hasEOL) {
      content = `${content} ${language === "zh" ? "新行" : "New Line"}`;
    }
    return content;
  };
  const step1TextItemsTable = [
    ["#", language === "zh" ? "文本内容" : "Text Content", language === "zh" ? "元数据" : "Metadata"],
    ...textItems.map((item, idx) => [
      idx + 1,
      item.text,
      <Badge key={idx}>{getBadgeContent(item)}</Badge>,
    ]),
  ];

  const step2LinesTable = [
    [language === "zh" ? "行" : "Line", language === "zh" ? "行内容" : "Line Content"],
    ...lines.map((line, idx) => [
      idx + 1,
      line.map((item, idx) => (
        <span key={idx}>
          {item.text}
          {idx !== line.length - 1 && (
            <span className="select-none font-extrabold text-sky-400">
              &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
            </span>
          )}
        </span>
      )),
    ]),
  ];

  const { profile, profileScores } = extractProfile(sections);
  const Scores = ({ scores }: { scores: TextScores }) => {
    return (
      <>
        {scores
          .sort((a, b) => b.score - a.score)
          .map((item, idx) => (
            <span key={idx} className="break-all">
              <Badge>{item.score}</Badge> {item.text}
              <br />
            </span>
          ))}
      </>
    );
  };
  const step4ProfileFeatureScoresTable = [
    [
      language === "zh" ? "简历属性" : "Resume Attribute",
      language === "zh" ? "文本（最高特征分数）" : "Text (Highest Feature Score)",
      language === "zh" ? "其他文本的特征分数" : "Feature Scores of Other Texts",
    ],
    [language === "zh" ? "姓名" : "Name", profile.name, <Scores key={"Name"} scores={profileScores.name} />],
    [
      language === "zh" ? "电子邮件" : "Email",
      profile.email,
      <Scores key={"Email"} scores={profileScores.email} />,
    ],
    [
      language === "zh" ? "电话" : "Phone",
      profile.phone,
      <Scores key={"Phone"} scores={profileScores.phone} />,
    ],
  ];

  return (
    <article className="mt-10">
      <Heading className="text-primary !mt-0 border-t-2 pt-8">
        {language === "zh" ? "简历解析算法深入探讨" : "Resume Parser Algorithm Deep Dive"}
      </Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "对于对技术好奇的人，本节将深入探讨 OpenResume 解析器算法，并逐步介绍其工作原理的 4 个步骤。（请注意，该算法旨在解析英文单列简历）"
          : "For the technically curious, this section dives deep into the OpenResume parser algorithm and walks through the 4 steps of how it works. (Note that the algorithm is designed to parse English single-column resumes)"}
      </Paragraph>
      {/* Step 1. Read the text items from a PDF file */}
      <Heading level={2}>{language === "zh" ? "步骤 1. 从 PDF 文件中读取文本项" : "Step 1. Read the text items from a PDF file"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh" ? "PDF 文件是由 " : "A PDF file is a standardized file format defined by the "}
        <Link href="https://www.iso.org/standard/51502.html">
          {language === "zh" ? "ISO 32000 规范" : "ISO 32000 specification"}
        </Link>
        {language === "zh"
          ? "定义的标准化文件格式。当您使用文本编辑器打开 PDF 文件时，您会注意到原始内容看起来是经过编码的，难以阅读。要以可读格式显示它，您需要一个 PDF 阅读器来解码和查看该文件。同样，简历解析器首先需要解码 PDF 文件以提取其文本内容。"
          : ". When you open a PDF file with a text editor, you will notice the raw content looks encoded and unreadable. To display it in a readable format, you need a PDF reader to decode and view the file. Similarly, the resume parser first needs to decode the PDF file to extract its text content."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "虽然可以按照 ISO 32000 规范编写自定义的 PDF 阅读器功能，但利用现有库要简单得多。在这种情况下，简历解析器使用 Mozilla 的开源 "
          : "While it is possible to write a custom PDF reader function following the ISO 32000 specification, it is much simpler to leverage an existing library. In this case, the resume parser uses Mozilla's open-source "}
        <Link href="https://github.com/mozilla/pdf.js">pdf.js</Link> {language === "zh" ? "库首先提取文件中的所有文本项。" : " library to first extract all the text items from the file."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? `下表列出了从添加的简历 PDF 中提取的 ${textItems.length} 个文本项。文本项包含文本内容以及有关该内容的一些元数据，例如其在文档中的 x、y 位置、字体是否加粗或是否开始新行。（请注意，x、y 位置是相对于页面左下角的，即原点 0,0）`
          : `The table below lists the ${textItems.length} text items extracted from the added resume PDF. A text item contains the text content and some metadata about the content, such as its x, y position in the document, whether the font is bolded, or whether it starts a new line. (Note that the x, y position is relative to the bottom left corner of the page, which is the origin 0,0)`}
      </Paragraph>
      <div className="mt-4 max-h-72 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table
          table={step1TextItemsTable}
          className="!border-none"
          tdClassNames={["", "", "md:whitespace-nowrap"]}
        />
      </div>
      {/* Step 2. Group text items into lines */}
      <Heading level={2}>{language === "zh" ? "步骤 2. 将文本项分组为行" : "Step 2. Group text items into lines"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh" ? "提取的文本项尚未准备好使用，主要存在 2 个问题：" : "The extracted text items are not yet ready to be used, mainly due to 2 issues:"}
      </Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          {language === "zh" ? "问题 1：它们有一些不需要的噪音。" : "Issue 1: They have some unwanted noise."}
        </span>
        {language === "zh"
          ? "一些单个文本项可能会被分解成多个文本项，正如您在上面的表格中观察到的那样，例如电话号码 \"(123) 456-7890\" 可能会被分解为 3 个文本项 \"(123) 456\"、\"-\" 和 \"7890\"。"
          : 'Some single text items might be broken down into multiple text items, as you can observe in the table above, e.g., the phone number "(123) 456-7890" might be broken down into 3 text items "(123) 456", "-", and "7890".'}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">{language === "zh" ? "解决方案：" : "Solution:"}</span> {language === "zh" ? "为了解决这个问题，如果相邻文本项的距离小于平均典型字符宽度，简历解析器会将它们连接成一个文本项，其中" : "To solve this, the resume parser joins adjacent text items into one if their distance is less than the average typical character width, where"}
        <span
          dangerouslySetInnerHTML={{
            __html: `<math display="block">
                        <mrow>
                            <mn>${language === "zh" ? "距离 " : "Distance "}</mn>
                            <mo>=</mo>
                            <mn>${language === "zh" ? "右侧文本项X₁" : "Right Text Item X₁"}</mn>
                            <mo>-</mo>
                            <mn>${language === "zh" ? "左侧文本项X₂" : "Left Text Item X₂"}</mn>
                        </mrow>
                    </math>`,
          }}
          className="my-2 block text-left text-base"
        />
        {language === "zh"
          ? "平均典型字符宽度是通过将所有文本项的宽度总和除以文本项的总字符数来计算的（排除加粗文本和换行元素，以免影响结果）。"
          : "The average typical character width is calculated by dividing the sum of all text items' widths by the total number of characters in the text items (excluding bolded text and new line elements to avoid skewing the result)."}
      </Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          {language === "zh" ? "问题 2：它们缺乏上下文和关联。" : "Issue 2: They lack context and association."}
        </span>
        {language === "zh"
          ? "当我们阅读简历时，我们会逐行扫描。我们的大脑可以通过文本的粗细和接近程度等视觉线索来处理每个部分，我们可以快速将靠得更近的文本关联为一个相关组。然而，提取的文本项目前没有这些上下文/关联，只是脱节的元素。"
          : "When we read a resume, we scan it line by line. Our brain can process each section through visual cues like text thickness and proximity, and we can quickly associate texts that are closer together as a related group. However, the extracted text items currently have no such context/association and are just disjointed elements."}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">{language === "zh" ? "解决方案：" : "Solution:"}</span> {language === "zh" ? "为了解决这个问题，简历解析器重建了这些上下文和关联，类似于我们大脑阅读和处理简历的方式。它首先将文本项分组为行，因为我们逐行阅读文本。然后它将行分组为部分，这将在下一步中讨论。" : "To solve this, the resume parser reconstructs these contexts and associations, similar to how our brain reads and processes a resume. It first groups the text items into lines, as we read text line by line. Then it groups the lines into sections, which will be discussed in the next step."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? `在步骤 2 结束时，简历解析器从添加的简历 PDF 中提取了 ${lines.length} 行，如下表所示。当以行显示时，结果更具可读性。（有些行可能有多个文本项，它们由蓝色垂直分隔符分隔 `
          : `At the end of Step 2, the resume parser has extracted ${lines.length} lines from the added resume PDF, as shown in the table below. The result is much more readable when displayed in lines. (Some lines might have multiple text items, which are separated by a blue vertical divider `}
        <span className="select-none font-extrabold text-sky-400">
          &nbsp;{"|"}&nbsp;
        </span>
        {language === "zh" ? "）" : ")"}
      </Paragraph>
      <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table table={step2LinesTable} className="!border-none" />
      </div>
      {/* Step 3. Group lines into sections */}
      <Heading level={2}>{language === "zh" ? "步骤 3. 将行分组为部分" : "Step 3. Group lines into sections"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "在步骤 2 中，简历解析器首先将文本项分组为行，开始构建文本项的上下文和关联。步骤 3 继续该过程，通过将行分组为部分来构建其他关联。"
          : "In Step 2, the resume parser started building the context and association of the text items by first grouping them into lines. Step 3 continues the process to build other associations by grouping the lines into sections."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "请注意，每个部分（个人资料部分除外）都以占据整行的部分标题开始。这不仅在简历中，而且在书籍和博客中也是一种常见的模式。简历解析器使用此模式将行分组到这些行上方最近的部分标题中。"
          : "Notice that every section (except the profile section) starts with a section title that occupies the entire line. This is a common pattern not only in resumes but also in books and blogs. The resume parser uses this pattern to group lines into the nearest section title above those lines."}
      </Paragraph>
      <Paragraph>
        {language === "zh" ? "简历解析器应用一些启发式方法来检测部分标题。确定部分标题的主要启发式方法是检查它是否满足以下所有 3 个条件：" : "The resume parser applies some heuristics to detect section titles. The primary heuristic to determine a section title is to check if it meets all 3 of the following conditions:"}<br />
        {language === "zh" ? "1. 它是行中唯一的文本项" : "1. It is the only text item in the line"} <br />
        {language === "zh" ? "2. 它是" : "2. It is "}<span className="font-bold">{language === "zh" ? "加粗的" : "bolded"}</span> <br />
        {language === "zh" ? "3. 它的字母全部大写" : "3. Its letters are all uppercase"}
        <br />
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "简而言之，如果一个文本项被双重强调为既加粗又大写，它很可能是简历中的部分标题。对于格式良好的简历来说，通常是这样。可能会有例外，但在这些情况下，可能没有很好地使用加粗和大写。"
          : "In short, if a text item is double-emphasized as both bolded and uppercase, it is highly likely to be a section title in a resume. This is generally true for well-formatted resumes. There might be exceptions, but in those cases, bolding and uppercase might not have been used well."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "如果主要启发式方法不适用，简历解析器还有一个后备启发式方法。后备启发式方法主要针对常见简历部分标题关键字列表执行关键字匹配。"
          : "If the primary heuristic does not apply, the resume parser also has a fallback heuristic. The fallback heuristic mainly performs keyword matching against a list of common resume section title keywords."}
      </Paragraph>
      <Paragraph>
        {language === "zh" ? "在步骤 3 结束时，简历解析器从简历中识别出各个部分，并将这些行与相关的部分标题分组，如下表所示。请注意， " : "At the end of Step 3, the resume parser has identified the sections from the resume and grouped the lines with the associated section titles, as shown in the table below. Notice that "}
        <span className="font-bold">{language === "zh" ? "部分标题已加粗" : "section titles are bolded"}</span> {language === "zh" ? "并且 " : "and "}
        <span className="bg-teal-50">
          {language === "zh" ? "与该部分关联的行以相同的颜色突出显示" : "lines associated with the section are highlighted in the same color"}
        </span>
        。
      </Paragraph>
      <Step3SectionsTable sections={sections} />
      {/* Step 4. Extract resume from sections */}
      <Heading level={2}>{language === "zh" ? "步骤 4. 从部分中提取简历" : "Step 4. Extract resume from sections"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "步骤 4 是简历解析过程的最后一步，也是简历解析器的核心，它从各个部分中提取简历信息。"
          : "Step 4 is the final step of the resume parsing process and the core of the resume parser, where it extracts the resume information from the sections."}
      </Paragraph>
      <Heading level={3}>{language === "zh" ? "特征评分系统" : "Feature Scoring System"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "提取引擎的要点是特征评分系统。要提取的每个简历属性都有一个自定义特征集，其中每个特征集由一个特征匹配函数和一个匹配时的特征匹配分数组成（特征匹配分数可以是正数或负数）。要计算特定简历属性的文本项的最终特征分数，它将通过其所有特征集运行该文本项并汇总匹配的特征分数。对该部分内的所有文本项执行此过程，计算出的特征分数最高的文本项被识别为提取的简历属性。"
          : "The gist of the extraction engine is the feature scoring system. Each resume attribute to be extracted has a custom feature set, where each feature set consists of a feature matching function and a feature matching score when matched (the feature matching score can be positive or negative). To calculate the final feature score of a text item for a specific resume attribute, it runs the text item through all its feature sets and sums up the matched feature scores. This process is performed for all text items within the section, and the text item with the highest calculated feature score is identified as the extracted resume attribute."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "作为演示，下表显示了添加的简历 PDF 的个人资料部分中的 3 个简历属性。"
          : "As a demonstration, the table below shows 3 resume attributes in the profile section of the added resume PDF."}
      </Paragraph>
      <Table table={step4ProfileFeatureScoresTable} className="mt-4" />
      {(profileScores.name.find((item) => item.text === profile.name)?.score ||
        0) > 0 && (
        <Paragraph smallMarginTop={true}>
          {language === "zh" ? "在添加的简历 PDF 中，简历属性名称很可能是 \"" : "In the added resume PDF, the resume attribute name is highly likely to be \""}
          {profile.name}{language === "zh" ? "\"，因为它的特征分数是 " : "\", because its feature score is "}
          {profileScores.name.find((item) => item.text === profile.name)?.score}
          {language === "zh"
            ? "，这是个人资料部分中所有文本项中最高的特征分数。（某些文本项的特征分数可能为负，表明它们极不可能是目标属性）"
            : ", which is the highest feature score among all text items in the profile section. (Some text items might have negative feature scores, indicating they are highly unlikely to be the target attribute)"}
        </Paragraph>
      )}
      <Heading level={3}>{language === "zh" ? "特征集" : "Feature Sets"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh" ? "解释了特征评分系统后，我们可以更深入地探讨如何为简历属性构建特征集。它遵循 2 个原则：" : "Having explained the feature scoring system, we can dive deeper into how the feature sets are constructed for a resume attribute. It follows 2 principles:"}<br />
        {language === "zh" ? "1. 简历属性的特征集是相对于同一部分内的所有其他简历属性设计的。" : "1. The feature sets of a resume attribute are designed relative to all other resume attributes within the same section."}<br />
        {language === "zh" ? "2. 简历属性的特征集是根据其特征和每个特征的可能性手动制作的。" : "2. The feature sets of a resume attribute are manually crafted based on its characteristics and the likelihood of each characteristic."}
      </Paragraph>
      <Paragraph>
        {language === "zh"
          ? "下表列出了简历属性名称的一些特征集。它包含以正特征分数匹配名称属性的特征函数，以及仅以负特征分数匹配该部分中其他简历属性的特征函数。"
          : "The table below lists some feature sets for the resume attribute name. It contains feature functions that match the name attribute with positive feature scores, as well as feature functions that only match other resume attributes in the section with negative feature scores."}
      </Paragraph>
      <Table
        table={getStep4NameFeatureSetsTable(language)}
        title={language === "zh" ? "名称特征集" : "Name Feature Sets"}
        className="mt-4"
      />
      <Heading level={3}>{language === "zh" ? "核心特征函数" : "Core Feature Functions"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "每个简历属性都有多个特征集。它们可以在 extract-resume-from-sections 文件夹下的源代码中找到，我们不会在这里全部列出。每个简历属性通常都有一个核心特征函数，可以很好地识别它们，因此我们将在下面列出核心特征函数。"
          : "Each resume attribute has multiple feature sets. They can be found in the source code under the extract-resume-from-sections folder, and we will not list all of them here. Each resume attribute usually has a core feature function that identifies them well, so we will list the core feature functions below."}
      </Paragraph>
      <Table table={getStep4CoreFeatureFunctionTable(language)} className="mt-4" />
      <Heading level={3}>{language === "zh" ? "特殊情况：子部分" : "Special Case: Subsections"}</Heading>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "最后值得一提的是子部分。对于个人资料部分，我们可以直接将所有文本项传递给特征评分系统。但是对于其他部分，例如教育和工作经历，我们必须首先将该部分划分为子部分，因为该部分中可能有多个学校或工作经历。然后，特征评分系统处理每个子部分以检索每个子部分的简历属性并附加结果。"
          : "Lastly, it is worth mentioning subsections. For the profile section, we can directly pass all text items to the feature scoring system. But for other sections, such as education and work experience, we must first divide the section into subsections, because there might be multiple schools or work experiences in the section. Then, the feature scoring system processes each subsection to retrieve the resume attributes for each subsection and appends the results."}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        {language === "zh"
          ? "简历解析器应用一些启发式方法来检测子部分。确定子部分的主要启发式方法是检查 2 行之间的垂直行间距是否大于典型行间距 * 1.4，因为格式良好的简历通常会在添加下一个子部分之前创建一个新的空换行符。如果主要启发式方法不适用，还有一个后备启发式方法来检查文本项是否加粗。"
          : "The resume parser applies some heuristics to detect subsections. The primary heuristic to determine a subsection is to check if the vertical line spacing between 2 lines is greater than the typical line spacing * 1.4, because a well-formatted resume usually creates a new empty line break before adding the next subsection. If the primary heuristic does not apply, there is also a fallback heuristic to check if the text item is bolded."}
      </Paragraph>
      <Paragraph>
        {language === "zh" ? "这就是关于 OpenResume 解析器算法的全部内容 :)" : "That's all about the OpenResume parser algorithm :)"}
      </Paragraph>
      <Paragraph>
        {language === "zh" ? "作者：" : "Author: "}<Link href="https://github.com/xitanggg">Xitang</Link>{language === "zh" ? "，2023 年 6 月" : ", June 2023"}
      </Paragraph>
    </article>
  );
};

const getStep4NameFeatureSetsTable = (language: string) => [
  [language === "zh" ? "特征函数" : "Feature Function", language === "zh" ? "特征匹配分数" : "Feature Matching Score"],
  [language === "zh" ? "仅包含字母、空格或句号" : "Contains only letters, spaces, or periods", "+3"],
  [language === "zh" ? "已加粗" : "Is bolded", "+2"],
  [language === "zh" ? "包含所有大写字母" : "Contains all uppercase letters", "+2"],
  [language === "zh" ? "包含 @" : "Contains @", language === "zh" ? "-4 (匹配电子邮件)" : "-4 (Matches email)"],
  [language === "zh" ? "包含数字" : "Contains numbers", language === "zh" ? "-4 (匹配电话)" : "-4 (Matches phone)"],
  [language === "zh" ? "包含 ," : "Contains ,", language === "zh" ? "-4 (匹配地址)" : "-4 (Matches address)"],
  [language === "zh" ? "包含 /" : "Contains /", language === "zh" ? "-4 (匹配 url)" : "-4 (Matches url)"],
];

const getStep4CoreFeatureFunctionTable = (language: string) => [
  [language === "zh" ? "简历属性" : "Resume Attribute", language === "zh" ? "核心特征函数" : "Core Feature Function", language === "zh" ? "正则表达式" : "Regex"],
  [language === "zh" ? "姓名" : "Name", language === "zh" ? "仅包含字母、空格或句号" : "Contains only letters, spaces, or periods", "/^[a-zA-Z\\s\\.]+$/"],
  [
    language === "zh" ? "电子邮件" : "Email",
    language === "zh" ? (
      <>
        匹配电子邮件格式 xxx@xxx.xxx
        <br />
        xxx 可以是任何非空格字符
      </>
    ) : (
      <>
        Matches email format xxx@xxx.xxx
        <br />
        xxx can be any non-space character
      </>
    ),
    "/\\S+@\\S+\\.\\S+/",
  ],
  [
    language === "zh" ? "电话" : "Phone",
    language === "zh" ? (
      <>
        匹配电话格式 (xxx)-xxx-xxxx <br /> () 和 - 是可选的
      </>
    ) : (
      <>
        Matches phone format (xxx)-xxx-xxxx <br /> () and - are optional
      </>
    ),
    "/\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}/",
  ],
  [
    language === "zh" ? "地点" : "Location",
    language === "zh" ? <>匹配城市和州格式 {"City, ST"}</> : <>Matches city and state format {"City, ST"}</>,
    "/[A-Z][a-zA-Z\\s]+, [A-Z]{2}/",
  ],
  [language === "zh" ? "Url" : "Url", language === "zh" ? "匹配 url 格式 xxx.xxx/xxx" : "Matches url format xxx.xxx/xxx", "/\\S+\\.[a-z]+\\/\\S+/"],
  [language === "zh" ? "学校" : "School", language === "zh" ? "包含学校关键字，例如 College, University, School" : "Contains school keywords, e.g., College, University, School", ""],
  [language === "zh" ? "学位" : "Degree", language === "zh" ? "包含学位关键字，例如 Associate, Bachelor, Master" : "Contains degree keywords, e.g., Associate, Bachelor, Master", ""],
  [language === "zh" ? "GPA" : "GPA", language === "zh" ? "匹配 GPA 格式 x.xx" : "Matches GPA format x.xx", "/[0-4]\\.\\d{1,2}/"],
  [
    language === "zh" ? "日期" : "Date",
    language === "zh" ? "包含与年、月、季节或单词 Present 相关的日期关键字" : "Contains date keywords related to year, month, season, or the word Present",
    "Year: /(?:19|20)\\d{2}/",
  ],
  [
    language === "zh" ? "职位" : "Job Title",
    language === "zh" ? "包含职位关键字，例如 Analyst, Engineer, Intern" : "Contains job title keywords, e.g., Analyst, Engineer, Intern",
    "",
  ],
  [language === "zh" ? "公司" : "Company", language === "zh" ? "已加粗或不匹配职位和日期" : "Is bolded or does not match job title and date", ""],
  [language === "zh" ? "项目" : "Project", language === "zh" ? "已加粗或不匹配日期" : "Is bolded or does not match date", ""],
];

const Step3SectionsTable = ({
  sections,
}: {
  sections: ResumeSectionToLines;
}) => {
  const language = useAppSelector(selectLanguage);
  const table: React.ReactNode[][] = [[language === "zh" ? "行" : "Line", language === "zh" ? "行内容" : "Line Content"]];
  const trClassNames = [];
  let lineCounter = 0;
  const BACKGROUND_COLORS = [
    "bg-red-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-blue-50",
    "bg-purple-50",
  ] as const;
  const sectionsEntries = Object.entries(sections);

  const Line = ({ line }: { line: Line }) => {
    return (
      <>
        {line.map((item, idx) => (
          <span key={idx}>
            {item.text}
            {idx !== line.length - 1 && (
              <span className="select-none font-extrabold text-sky-400">
                &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  for (let i = 0; i < sectionsEntries.length; i++) {
    const sectionBackgroundColor = BACKGROUND_COLORS[i % 6];
    const [sectionTitle, lines] = sectionsEntries[i];
    table.push([
      sectionTitle === "profile" ? "" : lineCounter,
      sectionTitle === "profile" ? (language === "zh" ? "个人资料" : "Profile") : sectionTitle,
    ]);
    trClassNames.push(`${sectionBackgroundColor} font-bold`);
    lineCounter += 1;
    for (let j = 0; j < lines.length; j++) {
      table.push([lineCounter, <Line key={lineCounter} line={lines[j]} />]);
      trClassNames.push(sectionBackgroundColor);
      lineCounter += 1;
    }
  }

  return (
    <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
      <Table
        table={table}
        className="!border-none"
        trClassNames={trClassNames}
      />
    </div>
  );
};
