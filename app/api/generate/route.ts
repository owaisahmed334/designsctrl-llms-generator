import { NextResponse } from "next/server";
import { buildLlmsTxt } from "../../../lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await buildLlmsTxt({
      websiteUrl: body.websiteUrl,
      sitemapUrl: body.sitemapUrl,
      pastedUrls: body.pastedUrls,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong." },
      { status: 400 }
    );
  }
}
