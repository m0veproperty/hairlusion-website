'use client';
import {useId} from 'react';
import {consultationConfig} from '../lib/consultation';
export function FormatIcon({format}:{format:string}){return <svg viewBox="0 0 24 24" aria-hidden="true">{format==='Telephone'?<path d="m7 3-4 3c0 8 7 15 15 15l3-4-5-3-3 3c-3-1-5-3-6-6l3-3Z"/>:format==='Video'?<><rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 6-4v12l-6-4Z"/></>:<><circle cx="12" cy="7" r="4"/><path d="M4 22v-3c0-9 16-9 16 0v3"/></>}</svg>}
export default function ConsultationFormat({value,onChange,label='Consultation format'}:{value:string;onChange:(value:string)=>void;label?:string}){const group=useId();return <fieldset className="format-picker"><legend>{label}</legend><div>{consultationConfig.formats.map(format=><label key={format}><input type="radio" name={group} value={format} checked={value===format} onChange={()=>onChange(format)}/><span><FormatIcon format={format}/>{format}</span></label>)}</div></fieldset>}
