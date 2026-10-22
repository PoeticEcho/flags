export function quizRewardText({count=0,retried=false,newStamp=false,language='ko'}={}){
 if(language==='ko')return `${retried?'다시 도전해서 찾았어요!':'멋져요! 정답이에요!'} ${count>0&&count%3===0?'탐험 별 세 개 완성!':newStamp?'새 탐험 도장을 모았어요!':'한 문제 더 발견했어요!'}`;
 return `${retried?'You found it by trying again!':'Great discovery! That’s right!'} ${count>0&&count%3===0?'Three explorer stars earned!':newStamp?'A new explorer stamp!':'Another answer discovered!'}`;
}

// Sound starts only in an explicitly enabled, user-initiated answer action.
export function createQuizSound(getContext=()=>new (window.AudioContext||window.webkitAudioContext)()){
 let context;
 return {
  play(enabled,correct){
   if(!enabled||!correct)return;
   try{
    context??=getContext();
    if(context.state==='suspended')context.resume()?.catch?.(()=>{});
    const start=context.currentTime;
    [523.25,659.25,783.99].forEach((frequency,i)=>{
     const oscillator=context.createOscillator(),gain=context.createGain(),at=start+i*.09;
     oscillator.type='sine';oscillator.frequency.value=frequency;
     gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.075,at+.015);gain.gain.exponentialRampToValueAtTime(.001,at+.22);
     oscillator.connect(gain);gain.connect(context.destination);
     oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
     oscillator.start(at);oscillator.stop(at+.23);
    });
   }catch{}
  },
  dispose(){try{context?.close()?.catch?.(()=>{});}catch{}context=undefined;},
 };
}
