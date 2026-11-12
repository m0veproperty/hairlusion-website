import type { Metadata } from 'next';
import './globals.css';
import './montage.css';
import './site.css';
import './reference-hero.css';
import HeroAtmosphere from './components/HeroAtmosphere';
import './continuous.css';
import CustomCursor from './components/CustomCursor';
import './polish.css';
import './inner-polish.css';
import CookieConsent from './components/CookieConsent';
import HeadingReveal from './components/HeadingReveal';
import './experience.css';
import Preloader from './components/Preloader';
export const metadata: Metadata = { title: 'Hairlusion — The detail behind confidence', description: 'Explore scalp micropigmentation with Joe at Hairlusion. Understand SMP, see real client results and talk through your options.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en-GB"><head><link rel="stylesheet" href="/assets/fonts.css" /></head><body><noscript><style>{'.carousel-controls,.montage-switch{display:none!important}'}</style></noscript><HeroAtmosphere/><Preloader/><CustomCursor/>{children}<CookieConsent/><HeadingReveal/></body></html>; }
