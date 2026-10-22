// A hold chooses an editor action; movement before activation chooses drawing.
export function createShapeHold({onActivate,delay=480,distance=8,schedule=setTimeout,unschedule=clearTimeout}) {
 let press=null,timer=null;
 const clear=()=>{if(timer!==null)unschedule(timer);timer=null;press=null;};
 return {
  begin(data){clear();press={...data,active:false};timer=schedule(()=>{timer=null;if(!press)return;press.active=true;onActivate(press);},delay);},
  move(id,client){if(!press||press.id!==id)return 'none';if(press.active)return 'active';if(Math.hypot(client[0]-press.client[0],client[1]-press.client[1])>distance){clear();return 'draw';}return 'wait';},
  end(id){if(!press||press.id!==id)return 'none';const result=press.active?'active':'tap';clear();return result;},
  cancel(id){if(id===undefined||press?.id===id)clear();}
 };
}
