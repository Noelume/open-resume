import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";
const LOCAL_STORAGE_LANG_KEY = "open-resume-language";

export const loadStateFromLocalStorage = (language?: "zh" | "en") => {
  try {
    let targetLanguage = language;
    if (!targetLanguage) {
      targetLanguage =
        (localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as "zh" | "en") || "zh";
    }

    const key = `open-resume-state-${targetLanguage}`;
    let stringifiedState = localStorage.getItem(key);

    if (!stringifiedState && targetLanguage === "zh") {
      stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    }

    if (!stringifiedState) return undefined;
    return JSON.parse(stringifiedState);
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const language = state.settings.language;
    const key = `open-resume-state-${language}`;
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(key, stringifiedState);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
