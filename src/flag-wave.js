// The flag and metal pole share one camera, so the hoist never drifts.
export function flagSceneFor(aspect=1.5) {
 const width=1.8*(Number.isFinite(aspect)&&aspect>0?aspect:1.5),hoistX=-width/2,poleRadius=.058;
 return {width,height:1.8,hoistX,top:.9,bottom:-.9,poleX:hoistX-poleRadius,poleRadius};
}
export const flagScene=flagSceneFor();
export function svgFlagAspect(svg) {
 const root=String(svg).match(/<svg\b[^>]*>/i)?.[0]||'';
 const viewBox=root.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]?.trim().split(/[\s,]+/).map(Number);
 if(viewBox?.length===4&&viewBox.every(Number.isFinite)&&viewBox[2]>0&&viewBox[3]>0)return viewBox[2]/viewBox[3];
 const dimension=name=>{const value=root.match(new RegExp(`\\b${name}\\s*=\\s*["']([0-9.]+)(?:px)?["']`,'i'))?.[1];return Number(value);};
 const width=dimension('width'),height=dimension('height');
 return width>0&&height>0?width/height:1.5;
}
export function createFlagMesh(columns=80,rows=40) {
 const vertices=[];
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
  const a=[x/columns,y/rows],b=[(x+1)/columns,y/rows],c=[x/columns,(y+1)/rows],d=[(x+1)/columns,(y+1)/rows];
  vertices.push(...a,...c,...b,...b,...c,...d);
 }
 return new Float32Array(vertices);
}
export function flagDisplacement(u,v,time,wind=1) {
 return wind*.14*u*u*(Math.sin(u*8-v*2-time*2.4)+.45*Math.sin(u*16+v*4-time*3.3)+.18*Math.sin(u*25-v*3-time*4.1));
}
export function flagSurface(u,v,time,wind=1,aspect=1.5) {
 return [(u-.5)*flagSceneFor(aspect).width-wind*.035*u*u*(1+Math.sin(u*8-time*2.4)),(.5-v)*1.8-wind*.075*u*u+wind*.026*u*u*Math.sin(u*10-v*3-time*2.4),flagDisplacement(u,v,time,wind)];
}
export function createPoleMesh(segments=32,aspect=1.5) {
 const vertices=[],scene=flagSceneFor(aspect),cx=scene.poleX;
 const triangle=(a,b,c)=>vertices.push(...a,...b,...c);
 const cylinder=(low,high,radius)=>{
  for(let i=0;i<segments;i++){
   const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
   const point=(angle,y)=>[cx+radius*Math.cos(angle),y,radius*Math.sin(angle),Math.cos(angle),0,Math.sin(angle)];
   triangle(point(a,low),point(b,low),point(a,high));triangle(point(b,low),point(b,high),point(a,high));
  }
 };
 cylinder(-2.15,1.16,scene.poleRadius);
 // Hoist collars and a small spherical finial above the cloth.
 cylinder(.86,.90,.067);cylinder(-.90,-.86,.067);cylinder(1.10,1.16,.073);
 const sphere=(a,b)=>{const nx=Math.sin(a)*Math.cos(b),ny=Math.cos(a),nz=Math.sin(a)*Math.sin(b);return [cx+.084*nx,1.235+.084*ny,.084*nz,nx,ny,nz];};
 for(let j=0;j<12;j++)for(let i=0;i<segments;i++){
  const a=j/12*Math.PI,b=(j+1)/12*Math.PI,c=i/segments*Math.PI*2,d=(i+1)/segments*Math.PI*2;
  triangle(sphere(a,c),sphere(b,c),sphere(a,d));triangle(sphere(a,d),sphere(b,c),sphere(b,d));
 }
 return new Float32Array(vertices);
}
const sceneProjection=`
 uniform float u_aspect;
 vec3 rotateScene(vec3 p){float angle=-.18;return vec3(cos(angle)*p.x+sin(angle)*p.z,p.y,-sin(angle)*p.x+cos(angle)*p.z);}
 vec4 projectScene(vec3 p){p=rotateScene(p);float camera=3.7-p.z;return vec4(p.x*2.7/u_aspect,p.y*2.7,1.25*camera-2.25,camera);}`;
export const vertexShader=`
 attribute vec2 a_uv;
 uniform float u_time;
 uniform float u_wind;
 uniform float u_cloth_width;
 varying mediump vec2 v_uv;
 varying mediump vec3 v_normal;
 ${sceneProjection}
 float wave(vec2 uv){return u_wind*.14*uv.x*uv.x*(sin(uv.x*8.-uv.y*2.-u_time*2.4)+.45*sin(uv.x*16.+uv.y*4.-u_time*3.3)+.18*sin(uv.x*25.-uv.y*3.-u_time*4.1));}
 vec3 surface(vec2 uv){return vec3((uv.x-.5)*u_cloth_width-u_wind*.035*uv.x*uv.x*(1.+sin(uv.x*8.-u_time*2.4)),(.5-uv.y)*1.8-u_wind*.075*uv.x*uv.x+u_wind*.026*uv.x*uv.x*sin(uv.x*10.-uv.y*3.-u_time*2.4),wave(uv));}
 void main(){
  vec3 p=surface(a_uv),dx=surface(a_uv+vec2(.002,0.))-p,dy=surface(a_uv+vec2(0.,.002))-p;
  v_normal=rotateScene(normalize(cross(dy,dx)));
  gl_Position=projectScene(p);v_uv=a_uv;
 }`;
export const fragmentShader=`
 precision mediump float;
 uniform sampler2D u_flag;
 varying mediump vec2 v_uv;
 varying mediump vec3 v_normal;
 void main(){
  vec3 n=normalize(v_normal);if(n.z<0.)n=-n;
  vec3 sun=normalize(vec3(-.45,.7,1.));
  float light=.64+.36*max(0.,dot(n,sun));
  float sheen=.045*pow(max(0.,dot(n,normalize(sun+vec3(0.,0.,1.)))),18.);
  float weave=1.-.013*(sin(v_uv.x*1800.)*sin(v_uv.y*1200.));
  vec4 ink=texture2D(u_flag,v_uv);gl_FragColor=vec4(ink.rgb*light*weave+sheen,ink.a);
 }`;
const poleVertexShader=`
 attribute vec3 a_position;
 attribute vec3 a_normal;
 varying mediump vec3 v_normal;
 ${sceneProjection}
 void main(){v_normal=rotateScene(a_normal);gl_Position=projectScene(a_position);}`;
const poleFragmentShader=`
 precision mediump float;
 varying mediump vec3 v_normal;
 void main(){vec3 n=normalize(v_normal),sun=normalize(vec3(-.45,.7,1.));float diffuse=max(0.,dot(n,sun));float shine=pow(max(0.,dot(n,normalize(sun+vec3(0.,0.,1.)))),38.);vec3 silver=mix(vec3(.36,.48,.57),vec3(.88,.92,.94),.28+.60*diffuse)+vec3(.30)*shine;gl_FragColor=vec4(silver,1.);}`;

export function createFlagRenderer(canvas,image,aspect=1.5) {
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
 if(!gl)throw new Error('webgl-unavailable');
 const shaders=[],buffers=[],textures=[],programs=[];
 const compile=(type,code)=>{const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error('shader-failed');return shader;};
 const programFor=(vertex,fragment)=>{const program=gl.createProgram();programs.push(program);gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('program-failed');return program;};
 const meshBuffer=mesh=>{const buffer=gl.createBuffer();buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);return buffer;};
 const dispose=()=>{buffers.forEach(b=>gl.deleteBuffer(b));textures.forEach(t=>gl.deleteTexture(t));shaders.forEach(s=>gl.deleteShader(s));programs.forEach(p=>gl.deleteProgram(p));};
 try {
  const cloth=programFor(vertexShader,fragmentShader),pole=programFor(poleVertexShader,poleFragmentShader);
  const mesh=createFlagMesh(),clothBuffer=meshBuffer(mesh),poleMesh=createPoleMesh(32,aspect),poleBuffer=meshBuffer(poleMesh);
  const texture=gl.createTexture();textures.push(texture);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  const uv=gl.getAttribLocation(cloth,'a_uv'),position=gl.getAttribLocation(pole,'a_position'),normal=gl.getAttribLocation(pole,'a_normal');
  const time=gl.getUniformLocation(cloth,'u_time'),wind=gl.getUniformLocation(cloth,'u_wind'),clothAspect=gl.getUniformLocation(cloth,'u_aspect'),poleAspect=gl.getUniformLocation(pole,'u_aspect');
  gl.useProgram(cloth);gl.uniform1i(gl.getUniformLocation(cloth,'u_flag'),0);gl.uniform1f(gl.getUniformLocation(cloth,'u_cloth_width'),flagSceneFor(aspect).width);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  return {draw(seconds,strength){
   const ratio=Math.min(window.devicePixelRatio||1,2),width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
   if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
   gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.useProgram(pole);gl.uniform1f(poleAspect,width/height);gl.bindBuffer(gl.ARRAY_BUFFER,poleBuffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(normal);gl.vertexAttribPointer(normal,3,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,poleMesh.length/6);gl.disableVertexAttribArray(position);gl.disableVertexAttribArray(normal);
   gl.useProgram(cloth);gl.uniform1f(time,seconds);gl.uniform1f(wind,strength);gl.uniform1f(clothAspect,width/height);gl.bindBuffer(gl.ARRAY_BUFFER,clothBuffer);gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,mesh.length/2);gl.disableVertexAttribArray(uv);
  },dispose};
 }catch(error){dispose();throw error;}
}
