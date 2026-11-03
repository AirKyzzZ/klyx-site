"use server";

import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import { Resend } from "resend";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import {
  type ContactBlockReason,
  checkContactRequest,
  clientIp,
  maskIp,
} from "@/lib/contact-guard";
import {
  type ContactInput,
  type ContactState,
  contactSchema,
} from "@/lib/contact-schema";
import { site } from "@/lib/site";

const FROM = "Klyx <contact@send.klyx.fr>";
const FIELDS = [
  "name",
  "email",
  "company",
  "need",
  "budget",
  "message",
  "website",
  "consent",
] as const;

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const requested = formData.get("locale");
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = getStaticTranslator(locale, "contact.form.errors");
  const input = readFields(formData);

  const ip = clientIp(await headers());

  if (input.website) {
    logBlocked("honeypot", ip, locale);
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      if (fieldErrors[field]) continue;
      if (input[field as keyof typeof input] === undefined) {
        fieldErrors[field] = t("required");
      } else if (field === "email") {
        fieldErrors[field] = t("email");
      } else {
        fieldErrors[field] = t("invalid");
      }
    }
    return { status: "error", fieldErrors };
  }

  const blocked = checkContactRequest(ip, formData.get("fillMs"));
  if (blocked) {
    logBlocked(blocked, ip, locale);
    return { status: "error", message: t("generic", { email: site.email }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(
      "[contact] RESEND_API_KEY and CONTACT_TO_EMAIL must both be set to send contact requests.",
    );
    return {
      status: "error",
      message: t("unavailable", { email: site.email }),
    };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to,
      replyTo: parsed.data.email,
      subject: subjectFor(parsed.data),
      text: bodyFor(parsed.data),
    });
    if (error) {
      console.error(`[contact] Resend rejected the email: ${error.message}`);
      return { status: "error", message: t("generic", { email: site.email }) };
    }
  } catch (error) {
    console.error("[contact] Resend request failed", error);
    return { status: "error", message: t("generic", { email: site.email }) };
  }

  return { status: "success" };
}

function logBlocked(
  reason: ContactBlockReason | "honeypot",
  ip: string,
  locale: string,
) {
  console.warn(
    `[contact] blocked request: reason=${reason} ip=${maskIp(ip)} locale=${locale}`,
  );
}

function readFields(formData: FormData) {
  return Object.fromEntries(
    FIELDS.map((field) => {
      const value = formData.get(field);
      const text = typeof value === "string" ? value.trim() : "";
      return [field, text || undefined];
    }),
  ) as Partial<Record<(typeof FIELDS)[number], string>>;
}

function subjectFor(data: ContactInput): string {
  const who = data.company ? `${data.name} (${data.company})` : data.name;
  return `Nouvelle demande ${data.need} : ${who}`.replace(/\s+/g, " ");
}

function bodyFor(data: ContactInput): string {
  return [
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    `Entreprise : ${data.company ?? "-"}`,
    `Besoin : ${data.need}`,
    `Budget : ${data.budget ?? "-"}`,
    "",
    data.message,
  ].join("\n");
}
