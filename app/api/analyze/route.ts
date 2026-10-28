import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { buildDemoAnalysis } from "@/lib/demo-analysis";
import { getUi } from "@/lib/i18n/ui";
import { parseLocale } from "@/lib/i18n/locale";
import { fillDecisionAnalysisGaps } from "@/lib/analysis-gap-fill";
import { analyzeWithOpenAI } from "@/lib/llm-analyze";
import { rateLimitAllow } from "@/lib/rate-limit";
import type { AnalyzeRequestBody, SuggestedDirectoryRole } from "@/lib/types";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 64;

async function safeLoadMatchedExperts(role: SuggestedDirectoryRole) {
  try {
    const { loadMatchedExperts } = await import("@/lib/matched-experts");
    return await loadMatchedExperts(role);
  } catch (e) {
    console.error("[analyze] loadMatchedExperts failed", e);
    return [];
  }
}

function normalizeDemoOpts(body: AnalyzeRequestBody) {
  const stakesOpt =
    typeof body.stakesLevel === "number" &&
    body.stakesLevel >= 1 &&
    body.stakesLevel <= 10
      ? { stakesLevel: body.stakesLevel }
      : undefined;
  return {
    ...stakesOpt,
    context: typeof body.context === "string" ? body.context : undefined,
    constraints:
      typeof body.constraints === "string" ? body.constraints : undefined,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyzeRequestBody;
    const decisionRaw = typeof body.decision === "string" ? body.decision : "";
    const decision = decisionRaw.trim() || "Need help structuring a decision.";
    const locale = parseLocale(body.language);
    const ui = getUi(locale);
    const demoOpts = normalizeDemoOpts(body);
    const ip = getClientIp(req);

    // Free package is open on-device without share unlock.

    // On shared/mobile IPs prefer graceful fallback over a hard 429.
    if (!rateLimitAllow(`analyze:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
      const analysis = fillDecisionAnalysisGaps(
        buildDemoAnalysis(decision, locale, demoOpts),
        locale,
      );
      const matchedExperts = await safeLoadMatchedExperts(
        analysis.suggestedDirectoryRole ?? "UNSPECIFIED",
      );
      return NextResponse.json({
        analysis,
        mode: "fallback" as const,
        warning: ui.apiAnalysisServiceNotice,
        matchedExperts,
      });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const raw = await analyzeWithOpenAI({
          ...body,
          decision,
          language: locale,
        });
        const analysis = fillDecisionAnalysisGaps(raw, locale);
        const matchedExperts = await safeLoadMatchedExperts(
          analysis.suggestedDirectoryRole ?? "UNSPECIFIED",
        );
        return NextResponse.json({
          analysis,
          mode: "live" as const,
          matchedExperts,
        });
      } catch (e) {
        console.error("[analyze] OpenAI path failed", e);
        const analysis = fillDecisionAnalysisGaps(
          buildDemoAnalysis(decision, locale, demoOpts),
          locale,
        );
        const matchedExperts = await safeLoadMatchedExperts(
          analysis.suggestedDirectoryRole ?? "UNSPECIFIED",
        );
        return NextResponse.json({
          analysis,
          mode: "fallback" as const,
          warning: ui.apiAnalysisServiceNotice,
          matchedExperts,
        });
      }
    }

    const analysis = fillDecisionAnalysisGaps(
      buildDemoAnalysis(decision, locale, demoOpts),
      locale,
    );
    const matchedExperts = await safeLoadMatchedExperts(
      analysis.suggestedDirectoryRole ?? "UNSPECIFIED",
    );
    return NextResponse.json({
      analysis,
      mode: "demo" as const,
      hint: ui.apiHintDemo,
      matchedExperts,
    });
  } catch {
    const locale = parseLocale("en");
    const ui = getUi(locale);
    const analysis = fillDecisionAnalysisGaps(
      buildDemoAnalysis("Need help structuring a decision.", locale, {}),
      locale,
    );
    return NextResponse.json({
      analysis,
      mode: "fallback" as const,
      warning: ui.apiAnalysisServiceNotice,
      matchedExperts: [],
    }, { status: 200 });
  }
}
