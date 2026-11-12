import SiteExperience from './components/SiteExperience';
import type { Metadata } from 'next';
import './globals.css';
import './montage.css';
import './site.css';
import './reference-hero.css';
import './continuous.css';
import './polish.css';
import './inner-polish.css';
import './experience.css';
import './booking.css';
export const metadata: Metadata = { title: 'Hairlusion — The detail behind confidence', description: 'Explore scalp micropigmentation with Joe at Hairlusion. Understand SMP, see real client results and talk through your options.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en-GB"><head><link rel="stylesheet" href="/assets/fonts.css" /></head><body><noscript><style>{'.carousel-controls,.montage-switch{display:none!important}'}</style></noscript><SiteExperience>{children}</SiteExperience></body></html>; }

