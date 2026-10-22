import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Map as MapLibreMap, Marker as MapLibreMarker, setWorkerUrl } from "maplibre-gl";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  ArrowClockwise,
  ArrowRight,
  Compass,
  GlobeHemisphereWest,
  MapPin,
  Minus,
  Plus,
  Sparkle,
  SpeakerHigh,
  SpeakerSlash,
  Star,
  Flag,
  PaintBrush,
  Palette,
  CaretLeft,
  X,
} from "@phosphor-icons/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { explorationPoints as capitalPoints, countryByCode, loadCountryGeoJson, regionBounds, explorationRoster as roster } from "./data.js";
import {focusMapCountry,nearestWorldBounds} from "./map-geometry.js";
import {canAnswerQuiz,quizOptionResult} from './quiz-answer-state.js';
import {countryHighlightLayers,updateCountryHighlight} from './map-highlight.js';
import {createQuizAdvance} from './quiz-advance.js';
import FlagStudio from "./FlagStudio.jsx";
import {browserStorage,readStudioDraft,saveStudioDraft} from "./studio-drafts.js";
import {readArtGallery,artworkDraft,galleryChangeEvent,deleteCustomCountry} from "./art-gallery.js";
import CountryCollection from "./CountryCollection.jsx";
import FlagWavePreview from "./FlagWavePreview.jsx";
import {searchCountryMatches} from "./country-search.js";
import PostcardPreview,{PostcardViewer} from './PostcardPreview.jsx';
import {saveExplorerSettings} from './explorer-settings.js';
import {launchExplorerSettings} from './explorer-launch.js';
import {mapFailureKind} from './map-failure.js';
import {createQuizSound,quizRewardText} from './quiz-reward.js';
import CountrySearch from "./CountrySearch.jsx";
import CountryCardFace from "./CountryCardFace.jsx";
import CountryAnthemBar from "./CountryAnthemBar.jsx";
import CapitalQuizAnswers from "./CapitalQuizAnswers.jsx";
import { readProgress, addProgress, quizPool, progressKey } from "./progress.js";
import { learningData } from "./learning-data.js";
import {populationSourceUrl} from './population.js';
import {generatedLocationOptions, capitalName, capitalRole, createQuizQuestion, quizQuestionText, quizMapFrame, wrongCapitalHint} from "./quiz-data.js";
import {antarcticSymbols} from './polar-data.js';
import {priorityCountryCodes} from './priority-countries.js';
import {assetUrl} from './asset-url.js';

// Bundle the worker and its imports rather than resolving a missing sibling
// module beside the hashed production application bundle.
setWorkerUrl(mapWorkerUrl);

const copy = {
  ko: {
    appName: "꼬마 세계 탐험대", subtitle: "지도를 누르면 여행이 시작돼요", map: "세계 지도", world: "세계", trip: "탐험 중", arrival: "유럽에 도착했어요!", today: "오늘의 탐험", progress: "탐험 도장", countryHint: "지도의 나라를 눌러 살펴보세요", capital: "수도", population: "인구 · 2025년 추정", moreFacts: "어린이 세계 상식", landmark: "여기서 만날 수 있어요", discover: "수도 찾기 퀴즈", quiz: "수도 퀴즈", start: "퀴즈 시작", next: "다음 탐험지", retry: "한 번 더 해볼까요?", correct: "정답이에요! 멋진 탐험가네요!", wrong: "앗, 다시 찾아봐요!", questionMap: "수도를 지도에서 찾아볼까요?", questionWord: "의 수도는 어디일까요?", choose: "정답을 골라보세요", search: "나라 이름을 찾아보세요", searchPlaceholder: "나라 이름 검색", pictureSoon: "나라별 그림이 하나씩 찾아와요!", capitalPin: "수도 위치", hold: "꾹 눌러 나라를 발견해요", zoom: "확대", zoomOut: "축소", reset: "세계 보기", showing: "나라", postcard: "여행 엽서", region: "지역", score: "맞힌 문제", ready: "준비됐어요", explore: "지도 탐험", allCountries: "나라 목록", english: "영어", korean: "한글", selected: "선택한 곳", lookFor: "지도에서 찾아보세요", exit: "지도 탐험으로", continue: "계속 탐험하기", journey: "오늘의 세계 여행", worldTrip: "어디로 떠나볼까요?", speak: "이름 듣기", plane: "하늘을 나는 여행 비행기", mark: "탐험 도장", mapOnly: "이 나라의 수도 핀은 다음 지도 업데이트에서 추가돼요.", mapLoading: "세계를 펼치고 있어요…", mapError: "지도를 불러오지 못했어요. 다시 열어 주세요.", visited: "새로운 나라를 발견했어요!", language: "언어", all: "전체",
  },
  en: {
    exit: "Back to map", continue: "Keep exploring", journey: "Today’s world journey", worldTrip: "Where shall we go?", plane: "A plane flying around the world", appName: "Little World Explorers", subtitle: "Tap the map to begin your journey", map: "World map", world: "World", trip: "Exploring", arrival: "You've arrived in Europe!", today: "Today's adventure", progress: "Explorer stamps", countryHint: "Tap a country on the map to explore", capital: "Capital", population: "Population · 2025 estimate", moreFacts: "World facts for kids", landmark: "A famous place to visit", discover: "Capital hunt", quiz: "Capital quiz", start: "Start quiz", next: "Next place", retry: "Try one more time?", correct: "That's right! What a great explorer!", wrong: "Not quite. Have another look!", questionMap: "Can you find the capital on the map?", questionWord: "What is the capital of", choose: "Choose the right answer", search: "Find a country", searchPlaceholder: "Search countries", pictureSoon: "A postcard for every country is on its way!", capitalPin: "Capital location", hold: "Press and hold to discover a country", zoom: "Zoom in", zoomOut: "Zoom out", reset: "See the world", showing: "countries", postcard: "Travel postcard", region: "Region", score: "Solved", ready: "Ready to explore", explore: "Explore map", allCountries: "Country list", english: "English", korean: "한국어", selected: "Selected place", lookFor: "Find it on the map", speak: "Hear the name", mark: "Explorer stamp", mapOnly: "A capital pin for this country is coming in a map update.", mapLoading: "Preparing your world map…", mapError: "The map could not be loaded. Please reopen the app.", visited: "You discovered a new country!", language: "Language", all: "All",
  },
};

const motionDuration = duration => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;

const regionNames = {
  ko: { Europe: "유럽", Asia: "아시아", Africa: "아프리카", Americas: "아메리카", Oceania: "오세아니아", Antarctica:'남극', World: "세계" },
  en: { Europe: "Europe", Asia: "Asia", Africa: "Africa", Americas: "Americas", Oceania: "Oceania", Antarctica:'Antarctica', World: "World" },
};

const continentItems = [
  { code: "World", label: { ko: "세계", en: "World" }, icon: "🌍" },
  { code: "Europe", label: { ko: "유럽", en: "Europe" }, icon: "✨" },
  { code: "Asia", label: { ko: "아시아", en: "Asia" }, icon: "🌸" },
  { code: "Africa", label: { ko: "아프리카", en: "Africa" }, icon: "🦒" },
  { code: "Americas", label: { ko: "아메리카", en: "Americas" }, icon: "🗽" },
  { code: "Oceania", label: { ko: "오세아니아", en: "Oceania" }, icon: "🐠" },
  { code: "Antarctica", label: { ko: "남극", en: "Antarctica" }, icon: "🐧" },
];

export const locationOptions = generatedLocationOptions;


function countryName(country, language) {
  if (!country) return "";
  return language === "ko" ? country.nameKo : country.name;
}

function MapView({ language, selectedCode, selectedCountry, onSelect, onAnswer, quizMode, quizStatus, quizChoices, textChoice, region, setRegion, focusRequest,onUnavailable,onOpenCards,onWordQuiz }) {
  const hostRef = useRef(null);
  const fitQuizRef=useRef(null);
  const mapRef = useRef(null);
  const capitalMarkerRef = useRef(null);
  const geometryRef = useRef(null);
  const focusedRequestRef = useRef(null);
  const optionMarkersRef = useRef([]);
  const selectedRef = useRef(selectedCode);
  const onSelectRef = useRef(onSelect);
  const onAnswerRef = useRef(onAnswer);
  const quizModeRef = useRef(quizMode);
  const holdTimerRef = useRef(null);
  const pressPointRef = useRef(null);
  const activePointersRef = useRef(new Set());
  const longPressRef = useRef(false);
  const ignoreClickUntilRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [mapLoadError, setMapLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const t = copy[language];

  useEffect(()=>{
    const end=event=>{activePointersRef.current.delete(event.pointerId);window.clearTimeout(holdTimerRef.current);pressPointRef.current=null;};
    window.addEventListener("pointerup",end);window.addEventListener("pointercancel",end);
    return ()=>{window.removeEventListener("pointerup",end);window.removeEventListener("pointercancel",end);};
  },[]);
  useEffect(() => { selectedRef.current = selectedCode; }, [selectedCode]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onAnswerRef.current = onAnswer; }, [onAnswer]);
  useLayoutEffect(() => { quizModeRef.current = quizMode; }, [quizMode]);

  useEffect(() => {
    let disposed = false;
    let map = null;
    let loaded = false;
    let resizeObserver;
    focusedRequestRef.current = null;
    setReady(false);
    setMapLoadError('');
    const fail=error=>{if(disposed)return;window.clearTimeout(timeout);const kind=mapFailureKind(error);setMapLoadError(kind);onUnavailable?.(kind);};
    const timeout = window.setTimeout(() => { if (!disposed && !loaded) fail(); }, 20000);

    const initializeMap = async () => {
      try {
        const countryGeoJson = await loadCountryGeoJson();
        if (disposed || !hostRef.current) return;
        geometryRef.current = countryGeoJson;
        map = new MapLibreMap({
          container: hostRef.current,
          style: {
            version: 8,
            sources: { countries: { type: "geojson", data: countryGeoJson } },
            layers: [
              { id: "ocean", type: "background", paint: { "background-color": "#dff2f2" } },
              {
                id: "country-fill",
                type: "fill",
                source: "countries",
                paint: {
                  "fill-color": ["match", ["get", "region"], "Europe", "#c9e9d1", "Asia", "#f0d8bd", "Africa", "#f6e6ab", "Americas", "#c6e3eb", "Oceania", "#ddd2ed", "#e0e8cf"],
                  "fill-opacity": 0.96,
                },
              },
              ...countryHighlightLayers(selectedRef.current,quizModeRef.current),
              { id: "country-line", type: "line", source: "countries", paint: { "line-color": "#fffaf0", "line-width": 1.05, "line-opacity": 0.94 } },
            ],
          },
          center: [10, 18],
          zoom: 0.95,
          minZoom: -1,
          maxZoom: 18,
          attributionControl: false,
          renderWorldCopies: true,
          maxPitch: 0,
          pitchWithRotate: false,
          dragRotate: false,
        });
        map.on("dragstart", () => {ignoreClickUntilRef.current = Infinity; window.clearTimeout(holdTimerRef.current);pressPointRef.current=null;});
        map.on("dragend", () => {ignoreClickUntilRef.current = Date.now()+350;});
        map.on("zoomstart", () => {ignoreClickUntilRef.current=Infinity;window.clearTimeout(holdTimerRef.current);pressPointRef.current=null;});
        map.on("zoomend", () => {ignoreClickUntilRef.current=Date.now()+350;});
        map.touchZoomRotate.disableRotation();
        map.dragRotate.disable();
        mapRef.current = map;
        resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(hostRef.current);

        map.on("load", () => {
          if (disposed) return;
          loaded = true;
          window.clearTimeout(timeout);
          setMapLoadError('');
          onUnavailable?.('');
          map.resize();
          map.fitBounds(regionBounds.World, { padding: 26, duration: 0, maxZoom: 1.4 });
          map.on("click", "country-fill", (event) => {
            if (longPressRef.current || quizModeRef.current || Date.now() < ignoreClickUntilRef.current) return;
            const feature = event.features?.find((item) => item.properties?.eligible);
            if (feature?.properties?.cca2) onSelectRef.current(feature.properties.cca2, true);
          });
          map.on("mouseenter", "country-fill", () => { map.getCanvas().style.cursor = quizModeRef.current?"grab":"pointer"; });
          map.on("mouseleave", "country-fill", () => { map.getCanvas().style.cursor = "grab"; });
          setReady(true);
        });

        map.on("error", (event) => {
          console.warn("Map rendering issue:", event.error?.message || event.error);
          if (!disposed && !loaded) fail(event.error);
        });
      } catch (error) {
        if (!disposed) {
          console.error("World map could not be initialized:", error);
          fail(error);
        }
      }
    };

    initializeMap();
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      window.clearTimeout(holdTimerRef.current);
      resizeObserver?.disconnect();
      capitalMarkerRef.current?.remove();
      optionMarkersRef.current.forEach((marker) => marker.remove());
      map?.remove();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, [loadAttempt,onUnavailable]);

  useLayoutEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !map.getLayer("country-fill")) return;
    updateCountryHighlight(map,selectedCode,quizMode);
    map.getCanvas().style.cursor='grab';
  }, [ready, selectedCode, quizMode]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    capitalMarkerRef.current?.remove();
    capitalMarkerRef.current = null;
    const focusedMapChoice=optionMarkersRef.current.find(marker=>marker.getElement()===document.activeElement)?.getElement().dataset.quizOptionId;
    optionMarkersRef.current.forEach((marker) => marker.remove());
    optionMarkersRef.current = [];

    if (quizMode) {
      if (quizChoices?.options?.length && quizChoices.type!=='knowledge') {
        const frame=quizMapFrame(quizChoices.options);
        quizChoices.options.forEach((option, index) => {
          const element = document.createElement("button");
          const result=quizOptionResult(quizStatus,textChoice,option);
          const outcome = result==='correct';
          element.type = "button";
          element.disabled=!canAnswerQuiz(quizStatus);
          element.dataset.quizOptionId=option.id;
          const wrong=result==='wrong';
          element.className = `quiz-map-pin ${outcome ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`;
          element.textContent = String.fromCharCode(65 + index);
          const label=document.createElement("span");label.className="quiz-city-label";label.textContent=language==='ko'?option.nameKo:option.name;element.append(label);
          if(wrong){const tip=document.createElement("span");tip.className="quiz-pin-tooltip";tip.textContent=wrongCapitalHint(option,language);tip.role="tooltip";element.append(tip);element.title=tip.textContent;}
          let downPoint=null,dragged=false;
          element.addEventListener("pointerdown",event=>{downPoint=[event.clientX,event.clientY];dragged=false;element.setPointerCapture(event.pointerId);});
          element.addEventListener("pointermove",event=>{if(downPoint&&Math.hypot(event.clientX-downPoint[0],event.clientY-downPoint[1])>8)dragged=true;});
          element.addEventListener("pointercancel",()=>{dragged=true;downPoint=null;});
          element.setAttribute("aria-label", `${String.fromCharCode(65 + index)}. ${language==='ko'?option.nameKo:option.name}`);
          element.addEventListener("click", (event) => {
            event.stopPropagation();
            if((event.detail===0||!dragged) && Date.now() >= ignoreClickUntilRef.current) onAnswerRef.current(option.id);
          });
          optionMarkersRef.current.push(new MapLibreMarker({ element, anchor: "center", subpixelPositioning: true }).setLngLat(frame.coordinates[index]).addTo(map));
          if(quizStatus==='wrong'&&focusedMapChoice===option.id)element.focus({preventScroll:true});
        });
      }
      return;
    }

    const point = capitalPoints[selectedCode];
    if (!point?.coordinates) return;
    const element = document.createElement("div");
    element.className = "capital-map-pin";
    const pinRole=point.role?.[language]||capitalRole(selectedCountry,language),pinName=point.name?.[language]||capitalName(selectedCountry,language);
    element.setAttribute("aria-label", `${countryName(selectedCountry, language)}, ${pinRole}: ${pinName}`);
    const bubble = document.createElement("span");
    bubble.className = "capital-map-dot";
    bubble.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "capital-map-label";
    const flag=document.createElement("img");
    flag.src=assetUrl(`/flags/${selectedCode.toLowerCase()}.svg`);flag.alt="";flag.draggable=false;
    const text=document.createElement("span"),name=document.createElement("strong"),capital=document.createElement("small");
    name.textContent=countryName(selectedCountry,language);
    capital.textContent=`${pinRole} · ${pinName}`;
    text.append(name,capital);label.append(flag,text);
    element.append(bubble, label);
    capitalMarkerRef.current = new MapLibreMarker({ element, anchor: "center", subpixelPositioning: true }).setLngLat(point.coordinates).addTo(map);
  }, [ready, selectedCode, selectedCountry?.capital, language, quizMode, quizChoices, quizStatus, textChoice, t.capitalPin]);

  useEffect(() => {
    if (!ready || quizMode || !focusRequest || focusedRequestRef.current === focusRequest.requestId) return;
    const map = mapRef.current;
    if (map && geometryRef.current && focusMapCountry(map, geometryRef.current, focusRequest.code, countryByCode.get(focusRequest.code), motionDuration(900))) focusedRequestRef.current = focusRequest.requestId;
  }, [ready, focusRequest, quizMode]);

  useEffect(() => {
    if (!ready || !quizMode || !quizChoices?.options?.length) return;
    const map=mapRef.current,frame=quizChoices.type==='knowledge'?{bounds:regionBounds.Antarctica,wrapped:false}:quizMapFrame(quizChoices.options);
    if(!frame)return;
    const fit=()=>{const {width,height}=hostRef.current.getBoundingClientRect();map.stop();map.setRenderWorldCopies(true);map.fitBounds(nearestWorldBounds(frame.bounds,map.getCenter().lng),{padding:{top:Math.min(140,height*.34),bottom:Math.min(95,height*.24),left:Math.min(85,width*.24),right:Math.min(85,width*.24)},duration:motionDuration(650),maxZoom:5.4});};
    fitQuizRef.current=fit;fit();const observer=new ResizeObserver(fit);observer.observe(hostRef.current);return()=>{observer.disconnect();fitQuizRef.current=null;};
  }, [ready, quizMode, quizChoices]);

  const handlePointerDown = (event) => {
    if (!mapRef.current || event.button>0 || event.target.closest("button, input, .map-region-list")) return;
    activePointersRef.current.add(event.pointerId);
    if (activePointersRef.current.size>1) {
      ignoreClickUntilRef.current=Date.now()+800;
      window.clearTimeout(holdTimerRef.current);
      pressPointRef.current = null;
      return;
    }
    pressPointRef.current = { x: event.clientX, y: event.clientY };
    longPressRef.current = false;
    if (quizModeRef.current) return;
    holdTimerRef.current = window.setTimeout(() => {
      const rect = hostRef.current?.getBoundingClientRect();
      if (!rect || !pressPointRef.current) return;
      const point = [pressPointRef.current.x - rect.left, pressPointRef.current.y - rect.top];
      const feature = mapRef.current?.queryRenderedFeatures(point, { layers: ["country-fill"] }).find((item) => item.properties?.eligible);
      if (feature?.properties?.cca2) {
        longPressRef.current = true;
        onSelectRef.current(feature.properties.cca2, true);
        window.setTimeout(() => { longPressRef.current = false; }, 650);
      }
    }, 560);
  };

  const handlePointerMove = (event) => {
    if (!pressPointRef.current) return;
    if (Math.hypot(event.clientX - pressPointRef.current.x, event.clientY - pressPointRef.current.y) > 11) {
      ignoreClickUntilRef.current=Date.now()+500;
      window.clearTimeout(holdTimerRef.current);
      pressPointRef.current = null;
    }
  };

  const clearPress = event => {
    if (event.type === "pointercancel") ignoreClickUntilRef.current=Date.now()+500;
    activePointersRef.current.delete(event.pointerId);
    window.clearTimeout(holdTimerRef.current);
    pressPointRef.current = null;
  };

  const adjustZoom = (delta) => mapRef.current?.zoomTo(mapRef.current.getZoom() + delta, { duration: motionDuration(320) });
  const resetView = () => {if(quizMode&&fitQuizRef.current){fitQuizRef.current();return;}const map=mapRef.current;if(!map)return;map.setRenderWorldCopies(true);map.fitBounds(nearestWorldBounds(regionBounds.World,map.getCenter().lng), { padding: 26, duration: motionDuration(850), maxZoom: 1.4 });};
  const flyToRegion = (code) => {
    setRegion(code);
    const map=mapRef.current;if(!map)return;
    map.setRenderWorldCopies(true);
    map.fitBounds(nearestWorldBounds(regionBounds[code],map.getCenter().lng), { padding: 44, duration: motionDuration(900), maxZoom: code === "World" ? 1.4 : 3.2 });
  };

  return (
    <section className="map-shell" aria-label={t.map} onDragStart={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={clearPress} onPointerCancel={clearPress}>
      <div ref={hostRef} className="map-canvas" role="application" aria-label={language === "ko" ? "핀치하거나 버튼으로 확대할 수 있는 세계 지도" : "Interactive world map. Pinch or use zoom controls."} />
      {!ready && <div className={`map-loading ${mapLoadError?'map-unavailable':''}`} role="status"><span className="loading-globe" aria-hidden="true">🌎</span><span>{mapLoadError==='unsupported'?(language==='ko'?'이 기기에서는 지도를 펼칠 수 없어요. 나라 카드와 퀴즈로 탐험해요.':'This device cannot display the map. Explore with country cards and quizzes.') :mapLoadError?t.mapError:t.mapLoading}</span>{mapLoadError&&<div className="map-recovery-actions">{mapLoadError!=='unsupported'&&<button onClick={() => setLoadAttempt(n => n + 1)}>{language === "ko" ? "지도 다시 불러오기" : "Reload map"}</button>}<button onClick={onOpenCards}>{language==='ko'?'나라 카드로 탐험':'Explore country cards'}</button><button onClick={onWordQuiz}>{language==='ko'?'이름으로 퀴즈하기':'Quiz with names'}</button></div>}</div>}
      <div className="map-topline">
        <div className="map-world-tag"><GlobeHemisphereWest size={18} weight="duotone" /><span>{t.world}</span><span className="map-dot">·</span><span>{roster.length} {language==='ko'?'탐험지':'places'}</span></div>

      </div>
      {!quizMode&&!mapLoadError&&<div className="map-region-list" role="group" aria-label={t.region}>
        {continentItems.map((item) => (
          <button className={`region-chip ${region === item.code ? "active" : ""}`} key={item.code} onClick={() => flyToRegion(item.code)} aria-pressed={region === item.code}>
            <span aria-hidden="true">{item.icon}</span>{item.label[language]}
          </button>
        ))}
      </div>}
      {!mapLoadError&&<div className="map-zoom-controls">
        <button aria-label={t.zoom} title={t.zoom} onClick={() => adjustZoom(0.7)}><Plus size={19} weight="bold" /></button>
        <button aria-label={t.zoomOut} title={t.zoomOut} onClick={() => adjustZoom(-0.7)}><Minus size={19} weight="bold" /></button>
        <span className="zoom-divider" />
        <button className="reset-button" aria-label={quizMode?(quizChoices?.type==='knowledge'?(language==='ko'?'남극 전체 보기':'Show Antarctica'):(language==='ko'?'세 도시 함께 보기':'Show all three cities')):t.reset} title={quizMode?(quizChoices?.type==='knowledge'?(language==='ko'?'남극 전체 보기':'Show Antarctica'):(language==='ko'?'세 도시 함께 보기':'Show all three cities')):t.reset} onClick={resetView}><ArrowClockwise size={17} weight="bold" /></button>
      </div>}
      {!mapLoadError&&<div className="map-hold-hint"><MapPin size={14} weight="fill" />{quizMode?(quizChoices?.type==='knowledge'?t.choose:(language==='ko'?'도시 핀이나 보기를 골라요':'Choose a city pin or an answer')):t.hold}</div>}
      {!quizMode&&<><div className="map-region-caption"><span className="caption-sparkle">✦</span><div><b>{countryName(selectedCountry, language)}</b><span>{capitalRole(selectedCountry,language)}: {capitalName(selectedCountry,language) || "—"}</span></div></div>
      <img className="travel-plane" src={assetUrl("/assets/travel-plane.png")} alt={t.plane} /></>}
      <div className="map-credit">Map: Natural Earth · <a href={assetUrl("/data/country-data-license.txt")} target="_blank" rel="noreferrer">mledoze · ODbL</a>{selectedCode!=='AQ'&&<> · <a href={selectedCountry.populationInfo?.sourceUrl||populationSourceUrl} target="_blank" rel="noreferrer">{language==='ko'?'인구':'Population'}: {selectedCode==='GL'?'Statistics Greenland':'UN'} · 2025</a></>}</div>
    </section>
  );
}

function App() {
  const [settings]=useState(()=>launchExplorerSettings(browserStorage(),countryByCode));
  const [progress, setProgress] = useState(() => readProgress(browserStorage()));
  const [focusRequest, setFocusRequest] = useState({code:settings.selectedCode,requestId:1});
  const [collectionFilter,setCollectionFilter] = useState("priority");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [gallery,setGallery]=useState(()=>readArtGallery(browserStorage()));
  const [waveItem,setWaveItem]=useState(null),[studioRevision,setStudioRevision]=useState(0);
  const [postcardItem,setPostcardItem]=useState(null);
  useEffect(()=>{const refresh=()=>setGallery(readArtGallery(browserStorage()));window.addEventListener(galleryChangeEvent,refresh);window.addEventListener("storage",refresh);return ()=>{window.removeEventListener(galleryChangeEvent,refresh);window.removeEventListener("storage",refresh);};},[]);
  const [poolSize, setPoolSize] = useState(settings.poolSize);
  const [difficulty, setDifficulty] = useState(settings.difficulty);
  const [saveError, setSaveError] = useState("");
  const pool = useMemo(() => quizPool(roster, priorityCountryCodes, poolSize), [poolSize]);
  useEffect(() => { try { window.localStorage.setItem(progressKey, JSON.stringify(progress)); setSaveError(""); } catch { setSaveError("기록을 저장하지 못했어요. 저장 공간을 확인해 주세요."); } }, [progress]);
  const [language, setLanguage] = useState(settings.language);
  const [storyIndex,setStoryIndex]=useState(0);
  const [selectedCode, setSelectedCode] = useState(settings.selectedCode);
  const [mode, setMode] = useState(settings.mode);
  const studioOpen = mode === "colour" || mode === "custom";
  const quizCountryRef = useRef(null);
  const [quizStatus, setQuizStatus] = useState("idle");
  const [quizChoices, setQuizChoices] = useState(null);
  const [textChoice, setTextChoice] = useState("");
  const [mapUnavailable,setMapUnavailable]=useState(false),[sessionCorrect,setSessionCorrect]=useState(0),[retriedQuestion,setRetriedQuestion]=useState(false),[newQuizStamp,setNewQuizStamp]=useState(false),[quizSoundEnabled,setQuizSoundEnabled]=useState(false);
  const quizSound=useRef();if(!quizSound.current)quizSound.current=createQuizSound();
  useEffect(()=>()=>quizSound.current.dispose(),[]);
  const handleMapUnavailable=useCallback(kind=>{setMapUnavailable(kind==='unsupported');if(kind==='unsupported')setQuizChoices(question=>question?.type==='map'?{...question,type:'word'}:question);},[]);
  const [region, setRegion] = useState(countryByCode.get(settings.selectedCode)?.region||"World");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRequest,setSearchRequest]=useState(0);
  const solvedCount = progress.solved.filter(code => countryByCode.has(code)).length;
  const [announcement, setAnnouncement] = useState("");
  const advanceActionRef=useRef(),advanceStateRef=useRef(),autoAdvance=useRef(),answerLock=useRef(false),questionHeading=useRef(),focusQuestion=useRef(false);
  if(!autoAdvance.current)autoAdvance.current=createQuizAdvance({onAdvance:question=>advanceActionRef.current?.(question)});
  advanceActionRef.current=question=>{if(mode==='quiz'&&quizStatus==='correct'&&quizChoices===question&&!searchOpen&&!collectionOpen&&document.visibilityState!=='hidden')nextCountry();};
  advanceStateRef.current={mode,status:quizStatus,question:quizChoices,blocked:searchOpen||collectionOpen};
  useEffect(()=>{
    autoAdvance.current.queue({mode,status:quizStatus,question:quizChoices,blocked:searchOpen||collectionOpen||document.visibilityState==='hidden'});
    return ()=>autoAdvance.current.cancel();
  },[mode,quizStatus,quizChoices,searchOpen,collectionOpen,poolSize,difficulty]);
  useEffect(()=>{const visibility=()=>{if(document.visibilityState==='hidden')autoAdvance.current.cancel();else autoAdvance.current.queue(advanceStateRef.current);};document.addEventListener('visibilitychange',visibility);return()=>{document.removeEventListener('visibilitychange',visibility);autoAdvance.current.cancel();};},[]);
  useEffect(()=>{if(mode==='quiz'&&quizChoices&&focusQuestion.current){focusQuestion.current=false;questionHeading.current?.focus({preventScroll:true});}},[mode,quizChoices]);
  const openSearch=useCallback(open=>{if(open)autoAdvance.current.cancel();setSearchOpen(open);},[]);
  const t = copy[language];
  const searchRef = useRef(null);
  const country = countryByCode.get(selectedCode);
  useEffect(()=>{saveExplorerSettings(browserStorage(),{language,selectedCode,mode,poolSize,difficulty});},[language,selectedCode,mode,poolSize,difficulty]);
  const place = capitalPoints[selectedCode];
  const learning = learningData[selectedCode];
  const collectionCountries = collectionFilter === "priority" ? priorityCountryCodes.map(code=>countryByCode.get(code)) : collectionFilter === "visited" ? roster.filter(entry=>progress.discovered.includes(entry.code)) : roster;
  useEffect(()=>setStoryIndex(0),[selectedCode]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const keyboard = (event) => {
      if (event.key === "Escape") {setSearchOpen(false);setCollectionOpen(false);}
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, []);

  const matchingCountries = useMemo(() => searchCountryMatches(roster,search,{language}), [search,language]);

  const selectCountry = useCallback((code, fly = false) => {
    if (!countryByCode.has(code)) return;
    const found = countryByCode.get(code);
    autoAdvance.current.cancel();answerLock.current=false;focusQuestion.current=false;
    setCollectionOpen(false);
    setSelectedCode(code);
    setProgress(v => addProgress(v, "discovered", code));
    setRegion(found.region || "World");
    setMode(current=>current === "colour" || current === "custom" ? current : "explore");
    setQuizStatus("idle");
    setQuizChoices(null);
    setSearch("");
    setSearchOpen(false);
    setAnnouncement(`${language === "ko" ? found.nameKo : found.name} ${language === "ko" ? "도착!" : "selected!"}`);
    if (fly) setFocusRequest(previous => ({code, requestId:(previous?.requestId || 0) + 1}));
  }, [language]);

  const startQuiz = (code = selectedCode, questionType = difficulty) => {
    autoAdvance.current.cancel();answerLock.current=false;focusQuestion.current=true;
    quizCountryRef.current = code;
    setMode("quiz");
    setQuizStatus("idle");
    setTextChoice("");
    setRetriedQuestion(false);setNewQuizStamp(false);
    const question=createQuizQuestion(code,mapUnavailable&&questionType==='mixed'?'word':questionType);
    setQuizChoices(question);
    setAnnouncement(quizQuestionText(question,countryByCode.get(code),language));
  };

  const openMode = next => {
    autoAdvance.current.cancel();
    setSearchOpen(false);
    if (next === "quiz") {
      if (quizCountryRef.current === selectedCode && quizChoices) setMode("quiz");
      else startQuiz();
    } else setMode(next);
  };

  const answerQuiz = (id) => {
    if (!canAnswerQuiz(quizStatus)||answerLock.current) return;
    const option=quizChoices?.options.find(choice=>choice.id===id);if(!option)return;
    answerLock.current=option.correct;
    const correct=option.correct;setTextChoice(id);
    setQuizStatus(correct ? "correct" : "wrong");
    if (correct) { setNewQuizStamp(!progress.solved.includes(selectedCode));setSessionCorrect(value=>value+1);quizSound.current.play(quizSoundEnabled,true);setProgress(v => addProgress(addProgress(v, "discovered", selectedCode), "solved", selectedCode)); }
    else setRetriedQuestion(true);
  };

  const nextCountry = () => {
    autoAdvance.current.cancel();
    const index = pool.findIndex(entry => entry.code === selectedCode);
    const next = pool[(index + 1) % pool.length]?.code || "FR";
    selectCountry(next,true);
    if (mode === "quiz") startQuiz(next);
  };

  const playName = () => {
    if (!country?.name || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(language === "ko" ? country.nameKo : country.name);
    utterance.lang = language === "ko" ? "ko-KR" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSearchInput = (value) => {
    if(value.trim())autoAdvance.current.cancel();
    setSearch(value);
    setSearchOpen(Boolean(value.trim()));
  };

  const chooseSearchResult = (code) => {
    selectCountry(code, true);
    setSearch("");
  };

  const renderFlag = (code, size = "medium") => <img className={`flag-svg flag-${size}`} src={assetUrl(`/flags/${code.toLowerCase()}.svg`)} draggable={false} alt={`${countryByCode.get(code)?.name || code} ${code==='AQ'?'unofficial symbol':'flag'}`}/>;

  return (
    <div className={`app-shell ${studioOpen?"studio-screen":"map-screen"}`} onDragStart={e=>e.preventDefault()}>
      <header className="topbar"><div className="toolbar-line">
        <div className="brand-block">
          <div className="brand-mark"><img src={assetUrl("/assets/globe-mascot.png")} alt="" /></div>
          <div className="brand-words"><strong>{t.appName}</strong></div>
        </div>
        <nav className="activity-tabs" aria-label={language==='ko'?'학습 모드':'Learning mode'}>
          {[['explore',GlobeHemisphereWest,language==='ko'?'지도 탐험':'Explore'],['quiz',MapPin,language==='ko'?'탐험 퀴즈':'Explorer quiz'],['colour',PaintBrush,language==='ko'?'국기 색칠':'Colour flags'],['custom',Palette,language==='ko'?'내 국기 만들기':'Create flag']].map(([id,Icon,label])=><button key={id} className={mode===id?'active':''} aria-pressed={mode===id} onClick={()=>openMode(id)} aria-label={label} title={label}><Icon size={20} weight="duotone"/><span className="activity-label">{label}</span></button>)}

        </nav>
        <CountrySearch language={language} value={search} open={searchOpen} openRequest={searchRequest} onOpen={openSearch} onChange={handleSearchInput} onSelect={chooseSearchResult} selectedCode={selectedCode} results={matchingCountries} inputRef={searchRef}/>
        <div className="topbar-actions">
          <button className="stamps-pill" onClick={()=>{autoAdvance.current.cancel();setCollectionOpen(true);}} aria-haspopup="dialog" aria-label={`${t.progress} ${solvedCount}/${roster.length} · ${language==='ko'?'나라 카드 열기':'Open country cards'}`}><span className="stamp-icon"><Star size={17} weight="fill" /></span><span className="stamp-label">{t.progress}</span><b>{solvedCount}<i>/{roster.length}</i></b><span className="stamps-track"><span style={{ width: `${solvedCount / roster.length * 100}%` }} /></span></button>
          <div className="language-toggle" role="group" aria-label={t.language}>
            <button className={language === "ko" ? "active" : ""} aria-pressed={language === "ko"} onClick={() => setLanguage("ko")}>한글</button>
            <button className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button className="mobile-language-toggle" aria-label={language==='ko'?'Switch to English':'한국어로 바꾸기'} title={language==='ko'?'English':'한글'} onClick={()=>setLanguage(value=>value==='ko'?'en':'ko')}>{language==='ko'?'한':'EN'}</button>
        </div>
      </div></header>

      <main className="main-content">

        {mode==='quiz' && <section className="learning-controls" aria-label={language==='ko'?'퀴즈 설정':'Quiz settings'}>
          <label>{language==='ko'?'학습 묶음':'Study set'} <select value={poolSize} onChange={e=>setPoolSize(Number(e.target.value))}>{[20,40,48,60,100,120,197,roster.length].map(n=><option key={n} value={n}>{n===48?(language==='ko'?'주요 48개국':'Priority 48'):n===roster.length?(language==='ko'?`전체 ${n}곳`:`All ${n} places`):language==='ko'?`${n}개국`:`${n} countries`}</option>)}</select></label>
          <label>{language==='ko'?'문제 방식':'Question type'} <select value={mapUnavailable&&difficulty==='mixed'?'word':difficulty} onChange={e=>{setDifficulty(e.target.value);startQuiz(selectedCode,e.target.value);}}><option value="word">{language==='ko'?'수도 이름':'Capital names'}</option><option value="flag">{language==='ko'?'국기 맞추기':'Match the flag'}</option><option value="mixed" disabled={mapUnavailable}>{language==='ko'?'지도에서 찾기':'Find on map'}</option></select></label>
          <button onClick={()=>{selectCountry(pool[0].code,true);startQuiz(pool[0].code);}}>{language==='ko'?'묶음 첫 나라부터':'Start this set'}</button>
          <button className="quiz-sound-toggle" aria-pressed={quizSoundEnabled} aria-label={language==='ko'?`퀴즈 소리 ${quizSoundEnabled?'끄기':'켜기'}`:`Turn quiz sound ${quizSoundEnabled?'off':'on'}`} title={language==='ko'?`퀴즈 소리 ${quizSoundEnabled?'끄기':'켜기'}`:`Quiz sound ${quizSoundEnabled?'off':'on'}`} onClick={()=>setQuizSoundEnabled(value=>!value)}>{quizSoundEnabled?<SpeakerHigh size={20}/>:<SpeakerSlash size={20}/>}</button>
        </section>}
        {studioOpen && <FlagStudio key={`${selectedCode}:${mode}:${studioRevision}`} initialCode={selectedCode} initialCustom={mode==='custom'} language={language} onPreview={setWaveItem} onCountryChange={code=>selectCountry(code,true)} onModeChange={custom=>openMode(custom?'custom':'colour')} onOpenArtwork={(code,custom)=>{selectCountry(code,true);setMode(custom?'custom':'colour');}}/>}
        {saveError && <p className="save-alert" role="alert">{language==='ko'?saveError:'Could not save your progress. Check available storage.'}</p>}
        {collectionOpen&&<CountryCollection language={language} filter={collectionFilter} onFilter={setCollectionFilter} countries={collectionCountries} gallery={gallery} progress={progress} exploredCount={progress.discovered.filter(code=>countryByCode.has(code)).length} solvedCount={solvedCount} onClose={()=>setCollectionOpen(false)} onCountry={code=>{selectCountry(code,true);setMode("explore");}} onPreview={setWaveItem} onEdit={item=>{const defaults=readStudioDraft(browserStorage(),item.code,true);saveStudioDraft(browserStorage(),item.code,true,artworkDraft(item,defaults));setSelectedCode(item.code);setMode("custom");setStudioRevision(v=>v+1);setCollectionOpen(false);}} onDelete={item=>{try{const next=deleteCustomCountry(browserStorage(),item.id);setGallery(next);window.dispatchEvent(new Event(galleryChangeEvent));return true;}catch{return false;}}}/>}

        {waveItem&&<FlagWavePreview item={waveItem} language={language} onClose={()=>setWaveItem(null)}/>}
        {!studioOpen && <>
        <div className="intro-row">
          <div className="intro-copy"><div className="eyebrow"><Sparkle size={14} weight="fill" />{t.journey}</div><h1>{t.worldTrip}</h1></div>
          <div className="intro-note"><span className="note-icon">✈</span><span>{t.hold}</span><span className="note-sparkle">✦</span></div>
        </div>
        <div className="adventure-layout">
          <MapView
            language={language}
            selectedCode={selectedCode}
            selectedCountry={country}
            onSelect={selectCountry}
            onAnswer={answerQuiz}
            quizMode={mode === "quiz"}
            quizStatus={quizStatus}
            quizChoices={quizChoices}
            textChoice={textChoice}
            region={region}
            setRegion={setRegion}
            focusRequest={focusRequest}
            onUnavailable={handleMapUnavailable}
            onOpenCards={()=>{autoAdvance.current.cancel();setCollectionOpen(true);}}
            onWordQuiz={()=>{setDifficulty('word');startQuiz(selectedCode,'word');}}
          />

          <aside className={`country-card ${mode === "quiz" ? `quiz-card quiz-result-${quizStatus}` : ""}`}>
            <div className="card-topline"><span className="card-kicker"><Compass size={16} weight="fill" />{mode === "quiz" ? (country.quizKind==='knowledge'?(language==='ko'?'남극 탐험 퀴즈':'Antarctic explorer quiz'):quizChoices?.type==='flag'?(language==='ko'?'국기 맞추기 퀴즈':'Flag quiz'):t.quiz) : t.today}</span>{mode==='explore'&&place?.image&&<PostcardPreview compact key={selectedCode} place={place} language={language} onOpen={event=>setPostcardItem({country,place,trigger:event.currentTarget})}/>}<button className="card-sound" onClick={playName} aria-label={t.speak} title={t.speak}><SpeakerHigh size={18} weight="fill" /></button></div>

            {mode === "explore" ? (
              <div className="country-overview">
                <div className="country-detail-stack">
                <CountryCardFace country={country} language={language} solved={progress.solved.includes(selectedCode)}/>
                <CountryAnthemBar country={country} language={language}/>
                {country.capitalNote?.[language] && <details className="capital-context"><summary>{language==='ko'?'수도 이야기 더 보기':'About the capital'}</summary><p>{country.capitalNote[language]}</p></details>}
                {!place?.coordinates && <div className="map-only-note"><MapPin size={14} />{t.mapOnly}</div>}
                <button className="primary-action" onClick={()=>startQuiz() }><span className="action-star"><Sparkle size={17} weight="fill" /></span><span>{t.start}</span><ArrowRight size={20} weight="bold" /></button>
                </div>
                {learning && <section className="story-reader" aria-label={t.moreFacts}>
                  <div className="story-nav"><button type="button" aria-label={language==='ko'?'이전 이야기':'Previous story'} title={language==='ko'?'이전 이야기':'Previous story'} onClick={()=>setStoryIndex(i=>(i+learning.facts.length-1)%learning.facts.length)}><CaretLeft size={18}/></button><span aria-label={language==='ko'?`이야기 ${storyIndex+1} / ${learning.facts.length}`:`Story ${storyIndex+1} of ${learning.facts.length}`}>{storyIndex+1}/{learning.facts.length}</span><button type="button" aria-label={language==='ko'?'다음 이야기':'Next story'} title={language==='ko'?'다음 이야기':'Next story'} onClick={()=>setStoryIndex(i=>(i+1)%learning.facts.length)}><ArrowRight size={18}/></button></div>
                  <p aria-live="polite">{learning.facts[storyIndex]?.[language]}</p>
                  <details className="story-keywords"><summary>{language==='ko'?'탐험 키워드':'Explorer words'} · {learning.keywords.length}</summary><div className="keyword-cloud">{learning.keywords.map(word=><button type="button" key={word.en} data-kind={word.type} data-artwork={Boolean(word.artwork)} aria-label={`${word[language]} ${language==='ko'?'태그로 탐험지 찾기':'tag · Find places'}`} onClick={()=>{setSearch(word[language]);setSearchRequest(value=>value+1);openSearch(true);}}>{word.artwork?'✦ ':''}{word[language]}</button>)}</div>{selectedCode==='AQ'&&<div className="polar-symbols">{antarcticSymbols.map(symbol=><figure key={symbol.image}><img src={assetUrl(symbol.image)} alt={symbol.label[language]} loading="lazy" decoding="async" draggable={false}/><figcaption>{symbol.label[language]}</figcaption></figure>)}</div>}</details>
                </section>}
                <div className="card-footnote"><span className="tiny-plane">✈</span>{t.countryHint}</div>
              </div>
            ) : (
              <>
                <div className="quiz-banner"><div className="quiz-banner-icon"><MapPin size={21} weight="fill" /></div><div><span>{t.selected}</span><strong>{quizChoices?.type==='flag'&&quizStatus!=='correct'?(language==='ko'?'어느 나라의 국기일까요?':'Mystery flag'):<>{countryName(country, language)} {renderFlag(selectedCode, "small")}</>}</strong></div><span className="quiz-step">{pool.some(entry=>entry.code===selectedCode)?<>{pool.findIndex(entry=>entry.code===selectedCode)+1}<i>/{pool.length}</i></>:<small>{language==='ko'?'개별 탐험':'Individual'}</small>}</span></div>
                <div className="quiz-journey" aria-label={language==='ko'?`이번 탐험 정답 ${sessionCorrect}개`:`This adventure: ${sessionCorrect} correct answers`}><span className="journey-stars" aria-hidden="true">{[0,1,2].map(index=><Star key={index} size={19} weight={((sessionCorrect-1)%3+1)>index&&sessionCorrect>0?'fill':'regular'}/>)}</span><span>{language==='ko'?`이번 탐험 · 정답 ${sessionCorrect}`:`This adventure · ${sessionCorrect} correct`}</span></div>
                <div className="quiz-question-wrap"><span className="question-label"><Sparkle size={14} weight="fill" />{quizChoices?.type==='knowledge'?(language==='ko'?'극지 탐험 퀴즈':'Polar explorer quiz'):quizChoices?.type==='flag'?(language==='ko'?'국기 보고 나라 찾기':'Match the flag'):t.discover}</span>{quizChoices?.type==='flag'&&<div className="quiz-mystery-flag-wrap"><img className="quiz-mystery-flag" src={assetUrl(`/flags/${selectedCode.toLowerCase()}.svg`)} draggable={false} alt={language==='ko'?'어느 나라의 국기일까요?':'Mystery flag to identify'}/></div>}<h2 ref={questionHeading} tabIndex={-1}>{quizQuestionText(quizChoices,country,language)}</h2><p>{quizChoices?.type === "map" ? t.lookFor : t.choose}</p></div>

                <CapitalQuizAnswers options={quizChoices?.options} status={quizStatus} selectedId={textChoice} language={language} onAnswer={answerQuiz} correctText={quizRewardText({count:sessionCorrect,retried:retriedQuestion,newStamp:newQuizStamp,language})} wrongText={language==='ko'?'괜찮아요! 다른 보기를 골라보세요.':'Keep exploring! Try another answer.'}/>
                {quizStatus === "correct" ? <button className="primary-action next-action" onClick={nextCountry}><span className="action-star"><Star size={17} weight="fill" /></span><span>{t.next}</span><ArrowRight size={20} weight="bold" /></button> : <button className="primary-action" onClick={() => setMode("explore")}><span className="action-star"><Sparkle size={17} weight="fill" /></span><span>{t.exit}</span><ArrowRight size={20} weight="bold" /></button>}
                <div className="card-footnote"><span className="tiny-plane">✈</span>{quizStatus === "correct" ? t.visited : t.hold}</div>
              </>
            )}
          </aside>
        </div>


        </>}
      </main>
      <div className="live-region sr-only" aria-live="polite">{announcement}</div>
      {postcardItem&&<PostcardViewer item={postcardItem} language={language} onClose={()=>setPostcardItem(null)}/>}
    </div>
  );
}

export { App };
