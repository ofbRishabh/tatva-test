"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

export const schema = {
  title: "Testimonial Section",
  type: "object",
  properties: {
    testimonials: {
      type: "array",
      title: "Testimonials",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "ID",
          },
          text: {
            type: "string",
            title: "Testimonial Text",
          },
          name: {
            type: "string",
            title: "Customer Name",
          },
          role: {
            type: "string",
            title: "Customer Role",
          },
          avatar: {
            type: "string",
            title: "Avatar URL",
          },
          rating: {
            type: "number",
            title: "Rating (1-5)",
            default: 5,
            minimum: 1,
            maximum: 5,
          },
        },
      },
    },
  },
};

export const uiSchema = {
  testimonials: {
    items: {
      id: { "ui:placeholder": "Unique identifier for the testimonial" },
      text: {
        "ui:widget": "textarea",
        "ui:placeholder": "Customer testimonial text",
      },
      name: { "ui:placeholder": "Customer name" },
      role: { "ui:placeholder": "Customer position/role" },
      avatar: { "ui:placeholder": "URL to customer avatar" },
      rating: {
        "ui:widget": "range",
        "ui:options": { min: 1, max: 5, step: 1 },
      },
    },
  },
};

interface TestimonialItem {
  id: string;
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating?: number;
}

interface TestimonialProps {
  testimonials?: TestimonialItem[];
}

export const sampleData = {
  testimonials: [
    {
      id: "testimonial-1",
      text: "This platform completely transformed our workflow. The intuitive interface and powerful features have significantly improved our team's productivity.",
      name: "Sarah Johnson",
      role: "Marketing Director at TechCorp",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
      rating: 5,
    },
    {
      id: "testimonial-2",
      text: "I've tried many similar solutions, but this one stands out for its reliability and customer support. It's been a game-changer for our business operations.",
      name: "Michael Chen",
      role: "Operations Manager at GlobalTech",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
      rating: 5,
    },
    {
      id: "testimonial-3",
      text: "The customization options are incredible. We were able to tailor everything to our specific needs, which wasn't possible with other solutions we tried before.",
      name: "Emily Rodriguez",
      role: "Product Designer at CreativeSolutions",
      avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
      rating: 5,
    },
    {
      id: "testimonial-4",
      text: "We've seen a 40% increase in customer engagement since implementing this platform. The analytics provide invaluable insights for our business strategy.",
      name: "David Park",
      role: "CEO at InnovateCo",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
      rating: 5,
    },
  ],
};

const Testimonial: React.FC<TestimonialProps> = ({
  testimonials = sampleData.testimonials,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <section className="py-12">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <div className="container flex flex-col items-center text-center">
                <p className="mb-8 max-w-4xl font-medium md:px-8 lg:text-3xl">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <Avatar className="mb-2 size-12 md:size-24">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name}</AvatarFallback>
                </Avatar>
                <p className="mb-1 text-sm font-medium md:text-lg">
                  {testimonial.name}
                </p>
                <p className="mb-2 text-sm text-muted-foreground md:text-lg">
                  {testimonial.role}
                </p>
                <div className="mt-2 flex items-center gap-0.5">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-primary stroke-none" />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="container flex justify-center py-16">
        {testimonials.map((testimonial, index) => (
          <Button
            key={testimonial.id}
            variant="ghost"
            size="sm"
            onClick={() => {
              api?.scrollTo(index);
            }}
          >
            <div
              className={`size-2.5 rounded-full ${
                index === current ? "bg-primary" : "bg-input"
              }`}
            />
          </Button>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
