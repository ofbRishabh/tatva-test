import { Button } from "@/components/ui/button";

interface CtaProps {
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
}
export const ctaUiSchema = {
  description: {
    "ui:widget": "textarea",
  },
  buttons: {
    primary: {
      url: {
        "ui:widget": "url",
      },
    },
    secondary: {
      url: {
        "ui:widget": "url",
      },
    },
  },
};

export const ctaSchema = {
  title: "Call to Action",
  type: "object",
  properties: {
    heading: {
      type: "string",
      title: "Heading",
      default: "Call to Action",
    },
    description: {
      type: "string",
      title: "Description",
      default:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis!",
    },
    buttons: {
      type: "object",
      title: "Buttons",
      properties: {
        primary: {
          type: "object",
          title: "Primary Button",
          properties: {
            text: { type: "string", title: "Text", default: "Get Started" },
            url: {
              type: "string",
              title: "URL",
              default: "https://www.shadcnblocks.com",
            },
          },
        },
        secondary: {
          type: "object",
          title: "Secondary Button",
          properties: {
            text: { type: "string", title: "Text", default: "Learn More" },
            url: {
              type: "string",
              title: "URL",
              default: "https://www.shadcnblocks.com",
            },
          },
        },
      },
    },
  },
};

const Cta = ({
  heading = "Call to Action",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis!",
  buttons = {
    primary: {
      text: "Get Started",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "Learn More",
      url: "https://www.shadcnblocks.com",
    },
  },
}: CtaProps) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            {heading}
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            {buttons.secondary && (
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            )}
            {buttons.primary && (
              <Button className="w-full sm:w-auto" asChild>
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
