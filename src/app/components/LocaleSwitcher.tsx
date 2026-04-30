"use client";

import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { switchLanguageAndState, selectLanguage } from "lib/redux/settingsSlice";

export const LocaleSwitcher = () => {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  return (
    <select
      value={language}
      onChange={(e) => dispatch(switchLanguageAndState(e.target.value as "en" | "zh"))}
      className="bg-transparent rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 text-sm font-medium outline-none cursor-pointer"
    >
      <option value="zh">中文</option>
      <option value="en">EN</option>
    </select>
  );
};
