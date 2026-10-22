export function openDialogWithReturnFocus(dialog,trigger=document.activeElement){
 if(!dialog.open)dialog.showModal();
 return ()=>{
  if(dialog.open)dialog.close();
  if(trigger?.isConnected)trigger.focus({preventScroll:true});
 };
}
