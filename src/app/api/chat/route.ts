import { NextResponse } from "next/server";
import { VAVRINEC_SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { getVerifiedSlotsText } from "@/actions/clubspire";

export type ChatRequest = {
  message: string;
  history?: { role: "assistant" | "user"; text: string }[];
  sessionId: string;
  page?: string;
  locale?: "cs" | "en";
  context?: {
    source?: string;
    serviceHint?: string;
  };
};

export type ChatResponse = {
  reply: string;
  actions?: string[];
  intent?:
    | "general"
    | "availability"
    | "service-selection"
    | "contact"
    | "reservation";
  needsHuman?: boolean;
};

const FALLBACK_RESPONSE: ChatResponse = {
  reply: "Omlouvám se, ale momentálně se mi nedaří spojit se serverem. Zkuste to prosím za malou chvíli, nebo navštivte naši stránku s kontakty.",
  actions: ["Kontakt"],
  intent: "contact",
  needsHuman: true,
};

function buildPrompt(body: ChatRequest) {
  const historyText = body.history && body.history.length > 0
    ? body.history.map(m => `${m.role === 'assistant' ? 'Ty (Vavřinec)' : 'Uživatel'}: ${m.text}`).join('\n')
    : "Žádná předchozí konverzace.";

  return [
    VAVRINEC_SYSTEM_PROMPT,
    "",
    "Pravidla navíc pro tento kontext:",
    "Pokud se uživatel ptá na volné termíny, zkontroluj Remedy rezervace a vrať konkrétní dostupné sloty.",
    "Pokud chybí důležitý parametr, krátce se doptej.",
    "Nikdy neodhaluj interní přístupy ani technické detaily systému.",
    "",
    `Kontext: zdroj=${body.context?.source ?? "remedy-widget"}, sessionId=${body.sessionId}, page=${body.page ?? "/"}`,
    "",
    "--- PŘEDCHOZÍ HISTORIE CHATU ---",
    historyText,
    "--- KONEC HISTORIE ---",
    "",
    "Nová zpráva uživatele (na tuto zareaguj!):",
    body.message,
  ].join("\n");
}

export async function postChatToOpenClaw(body: ChatRequest): Promise<ChatResponse> {
  const prompt = buildPrompt(body);

  const OPENCLAW_ENDPOINT = process.env.OPENCLAW_API_URL;
  const OPENCLAW_API_KEY = process.env.OPENCLAW_SECRET_TOKEN;

  // Bezpečnostní pojistka v případě chybějících klíčů
  if (!OPENCLAW_ENDPOINT || !OPENCLAW_API_KEY) {
    console.error("Chybí OpenClaw environment proměnné!");
    throw new Error("Missing API config");
  }

  // Zajištění správné cesty endpointu
  const finalEndpoint = OPENCLAW_ENDPOINT.endsWith("/api/openclaw-bridge") 
    ? OPENCLAW_ENDPOINT 
    : `${OPENCLAW_ENDPOINT.replace(/\/$/, '')}/api/openclaw-bridge`;

  // ------------------------------------------------------------------
  // OSTRÉ SÍŤOVÉ SPOJENÍ NA OPENCLAW ENGINE
  // ------------------------------------------------------------------
  const res = await fetch(finalEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENCLAW_API_KEY}`
    },
    body: JSON.stringify({ 
      message: prompt, 
      sessionId: body.sessionId,
      intentDetection: true
    })
  });

  if (!res.ok) {
    throw new Error(`OpenClaw API chyba: HTTP ${res.status}`);
  }

  return await res.json();
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    if (!bodyText) {
      return NextResponse.json({ error: "Tělo požadavku nesmí být prázdné." }, { status: 400 });
    }

    const body = JSON.parse(bodyText) as Partial<ChatRequest>;

    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "Pole 'message' je povinné a textové." }, { status: 400 });
    }
    
    const requestBody: ChatRequest = {
      message: body.message,
      history: body.history,
      sessionId: body.sessionId || crypto.randomUUID(),
      page: body.page,
      locale: body.locale ?? "cs",
      context: body.context,
    };

    // Forward do OpenClaw vrstvy
    let responseData = await postChatToOpenClaw(requestBody);

    // AI NÁSTROJE / TOOL CALLING (Intercept)
    if (responseData.reply && responseData.reply.includes("@TOOL_CALL:")) {
      const match = responseData.reply.match(/@TOOL_CALL:\s*({.*})/);
      if (match && match[1]) {
         try {
           const toolData = JSON.parse(match[1]);
           if (toolData.tool === "get_slots") {
              const personData = toolData.person || "kuba";
              const personName = personData.toLowerCase() === "kuba" ? "Kubu" : "Radima";
              
              const slotsText = await getVerifiedSlotsText(personData);
              if (slotsText) {
                 responseData.reply = `Tady mám aktuálně nejbližší volno pro ${personName}:\n\n${slotsText}\n\n[Rezervovat termín online](https://rezervace.remedy.cz/)`;
              } else {
                 responseData.reply = `Teď zrovna nemám pro ${personName} žádný ověřený zcela volný blok (podmínkou pro online rezervaci je souvislých 50 minut). Zkuste to omrknout [na webu](https://rezervace.remedy.cz/), nebo se mi ozvěte na WhatsApp a nějak Vás zkusíme vtlačit. 🦥`;
              }
           }
         } catch(e) {
           console.error("[TOOL CALING PARSE ERROR]", e);
           responseData.reply = "Při zjišťování přesného termínu došlo k drobné technické chybě na komunikaci se serverem. Ale kouknout do [rezervací](https://rezervace.remedy.cz/) můžete teď hned oknem. 🦥";
         }
      }
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[CHAT API ROUTE ERROR]: ", errorMsg);
    return NextResponse.json({ ...FALLBACK_RESPONSE, debug_error: errorMsg }, { status: 500 });
  }
}
