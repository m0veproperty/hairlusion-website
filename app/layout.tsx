import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Hairlusion — The detail behind confidence', description: 'Explore scalp micropigmentation with Joe at Hairlusion. Understand SMP, see real client results and talk through your options.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en-GB"><head><link rel="stylesheet" href="/assets/fonts.css" /></head><body>{children}</body></html>; }
