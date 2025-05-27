import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RJSFSchema } from "@rjsf/utils";
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

export const schema: RJSFSchema = {
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

interface HeroProps {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero = ({
  badge = "✨ Your Website Builder",
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
  image = {
    src: "https://www.shadcnblocks.com/images/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}: HeroProps) => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              {heading}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
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
