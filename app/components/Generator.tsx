"use client";

import { useState } from "react";
import { Copy, Download, Loader2, Sparkles } from "lucide-react";

type Mode = "website" | "sitemap" | "paste";

type ApiResult = {
  totalUrls: number;
  scannedPages: number;
  content: string;
};

export default function Generator() {
  const [mode, setMode] = useState<Mode>("website");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [pastedUrls, setPastedUrls] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    setCopied(false);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: mode === "website" ? websiteUrl : "",
          sitemapUrl: mode === "sitemap" ? sitemapUrl : "",
          pastedUrls: mode === "paste" ? pastedUrls : "",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate llms.txt");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate llms.txt");
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!result?.content) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
  }

  function downloadFile() {
    if (!result?.content) return;
    const blob = new Blob([result.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "llms.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section id="generator" className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-premium md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles size={16} /> AI-ready website file
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Generate your llms.txt</h2>
          <p className="mt-3 text-slate-600">Enter a website, sitemap, or list of URLs. We scan page titles and meta descriptions to create a clean AI-friendly file.</p>

          <div className="mt-6 grid grid-cols-3 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
            {(["website", "sitemap", "paste"] as Mode[]).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-xl px-3 py-2 transition ${mode === item ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
              >
                {item === "website" ? "Website" : item === "sitemap" ? "Sitemap" : "Paste URLs"}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {mode === "website" && (
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none ring-blue-100 focus:ring-4" placeholder="https://designsctrl.net" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
            )}
            {mode === "sitemap" && (
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none ring-blue-100 focus:ring-4" placeholder="https://example.com/sitemap.xml" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} />
            )}
            {mode === "paste" && (
              <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none ring-blue-100 focus:ring-4" placeholder="https://example.com/&#10;https://example.com/services&#10;https://example.com/contact" value={pastedUrls} onChange={(e) => setPastedUrls(e.target.value)} />
            )}
          </div>

          {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <button onClick={generate} disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? "Scanning website..." : "Generate LLMs.txt"}
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-white">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Generated Preview</p>
              <p className="text-xs text-slate-400">{result ? `${result.scannedPages}/${result.totalUrls} pages scanned` : "Your llms.txt will appear here"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyText} disabled={!result} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-40"><Copy size={16} /> {copied ? "Copied" : "Copy"}</button>
              <button onClick={downloadFile} disabled={!result} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-40"><Download size={16} /> Download</button>
            </div>
          </div>
          <pre className="min-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black/30 p-4 text-sm leading-6 text-slate-200">{result?.content || `# Website Name\n\n> Short website summary\n\n## Important Pages\n- [Page Title](URL): Meta description\n\n## Contact\n- [Contact](URL)`}</pre>
        </div>
      </div>
    </section>
  );
}
