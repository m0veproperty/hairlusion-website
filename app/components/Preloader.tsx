'use client';
import {useEffect,useState} from 'react';
export default function Preloader(){
 const [dismissed,setDismissed]=useState(false);
 useEffect(()=>{let seen=false;try{seen=sessionStorage.getItem('hairlusion-intro')==='1';sessionStorage.setItem('hairlusion-intro','1')}catch{}if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){setDismissed(true);return}const timer=setTimeout(()=>setDismissed(true),1400);return()=>clearTimeout(timer)},[]);
 if(dismissed)return null;
 return <div className="brand-preloader" aria-hidden="true"><div className="preloader-dots">{Array.from({length:25},(_,i)=><i key={i} style={{animationDelay:`${i*18}ms`}}/>)}</div><img src="/assets/logo.svg" alt="" width="220" height="57"/><span>THE DETAIL BEHIND CONFIDENCE.</span></div>;
}
