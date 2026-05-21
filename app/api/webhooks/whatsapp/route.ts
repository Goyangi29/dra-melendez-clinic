import { NextRequest, NextResponse } from "next/server";

// Webhook compatible con n8n / Meta WhatsApp Business API
// Este endpoint recibe eventos de WhatsApp y los procesa

export async function GET(req: NextRequest) {
  // Verificacion del webhook (Meta requiere esto)
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "melendez-webhook-token";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Estructura del mensaje entrante de WhatsApp Business API
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry ?? []) {
        for (const change of entry.changes ?? []) {
          const value = change.value;

          // Mensaje entrante
          if (value.messages) {
            for (const message of value.messages) {
              console.log("[WhatsApp] Mensaje recibido:", {
                from: message.from,
                type: message.type,
                text: message.text?.body,
              });
              // TODO: procesar respuestas automaticas, confirmacion de citas, etc.
            }
          }

          // Status de mensaje enviado
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log("[WhatsApp] Status:", {
                id: status.id,
                status: status.status, // sent | delivered | read | failed
                recipient: status.recipient_id,
              });
              // TODO: actualizar WhatsAppLog en BD
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[WhatsApp webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
