'use client';
import {useEffect,useState} from 'react';
export default function ConcernSummary(){const [concern,setConcern]=useState('');useEffect(()=>{const receive=(event:Event)=>setConcern((event as CustomEvent<string>).detail);window.addEventListener('hairlusion:concern',receive);return()=>window.removeEventListener('hairlusion:concern',receive)},[]);return concern?<p className="concern-summary">Your conversation starter: <strong>{concern}</strong></p>:null;}
