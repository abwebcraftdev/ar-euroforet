import nodemailer from 'nodemailer';
import { S as SITE } from '../../chunks/site_CKupJ64a.mjs';
import { config } from 'dotenv';
import { resolve } from 'node:path';
export { renderers } from '../../renderers.mjs';

try {
  const root = process.cwd();
  config({ path: resolve(root, ".env") });
  config({ path: resolve(root, ".env.local") });
} catch (error) {
}
const REQUIRED_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key] || process.env[key] === "");
if (missingEnv.length > 0) {
  console.log("[contact] Variables SMTP chargées:", {
    SMTP_HOST: process.env.SMTP_HOST ? "✓" : "✗",
    SMTP_PORT: process.env.SMTP_PORT ? "✓" : "✗",
    SMTP_USER: process.env.SMTP_USER ? "✓" : "✗",
    SMTP_PASS: process.env.SMTP_PASS ? "✓ (masqué)" : "✗",
    CONTACT_TO: process.env.CONTACT_TO ? "✓" : "✗"
  });
}
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const prerender = false;
const transporter = missingEnv.length ? null : nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
const POST = async ({ request }) => {
  if (!transporter) {
    console.error("[contact] Configuration SMTP manquante :", missingEnv.join(", "));
    return new Response(
      JSON.stringify({
        success: false,
        message: "Le service de messagerie n'est pas configuré."
      }),
      { status: 500 }
    );
  }
  try {
    const formData = await request.formData();
    const nom = (formData.get("nom") ?? "").toString().trim();
    const telephone = (formData.get("telephone") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const codePostal = (formData.get("code_postal") ?? "").toString().trim();
    const service = (formData.get("service_souhaite") ?? "").toString().trim();
    const message = (formData.get("message") ?? "").toString().trim();
    const files = formData.getAll("photos").filter((entry) => entry instanceof File && entry.size > 0);
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || void 0
      }))
    );
    const now = /* @__PURE__ */ new Date();
    const leadId = now.toISOString().replace(/[-:TZ]/g, "").slice(0, 14);
    const submittedAt = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
      timeStyle: "short"
    }).format(now);
    const attachmentsCount = attachments.length;
    const attachmentsDisplay = attachmentsCount ? attachments.map((file) => `• ${escapeHtml(file.filename || "pièce jointe")}`).join("<br/>") : "Aucune";
    const subjectFragments = ["Lead A.R. Euro Forêt"];
    if (service) subjectFragments.push(service);
    if (nom) subjectFragments.push(nom);
    if (codePostal) subjectFragments.push(`CP ${codePostal}`);
    if (attachmentsCount) subjectFragments.push(`${attachmentsCount} ${attachmentsCount > 1 ? "PJ" : "PJ"}`);
    const subject = `${subjectFragments.join(" · ")} — #${leadId}`;
    const textBody = [
      `Bonjour,`,
      ``,
      `Nouvelle demande reçue via ${SITE.name} le ${submittedAt} — ID #${leadId}`,
      ``,
      `Message :`,
      message || "—",
      ``,
      `Nom               : ${nom || "—"}`,
      `Téléphone         : ${telephone || "—"}`,
      `Email             : ${email || "—"}`,
      `Code postal       : ${codePostal || "—"}`,
      `Service souhaité  : ${service || "—"}`,
      ``,
      attachmentsCount ? `Pièces jointes  : ${attachmentsCount} ${attachmentsCount > 1 ? "fichiers" : "fichier"} (${attachments.map((file) => file.filename).join(", ")})` : `Pièces jointes  : aucune`,
      ``,
      `Répondez directement à ce mail pour contacter ${nom || "le client"}.`
    ].join("\n");
    const replySections = [
      `Bonjour ${nom || ""},`,
      ``,
      `Merci pour votre demande concernant ${service || "notre intervention"} (${codePostal || "code postal"}).`,
      `Pourriez-vous me préciser : adresse des travaux, accès/hauteur, délai souhaité ?`,
      ``,
      `Nous pouvons vous proposer un premier créneau de visite.`,
      ``,
      `--- Rappel de votre message ---`,
      message || "—",
      ``,
      `--- Informations transmises ---`,
      `Téléphone : ${telephone || "—"}`,
      `Email : ${email || "—"}`,
      `Pièces jointes : ${attachmentsCount ? `${attachmentsCount} ${attachmentsCount > 1 ? "fichiers" : "fichier"} (${attachments.map((file) => file.filename).join(", ")})` : "aucune"}`,
      ``,
      `Bien cordialement,`,
      ``
    ];
    const mailtoBody = encodeURIComponent(replySections.join("\n"));
    const ccTarget = process.env.CONTACT_TO ? `&cc=${encodeURIComponent(process.env.CONTACT_TO)}` : "";
    const htmlBody = `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:640px;margin:auto;padding:16px;">
        <h2 style="margin:0 0 8px;">Nouvelle demande – ${escapeHtml(SITE.name)}</h2>
        <p style="margin:0 0 16px;color:#555;">
          Reçue le <strong>${escapeHtml(submittedAt)}</strong> — ID : <strong>#${escapeHtml(leadId)}</strong>
        </p>

        <p style="margin:12px 0;">
          ${telephone ? `<a href="tel:${escapeHtml(telephone)}" style="text-decoration:none;padding:10px 14px;border:1px solid #ccc;border-radius:6px;">📞 Appeler</a>` : ""}
          ${email ? `<a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(
      "Votre demande A.R. Euro Forêt"
    )}${ccTarget}&body=${mailtoBody}" style="text-decoration:none;padding:10px 14px;border:1px solid #ccc;border-radius:6px;margin-left:8px;">✉️ Répondre</a>` : ""}
        </p>

        <div style="margin:12px 0 20px;">
          <div style="font-weight:600;margin-bottom:6px;">Message</div>
          <div style="font-size:15px;line-height:1.5;background:#f7f7f7;padding:12px;border-radius:8px;">
            ${escapeHtml(message || "—").replace(/\n/g, "<br/>")}
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Nom</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${escapeHtml(nom || "—")}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Téléphone</td><td style="padding:8px;border-bottom:1px solid #eee;">${telephone ? `<a href="tel:${escapeHtml(telephone)}">${escapeHtml(telephone)}</a>` : "—"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "—"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Code postal</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(codePostal || "—")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Service souhaité</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${escapeHtml(service || "—")}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;vertical-align:top;">Pièces jointes</td><td style="padding:8px;border-bottom:1px solid #eee;">${attachmentsDisplay}</td></tr>
        </table>

        <p style="margin:10px 0;color:#444;">
          <strong>Résumé :</strong> ${escapeHtml(service || "Service non précisé")} — ${escapeHtml(
      codePostal || "CP ?"
    )} — contact ${escapeHtml(nom || "—")}
        </p>

        <p style="font-size:12px;color:#777;margin-top:16px;">
          Source : ${escapeHtml(formData.get("page_url")?.toString() || "non renseigné")}
        </p>
      </div>
    `;
    const toAddress = process.env.CONTACT_TO;
    const fromAddress = process.env.CONTACT_FROM || `Site ${SITE.name} <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      to: toAddress,
      from: fromAddress,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: email || void 0,
      attachments
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Demande envoyée avec succès."
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[contact] Erreur à l'envoi :", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Une erreur est survenue lors de l'envoi du message."
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
