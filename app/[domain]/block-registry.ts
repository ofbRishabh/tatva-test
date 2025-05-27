import dynamic from "next/dynamic";

export const blockRegistry = {
  hero: dynamic(() => import("./blocks/hero")),
  features: dynamic(() => import("./blocks/features")),
  testimonial: dynamic(() => import("./blocks/testimonial")),
  stats: dynamic(() => import("./blocks/stats")),
  logos: dynamic(() => import("./blocks/logos")),
  cta: dynamic(() => import("./blocks/cta")),
  faq: dynamic(() => import("./blocks/faq")),
  team: dynamic(() => import("./blocks/team")),
  products: dynamic(() => import("./blocks/products")),
};
