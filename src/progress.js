export const progressKey = 'world-explorer-progress-v1';
export function readProgress(storage) { try { const v = JSON.parse(storage.getItem(progressKey) || '{}'); return { discovered: [...new Set(Array.isArray(v.discovered) ? v.discovered.filter(x => typeof x === 'string') : [])], solved: [...new Set(Array.isArray(v.solved) ? v.solved.filter(x => typeof x === 'string') : [])] }; } catch { return { discovered: [], solved: [] }; } }
export function addProgress(v, field, code) { return { ...v, [field]: [...new Set([...v[field], code])] }; }
export function quizPool(roster, priority, count) {
 // Keep the existing 197-country study order; requested extra places come last.
 const ordered=[...priority,...roster.filter(x=>!x.kind).map(x=>x.code),...roster.filter(x=>x.kind).map(x=>x.code)];
 return [...new Set(ordered)].slice(0,count).map(code=>roster.find(x=>x.code===code)).filter(x=>x?.capital||x?.quizKind==='knowledge');
}
