import type { Metadata } from "next";

import { Background } from "@/components/background";
import { About } from "@/components/blocks/about";
import { AboutHero } from "@/components/blocks/about-hero";
import { Contact } from "@/components/blocks/contact";
import { FAQ } from "@/components/blocks/faq";
import { Features } from "@/components/blocks/features";
import { Hero } from "@/components/blocks/hero";
import { Investors } from "@/components/blocks/investors";
import { Logos } from "@/components/blocks/logos";
import { Pricing } from "@/components/blocks/pricing";
import { PricingTable } from "@/components/blocks/pricing-table";
import { ResourceAllocation } from "@/components/blocks/resource-allocation";
import { Testimonials } from "@/components/blocks/testimonials";
import { DashedLine } from "@/components/dashed-line";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return (
    <>
      <Navbar />
      <main>
        <Background className="via-muted to-muted/80">
          <Hero />
          <Logos />
          <Features />
          <ResourceAllocation />
        </Background>
        <Testimonials />
        <Background variant="bottom">
          <Pricing />
          <FAQ />
        </Background>
        <Background>
          <div className="py-28 lg:py-32 lg:pt-44">
            <AboutHero />
            <About />
            <div className="pt-28 lg:pt-32">
              <DashedLine className="container max-w-5xl scale-x-115" />
              <Investors />
            </div>
          </div>
        </Background>
        <Background>
          <PricingTable />
        </Background>
        <Background>
          <Contact />
        </Background>
      </main>
      <Footer />
    </>
  );
}
