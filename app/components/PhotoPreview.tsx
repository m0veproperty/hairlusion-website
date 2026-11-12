'use client';
import {useEffect,useRef,useState} from 'react';
import {photoError} from '../lib/consultation';
type Photo={id:number;name:string;url:string};
export default function PhotoPreview(){
 const [photos,setPhotos]=useState<Photo[]>([]),[error,setError]=useState(''),[dragging,setDragging]=useState(false);
 const input=useRef<HTMLInputElement>(null),replacement=useRef<number|null>(null),sequence=useRef(0),urls=useRef(new Set<string>());
 useEffect(()=>{const clear=()=>{urls.current.forEach(url=>URL.revokeObjectURL(url));urls.current.clear()};const leave=()=>{clear();setPhotos([]);setError('')};window.addEventListener('pagehide',leave);return()=>{window.removeEventListener('pagehide',leave);clear()}},[]);
 function remove(id:number){const p=photos.find(p=>p.id===id);if(p){URL.revokeObjectURL(p.url);urls.current.delete(p.url)}setPhotos(photos.filter(p=>p.id!==id))}
 function add(files:FileList|null){
  if(!files)return;const incoming=Array.from(files), replacing=replacement.current;replacement.current=null;
  if(incoming.length>(replacing===null?3-photos.length:1)){setError(replacing===null?'You can add up to three photographs. Remove one before adding more.':'Choose one replacement photograph.');return}
  const invalid=incoming.map(f=>photoError(f)).find(Boolean);if(invalid){setError(invalid);return}
  const added=incoming.map(file=>{const url=URL.createObjectURL(file);urls.current.add(url);return {id:sequence.current++,name:file.name,url}});
  if(replacing!==null){const old=photos.find(p=>p.id===replacing);if(old){URL.revokeObjectURL(old.url);urls.current.delete(old.url)}setPhotos(photos.flatMap(p=>p.id===replacing?added:[p]))}else setPhotos([...photos,...added]);setError('');
 }
 function browse(id:number|null=null){replacement.current=id;if(input.current){input.current.multiple=id===null;input.current.click()}}
 return <section className="photo-preview" aria-labelledby="photo-heading"><div className="photo-title"><h3 id="photo-heading">Help Joe understand<br/><span>your starting point.</span></h3><span>{photos.length} / 3 photos</span></div><p>If you’d like, you can add a few photographs of your hair or scalp to help prepare for your consultation.</p><p className="demo-privacy"><strong>Local preview only.</strong> Demo images stay in this page’s memory. They are never uploaded, emailed or retained after you leave or complete the preview.</p><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden aria-label="Choose scalp photographs" onChange={e=>{add(e.currentTarget.files);e.currentTarget.value=''}}/>
 <div className={`photo-drop ${dragging?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);replacement.current=null;add(e.dataTransfer.files)}}><span aria-hidden="true">＋</span><strong>Drop your photographs here</strong><span>JPG, PNG or WebP · Up to 5 MB each</span><button type="button" className="booking-outline" disabled={photos.length===3} onClick={()=>browse()}>Browse device files</button></div>
 {error&&<p className="form-error" role="alert">{error}</p>}<div className="photo-thumbs">{photos.map((p,i)=><figure key={p.id}><img src={p.url} alt={`Your selected photograph ${i+1}`} onError={()=>setError('One image could not be displayed. Please remove it or choose a replacement.')}/><figcaption><span>{p.name}</span><div><button type="button" onClick={()=>browse(p.id)} aria-label={`Replace photograph ${i+1}`}>Replace</button><button type="button" onClick={()=>remove(p.id)} aria-label={`Remove photograph ${i+1}`}>Remove</button></div></figcaption></figure>)}</div>
 <details className="photo-guidance"><summary>Tips for clear photographs <span>＋</span></summary><p>Try a front hairline view, a top or crown view, and a side view or your area of concern. Use soft natural light, keep the camera steady and avoid filters, flash and harsh shadows. Only include photographs you are comfortable previewing.</p></details></section>;
}
