import * as cheerio from "cheerio";

export type PageInfo = {
  url: string;
  title: string;
  description: string;
};

const MAX_URLS = 50;
const REQUEST_TIMEOUT = 9000;

export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withProtocol);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export function uniqueUrls(urls: string[]): string[] {
  return Array.from(new Set(urls.map((url) => normalizeUrl(url)).filter(Boolean) as string[]));
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "DesignsCtrl LLMs.txt Generator/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch ${url}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractUrlsFromXml(xml: string): string[] {
  const urls: string[] = [];
  const regex = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  return uniqueUrls(urls);
}

export async function discoverUrls(input: {
  websiteUrl?: string;
  sitemapUrl?: string;
  pastedUrls?: string;
}): Promise<string[]> {
  const pasted = input.pastedUrls
    ? input.pastedUrls.split(/\r?\n|,/).map((line) => line.trim()).filter(Boolean)
    : [];

  if (pasted.length) return uniqueUrls(pasted).slice(0, MAX_URLS);

  const sitemapUrl = normalizeUrl(input.sitemapUrl || "");
  if (sitemapUrl) {
    const xml = await fetchText(sitemapUrl);
    return extractUrlsFromXml(xml).slice(0, MAX_URLS);
  }

  const websiteUrl = normalizeUrl(input.websiteUrl || "");
  if (!websiteUrl) throw new Error("Please enter a valid website URL, sitemap URL, or pasted URLs.");

  const root = new URL(websiteUrl);
  const candidates = [
    new URL("/sitemap.xml", root.origin).toString(),
    new URL("/sitemap_index.xml", root.origin).toString(),
    new URL("/wp-sitemap.xml", root.origin).toString(),
  ];

  for (const candidate of candidates) {
    try {
      const xml = await fetchText(candidate);
      const found = extractUrlsFromXml(xml);
      if (found.length) return found.slice(0, MAX_URLS);
    } catch {
      // Try next sitemap candidate.
    }
  }

  return [root.origin + "/"];
}

export async function getPageInfo(url: string): Promise<PageInfo> {
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  const title =
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("title").first().text().trim() ||
    new URL(url).hostname;

  const description =
    $("meta[name='description']").attr("content")?.trim() ||
    $("meta[property='og:description']").attr("content")?.trim() ||
    $("h1").first().text().trim() ||
    "Important page on this website.";

  return {
    url,
    title: cleanText(title),
    description: cleanText(description),
  };
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[\[\]\n\r]/g, "").trim().slice(0, 220);
}

function guessWebsiteName(pages: PageInfo[], fallbackUrl: string): string {
  const firstTitle = pages[0]?.title;
  if (firstTitle) return firstTitle.split(/[|–—-]/)[0].trim();
  return new URL(fallbackUrl).hostname.replace(/^www\./, "");
}

function findContactUrl(pages: PageInfo[]): string | null {
  return pages.find((page) => /contact|support|get-in-touch/i.test(page.url + " " + page.title))?.url || null;
}

export function generateLlmsTxt(pages: PageInfo[]): string {
  if (!pages.length) throw new Error("No pages were found to generate llms.txt.");

  const siteName = guessWebsiteName(pages, pages[0].url);
  const homepageDescription = pages[0]?.description || "AI-friendly website overview.";
  const contactUrl = findContactUrl(pages);

  const pageLines = pages
    .slice(0, MAX_URLS)
    .map((page) => `- [${page.title}](${page.url}): ${page.description}`)
    .join("\n");

  return `# ${siteName}\n\n> ${homepageDescription}\n\n## Important Pages\n${pageLines}\n\n## Contact\n${contactUrl ? `- [Contact](${contactUrl})` : "- Contact page not detected. Add your main contact URL here."}\n`;
}

export async function buildLlmsTxt(input: {
  websiteUrl?: string;
  sitemapUrl?: string;
  pastedUrls?: string;
}) {
  const urls = await discoverUrls(input);
  const results = await Promise.allSettled(urls.map((url) => getPageInfo(url)));
  const pages = results
    .filter((result): result is PromiseFulfilledResult<PageInfo> => result.status === "fulfilled")
    .map((result) => result.value);

  if (!pages.length) {
    throw new Error("We could not read any pages. Please check the URL or try pasting specific URLs.");
  }

  return {
    totalUrls: urls.length,
    scannedPages: pages.length,
    pages,
    content: generateLlmsTxt(pages),
  };
}
