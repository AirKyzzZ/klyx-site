"use client";

import {
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
} from "react";

import { sendContact } from "@/actions/send-contact";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ContactState } from "@/lib/contact-schema";

type FieldCopy = { label: string; placeholder: string };
type SelectCopy = FieldCopy & { options: { value: string; label: string }[] };

export type ContactFormCopy = {
  name: FieldCopy;
  email: FieldCopy;
  company: FieldCopy;
  need: SelectCopy;
  budget: SelectCopy;
  message: FieldCopy;
  honeypot: string;
  consent: string;
  privacyLink: string;
  submit: string;
  sending: string;
  success: string;
};

const INITIAL_STATE: ContactState = { status: "idle" };

export function ContactForm({
  copy,
  locale,
}: {
  copy: ContactFormCopy;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState(
    sendContact,
    INITIAL_STATE,
  );
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <p role="status" className="text-lg leading-snug">
        {copy.success}
      </p>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 space-y-4 rounded-md"
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label={copy.name.label} error={errors.name}>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder={copy.name.placeholder}
            {...errorProps("contact-name", errors.name)}
          />
        </Field>
        <Field id="contact-email" label={copy.email.label} error={errors.email}>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder={copy.email.placeholder}
            {...errorProps("contact-email", errors.email)}
          />
        </Field>
      </div>
      <Field
        id="contact-company"
        label={copy.company.label}
        error={errors.company}
      >
        <Input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={120}
          placeholder={copy.company.placeholder}
          {...errorProps("contact-company", errors.company)}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          id="contact-need"
          name="need"
          copy={copy.need}
          error={errors.need}
          required
        />
        <SelectField
          id="contact-budget"
          name="budget"
          copy={copy.budget}
          error={errors.budget}
        />
      </div>
      <Field
        id="contact-message"
        label={copy.message.label}
        error={errors.message}
      >
        <Textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          placeholder={copy.message.placeholder}
          className="min-h-32 resize-none"
          {...errorProps("contact-message", errors.message)}
        />
      </Field>
      <div aria-hidden="true" inert className="absolute -left-[9999px]">
        <label htmlFor="contact-website">{copy.honeypot}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-start gap-2">
          <Checkbox
            id="contact-consent"
            name="consent"
            required
            {...errorProps("contact-consent", errors.consent)}
          />
          <Label htmlFor="contact-consent" className="leading-snug font-normal">
            <span>
              {copy.consent}{" "}
              <Link
                href="/confidentialite"
                className="underline underline-offset-4"
              >
                {copy.privacyLink}
              </Link>
            </span>
          </Label>
        </div>
        <FieldError id="contact-consent" error={errors.consent} />
      </div>
      <div className="flex w-full flex-col items-end gap-3 pt-3">
        <Button type="submit" className="rounded-lg" disabled={pending}>
          {pending ? copy.sending : copy.submit}
        </Button>
        {state.message ? (
          <p role="alert" className="text-destructive text-end text-sm">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function errorProps(id: string, error: string | undefined) {
  if (!error) return {};
  return { "aria-invalid": true, "aria-describedby": `${id}-error` };
}

function SelectField({
  id,
  name,
  copy,
  error,
  required,
}: {
  id: string;
  name: string;
  copy: SelectCopy;
  error: string | undefined;
  required?: boolean;
}) {
  return (
    <Field id={id} label={copy.label} error={error}>
      <Select name={name} required={required}>
        <SelectTrigger id={id} className="w-full" {...errorProps(id, error)}>
          <SelectValue placeholder={copy.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {copy.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}

function FieldError({ id, error }: { id: string; error: string | undefined }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="text-destructive text-sm">
      {error}
    </p>
  );
}
