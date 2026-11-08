'use client';
import {useEffect,useState} from 'react';
export default function Preloader(){
 const [dismissed,setDismissed]=useState(false);
 useEffect(()=>{let seen=false;try{seen=sessionStorage.getItem('hairlusion-intro-v2')==='1';sessionStorage.setItem('hairlusion-intro-v2','1')}catch{}if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){setDismissed(true);return}const timer=setTimeout(()=>setDismissed(true),1900);return()=>clearTimeout(timer)},[]);
 if(dismissed)return null;
 return <div className="brand-preloader precision-preloader" aria-hidden="true"><div className="preloader-orbit"><svg viewBox="0 0 160 160"><circle className="orbit-track" cx="80" cy="80" r="62"/><circle className="orbit-draw" cx="80" cy="80" r="62"/><circle className="orbit-inner" cx="80" cy="80" r="43"/>{Array.from({length:9},(_,i)=><circle key={i} className="precision-dot" cx={64+(i%3)*16} cy={64+Math.floor(i/3)*16} r="2" style={{animationDelay:`${i*65}ms`}}/>)}</svg></div><img src="/assets/logo.svg" alt="" width="220" height="57"/><span>CONFIDENCE. IN EVERY DETAIL.</span><div className="preloader-rule"><i/></div></div>;
}
