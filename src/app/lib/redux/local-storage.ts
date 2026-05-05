import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";
const LOCAL_STORAGE_LANG_KEY = "open-resume-language";

type PersistedState = Pick<RootState, "resume" | "settings">;

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

export const saveStateToLocalStorage = (state: PersistedState) => {
  try {
    const language = state.settings.language;
    const key = `open-resume-state-${language}`;
    const stringifiedState = JSON.stringify({
      resume: state.resume,
      settings: state.settings,
    });
    localStorage.setItem(key, stringifiedState);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
    return true;
  } catch (e) {
    return false;
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
