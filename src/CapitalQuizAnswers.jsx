import {CheckCircle,XCircle} from '@phosphor-icons/react';
import {wrongCapitalHint} from './quiz-data.js';
import {canAnswerQuiz,quizOptionResult} from './quiz-answer-state.js';
import {assetUrl} from './asset-url.js';

export default function CapitalQuizAnswers({options=[],status='idle',selectedId='',language='ko',onAnswer,correctText,wrongText}){
 return <>
  <div className="capital-options">{options.map((option,index)=>{
   const result=quizOptionResult(status,selectedId,option);
   return <div key={option.id} className="capital-option-wrap">
    <button className={`capital-option ${result}`} onClick={()=>onAnswer(option.id)} disabled={!canAnswerQuiz(status)} aria-describedby={result==='wrong'?`capital-hint-${option.id}`:undefined}>
     <span>{String.fromCharCode(65+index)}</span>{language==='ko'?option.nameKo:option.name}
     {result==='correct'&&<CheckCircle size={19} weight="fill"/>}{result==='wrong'&&<XCircle size={19} weight="fill"/>}
    </button>
    {result==='wrong'&&<div className="capital-answer-tooltip" id={`capital-hint-${option.id}`} role="tooltip">{option.code&&<img src={assetUrl(`/flags/${option.code.toLowerCase()}.svg`)} alt=""/>}{wrongCapitalHint(option,language)}</div>}
   </div>;
  })}</div>
  {status==='correct'&&<div className="quiz-celebration" aria-hidden="true">{Array.from({length:7},(_,i)=><span key={i} style={{'--star-index':i}}>✦</span>)}</div>}
  {status!=='idle'&&<div className={`quiz-feedback ${status}`} role="status">{status==='correct'?<CheckCircle size={19} weight="fill"/>:<XCircle size={19} weight="fill"/>}<span>{status==='correct'?correctText:<>{wrongText}<span className="sr-only"> {wrongCapitalHint(options.find(o=>o.id===selectedId),language)}</span></>}</span></div>}
 </>;
}
