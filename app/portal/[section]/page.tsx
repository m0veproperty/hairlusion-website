import Portal from '../components/Portal';
export function generateStaticParams(){return ['pipeline','clients','appointments','inbox','tasks','email-templates','automations','photos','reports','settings'].map(section=>({section}))}
export const dynamicParams=false;
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <Portal section={section}/>}
