import type { NextConfig } from 'next';
const config: NextConfig = { output: 'export', trailingSlash:true, images: { unoptimized: true }, experimental: {useTypeScriptCli:false,workerThreads:true,webpackBuildWorker:false,cpus:1} };
export default config;
