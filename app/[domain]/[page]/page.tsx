import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/actions";
import { blockRegistry } from "../block-registry";

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: { domain: string; page: string };
}) {
  const { domain, page: slug } = params;

  try {
    // Get page data
    const page = await getPageBySlug(domain, slug);

    if (!page) {
      return {
        title: "Page not found",
        description: "The page you are looking for does not exist.",
      };
    }

    return {
      title: page.metaTitle || page.displayName || page.name,
      description:
        page.metaDescription || `${page.displayName || page.name} page`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page not found",
      description: "The page you are looking for does not exist.",
    };
  }
}

export default async function DynamicPage({
  params,
}: {
  params: { domain: string; page: string };
}) {
  const { domain, page: slug } = params;

  let page = null;

  try {
    // Fetch the page data
    page = await getPageBySlug(domain, slug);
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }

  // If page doesn't exist, return 404
  if (!page) {
    notFound();
  }

  // Sort sections by their sortOrder if available
  const sortedSections = [...(page.sections || [])].sort(
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
              Page Under Construction
            </h2>
            <p className="text-gray-500">
              This page is being built. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
