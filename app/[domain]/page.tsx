import { blockRegistry } from "./block-registry";

import { sampleData as heroData } from "./blocks/hero";
import { sampleData as featuresData } from "./blocks/features";
import { sampleData as statsData } from "./blocks/stats";
import { sampleData as testimonialData } from "./blocks/testimonial";
import { sampleData as logosData } from "./blocks/logos";
import { sampleData as ctaData } from "./blocks/cta";
import { sampleData as faqData } from "./blocks/faq";
import { sampleData as teamData } from "./blocks/team";
import { sampleData as productsData } from "./blocks/products";

export default async function Page() {
  const {
    Hero,
    Features,
    Stats,
    Testimonial,
    Logos,
    Cta,
    Faq,
    Team,
    Products,
  } = blockRegistry;

  return (
    <div className="container my-8 flex flex-col gap-16">
      <Hero {...heroData} />
      <Features data={featuresData} />
      <Stats {...statsData} />
      <Testimonial {...testimonialData} />
      <Logos {...logosData} />
      <Cta {...ctaData} />
      <Faq {...faqData} />
      <Team {...teamData} />
      <Products {...productsData} />
    </div>
  );
}
