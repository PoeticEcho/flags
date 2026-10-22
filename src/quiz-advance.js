export function createQuizAdvance({onAdvance,delay=900,schedule=setTimeout,unschedule=clearTimeout}){
 let timer=null,revision=0;
 const cancel=()=>{revision++;if(timer!==null)unschedule(timer);timer=null;};
 return {
  cancel,
  queue({mode,status,question,blocked=false}){
   cancel();if(mode!=='quiz'||status!=='correct'||!question||blocked)return false;
   const current=revision;
   timer=schedule(()=>{if(current!==revision)return;timer=null;revision++;onAdvance(question);},delay);
   return true;
  },
 };
}
