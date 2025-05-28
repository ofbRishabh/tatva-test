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

  // Get page data
  const page = await getPageBySlug(domain, slug);

  if (!page) {
    return {
      title: "Page not found",
      description: "The page you are looking for does not exist.",
    };
  }

  return {
    title: page.displayName || page.name,
    description:
      page. || `${page.displayName || page.name} page`,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { domain: string; page: string };
}) {
  const { domain, page: slug } = params;

  // Fetch the page data
  const page = await getPageBySlug(domain, slug);

  // If page doesn't exist, return 404
  if (!page) {
    notFound();
  }

  // Sort sections by their sortOrder if available
  const sortedSections = [...(page.sections || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <main className="page-content">
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

          // For Features section, the API expects data object
          if (section.type === "Features") {
            return (
              <div key={section.id} className="section-wrapper">
                <SectionComponent data={section.content} />
              </div>
            );
          }

          // Render the section with its content as props
          return (
            <div key={section.id} className="section-wrapper">
              <SectionComponent {...section.content} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
