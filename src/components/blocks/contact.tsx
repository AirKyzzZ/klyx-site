import Link from "next/link";

import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";

import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";

const socials = [
  { name: "Facebook", href: "#", icon: FaFacebook },
  { name: "X", href: "#", icon: FaXTwitter },
  { name: "LinkedIn", href: "#", icon: FaLinkedin },
];

const contactInfo = [
  {
    title: "Corporate office",
    content: (
      <p className="text-muted-foreground mt-3">
        1 Carlsberg Close
        <br />
        1260 Hillview, Australia
      </p>
    ),
  },
  {
    title: "Email us",
    content: (
      <div className="mt-3">
        <div>
          <p>Careers</p>
          <Link
            href="mailto:careers@example.com"
            className="text-muted-foreground hover:text-foreground"
          >
            careers@example.com
          </Link>
        </div>
        <div className="mt-1">
          <p>Press</p>
          <Link
            href="mailto:press@example.com"
            className="text-muted-foreground hover:text-foreground"
          >
            press@example.com
          </Link>
        </div>
      </div>
    ),
  },
  {
    title: "Follow us",
    content: (
      <div className="mt-3 flex gap-6 lg:gap-10">
        {socials.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            aria-label={name}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon className="size-5" />
          </Link>
        ))}
      </div>
    ),
  },
];

export const Contact = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-2xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Contact us
        </h1>
        <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
          Hopefully this form gets through our spam filters.
        </p>

        <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
          {contactInfo.map((info) => (
            <div key={info.title}>
              <h2 className="font-medium">{info.title}</h2>
              {info.content}
            </div>
          ))}
        </div>

        <DashedLine className="my-12" />

        <div className="mx-auto">
          <h2 className="mb-4 text-lg font-semibold">Inquiries</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
