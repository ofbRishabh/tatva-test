import { blockRegistry } from "./block-registry";
import { getSiteBySubdomain, getHomePage } from "@/lib/actions";
import { notFound } from "next/navigation";

import { sampleData as heroData } from "./blocks/hero";
import { sampleData as featuresData } from "./blocks/features";
import { sampleData as statsData } from "./blocks/stats";
import { sampleData as testimonialData } from "./blocks/testimonial";
import { sampleData as logosData } from "./blocks/logos";
import { sampleData as ctaData } from "./blocks/cta";
import { sampleData as faqData } from "./blocks/faq";
import { sampleData as teamData } from "./blocks/team";
import { sampleData as productsData } from "./blocks/products";

export default async function Page({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);

  console.log("Domain param: ", domain);

  // The domain param is now just the subdomain (e.g., "mysite")
  // since the middleware extracts it from "mysite.site.localhost"
  const subdomain = domain;

  console.log("Subdomain: ", subdomain);
  // Get site data
  const site = await getSiteBySubdomain(subdomain);

  if (!site) {
    notFound();
  }

  // Get the home page (first page by sortOrder)
  let homePage;
  try {
    homePage = await getHomePage(site.id);
  } catch (error) {
    console.error("Error getting home page:", error);
  }

  // If site has pages, render the home page
  if (site.pages && site.pages.length > 0 && homePage) {
    // Render the home page content directly
    const sortedSections = [...(homePage.sections || [])].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    return (
      <main className="page-content w-full">
        <div className="container my-8 flex flex-col gap-16">
          {sortedSections.map((section) => {
            // Get the component from the block registry
            const SectionComponent = blockRegistry[section.type];

            // If the component doesn't exist, skip it
            if (!SectionComponent) {
              console.warn(
                `Section component "${section.type}" not found in block registry`
              );
              return null;
            }

            // Check if section has content, if not skip rendering
            if (!section.content || Object.keys(section.content).length === 0) {
              console.warn(
                `Section ${section.type} has empty content, skipping render`
              );
              return null;
            }

            // Handle different component prop patterns
            try {
              // For Features section, the component expects data object
              if (section.type === "Features") {
                return (
                  <div key={section.id} className="section-wrapper">
                    <SectionComponent data={section.content} />
                  </div>
                );
              }

              // For other sections, spread the content as props
              return (
                <div key={section.id} className="section-wrapper">
                  <SectionComponent {...section.content} />
                </div>
              );
            } catch (componentError) {
              console.error(
                `Error rendering section ${section.type}:`,
                componentError
              );
              return (
                <div key={section.id} className="section-wrapper">
                  <div className="p-4 border border-red-200 bg-red-50 rounded">
                    <p className="text-red-600">
                      Error rendering section: {section.type}
                    </p>
                  </div>
                </div>
              );
            }
          })}

          {/* Show message if no sections to render */}
          {sortedSections.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                Welcome to {site.name}
              </h2>
              <p className="text-gray-500 mb-4">
                This is your home page. Add some content to get started!
              </p>
              <p className="text-sm text-gray-400">
                Visit your dashboard to add sections and customize your site.
              </p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // If no pages exist at all, show a message encouraging page creation
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
      <div className="text-center py-16 bg-blue-50 border border-blue-200 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Welcome to {site.name}
        </h2>
        <p className="text-blue-700 mb-4">
          Your site is ready, but you haven't created any pages yet.
        </p>
        <p className="text-blue-600">
          Visit your dashboard to create your first page and start building your
          site.
        </p>
      </div>

      {/* Sample preview sections for demonstration */}
      <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">
          Sample Landing Page Preview
        </h3>
        <p className="text-yellow-700">
          This is just a preview of what your site could look like. Create pages
          to replace this content.
        </p>
      </div>
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
