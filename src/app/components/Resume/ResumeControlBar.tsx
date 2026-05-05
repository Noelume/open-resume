"use client";
import { useEffect, useRef, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppSelector } from "lib/redux/hooks";
import { selectLanguage } from "lib/redux/settingsSlice";

const PDF_GENERATION_DEBOUNCE_MS = 1000;

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const language = useAppSelector(selectLanguage);
  const updateRef = useRef(update);
  const hasInitializedPdf = useRef(false);
  const documentVersion = useRef(0);
  const requestedDocumentVersion = useRef(0);
  const [isPdfStale, setIsPdfStale] = useState(true);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    setIsPdfStale(true);

    if (!hasInitializedPdf.current) {
      hasInitializedPdf.current = true;
      requestedDocumentVersion.current = documentVersion.current;
      return;
    }

    documentVersion.current += 1;

    const timeoutId = window.setTimeout(() => {
      requestedDocumentVersion.current = documentVersion.current;
      updateRef.current();
    }, PDF_GENERATION_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [document]);

  useEffect(() => {
    if (
      !instance.loading &&
      instance.url &&
      !instance.error &&
      requestedDocumentVersion.current === documentVersion.current
    ) {
      setIsPdfStale(false);
    }
  }, [instance.error, instance.loading, instance.url]);

  const canDownload =
    Boolean(instance.url) && !instance.loading && !instance.error && !isPdfStale;
  const downloadText = instance.loading
    ? language === "zh"
      ? "生成中..."
      : "Generating..."
    : instance.error
    ? language === "zh"
      ? "重试 PDF"
      : "Retry PDF"
    : isPdfStale
    ? language === "zh"
      ? "准备下载"
      : "Prepare download"
    : language === "zh"
    ? "下载简历"
    : "Download Resume";
  const handleGeneratePdf = () => {
    setIsPdfStale(true);
    requestedDocumentVersion.current = documentVersion.current;
    updateRef.current();
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">
            {language === "zh" ? "自动缩放" : "Auto scale"}
          </span>
        </label>
      </div>
      {canDownload ? (
        <a
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-8"
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">{downloadText}</span>
        </a>
      ) : (
        <button
          type="button"
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-gray-100 lg:ml-8"
          onClick={handleGeneratePdf}
          disabled={instance.loading}
          title={instance.error || undefined}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">{downloadText}</span>
        </button>
      )}
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
