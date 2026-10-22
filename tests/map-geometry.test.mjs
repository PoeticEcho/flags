import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCountryGeoJson,countryByCode,capitalPoints} from '../src/data.js';
import {splitAntimeridianGeometry,pointInGeometry,ringArea,countryFocusBounds,focusMapCountry,nearestWorldBounds} from '../src/map-geometry.js';
const geo=createCountryGeoJson(JSON.parse(readFileSync(new URL('../public/data/countries-10m.json',import.meta.url))));

test('all 199 learning destinations retain non-degenerate mapped territory',()=>{
 assert.equal(geo.features.length,255);
 const codes=new Set(geo.features.filter(f=>f.properties.eligible&&f.geometry.coordinates.length).map(f=>f.properties.cca2));
 assert.equal(codes.size,199);
 for(const f of geo.features)for(const p of f.geometry.coordinates){assert.ok(ringArea(p[0])>0,f.properties.label);for(const h of p.slice(1))assert.ok(ringArea(h)<0,f.properties.label);}
});
test('all world rings are closed and have no edges traversing more than half the world',()=>{
 for(const f of geo.features)for(const p of f.geometry.coordinates)for(const r of p){assert.deepEqual(r[0],r.at(-1));for(let i=1;i<r.length;i++){assert.ok(Math.abs(r[i][0]-r[i-1][0])<=180.000001,f.properties.label);assert.ok(r[i][0]>=-180&&r[i][0]<=180);}}
});
test('Russia highlight includes Moscow and Chukotka, not Poland, France or the Norwegian Sea',()=>{
 const ru=geo.features.find(f=>f.properties.cca2==='RU').geometry;
 assert.ok(pointInGeometry(capitalPoints.RU.coordinates,ru));assert.ok(pointInGeometry([-175,66],ru));
 for(const p of [capitalPoints.PL.coordinates,capitalPoints.FR.coordinates,[0,70],[20,65]])assert.equal(pointInGeometry(p,ru),false,String(p));
});
test('date-line polygons split without filling the ocean between their two sides',()=>{
 const g=splitAntimeridianGeometry({type:'Polygon',coordinates:[[[170,-10],[-170,-10],[-170,10],[170,10],[170,-10]]]});
 assert.equal(g.coordinates.length,2);assert.ok(pointInGeometry([175,0],g));assert.ok(pointInGeometry([-175,0],g));assert.equal(pointInGeometry([0,0],g),false);
});
test('holes remain unfilled after normalisation',()=>{
 const g=splitAntimeridianGeometry({type:'Polygon',coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]],[[3,3],[3,7],[7,7],[7,3],[3,3]]]});
 assert.ok(pointInGeometry([1,1],g));assert.equal(pointInGeometry([5,5],g),false);
});
test('search framing uses country bounds and nearby islands rather than capital coordinates',()=>{
 const france=countryFocusBounds(geo,'FR',countryByCode.get('FR').center);assert.ok(france[0][0]>-10&&france[1][0]<15);
 const japan=countryFocusBounds(geo,'JP',countryByCode.get('JP').center);assert.ok(japan[1][1]>45&&japan[0][1]<26);
 const fiji=countryFocusBounds(geo,'FJ',countryByCode.get('FJ').center);assert.ok(fiji[1][0]-fiji[0][0]<20);
 const russia=countryFocusBounds(geo,'RU',countryByCode.get('RU').center);assert.ok((russia[0][0]+russia[1][0])/2>80);
});
test('repeated searches recenter the same country and date-line focus enables wrapped territory',()=>{
 const calls=[],map={stop(){calls.push('stop')},setRenderWorldCopies(v){calls.push(v)},fitBounds(b,o){calls.push({b,o})}};
 assert.ok(focusMapCountry(map,geo,'PL',countryByCode.get('PL')));assert.ok(focusMapCountry(map,geo,'PL',countryByCode.get('PL')));assert.equal(calls.filter(c=>typeof c==='object').length,2);
 calls.length=0;focusMapCountry(map,geo,'FJ',countryByCode.get('FJ'));assert.equal(calls[1],true);assert.equal(calls[2].o.maxZoom,5.7);
});

test('microstates can be framed at a visible scale using real mapped boundaries',()=>{let options;const map={stop(){},setRenderWorldCopies(){},fitBounds(b,o){options=o;}};assert.ok(focusMapCountry(map,geo,'VA',countryByCode.get('VA')));assert.equal(options.maxZoom,18);});

test('country selection after multiple revolutions frames the closest world without changing geography',()=>{
 for(const longitude of [-1080,-720,-360,0,360,720,1080])for(const code of ['FR','FJ','GL','AQ','VA']){
  const canonical=countryByCode.get(code).focusBounds||countryFocusBounds(geo,code,countryByCode.get(code).center);
  const before=structuredClone(canonical);let framed,repeat;
  const map={getCenter:()=>({lng:longitude}),stop(){},setRenderWorldCopies(value){repeat=value;},fitBounds(bounds){framed=bounds;}};
  assert.ok(focusMapCountry(map,geo,code,countryByCode.get(code),0));assert.equal(repeat,true);
  assert.ok(Math.abs((framed[0][0]+framed[1][0])/2-longitude)<=180);
  assert.ok(Math.abs((framed[1][0]-framed[0][0])-(canonical[1][0]-canonical[0][0]))<1e-9);
  assert.deepEqual(framed.map(p=>p[1]),canonical.map(p=>p[1]));assert.deepEqual(canonical,before);
 }
});
test('world and Pacific quiz frames keep their span on either side of the date line',()=>{
 const bounds=[[166,-22],[185,-8]];
 assert.deepEqual(nearestWorldBounds(bounds,-184),[[-194,-22],[-175,-8]]);
 assert.deepEqual(nearestWorldBounds(bounds,890),[[886,-22],[905,-8]]);
 assert.deepEqual(nearestWorldBounds([[-180,-80],[180,84]],735),[[540,-80],[900,84]]);
 assert.deepEqual(nearestWorldBounds(bounds,NaN),bounds);
});
