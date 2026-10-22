import {validShape} from './custom-shapes.js';
// Keep the full undo stack during this visit, and save the painting for reloads.
// A storage failure must never discard the in-memory drawing.
const draftKey = (code, custom) => `world-flag-draft-v1:${custom ? 'custom' : code}`;
export const blankArtwork = () => ({colors: {}, shapes: [], strokes: [], actions: []});
export function browserStorage() {try {return window.localStorage;} catch {return null;}}
const validPoints = points => Array.isArray(points) && points.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));
export const validArt = art => art && art.colors && typeof art.colors === 'object'
  && Array.isArray(art.shapes) && art.shapes.every(validShape)
  && Array.isArray(art.strokes) && art.strokes.every(s => s && validPoints(s.points))
  && Array.isArray(art.actions) && art.actions.every(a => a && ['fill','stroke','erase'].includes(a.kind) && Number.isInteger(a.region) && (a.kind === 'fill' || validPoints(a.points)));

export function createStudioDraftStore() {
 const drafts = new Map();
 function readStudioDraft(storage, code, custom = false) {
  const key = draftKey(code, custom);
  if (drafts.has(key)) return drafts.get(key);
  try {
    const saved = JSON.parse(storage.getItem(key) || 'null');
    if (saved?.version === 1 && validArt(saved.art)) {
      return {...saved, history: [],
        tool: ['paint','crayon','pencil','marker','eraser','eyedropper'].includes(saved.tool) ? saved.tool : 'paint',
        ink: /^#[a-f\d]{6}$/i.test(saved.ink) ? saved.ink : '#002395',
        size: Number.isFinite(saved.size) ? Math.max(6, Math.min(60, saved.size)) : 24,
        extra: Array.isArray(saved.extra) ? saved.extra.filter(c => /^#[a-f\d]{6}$/i.test(c)).slice(0,10) : []};
    }
  } catch { /* A damaged or unavailable storage entry starts with fresh paper. */ }
  return {art: blankArtwork(), history: [], ink: '#002395', tool: 'paint', size: 24, extra: []};
 }

 function saveStudioDraft(storage, code, custom, draft, persist = true) {
  const key = draftKey(code, custom);
  drafts.set(key, draft);
  if (!persist) return true;
  try {
    const {history, ...painting} = draft;
    storage.setItem(key, JSON.stringify({version: 1, ...painting}));
    return true;
  } catch { return false; }
 }
 return {readStudioDraft, saveStudioDraft};
}
export const {readStudioDraft, saveStudioDraft} = createStudioDraftStore();
