import Cta from "./blocks/cta";
import Faq from "./blocks/faq";
import Features from "./blocks/features";
import Hero from "./blocks/hero";
import Logos from "./blocks/logos";
import Products from "./blocks/products";
import Stats from "./blocks/stats";
import Team from "./blocks/team";
import Testimonial from "./blocks/testimonial";

export default async function Page() {
  return (
    <div className="container my-8 flex flex-col gap-16">
      <Hero />
      <Features />
      <Stats />
      <Testimonial />
      <Logos />
      <Cta />
      <Faq />
      <Team />
      <Products />
    </div>
  );
}
