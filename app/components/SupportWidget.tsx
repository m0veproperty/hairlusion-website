'use client';
import {useEffect,useRef,useState} from 'react';
const answers=[
 {question:'Book a consultation',text:'You can explore a personal consultation with Joe to discuss your concerns and options. This calendar is a demonstration: it does not reserve an appointment.',link:'/book-a-consultation/',cta:'View consultation times'},
 {question:'Joe’s availability',text:'For this preview, Friday consultations are shown between 9 am and 5 pm, in UK time. These are example hours, not Joe’s confirmed working schedule.',link:'/book-a-consultation/',cta:'Explore example availability'},
 {question:'Can I send photographs?',text:'You can preview up to three hairline, crown or area-of-concern photographs in the consultation demo. They stay in your browser and are never sent to Joe. For a real enquiry, ask Joe how to share images privately.',link:'/book-a-consultation/',cta:'Explore the photo preview'},
 {question:'What is scalp micropigmentation?',text:'SMP uses tiny pigment impressions to create the appearance of hair follicles. It can create a closely shaved look or the appearance of density; it does not grow hair. Joe can discuss suitability with you personally.',link:'/treatments/smp/',cta:'Understand SMP'},
 {question:'Contact Joe',text:'You can find Joe’s telephone and email details on the contact page. This automated demo is not a live conversation with Joe.',link:'/get-in-touch/',cta:'Contact Joe'},
];
type Reply={question:string;text:string;link?:string;cta?:string;shown:number;status:'waiting'|'typing'|'done'};
export default function SupportWidget(){
 const [open,setOpen]=useState(false),[history,setHistory]=useState<Reply[]>([]),[query,setQuery]=useState(''),[busy,setBusy]=useState(false),[announcement,setAnnouncement]=useState('');
 const launcher=useRef<HTMLButtonElement>(null),close=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDialogElement>(null),log=useRef<HTMLDivElement>(null);
 const delay=useRef<ReturnType<typeof setTimeout>|null>(null),typing=useRef<ReturnType<typeof setInterval>|null>(null),working=useRef(false);
 function stopTimers(){if(delay.current)clearTimeout(delay.current);if(typing.current)clearInterval(typing.current);delay.current=null;typing.current=null;working.current=false}
 useEffect(()=>()=>stopTimers(),[]);
 useEffect(()=>{if(!open)return;panel.current?.showModal();close.current?.focus();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:'instant'})},[history]);
 function dismiss(){stopTimers();setBusy(false);setHistory(h=>h.map(r=>({...r,shown:r.text.length,status:'done'})));setOpen(false);setAnnouncement('');launcher.current?.focus()}
 function reset(){stopTimers();setBusy(false);setHistory([]);setQuery('');setAnnouncement('Conversation cleared.')}
 function ask(answer:{question:string;text:string;link?:string;cta?:string}){
  if(working.current)return;working.current=true;setBusy(true);setAnnouncement('The assistant is preparing a response.');
  setHistory(h=>[...h.slice(-9),{...answer,shown:0,status:'waiting'}]);
  const finish=()=>{stopTimers();setBusy(false);setHistory(h=>h.map((r,i)=>i===h.length-1?{...r,shown:r.text.length,status:'done'}:r));setAnnouncement(answer.text)};
  delay.current=setTimeout(()=>{
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
   let shown=0;setHistory(h=>h.map((r,i)=>i===h.length-1?{...r,status:'typing'}:r));
   typing.current=setInterval(()=>{shown=Math.min(shown+3,answer.text.length);setHistory(h=>h.map((r,i)=>i===h.length-1?{...r,shown}:r));if(shown>=answer.text.length)finish()},22);
  },1000);
 }
 function send(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const text=query.trim();if(!text||working.current)return;setQuery('');ask({question:text,text:"The response is: This part of the functionality hasn't been mapped out yet."})}
 return <aside className="support-widget">{open&&<dialog ref={panel} className="support-panel" aria-modal="true" aria-labelledby="support-title" onCancel={e=>{e.preventDefault();dismiss()}} onClick={e=>{if(e.target!==e.currentTarget)return;const box=e.currentTarget.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dismiss()}}><header><div><span className="eyebrow">A LITTLE GUIDANCE</span><h2 id="support-title">Hairlusion<br/><span>Assistant</span></h2><p>Here to help you get started</p></div><button ref={close} onClick={dismiss} aria-label="Close assistant">×</button></header><p className="support-demo">Automated demonstration · Not live support</p><div className="support-log" ref={log} role="log" aria-label="Demo conversation" aria-live="off"><div className="assistant-message">Hi, welcome to Hairlusion! I’m the website assistant. What can I help you with today?</div>{history.map((reply,i)=><div key={i}><p className="visitor-message">{reply.question}</p><div className="assistant-message">{reply.status==='waiting'?<div className="support-typing" aria-label="Preparing response"><span/><span/><span/><small>One moment…</small></div>:<><p aria-hidden={reply.status==='typing'?true:undefined}>{reply.text.slice(0,reply.shown)}{reply.status==='typing'&&<span className="typing-caret" aria-hidden="true"/>}</p>{reply.status==='done'&&reply.link&&<a href={reply.link}>{reply.cta} <span>↗</span></a>}</>}</div></div>)}</div><div className="support-live" role="status" aria-live="polite">{announcement}</div><div className="support-quick" aria-label="Choose a question">{answers.map(a=><button key={a.question} disabled={busy} onClick={()=>ask(a)}>{a.question}<span>↗</span></button>)}</div><form className="support-composer" onSubmit={send}><label className="support-live" htmlFor="support-query">Type your question</label><input id="support-query" value={query} onChange={e=>setQuery(e.target.value)} maxLength={400} autoComplete="off" placeholder="Or type your question…"/><button type="submit" disabled={busy||!query.trim()} aria-label="Send demo question">↑</button></form><footer>No messages are sent or saved.<button onClick={reset}>Start again</button></footer></dialog>}<button ref={launcher} className="support-launcher" aria-label={open?'Close Hairlusion Assistant':'Open Hairlusion Assistant'} aria-expanded={open} onClick={()=>open?dismiss():setOpen(true)}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 15a11 11 0 0 1-11 11h-4l-7 3 2-7a11 11 0 1 1 20-7Z"/><path d="M10 14h12M10 19h8"/></svg></button></aside>;
}
