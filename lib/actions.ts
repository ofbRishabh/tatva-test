"use server";

import { revalidatePath } from "next/cache";
import { eq, and, or } from "drizzle-orm";
import db from "./db";
import { pages, sites } from "./db/schema";
import { Page, Section, Site } from "@/app/types/site";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Validation schemas
const sectionSchema = z.object({
  type: z.string().min(1),
  content: z.record(z.any()),
  sortOrder: z.number().optional(),
});

const pageSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  displayName: z.string().optional(),
  visible: z.boolean().optional(),
  showInHeader: z.boolean().optional(),
  showInFooter: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  sortOrder: z.number().optional(),
});

/**
 * Helper function to resolve site ID from either ID or subdomain
 */
async function resolveSiteId(siteIdentifier: string): Promise<string> {
  // If it's a valid UUID, return as is
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      siteIdentifier
    )
  ) {
    return siteIdentifier;
  }

  // Otherwise, treat as subdomain and look up the site
  const site = await getSiteBySubdomain(siteIdentifier);
  if (!site) {
    throw new Error(`Site with subdomain "${siteIdentifier}" does not exist`);
  }
  return site.id.toString();
}

/**
 * Get site by subdomain
 */
export async function getSiteBySubdomain(
  subdomain: string
): Promise<Site | null> {
  try {
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.subDomain, subdomain));

    return site ? (site as unknown as Site) : null;
  } catch (error) {
    console.error("Error fetching site by subdomain:", error);
    throw new Error("Failed to fetch site");
  }
}

/**
 * Create a new page for a site
 */
export async function createPage(
  siteIdentifier: string,
  pageData: Omit<Page, "id" | "sections" | "createdAt" | "updatedAt">
): Promise<Page> {
  try {
    // Validate input data
    pageSchema.parse(pageData);

    const siteId = await resolveSiteId(siteIdentifier);

    // Check if the site exists
    const existingSite = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.id, siteId));

    if (existingSite.length === 0) {
      throw new Error(`Site with ID "${siteId}" does not exist`);
    }

    // Check if a page with same slug already exists
    const existingPages = await db
      .select()
      .from(pages)
      .where(and(eq(pages.siteId, siteId), eq(pages.slug, pageData.slug)));

    if (existingPages.length > 0) {
      throw new Error(`A page with slug "${pageData.slug}" already exists`);
    }

    // Create the new page
    const newPageData = {
      ...pageData,
      siteId,
      sections: [],
    };

    // For MySQL we need to insert and then query the inserted record
    await db.insert(pages).values(newPageData);

    // Get the newly created page
    const [newPage] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.siteId, siteId), eq(pages.slug, pageData.slug)));

    revalidatePath(`/dashboard/${siteId}/site/pages`);
    revalidatePath(`/dashboard/${siteId}/site`);
    revalidatePath(`/${pageData.slug}`);

    return newPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid page data: ${error.errors[0].message}`);
    }
    console.error("Error creating page:", error);
    throw error;
  }
}

/**
 * Get all pages for a site
 */
export async function getPages(siteIdentifier: string): Promise<Page[]> {
  try {
    const siteId = await resolveSiteId(siteIdentifier);

    const pagesData = await db
      .select()
      .from(pages)
      .where(eq(pages.siteId, siteId));

    return pagesData as unknown as Page[];
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
}

/**
 * Get a specific page by ID
 */
export async function getPage(pageId: string): Promise<Page | null> {
  try {
    const [pageData] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));
    return pageData ? (pageData as unknown as Page) : null;
  } catch (error) {
    console.error(`Error fetching page with ID ${pageId}:`, error);
    throw error;
  }
}

/**
 * Get a specific page by site domain/subdomain and slug
 */
export async function getPageBySlug(
  domain: string,
  slug: string
): Promise<Page | null> {
  try {
    // First, find the site by domain
    const [site] = await db
      .select()
      .from(sites)
      .where(or(eq(sites.subDomain, domain), eq(sites.customDomain, domain)));

    if (!site) return null;

    // Then, find the page in that site by slug
    const [pageData] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.siteId, site.id), eq(pages.slug, slug)));

    return pageData ? (pageData as unknown as Page) : null;
  } catch (error) {
    console.error(
      `Error fetching page with slug ${slug} for domain ${domain}:`,
      error
    );
    throw error;
  }
}

/**
 * Update a page
 */
export async function updatePage(
  pageId: string,
  pageData: Partial<Omit<Page, "id" | "createdAt" | "updatedAt">>
): Promise<Page> {
  try {
    // Validate update data
    if (Object.keys(pageData).length > 0) {
      z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        displayName: z.string().optional(),
        visible: z.boolean().optional(),
        showInHeader: z.boolean().optional(),
        showInFooter: z.boolean().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        sortOrder: z.number().optional(),
      }).parse(pageData);
    }

    const [currentPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    if (!currentPage) {
      throw new Error("Page not found");
    }

    // If changing the slug, check for duplicates
    if (pageData.slug && pageData.slug !== currentPage.slug) {
      const [existingPage] = await db
        .select()
        .from(pages)
        .where(
          and(
            eq(pages.siteId, currentPage.siteId),
            eq(pages.slug, pageData.slug)
          )
        );

      if (existingPage) {
        throw new Error(`A page with slug "${pageData.slug}" already exists`);
      }
    }

    // Update the page
    await db.update(pages).set(pageData).where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${currentPage.siteId}/site/pages`);
    revalidatePath(`/dashboard/${currentPage.siteId}/site/pages/${pageId}`);
    revalidatePath(`/dashboard/${currentPage.siteId}/site`);
    revalidatePath(`/${currentPage.slug}`);
    if (pageData.slug && pageData.slug !== currentPage.slug) {
      revalidatePath(`/${pageData.slug}`);
    }

    return updatedPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid page data: ${error.errors[0].message}`);
    }
    console.error(`Error updating page with ID ${pageId}:`, error);
    throw error;
  }
}

/**
 * Delete a page
 */
export async function deletePage(pageId: string): Promise<void> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    await db.delete(pages).where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages`);
    revalidatePath(`/dashboard/${page.siteId}/site`);
    revalidatePath(`/${page.slug}`);
  } catch (error) {
    console.error(`Error deleting page with ID ${pageId}:`, error);
    throw error;
  }
}

/**
 * Add a section to a page
 */
export async function addSection(
  pageId: string,
  sectionData: Omit<Section, "id">
): Promise<Page> {
  try {
    // Validate section data
    sectionSchema.parse(sectionData);

    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = page.sections || [];
    const newSection = {
      ...sectionData,
      id: uuidv4(),
      sortOrder: sectionData.sortOrder ?? sections.length,
    };

    const updatedSections = [...sections, newSection];

    // Sort sections by sortOrder
    updatedSections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    await db
      .update(pages)
      .set({ sections: updatedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid section data: ${error.errors[0].message}`);
    }
    console.error(`Error adding section to page ${pageId}:`, error);
    throw error;
  }
}

/**
 * Update a section in a page
 */
export async function updateSection(
  pageId: string,
  sectionId: string,
  sectionData: Partial<Omit<Section, "id">>
): Promise<Page> {
  try {
    // Validate update data
    if (Object.keys(sectionData).length > 0) {
      z.object({
        type: z.string().min(1).optional(),
        content: z.record(z.any()).optional(),
        sortOrder: z.number().optional(),
      }).parse(sectionData);
    }

    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = page.sections || [];
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId
    );

    if (sectionIndex === -1) {
      throw new Error("Section not found");
    }

    // Update the section
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      ...sectionData,
    };

    // Ensure sort order is maintained
    if (sectionData.sortOrder !== undefined) {
      updatedSections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    await db
      .update(pages)
      .set({ sections: updatedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid section data: ${error.errors[0].message}`);
    }
    console.error(
      `Error updating section ${sectionId} in page ${pageId}:`,
      error
    );
    throw error;
  }
}

/**
 * Remove a section from a page
 */
export async function removeSection(
  pageId: string,
  sectionId: string
): Promise<Page> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = page.sections || [];
    const updatedSections = sections.filter(
      (section) => section.id !== sectionId
    );

    // Re-number the sort order
    updatedSections.forEach((section, index) => {
      section.sortOrder = index;
    });

    await db
      .update(pages)
      .set({ sections: updatedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    console.error(
      `Error removing section ${sectionId} from page ${pageId}:`,
      error
    );
    throw error;
  }
}

/**
 * Reorder sections within a page
 */
export async function reorderSections(
  pageId: string,
  sectionIds: string[]
): Promise<Page> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = page.sections || [];

    // Validate that all section IDs exist
    if (sectionIds.length !== sections.length) {
      throw new Error(
        "The number of section IDs must match the current sections"
      );
    }

    // Create a map for faster lookup
    const sectionMap = sections.reduce((map, section) => {
      map[section.id] = section;
      return map;
    }, {} as Record<string, Section>);

    // Reorder sections based on the provided order
    const reorderedSections = sectionIds.map((id, index) => {
      if (!sectionMap[id]) {
        throw new Error(`Section with id ${id} not found`);
      }

      return {
        ...sectionMap[id],
        sortOrder: index,
      };
    });

    await db
      .update(pages)
      .set({ sections: reorderedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    console.error(`Error reordering sections in page ${pageId}:`, error);
    throw error;
  }
}

/**
 * Add multiple sections to a page at once
 */
export async function addMultipleSections(
  pageId: string,
  sectionsData: Omit<Section, "id">[]
): Promise<Page> {
  try {
    // Validate all section data
    sectionsData.forEach((section) => sectionSchema.parse(section));

    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const currentSections = page.sections || [];
    const baseIndex = currentSections.length;

    // Create new sections with UUIDs and proper sort order
    const newSections = sectionsData.map((section, index) => ({
      ...section,
      id: uuidv4(),
      sortOrder: section.sortOrder ?? baseIndex + index,
    }));

    const updatedSections = [...currentSections, ...newSections];

    // Sort sections by sortOrder
    updatedSections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    await db
      .update(pages)
      .set({ sections: updatedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid section data: ${error.errors[0].message}`);
    }
    console.error(`Error adding multiple sections to page ${pageId}:`, error);
    throw error;
  }
}

/**
 * Update multiple sections in a page at once
 */
export async function updateMultipleSections(
  pageId: string,
  sectionsData: { id: string; data: Partial<Omit<Section, "id">> }[]
): Promise<Page> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = [...(page.sections || [])];

    // Update each section that needs to be modified
    for (const { id, data } of sectionsData) {
      // Validate the update data
      if (Object.keys(data).length > 0) {
        z.object({
          type: z.string().min(1).optional(),
          content: z.record(z.any()).optional(),
          sortOrder: z.number().optional(),
        }).parse(data);
      }

      const sectionIndex = sections.findIndex((section) => section.id === id);

      if (sectionIndex === -1) {
        throw new Error(`Section with id ${id} not found`);
      }

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        ...data,
      };
    }

    // Sort sections if any sort orders were updated
    if (sectionsData.some((s) => s.data.sortOrder !== undefined)) {
      sections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    await db.update(pages).set({ sections }).where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid section data: ${error.errors[0].message}`);
    }
    console.error(`Error updating multiple sections in page ${pageId}:`, error);
    throw error;
  }
}

/**
 * Duplicate a section within a page
 */
export async function duplicateSection(
  pageId: string,
  sectionId: string
): Promise<Page> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));

    if (!page) {
      throw new Error("Page not found");
    }

    const sections = page.sections || [];
    const sectionToDuplicate = sections.find(
      (section) => section.id === sectionId
    );

    if (!sectionToDuplicate) {
      throw new Error("Section not found");
    }

    // Create a duplicate with a new ID
    const duplicateSection = {
      ...sectionToDuplicate,
      id: uuidv4(),
      sortOrder: sections.length,
    };

    const updatedSections = [...sections, duplicateSection];

    await db
      .update(pages)
      .set({ sections: updatedSections })
      .where(eq(pages.id, pageId));

    // Get the updated page
    const [updatedPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId));

    revalidatePath(`/dashboard/${page.siteId}/site/pages/${pageId}`);
    revalidatePath(`/${page.slug}`);

    return updatedPage as unknown as Page;
  } catch (error) {
    console.error(
      `Error duplicating section ${sectionId} in page ${pageId}:`,
      error
    );
    throw error;
  }
}
