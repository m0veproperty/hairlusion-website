'use client';
import {useEffect,useRef} from 'react';
import type {Mesh,BufferGeometry} from 'three';
export default function AnatomicalHead({mode='story',region=0}:{mode?:'story'|'explorer';region?:number}){
 const host=useRef<HTMLDivElement>(null),selected=useRef(region);
 useEffect(()=>{selected.current=region;host.current?.dispatchEvent(new Event('regionchange'));},[region]);
 useEffect(()=>{
 const node=host.current;if(!node)return;let disposed=false,cleanup=()=>{};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const load=()=>{Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js')]).then(async([T,{GLTFLoader}])=>{
 const gltf=await new GLTFLoader().loadAsync('/assets/LeePerrySmith.glb');
 const geometry=(gltf.scene.children[0] as Mesh<BufferGeometry>).geometry.clone();
 gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});
 if(disposed){geometry.dispose();return;}geometry.computeBoundingBox();const box=geometry.boundingBox!,c=box.getCenter(new T.Vector3()),s=box.getSize(new T.Vector3());geometry.translate(-c.x,-c.y,-c.z);geometry.scale(3.6/s.y,3.6/s.y,3.6/s.y);
 let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{geometry.dispose();return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.domElement.setAttribute('aria-hidden','true');node.appendChild(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,30);camera.position.set(0,.85,8);camera.lookAt(0,.25,0);
 const treatment={value:reduced?1:0},area={value:selected.current};
 const material=new T.MeshStandardMaterial({color:0xaaa69e,roughness:.94,metalness:0});
 material.onBeforeCompile=shader=>{
 shader.uniforms.uTreatment=treatment;shader.uniforms.uArea=area;
 shader.vertexShader='varying vec3 vHead;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvHead=position;');
 shader.fragmentShader='varying vec3 vHead;\nuniform float uTreatment;\nuniform float uArea;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec3 cell=vHead*85.0;vec3 id=floor(cell);
 vec3 jitter=vec3(fract(sin(dot(id,vec3(127.1,311.7,74.7)))*43758.5453),fract(sin(dot(id,vec3(269.5,183.3,246.1)))*43758.5453),fract(sin(dot(id,vec3(113.5,271.9,124.6)))*43758.5453));
 float pigment=1.0-smoothstep(.19,.31,length(fract(cell)-(.25+.5*jitter)));
 float front=smoothstep(-.2,.6,vHead.z);
 float line=mix(.42,.87+.16*pow(abs(vHead.x),2.0),front);
 float scalp=smoothstep(line-.025,line+.09+jitter.x*.035,vHead.y);
 float density=.56;
 if(uArea>0.5&&uArea<1.5) density=mix(.22,.68,smoothstep(.9,1.5,vHead.y));
 if(uArea>1.5) density=mix(.18,.75,(1.0-smoothstep(.035,.13,abs(vHead.y-.65)))*(1.0-front));
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.065,.072,.073),pigment*scalp*density*uTreatment);
 diffuseColor.rgb*=1.0-scalp*.10*uTreatment;
 `);};
 const head=new T.Mesh(geometry,material);scene.add(head);scene.add(new T.HemisphereLight(0xe8f0ff,0x252b2c,2.3));
 const key=new T.DirectionalLight(0xfff3e4,3.4);key.position.set(-3,5,5);scene.add(key);const rim=new T.DirectionalLight(0xc8dfeb,2.2);rim.position.set(4,2,-2);scene.add(rim);
 let raf=0,visible=true;const started=performance.now();
 const render=(now:number)=>{if(disposed)return;const entry=reduced?1:Math.min(1,(now-started)/1400);treatment.value=entry;area.value=selected.current;
 const track=node.closest('.narrative-track');const progress=!reduced&&track&&innerWidth>760?Math.min(1,Math.max(0,-track.getBoundingClientRect().top/650)):0;
 head.rotation.y=mode==='story'?-.45+progress*.24:selected.current===2?2.55:-.45;head.rotation.x=mode==='story'?progress*.18:0;
 head.position.set(mode==='story'?progress*2.1:0,mode==='story'?-progress*.8:0,0);head.scale.setScalar(mode==='story'?1+progress*.6:1);
 if(visible){renderer.render(scene,camera);node.dataset.ready='true';node.dataset.assembled=String(entry===1);node.dataset.sceneState=mode==='story'?(progress>.66?'detail':'overview'):String(selected.current);if(mode==='story'&&node.parentElement)node.parentElement.dataset.detail=String(progress>.35);}if(entry<1&&visible)raf=requestAnimationFrame(render);};
 const request=()=>{cancelAnimationFrame(raf);if(visible&&!document.hidden)raf=requestAnimationFrame(render);};
 const resize=()=>{const b=node.getBoundingClientRect();renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.position.z=b.width<600?9.3:8;camera.updateProjectionMatrix();request();};
 const ro=new ResizeObserver(resize);ro.observe(node);const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)request();else cancelAnimationFrame(raf);});io.observe(node);
 window.addEventListener('scroll',request,{passive:true});node.addEventListener('regionchange',request);document.addEventListener('visibilitychange',request);resize();
 cleanup=()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();window.removeEventListener('scroll',request);node.removeEventListener('regionchange',request);document.removeEventListener('visibilitychange',request);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();};
 }).catch(()=>{node.dataset.fallback='true';});};const startObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){startObserver.disconnect();load();}},{rootMargin:'150px'});startObserver.observe(node);return()=>{disposed=true;startObserver.disconnect();cleanup();};},[mode]);
 return <div className="scalp-render" ref={host}><svg className="scalp-fallback" viewBox="0 0 800 430" role="img" aria-label="Illustrative head showing the scalp and hairline"><defs><pattern id={`pigment-${mode}`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#313a3b"/></pattern></defs><path d="M340 387 L345 339 Q295 316 291 247 Q266 243 270 211 Q273 192 289 203 L287 154 Q286 61 384 41 Q480 28 514 119 L522 203 Q542 192 540 220 Q540 247 520 251 Q513 318 463 341 L469 387" fill="#8e9796"/><path d="M290 166 Q279 62 384 41 Q482 26 514 119 L519 168 L486 135 Q401 117 324 139Z" fill={`url(#pigment-${mode})`}/><path d="M329 211 Q350 199 372 211 M438 211 Q460 199 480 211 M405 214 L394 266 L414 271 M374 299 Q404 308 438 297" fill="none" stroke="#535f60" strokeWidth="3"/></svg></div>;
}

