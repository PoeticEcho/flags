import anthemData from "./anthem-data.json" with { type: "json" };

export { anthemData };

export function getAnthemInfo(country, language = "ko") {
  if (!country) return null;
  const entry = anthemData[country.code];
  if (!entry) {
    return {
      isPolar: true,
      title: language === "ko" ? "공식 국가 없음" : "No official national anthem",
      subtitle:
        language === "ko"
          ? "남극은 나라가 아닌 대륙이어서 공식 국가가 없어요"
          : "Antarctica is a continent, so it has no official anthem",
      audioUrl: "",
      youtubeUrl: "",
    };
  }
  const ko = language === "ko";
  const title = ko ? entry.titleKo || entry.title : entry.title;
  const subtitle = ko && entry.title && entry.title !== entry.titleKo ? entry.title : "";
  const query = ko
    ? `${country.nameKo} 국가 ${entry.titleKo} ${entry.title} national anthem`
    : `${country.name} national anthem ${entry.title}`;
  return {
    isPolar: false,
    title,
    subtitle,
    audioUrl: entry.audio || "",
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  };
}
