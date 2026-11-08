import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import pages from '../data/pages.json';
import Header from '../components/Header';
import PageContent,{PageIntro} from '../components/PageContent';
import {Contact} from '../components/Editorial';
export function generateStaticParams(){return pages.map(p=>({slug:p.slug.split('/')}))}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{const {slug}=await params;const p=pages.find(p=>p.slug===slug.join('/'));return {title:`${p?.title||'Hairlusion'} — Hairlusion`,description:`Explore ${p?.title?.toLowerCase()||'your options'} with Hairlusion. Personal scalp micropigmentation care with Joe in East Hertfordshire.`}}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path=slug.join('/');const p=pages.find(p=>p.slug===path);if(!p)notFound();return <><Header/><main id="main" className={`inner-page ${["treatments/smp","treatments/smp-aftercare","privacy-policy","terms-conditions"].includes(path)?"inner-light":"inner-dark"}`}><PageIntro slug={path} title={p.title}/><div className={`page-content ${path.includes('policy')||path.includes('conditions')?'legal-content':''}`}><PageContent slug={path}/></div><Contact compact/></main></>}
