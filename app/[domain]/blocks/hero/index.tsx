import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const schema = {
  title: "Hero Section",
  type: "object",
  properties: {
    badge: {
      type: "string",
      title: "Badge",
      default: "✨ Your Website Builder",
    },
    heading: {
      type: "string",
      title: "Heading",
      default: "Blocks Built With Shadcn & Tailwind",
    },
    description: {
      type: "string",
      title: "Description",
      default:
        "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
    },
    buttons: {
      type: "object",
      properties: {
        primary: {
          type: "object",
          properties: {
            text: {
              type: "string",
              title: "Primary Button Text",
              default: "Discover all components",
            },
            url: {
              type: "string",
              title: "Primary Button URL",
              default: "https://www.shadcnblocks.com",
            },
          },
        },
        secondary: {
          type: "object",
          properties: {
            text: {
              type: "string",
              title: "Secondary Button Text",
              default: "View on GitHub",
            },
            url: {
              type: "string",
              title: "Secondary Button URL",
              default: "https://www.shadcnblocks.com",
            },
          },
        },
      },
    },
    image: {
      type: "object",
      properties: {
        src: {
          type: "string",
          title: "Image Source",
          default:
            "https://www.shadcnblocks.com/images/block/placeholder-1.svg",
        },
        alt: {
          type: "string",
          title: "Image Alt Text",
          default: "Hero section demo image showing interface components",
        },
      },
    },
  },
};

export const uiSchema = {
  badge: {
    "ui:placeholder": "e.g. ✨ Your Website Builder",
  },
  heading: {
    "ui:widget": "text",
  },
  description: {
    "ui:widget": "textarea",
  },
  buttons: {
    primary: {
      text: { "ui:placeholder": "e.g. Discover all components" },
      url: { "ui:placeholder": "https://..." },
    },
    secondary: {
      text: { "ui:placeholder": "e.g. View on GitHub" },
      url: { "ui:placeholder": "https://..." },
    },
  },
  image: {
    src: { "ui:placeholder": "Image URL" },
    alt: { "ui:placeholder": "Describe the image" },
  },
};

interface ButtonProps {
  text: string;
  url: string;
}

interface HeroProps {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: ButtonProps;
    secondary?: ButtonProps;
  };
  image: {
    src: string;
    alt: string;
  };
}

export const sampleData = {
  badge: "🚀 Launch Your Site",
  heading: "Build Amazing Websites Effortlessly",
  description:
    "Use our beautifully crafted React & Tailwind UI blocks to build your site quickly and easily.",
  buttons: {
    primary: {
      text: "Get Started",
      url: "https://example.com/get-started",
    },
    secondary: {
      text: "Learn More",
      url: "https://example.com/learn-more",
    },
  },
  image: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "A person working on a laptop",
  },
};

const Hero: React.FC<HeroProps> = ({
  badge = sampleData.badge,
  heading = sampleData.heading,
  description = sampleData.description,
  buttons = sampleData.buttons,
  image = sampleData.image,
}) => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline" className="inline-flex items-center">
                {badge}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Badge>
            )}
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              {heading}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a
                    href={buttons.secondary.url}
                    className="inline-flex items-center"
                  >
                    {buttons.secondary.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
