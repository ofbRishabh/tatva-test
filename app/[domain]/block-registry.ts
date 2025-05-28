import dynamic from "next/dynamic";

// Define block metadata types
export interface BlockMetadata {
  name: string;
  description: string;
  category: string;
  previewImageUrl?: string;
  tags?: string[];
}

// Define the full block registry type
export interface BlockRegistryItem {
  component: React.ComponentType<any>;
  metadata: BlockMetadata;
}

// Define the block configuration for easy registration
interface BlockConfig {
  id: string;
  metadata: BlockMetadata;
}

// Create a map of components with static imports for Next.js compatibility
const componentMap = {
  Hero: dynamic(() => import("./blocks/hero")),
  Features: dynamic(() => import("./blocks/features")),
  Stats: dynamic(() => import("./blocks/stats")),
  Testimonial: dynamic(() => import("./blocks/testimonial")),
  Logos: dynamic(() => import("./blocks/logos")),
  Cta: dynamic(() => import("./blocks/cta")),
  Faq: dynamic(() => import("./blocks/faq")),
  Team: dynamic(() => import("./blocks/team")),
  Products: dynamic(() => import("./blocks/products")),
} as const;

// Centralized block configurations - just add new blocks here
const blockConfigs: BlockConfig[] = [
  {
    id: "Hero",
    metadata: {
      name: "Hero Section",
      description: "A prominent banner section, typically at the top of a page",
      category: "Header",
      tags: ["header", "banner", "intro"],
      previewImageUrl: "/previews/hero.png",
    },
  },
  {
    id: "Features",
    metadata: {
      name: "Features Section",
      description: "Showcase your product or service features",
      category: "Content",
      tags: ["features", "highlights", "benefits"],
      previewImageUrl: "/previews/features.png",
    },
  },
  {
    id: "Stats",
    metadata: {
      name: "Stats Section",
      description: "Display important metrics and statistics",
      category: "Content",
      tags: ["numbers", "metrics", "statistics"],
      previewImageUrl: "/previews/stats.png",
    },
  },
  {
    id: "Testimonial",
    metadata: {
      name: "Testimonial Section",
      description: "Share customer reviews and testimonials",
      category: "Social Proof",
      tags: ["reviews", "quotes", "testimonials"],
      previewImageUrl: "/previews/testimonial.png",
    },
  },
  {
    id: "Logos",
    metadata: {
      name: "Logos Section",
      description: "Display partner or client logos",
      category: "Social Proof",
      tags: ["clients", "partners", "brands"],
      previewImageUrl: "/previews/logos.png",
    },
  },
  {
    id: "Cta",
    metadata: {
      name: "Call to Action Section",
      description: "Encourage users to take a specific action",
      category: "Conversion",
      tags: ["cta", "action", "button"],
      previewImageUrl: "/previews/cta.png",
    },
  },
  {
    id: "Faq",
    metadata: {
      name: "FAQ Section",
      description: "Answer frequently asked questions",
      category: "Content",
      tags: ["questions", "answers", "faq"],
      previewImageUrl: "/previews/faq.png",
    },
  },
  {
    id: "Team",
    metadata: {
      name: "Team Section",
      description: "Showcase your team members",
      category: "About",
      tags: ["team", "people", "staff"],
      previewImageUrl: "/previews/team.png",
    },
  },
  {
    id: "Products",
    metadata: {
      name: "Products Section",
      description: "Display products or services",
      category: "Commerce",
      tags: ["products", "services", "catalog"],
      previewImageUrl: "/previews/products.png",
    },
  },
];

// Auto-generate the registry from configurations
export const fullBlockRegistry: Record<string, BlockRegistryItem> =
  blockConfigs.reduce((registry, config) => {
    const component = componentMap[config.id as keyof typeof componentMap];
    if (component) {
      registry[config.id] = {
        component,
        metadata: config.metadata,
      };
    }
    return registry;
  }, {} as Record<string, BlockRegistryItem>);

// For backward compatibility, keep the simple block registry
export const blockRegistry: Record<
  string,
  React.ComponentType<any>
> = Object.entries(fullBlockRegistry).reduce((acc, [key, value]) => {
  acc[key] = value.component;
  return acc;
}, {} as Record<string, React.ComponentType<any>>);

// Export helper functions to get block categories and blocks by category
export function getBlockCategories(): string[] {
  const categories = new Set<string>();
  Object.values(fullBlockRegistry).forEach((item) =>
    categories.add(item.metadata.category)
  );
  return Array.from(categories).sort();
}

export function getBlocksByCategory(
  category: string
): [string, BlockRegistryItem][] {
  return Object.entries(fullBlockRegistry).filter(
    ([_, item]) => item.metadata.category === category
  );
}

// Get all available block types
export function getAllBlockTypes(): string[] {
  return Object.keys(fullBlockRegistry);
}

// Helper function to create block configuration easily
export function createBlockConfig(
  id: string,
  metadata: BlockMetadata
): BlockConfig {
  return {
    id,
    metadata: {
      ...metadata,
      previewImageUrl:
        metadata.previewImageUrl || `/previews/${id.toLowerCase()}.png`,
    },
  };
}
