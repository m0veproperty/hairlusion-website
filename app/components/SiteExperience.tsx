'use client';
import {usePathname} from 'next/navigation';
import HeroAtmosphere from './HeroAtmosphere';
import Preloader from './Preloader';
import CustomCursor from './CustomCursor';
import CookieConsent from './CookieConsent';
import HeadingReveal from './HeadingReveal';
import SupportWidget from './SupportWidget';
export default function SiteExperience({children}:{children:React.ReactNode}){const path=usePathname();if(path.startsWith('/portal'))return <>{children}</>;return <><HeroAtmosphere/><Preloader/><CustomCursor/>{children}<CookieConsent/><HeadingReveal/><SupportWidget/></>}
