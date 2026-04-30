import reducer, {
  changeLanguage,
  initialSettings,
} from "./settingsSlice";

describe("settingsSlice", () => {
  test("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialSettings);
  });

  test("should handle changeLanguage to 'en'", () => {
    const actual = reducer(initialSettings, changeLanguage("en"));
    expect(actual.language).toBe("en");
  });

  test("should handle changeLanguage to 'zh'", () => {
    const actual = reducer(initialSettings, changeLanguage("zh"));
    expect(actual.language).toBe("zh");
  });
});
