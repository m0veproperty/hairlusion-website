'use client';
import {useEffect} from 'react';
export default function Enhancements(){useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion: reduce)');if(mq.matches)return;const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));return()=>observer.disconnect()},[]);return null;}
