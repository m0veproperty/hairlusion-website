'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function HeadingReveal(){
 const path=usePathname();
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const headings=[...document.querySelectorAll<HTMLElement>('main h1,main h2:not([data-no-reveal])')];
  const restores:Array<()=>void>=[];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('heading-arrived');observer.unobserve(e.target)}}),{threshold:.15});
  headings.forEach(h=>{
   let index=0;
   const previousLabel=h.getAttribute('aria-label');
   h.setAttribute('aria-label',h.innerText.replace(/\s+/g,' ').trim());
   restores.push(()=>{if(previousLabel===null)h.removeAttribute('aria-label');else h.setAttribute('aria-label',previousLabel)});
   const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);const nodes:Text[]=[];
   while(walker.nextNode())nodes.push(walker.currentNode as Text);
   nodes.forEach(node=>{
    const wrapper=document.createElement('span');wrapper.className='motion-text';wrapper.setAttribute('aria-hidden','true');
    (node.textContent||'').split(/(\s+)/).forEach(word=>{
     if(/^\s+$/.test(word)){wrapper.append(document.createTextNode(word));return}
     const group=document.createElement('span');group.className='motion-word';
     [...word].forEach(char=>{const letter=document.createElement('span');letter.className='motion-letter';letter.textContent=char;letter.style.setProperty('--letter-delay',`${index++*22}ms`);group.append(letter)});
     wrapper.append(group);
    });
    node.replaceWith(wrapper);restores.push(()=>wrapper.replaceWith(node));
   });
   h.classList.add('heading-reveal');observer.observe(h);
  });
  return()=>{observer.disconnect();restores.forEach(restore=>restore());headings.forEach(h=>h.classList.remove('heading-reveal','heading-arrived'))};
 },[path]);
 return null;
}
