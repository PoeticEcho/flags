// Completion IDs and tool settings do not change the painted image.
export const paintingKey=(code,art)=>JSON.stringify({code,legacy:Boolean(art.legacy),colors:art.colors||{},shapes:art.shapes||[],strokes:art.strokes||[],actions:art.actions||[]});
export const earnsFlagWave=score=>Boolean(score&&score.total>0&&Number.isFinite(score.accuracy)&&score.accuracy>=.9&&score.accuracy<=1);
export function assessFlag(score,code,art,item) {
 if(!earnsFlagWave(score)||item?.custom||item?.code!==code||!item?.svg)return null;
 return {key:paintingKey(code,art),score,item};
}
export function earnedFlag(assessment,code,art,ready=true) {
 return ready&&earnsFlagWave(assessment?.score)&&assessment.key===paintingKey(code,art)?assessment.item:null;
}
