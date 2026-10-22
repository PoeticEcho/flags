import { useEffect, useRef, useState } from "react";
import {
  ChatCircleText,
  Coins,
  MusicNotes,
  Play,
  Stop,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { getAnthemInfo } from "./anthem.js";
import { getCountryProfile } from "./country-profile.js";

async function resolveCommonsMp3Fallback(audioUrl) {
  try {
    const match = audioUrl.match(/Special:FilePath\/(.+)$/);
    if (!match) return null;
    const fileName = decodeURIComponent(match[1]);
    const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      `File:${fileName}`
    )}&prop=videoinfo&viprop=url|derivatives&format=json&origin=*`;
    const res = await fetch(api);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data?.query?.pages || {});
    const info = pages[0]?.videoinfo?.[0];
    const derivatives = info?.derivatives || [];
    const mp3 = derivatives.find((d) => /mp3/i.test(d.type || d.title || d.src || ""));
    return mp3?.src || info?.url || null;
  } catch {
    return null;
  }
}

export default function CountryAnthemBar({ country, language = "ko" }) {
  const ko = language === "ko";
  const anthem = getAnthemInfo(country, language);
  const profile = getCountryProfile(country?.code, language);
  const audioRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | playing | error

  useEffect(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load?.();
    }
    setStatus("idle");
  }, [country?.code]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el || !anthem?.audioUrl) return;
    if (status === "playing" || status === "loading") {
      el.pause();
      el.currentTime = 0;
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      const isOgg = /\.(ogg|oga)$/i.test(anthem.audioUrl);
      const canPlayOgg = typeof el.canPlayType === "function" && el.canPlayType("audio/ogg") !== "";
      let targetUrl = anthem.audioUrl;
      if (isOgg && !canPlayOgg) {
        const mp3Url = await resolveCommonsMp3Fallback(anthem.audioUrl);
        if (mp3Url) targetUrl = mp3Url;
      }
      el.src = targetUrl;
      await el.play();
      setStatus("playing");
    } catch {
      const mp3Url = await resolveCommonsMp3Fallback(anthem.audioUrl);
      if (mp3Url && el.src !== mp3Url) {
        try {
          el.src = mp3Url;
          await el.play();
          setStatus("playing");
          return;
        } catch {
          // fall through
        }
      }
      setStatus("error");
    }
  };

  return (
    <div className="country-extra-info">
      {profile && (
        <div
          className="country-profile-bar"
          aria-label={ko ? "공식 언어 및 화폐 정보" : "Official language and currency"}
        >
          <div className="profile-chip" title={profile.languages}>
            <ChatCircleText size={15} weight="duotone" aria-hidden="true" />
            <span>
              <small>{ko ? "언어" : "Language"}</small>
              <strong>{profile.languages}</strong>
            </span>
          </div>
          <div className="profile-chip" title={profile.currency}>
            <Coins size={15} weight="duotone" aria-hidden="true" />
            <span>
              <small>{ko ? "화폐" : "Currency"}</small>
              <strong>{profile.currency}</strong>
            </span>
          </div>
        </div>
      )}

      {anthem && (
        <div
          className={`country-anthem-bar ${anthem.isPolar ? "is-polar" : ""}`}
          aria-label={ko ? "국가 정보 및 듣기" : "National anthem"}
        >
          <div className="anthem-info">
            <span className="anthem-icon" aria-hidden="true">
              <MusicNotes size={16} weight="fill" />
            </span>
            <div className="anthem-titles">
              <small>{ko ? "국가 (National Anthem)" : "National Anthem"}</small>
              <strong>{anthem.title}</strong>
              {anthem.subtitle && <em>{anthem.subtitle}</em>}
            </div>
          </div>

          {!anthem.isPolar && (
            <div className="anthem-actions">
              {anthem.audioUrl && (
                <button
                  type="button"
                  className={`anthem-play-btn ${status === "playing" ? "playing" : ""}`}
                  onClick={togglePlay}
                  aria-pressed={status === "playing"}
                  aria-label={
                    status === "playing"
                      ? ko
                        ? `${country.nameKo} 국가 정지`
                        : `Stop ${country.name} national anthem`
                      : ko
                        ? `${country.nameKo} 국가 바로 듣기`
                        : `Play ${country.name} national anthem`
                  }
                  title={
                    status === "playing"
                      ? ko
                        ? "정지"
                        : "Stop"
                      : ko
                        ? "앱에서 국가 연주곡 바로 듣기"
                        : "Listen to national anthem instrumental"
                  }
                >
                  {status === "playing" ? (
                    <Stop size={14} weight="fill" />
                  ) : (
                    <Play size={14} weight="fill" />
                  )}
                  <span>
                    {status === "playing"
                      ? ko
                        ? "정지"
                        : "Stop"
                      : status === "loading"
                        ? ko
                          ? "로딩…"
                          : "Loading…"
                        : ko
                          ? "듣기"
                          : "Play"}
                  </span>
                </button>
              )}
              {anthem.youtubeUrl && (
                <a
                  className="anthem-youtube-link"
                  href={anthem.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    ko
                      ? `${country.nameKo} 국가 YouTube에서 듣기 (새 창)`
                      : `Listen to ${country.name} national anthem on YouTube (new tab)`
                  }
                  title={ko ? "YouTube에서 국가 듣기" : "Listen on YouTube"}
                >
                  <YoutubeLogo size={15} weight="fill" />
                  <span>YouTube</span>
                </a>
              )}
            </div>
          )}
          {status === "error" && (
            <p className="anthem-error-hint" role="status">
              {ko
                ? "음원을 불러오지 못했어요. 옆의 YouTube 버튼을 눌러 들어보세요!"
                : "Could not stream audio directly. Try the YouTube button!"}
            </p>
          )}
          <audio
            ref={audioRef}
            preload="none"
            onEnded={() => setStatus("idle")}
            onError={() => {
              if (status === "playing") setStatus("error");
            }}
          />
        </div>
      )}
    </div>
  );
}
