'use client';
import {useEffect,useRef} from 'react';

// One viewport-sized scene shared by every section; scroll subtly shifts the orbital field.
export default function HeroAtmosphere(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let disposed=false,frame=0,cleanup=()=>{};
  import('three').then(THREE=>{
   if(disposed||!host.current)return;
   const root=host.current;
   let renderer: InstanceType<typeof THREE.WebGLRenderer>;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'})}catch{return}
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
   root.appendChild(renderer.domElement);
   const scene=new THREE.Scene(),camera=new THREE.Camera();
   const uniforms={time:{value:0},aspect:{value:1},scroll:{value:0}};
   const material=new THREE.ShaderMaterial({uniforms,vertexShader:`varying vec2 uvCoord;void main(){uvCoord=uv;gl_Position=vec4(position,1.0);}`,fragmentShader:`
    precision highp float;
    varying vec2 uvCoord;
    uniform float time;
    uniform float aspect;
    uniform float scroll;
    void main(){
     vec2 p=(uvCoord-.5)*vec2(aspect,1.);float t=time*.07;
     vec3 base=vec3(.043,.047,.043);vec3 orange=vec3(.933,.557,.314);
     float light=0.;
     for(int i=0;i<3;i++){
      float k=float(i);
      vec2 center=vec2(sin(t*.63+k*2.3)*.65,cos(t*.48+k*2.1+scroll*.13)*.62);
      vec2 q=p-center;
      float angle=t*.15+k;
      q=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*q;
      float radius=.65+k*.13;
      float d=length(q*vec2(.72,1.18))-radius;
      float rim=exp(-abs(d)*200.)*.53;
      float glow=exp(-abs(d)*18.)*.11;
      float inner=exp(-abs(d)*6.)*.12*step(d,0.);
      float shade=.35+.65*smoothstep(-.8,.7,q.x+q.y);
      light+=(rim+glow+inner)*shade;
     }
     vec3 color=base+orange*light*.32;
     gl_FragColor=vec4(color,1.);
    }`});
   const geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
   const mq=matchMedia('(prefers-reduced-motion: reduce)');let visible=true;
   const render=()=>{uniforms.scroll.value=window.scrollY/Math.max(window.innerHeight,1);renderer.render(scene,camera)};
   const resize=new ResizeObserver(()=>{renderer.setSize(root.clientWidth,root.clientHeight,false);uniforms.aspect.value=root.clientWidth/root.clientHeight;render()});resize.observe(root);
   const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});io.observe(root);
   let last=0;
   function tick(now:number){frame=requestAnimationFrame(tick);if(now-last<32)return;last=now;uniforms.time.value=now*.001;render()}
   function sync(){cancelAnimationFrame(frame);if(!document.hidden&&visible&&!mq.matches)frame=requestAnimationFrame(tick);else render()}
   document.addEventListener('visibilitychange',sync);mq.addEventListener('change',sync);sync();
   cleanup=()=>{cancelAnimationFrame(frame);resize.disconnect();io.disconnect();document.removeEventListener('visibilitychange',sync);mq.removeEventListener('change',sync);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove()};
  });
  return()=>{disposed=true;cleanup()};
 },[]);
 return <div className="hero-atmosphere" ref={host} aria-hidden="true"/>;
}

