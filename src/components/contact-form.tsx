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
      <p
        role="status"
        className="border-line-strong bg-surface-2 type-lead text-text rounded-sm border px-5 py-6"
      >
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
      className="flex w-full flex-col gap-6"
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
      <div className="grid gap-6">
        <SelectField
          id="contact-need"
          name="need"
          copy={copy.need}
          error={errors.need}
          required
        />
      </div>
      <BudgetPills
        id="contact-budget"
        name="budget"
        copy={copy.budget}
        error={errors.budget}
      />
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
          className="min-h-36 resize-none"
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
        <div className="flex items-start gap-3">
          <Checkbox
            id="contact-consent"
            name="consent"
            required
            {...errorProps("contact-consent", errors.consent)}
          />
          <Label
            htmlFor="contact-consent"
            className="text-text-2 text-sm leading-snug font-normal"
          >
            <span>
              {copy.consent}{" "}
              <Link
                href="/confidentialite"
                className="text-text underline underline-offset-4"
              >
                {copy.privacyLink}
              </Link>
            </span>
          </Label>
        </div>
        <FieldError id="contact-consent" error={errors.consent} />
      </div>
      <div className="flex w-full flex-col gap-3 sm:items-end">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={pending}
        >
          {pending ? copy.sending : copy.submit}
        </Button>
        {state.message ? (
          <p role="alert" className="text-destructive text-sm sm:text-end">
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

function BudgetPills({
  id,
  name,
  copy,
  error,
}: {
  id: string;
  name: string;
  copy: SelectCopy;
  error: string | undefined;
}) {
  return (
    <fieldset className="grid gap-2" {...errorProps(id, error)}>
      <legend className="type-label text-text-3 mb-2">{copy.label}</legend>
      <div className="flex flex-wrap gap-2">
        {copy.options.map((option) => (
          <label
            key={option.value}
            className="border-line-strong bg-surface-2 text-text-2 hover:border-text-3 hover:text-text has-checked:border-accent has-checked:bg-accent-soft has-checked:text-text has-focus-visible:outline-accent inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 font-mono text-[0.8125rem] transition-colors duration-(--d-fast) has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
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
      <Label htmlFor={id} className="type-label text-text-3">
        {label}
      </Label>
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
