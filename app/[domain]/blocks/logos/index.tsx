"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const schema = {
  title: "Logos Section",
  type: "object",
  properties: {
    heading: {
      type: "string",
      title: "Heading",
      default: "Trusted by these companies",
    },
    logos: {
      type: "array",
      title: "Logos",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "ID",
          },
          description: {
            type: "string",
            title: "Description",
          },
          image: {
            type: "string",
            title: "Image URL",
          },
          className: {
            type: "string",
            title: "Image Class",
          },
        },
      },
    },
  },
};

export const uiSchema = {
  heading: {
    "ui:placeholder": "e.g. Trusted by these companies",
  },
  logos: {
    items: {
      id: { "ui:placeholder": "Unique identifier for the logo" },
      description: { "ui:placeholder": "Logo description" },
      image: { "ui:placeholder": "Logo image URL" },
      className: {
        "ui:placeholder": "CSS classes for the logo (e.g. h-7 w-auto)",
      },
    },
  },
};

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface LogosProps {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

export const sampleData = {
  heading: "Trusted by these companies",
  logos: [
    {
      id: "logo-1",
      description: "Logo 1",
      image: "https://shadcnblocks.com/images/block/logos/astro-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Logo 2",
      image: "https://shadcnblocks.com/images/block/logos/figma-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "Logo 3",
      image: "https://shadcnblocks.com/images/block/logos/nextjs-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "Logo 4",
      image: "https://shadcnblocks.com/images/block/logos/react-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "Logo 5",
      image:
        "https://shadcnblocks.com/images/block/logos/shadcn-ui-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "Logo 6",
      image:
        "https://shadcnblocks.com/images/block/logos/supabase-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-7",
      description: "Logo 7",
      image:
        "https://shadcnblocks.com/images/block/logos/tailwind-wordmark.svg",
      className: "h-4 w-auto",
    },
    {
      id: "logo-8",
      description: "Logo 8",
      image: "https://shadcnblocks.com/images/block/logos/vercel-wordmark.svg",
      className: "h-7 w-auto",
    },
  ],
};

const Logos: React.FC<LogosProps> = ({
  heading = sampleData.heading,
  logos = sampleData.logos,
}: LogosProps) => {
  return (
    <section className="py-12">
      <div className="container flex flex-col items-center text-center">
        <h1 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">
          {heading}
        </h1>
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Logos;
