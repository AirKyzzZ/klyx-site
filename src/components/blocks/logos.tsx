import Marquee from "react-fast-marquee";

import { cn } from "@/lib/utils";

const topRowCompanies = ["Mercury", "Watershed", "Retool", "Descript"];
const bottomRowCompanies = ["Perplexity", "Monzo", "Ramp", "Raycast", "Arc"];

export const Logos = () => {
  return (
    <section className="overflow-hidden pb-28 lg:pb-32">
      <div className="container space-y-10 lg:space-y-16">
        <div className="text-center">
          <h2 className="mb-4 text-xl text-balance md:text-2xl lg:text-3xl">
            Powering the world&apos;s best product teams.
            <br className="max-md:hidden" />
            <span className="text-muted-foreground">
              From next-gen startups to established enterprises.
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-8">
          <LogoRow companies={topRowCompanies} gridClassName="grid-cols-4" />
          <LogoRow
            companies={bottomRowCompanies}
            gridClassName="grid-cols-5"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
};

type LogoRowProps = {
  companies: string[];
  gridClassName: string;
  direction?: "left" | "right";
};

const LogoRow = ({ companies, gridClassName, direction }: LogoRowProps) => {
  return (
    <>
      <div className="hidden md:block">
        <div
          className={cn(
            "grid items-center justify-items-center gap-x-20 lg:gap-x-28",
            gridClassName,
          )}
        >
          {companies.map((company) => (
            <Wordmark key={company} name={company} className="opacity-50" />
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <Marquee direction={direction} pauseOnHover>
          {companies.map((company) => (
            <Wordmark key={company} name={company} className="mx-8" />
          ))}
        </Marquee>
      </div>
    </>
  );
};

const Wordmark = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-display text-2xl font-semibold tracking-tight whitespace-nowrap",
        className,
      )}
    >
      {name}
    </span>
  );
};
