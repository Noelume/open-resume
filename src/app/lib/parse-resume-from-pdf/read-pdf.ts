// Getting pdfjs to work is tricky. The following 3 lines would make it work
// https://stackoverflow.com/a/63486898/7699841
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";
import type { TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

export const MAX_PDF_PAGES_TO_PARSE = 10;
export const MAX_PDF_TEXT_ITEMS_TO_PARSE = 10000;

export type ReadPdfOptions = {
  maxPages?: number;
  maxTextItems?: number;
};

/**
 * Step 1: Read pdf and output textItems by concatenating results from each page.
 *
 * To make processing easier, it returns a new TextItem type, which removes unused
 * attributes (dir, transform), adds x and y positions, and replaces loaded font
 * name with original font name.
 *
 * @example
 * const onFileChange = async (e) => {
 *     const fileUrl = URL.createObjectURL(e.target.files[0]);
 *     const textItems = await readPdf(fileUrl);
 * }
 */
export const readPdf = async (
  fileUrl: string,
  options: ReadPdfOptions = {}
): Promise<TextItems> => {
  const maxPages = options.maxPages ?? MAX_PDF_PAGES_TO_PARSE;
  const maxTextItems = options.maxTextItems ?? MAX_PDF_TEXT_ITEMS_TO_PARSE;
  const pdfFile = await pdfjs.getDocument(fileUrl).promise;
  let textItems: TextItems = [];

  try {
    if (pdfFile.numPages > maxPages) {
      throw new Error(
        `PDF has ${pdfFile.numPages} pages. Please import a resume with ${maxPages} pages or fewer.`
      );
    }

    for (let i = 1; i <= pdfFile.numPages; i++) {
      const page = await pdfFile.getPage(i);
      const textContent = await page.getTextContent();

      await page.getOperatorList();
      const commonObjs = page.commonObjs;

      const pageTextItems = textContent.items.map((item) => {
        const {
          str: text,
          dir,
          transform,
          fontName: pdfFontName,
          ...otherProps
        } = item as PdfjsTextItem;
        void dir;

        const x = transform[4];
        const y = transform[5];
        const fontObj = commonObjs.get(pdfFontName);
        const fontName = fontObj.name;
        const newText = text.replace(/-\u00ad/g, "-");

        return {
          ...otherProps,
          fontName,
          text: newText,
          x,
          y,
        };
      });

      textItems.push(...pageTextItems);
      page.cleanup();

      if (textItems.length > maxTextItems) {
        throw new Error(
          "PDF has too much text to import safely. Please import a shorter resume."
        );
      }
    }

    const isEmptySpace = (textItem: TextItem) =>
      !textItem.hasEOL && textItem.text.trim() === "";
    textItems = textItems.filter((textItem) => !isEmptySpace(textItem));

    return textItems;
  } finally {
    pdfFile.destroy();
  }
};
