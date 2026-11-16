import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/contact — envoie un message du formulaire de contact par email.
 *
 * Configuration (variables d'environnement, voir .env.example) :
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO
 *
 * Sans configuration SMTP, l'API répond 503 avec un message explicite :
 * aucun email n'est envoyé silencieusement.
 */

const CONTACT_TO = process.env.CONTACT_TO ?? "gecara6430@gamil.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  type?: unknown;
  message?: unknown;
};

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return badRequest("Corps JSON invalide.");
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const type = typeof payload.type === "string" ? payload.type.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return badRequest("Champs requis : nom, email et message.");
  }
  if (name.length > 200) {
    return badRequest("Le nom est trop long (200 caractères max).");
  }
  if (!EMAIL_RE.test(email)) {
    return badRequest("Adresse email invalide.");
  }
  if (message.length > MAX_MESSAGE) {
    return badRequest(`Message trop long (${MAX_MESSAGE} caractères max).`);
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Service d'envoi non configuré : SMTP_HOST, SMTP_USER et SMTP_PASS sont requis.",
      },
      { status: 503 },
    );
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = (process.env.SMTP_SECURE ?? "false") === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"Portfolio Arafath GEC" <${user}>`,
      to: CONTACT_TO,
      replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`,
      subject: `[Portfolio] ${type || "Nouveau message"} — ${name}`.slice(0, 200),
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        `Type : ${type || "non précisé"}`,
        "",
        message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] échec d'envoi :", error);
    return NextResponse.json(
      { ok: false, error: "Échec de l'envoi de l'email. Réessayez plus tard." },
      { status: 502 },
    );
  }
}
