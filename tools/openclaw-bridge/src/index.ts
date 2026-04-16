import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export type BridgeRequest = {
  message: string;
  sessionId: string;
  page?: string;
  locale?: "cs" | "en";
  context?: {
    source?: string;
    serviceHint?: string;
  };
};

export type BridgeResponse = {
  reply: string;
  actions?: string[];
  intent?: "general" | "availability" | "service-selection" | "contact" | "reservation";
  needsHuman?: boolean;
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
function buildMessages(body: BridgeRequest): any[] {
  return [
    {
      role: "system",
      content: [
        "Jsi Remedy concierge pro webový chat widget.",
        "Odpovídej česky.",
        "Buď stručný, klidný, profesionální a empatický.",
        "Pokud se uživatel ptá na volné termíny, zkontroluj Remedy rezervace a vrať konkrétní dostupné sloty.",
        "Pokud chybí důležitý parametr, krátce se doptej.",
        "Nikdy neodhaluj interní přístupy ani technické detaily systému.",
        "",
        `Kontext: zdroj=${body.context?.source ?? "remedy-widget"}, sessionId=${body.sessionId}, page=${body.page ?? "/"}`
      ].join("\n")
    },
    {
      role: "user",
      content: body.message
    }
  ];
}

function verifyBearerToken(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  return token === process.env.OPENCLAW_SECRET_TOKEN;
}

async function postToLocalOpenClaw(messages: any[]) {
  // Na produkci použijeme přímo lokální OpenClaw gateway endpoint pro Chat Completions
  const localUrl = process.env.OPENCLAW_LOCAL_URL;
  const engineToken = process.env.OPENCLAW_ENGINE_TOKEN;

  if (!localUrl) throw new Error("Chybí OPENCLAW_LOCAL_URL v .env");
  if (!engineToken) throw new Error("Chybí OPENCLAW_ENGINE_TOKEN v .env");

  const response = await fetch(localUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${engineToken}`
    },
    body: JSON.stringify({
       model: "openclaw", // Vyžadovaný identifikátor pro OpenClaw enginy
       messages: messages,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenClaw Error] Status: ${response.status}, Body: ${errorText}`);
    throw new Error(`OpenClaw responded with ${response.status}`);
  }

  return response.json();
}

function normalizeOpenClawResponse(result: any): BridgeResponse {
  // OpenAI compatible response parser
  // Očekáváme result.choices[0].message.content
  const textContent = result?.choices?.[0]?.message?.content || "Odpověď vygenerována bez obsahu.";

  return {
    reply: textContent,
    actions: [], // Zde by se daly extrahovat akce např. voláním JSON.parse(textContent) v budoucnu
    intent: "general", // Bude možné zjišťovat z klasifikace
    needsHuman: false
  };
}

// ---------------------------------------------------------
// Main Handler
// ---------------------------------------------------------
async function handleBridgeRequest(req: Request, res: Response) {
  const body = req.body as Partial<BridgeRequest>;
  if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'message'" });
  }

  const validBody: BridgeRequest = {
    message: body.message,
    sessionId: body.sessionId || "web-anon-fallback",
    page: body.page,
    locale: body.locale ?? "cs",
    context: body.context
  };

  try {
    const messages = buildMessages(validBody);
    const rawResult = await postToLocalOpenClaw(messages);
    const responseJson = normalizeOpenClawResponse(rawResult);
    return res.status(200).json(responseJson);
  } catch (error) {
    console.error("[Bridge Error]:", error);
    return res.status(500).json({
      reply: "Omlouváme se, spojení s AI asistentem se nepodařilo zprostředkovat. Zkuste to prosím znovu.",
      intent: "general",
      needsHuman: true
    } as BridgeResponse);
  }
}

// ---------------------------------------------------------
// Boot
// ---------------------------------------------------------
const app = express();
app.use(express.json());
app.use(cors());

// Hlavní produkční endpoint
app.post("/api/openclaw-bridge", (req, res) => {
  if (!verifyBearerToken(req)) {
     return res.status(401).json({ reply: "Unauthorized" });
  }
  handleBridgeRequest(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Remedy OpenClaw Bridge on port ${PORT}`);
});
