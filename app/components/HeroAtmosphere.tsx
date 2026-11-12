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
     vec2 p=uvCoord;float t=time*.085;
     vec3 base=vec3(.043,.047,.043);vec3 orange=vec3(.933,.557,.314);float light=0.;
     for(int band=0;band<3;band++){
      float b=float(band);
      for(int i=0;i<7;i++){
       float k=float(i);
       float y=.18+b*.29+k*(.012+.003*sin(t+b))+.16*sin(p.x*3.7+t+b*1.8)+.07*sin(p.x*6.-t*.6+b+k*.05);
       float d=abs(p.y-y);
       float shimmer=.86+.14*sin(p.x*4.-t*1.2+b);
       light+=(exp(-d*650.)*.085+exp(-d*85.)*.012)*shimmer;
      }
     }
     float mask=.50+.50*smoothstep(.2,.9,p.x);
     vec3 color=base+orange*light*mask;
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

