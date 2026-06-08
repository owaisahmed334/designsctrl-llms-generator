import Generator from "./components/Generator";
import Image from "next/image";
import { ArrowRight, Bot, CheckCircle2, FileText, Globe2, MessageCircle } from "lucide-react";

const faqs = [
  {
    title: "What is LLMs.txt?",
    text: "LLMs.txt is a simple text file that helps AI tools understand the most important pages, services, and context of your website.",
  },
  {
    title: "Why your website needs it",
    text: "It gives AI crawlers a clean summary of your business, so tools like ChatGPT, Claude, and Perplexity can better understand your content.",
  },
  {
    title: "LLMs.txt vs Robots.txt vs Sitemap.xml",
    text: "Robots.txt gives crawler rules, sitemap.xml lists URLs for search engines, and llms.txt summarizes your content for AI systems.",
  },
  {
    title: "How to upload it",
    text: "Upload llms.txt to your website root folder, for example example.com/llms.txt. WordPress, Shopify, Next.js, and custom hosting can all support this.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen gradient-grid">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><Bot size={22} /></div>
          <div>
            <Image
  src="/images/dc-logo-v2.png"
  alt="DesignsCtrl"
  width={180}
  height={50}
  priority
/>
           
          </div>
        </div>
        <a href="#generator" className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 sm:inline-flex">Generate Free</a>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-8 pt-8 text-center md:pt-16">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
          <Globe2 size={16} /> Free online AI visibility tool
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Free LLMs.txt Generator for AI-ready websites
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Generate a clean llms.txt file for ChatGPT, Claude, Perplexity, and other AI tools using your website URL, sitemap, or selected pages.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> Sitemap detection</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> Copy & download</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> No complex setup</span>
        </div>
      </section>

      <Generator />

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 md:grid-cols-2">
        {faqs.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><FileText size={21} /></div>
            <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-premium md:p-12">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="font-bold text-blue-300">Need help adding llms.txt to your website?</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">Let DesignsCtrl make your website AI-ready.</h2>
              <p className="mt-4 text-slate-300">We can add llms.txt, improve sitemap structure, optimize service pages, and prepare your site for modern AI search visibility.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <a href="https://designsctrl.net/contact/" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 hover:bg-slate-100">Contact DesignsCtrl <ArrowRight size={18} /></a>
              <a href="https://wa.me/923102119077" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold text-white hover:bg-blue-500"><MessageCircle size={18} /> WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
