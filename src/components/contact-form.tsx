import type { ReactNode } from "react";

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
  pending: string;
};

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  return (
    <form
      aria-describedby="contact-pending"
      className="flex w-full flex-col gap-2 space-y-4 rounded-md"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label={copy.name.label}>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={copy.name.placeholder}
          />
        </Field>
        <Field id="contact-email" label={copy.email.label}>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={copy.email.placeholder}
          />
        </Field>
      </div>
      <Field id="contact-company" label={copy.company.label}>
        <Input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder={copy.company.placeholder}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField id="contact-need" name="need" copy={copy.need} required />
        <SelectField id="contact-budget" name="budget" copy={copy.budget} />
      </div>
      <Field id="contact-message" label={copy.message.label}>
        <Textarea
          id="contact-message"
          name="message"
          required
          placeholder={copy.message.placeholder}
          className="min-h-32 resize-none"
        />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="contact-website">{copy.honeypot}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="contact-consent" name="consent" required />
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
      <div className="flex w-full flex-col items-end gap-3 pt-3">
        <Button type="submit" className="rounded-lg" disabled>
          {copy.submit}
        </Button>
        <p
          id="contact-pending"
          className="text-muted-foreground text-end text-sm"
        >
          {copy.pending}
        </p>
      </div>
    </form>
  );
}

function SelectField({
  id,
  name,
  copy,
  required,
}: {
  id: string;
  name: string;
  copy: SelectCopy;
  required?: boolean;
}) {
  return (
    <Field id={id} label={copy.label}>
      <Select name={name} required={required}>
        <SelectTrigger id={id} className="w-full">
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
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
