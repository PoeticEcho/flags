import {CheckCircle, MapPin, Star, UsersThree} from '@phosphor-icons/react';
import {capitalName, capitalRole} from './quiz-data.js';
import {populationData,formatPopulation,populationSource} from './population.js';
import {assetUrl} from './asset-url.js';

export default function CountryCardFace({country, language, discovered = false, solved = false, lazy = false}) {
  const ko = language === 'ko';
  const population=populationData[country.code]||country.populationInfo;
  return <div className={`country-card-face continent-${country.region.toLowerCase()}`}>
    <div className="flag-card-capital"><span><MapPin size={15} weight="fill"/>{capitalRole(country, language)}</span><strong>{capitalName(country, language)}</strong>
      {solved && <Star size={19} weight="fill" aria-label={country.quizKind==='knowledge'?(ko?'탐험 퀴즈 완료':'Explorer quiz solved'):(ko ? '수도 퀴즈 완료' : 'Capital quiz solved')}/>}</div>
    <img loading={lazy?"lazy":undefined} decoding="async" className="learning-flag" src={assetUrl(`/flags/${country.code.toLowerCase()}.svg`)} draggable={false} alt={`${ko ? country.nameKo : country.name} ${country.kind==='continent'?(ko?'비공식 상징':'unofficial symbol'):(ko ? '국기' : 'flag')}`}/>
    {population&&<div className="flag-card-population" title={`${population.source||populationSource} · ${population.value.toLocaleString(ko?'ko-KR':'en-US')}`}><UsersThree size={18} weight="duotone" aria-hidden="true"/><div><small>{population.label?.[language]||(ko?'인구 · 2025년 추계 (UN)':'Population · UN 2025 projection')}</small><strong>{formatPopulation(population.value,language)}</strong></div></div>}
    {country.populationNote&&<div className="flag-card-population"><UsersThree size={18} weight="duotone" aria-hidden="true"/><small>{country.populationNote[language]}</small></div>}
    <div className="flag-card-names"><strong lang="ko">{country.nameKo}</strong><span lang="en">{country.name}</span>{country.kindLabel&&<small>{country.kindLabel[language]}</small>}</div>
    {discovered && <span className="flag-card-discovered"><CheckCircle size={14} weight="fill"/>{ko ? '탐험한 곳' : 'Explored'}</span>}
  </div>;
}
