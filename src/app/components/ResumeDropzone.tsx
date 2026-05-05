import { useEffect, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import {
  type ShowForm,
  initialSettings,
  selectLanguage,
} from "lib/redux/settingsSlice";
import { useAppSelector } from "lib/redux/hooks";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";

const MAX_IMPORT_PDF_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const language = useAppSelector(selectLanguage);

  const hasFile = Boolean(file.name);

  useEffect(() => {
    return () => {
      if (file.fileUrl) {
        URL.revokeObjectURL(file.fileUrl);
      }
    };
  }, [file.fileUrl]);

  const validateFile = (newFile?: File) => {
    if (!newFile) {
      return language === "zh" ? "请选择 PDF 文件。" : "Please choose a PDF file.";
    }
    if (!newFile.name.toLowerCase().endsWith(".pdf")) {
      return language === "zh"
        ? "仅支持 PDF 文件。"
        : "Only PDF files are supported.";
    }
    if (newFile.size > MAX_IMPORT_PDF_FILE_SIZE_BYTES) {
      return language === "zh"
        ? "请选择小于 10 MB 的 PDF。"
        : "Please choose a PDF smaller than 10 MB.";
    }
    return "";
  };

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    setErrorMessage("");
    onFileUrlChange(fileUrl);
  };

  const trySetNewFile = (newFile?: File) => {
    const validationError = validateFile(newFile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setNewFile(newFile as File);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    trySetNewFile(event.dataTransfer.files[0]);
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    trySetNewFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onRemove = () => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }
    setFile(defaultFileState);
    setErrorMessage("");
    onFileUrlChange("");
  };

  const onImportClick = async () => {
    if (isImporting) return;
    setIsImporting(true);
    setErrorMessage("");

    try {
      const resume = await parseResumeFromPdf(file.fileUrl);
      const settings = deepClone(initialSettings);

      if (getHasUsedAppBefore()) {
        const sections = Object.keys(settings.formToShow) as ShowForm[];
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: resume.workExperiences.length > 0,
          educations: resume.educations.length > 0,
          projects: resume.projects.length > 0,
          skills: resume.skills.descriptions.length > 0,
          custom: resume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          settings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      const didSave = saveStateToLocalStorage({ resume, settings });
      if (!didSave) {
        setErrorMessage(
          language === "zh"
            ? "解析后的简历太大，浏览器无法保存。请删减部分内容后重试。"
            : "The parsed resume is too large to save in this browser. Please remove some content and try again."
        );
        return;
      }
      router.push("/resume-builder");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : language === "zh"
          ? "无法导入此 PDF，请尝试更小的简历 PDF。"
          : "We could not import this PDF. Please try a smaller resume PDF.";
      setErrorMessage(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6",
        isHoveredOnDropzone && "border-sky-400",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div
        className={cx(
          "text-center",
          playgroundView ? "space-y-2" : "space-y-3"
        )}
      >
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14"
            alt={language === "zh" ? "添加 PDF" : "Add PDF"}
            aria-hidden="true"
            priority
          />
        )}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3 text-gray-700",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              {language === "zh"
                ? "浏览 PDF 文件或将其拖放到此处"
                : "Browse a PDF file or drop it here"}
            </p>
            <p className="flex text-sm text-gray-500">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-gray-400" />
              {language === "zh"
                ? "文件数据仅在本地使用，绝不会离开您的浏览器"
                : "File data is used locally and never leaves your browser"}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-gray-900">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title={language === "zh" ? "移除文件" : "Remove file"}
              onClick={onRemove}
              disabled={isImporting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}
        {errorMessage && (
          <p className="mx-auto max-w-md text-sm text-red-500">
            {errorMessage}
          </p>
        )}
        <div className="pt-4">
          {!hasFile ? (
            <label
              className={cx(
                "within-outline-theme-purple cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm",
                playgroundView ? "border" : "bg-primary"
              )}
            >
              {language === "zh" ? "浏览文件" : "Browse file"}
              <input
                type="file"
                className="sr-only"
                accept=".pdf,application/pdf"
                onChange={onInputChange}
              />
            </label>
          ) : (
            <>
              {!playgroundView && (
                <button
                  type="button"
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onImportClick}
                  disabled={isImporting}
                >
                  {isImporting
                    ? language === "zh"
                      ? "导入中..."
                      : "Importing..."
                    : language === "zh"
                    ? "导入并继续"
                    : "Import and continue"}{" "}
                  <span aria-hidden="true">-&gt;</span>
                </button>
              )}
              <p className={cx("text-gray-500", !playgroundView && "mt-6")}>
                {language === "zh" ? "注意：" : "Note: "}
                {playgroundView
                  ? language === "zh"
                    ? "解析器"
                    : "Parser"
                  : language === "zh"
                  ? "导入功能"
                  : "Import"}
                {language === "zh"
                  ? "在单列简历上效果最佳"
                  : " works best on single column resumes."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
