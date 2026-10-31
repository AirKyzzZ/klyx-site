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

const employeeOptions = ["1", "2-10", "11-50", "51-500"];

export const ContactForm = () => {
  return (
    <form className="flex w-full flex-col gap-2 space-y-4 rounded-md">
      <Field id="contact-name" label="Full name *">
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="First and last name"
        />
      </Field>
      <Field id="contact-email" label="Email address *">
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="me@company.com"
        />
      </Field>
      <Field id="contact-company" label="Company name">
        <Input
          id="contact-company"
          name="company"
          type="text"
          placeholder="Company name"
        />
      </Field>
      <Field id="contact-employees" label="Number of employees">
        <Select name="employees">
          <SelectTrigger id="contact-employees" className="w-full">
            <SelectValue placeholder="e.g. 11-50" />
          </SelectTrigger>
          <SelectContent>
            {employeeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id="contact-message" label="Your message *">
        <Textarea
          id="contact-message"
          name="message"
          required
          placeholder="Write your message"
          className="resize-none"
        />
      </Field>
      <div className="flex flex-row items-start space-y-0 space-x-1">
        <Checkbox id="contact-agree" name="agree" required />
        <div className="space-y-1 leading-none">
          <Label htmlFor="contact-agree">
            I agree to the terms and conditions
          </Label>
        </div>
      </div>
      <div className="flex w-full items-center justify-end pt-3">
        <Button className="rounded-lg" size="sm">
          Submit
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};
