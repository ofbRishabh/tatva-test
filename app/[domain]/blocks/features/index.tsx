import {
  Infinity as InfinityIcon,
  MessagesSquare,
  Zap,
  ZoomIn,
} from "lucide-react";
// feature-ui-schema.ts
export const featureSectionUiSchema = {
  heading: {
    "ui:widget": "text",
  },
  subheading: {
    "ui:widget": "text",
  },
  description: {
    "ui:widget": "textarea",
  },
  features: {
    items: {
      icon: {
        "ui:placeholder": "e.g. Zap, Infinity, MessagesSquare",
      },
      description: {
        "ui:widget": "textarea",
      },
    },
  },
};

export const featureSectionSchema = {
  title: "Features Section",
  type: "object",
  properties: {
    heading: {
      type: "string",
      title: "Heading",
      default: "Bringing the best to you by the best in the industry",
    },
    subheading: {
      type: "string",
      title: "Subheading",
      default: "WHY WE ARE UNIQUE",
    },
    description: {
      type: "string",
      title: "Description",
      default:
        "We bring excellence and innovation through our experienced team, cutting-edge tech, and relentless commitment to quality.",
    },
    features: {
      type: "array",
      title: "Feature Items",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            title: "Title",
          },
          description: {
            type: "string",
            title: "Description",
          },
          icon: {
            type: "string",
            title: "Icon (Lucide name, e.g., 'Zap', 'Infinity')",
          },
        },
        required: ["title", "description", "icon"],
      },
    },
  },
};

const feature = [
  {
    title: "Quality",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <ZoomIn className="size-6" />,
  },
  {
    title: "Innovation",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <Zap className="size-6" />,
  },
  {
    title: "Customer Support",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <MessagesSquare className="size-6" />,
  },
  {
    title: "Reliability",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <InfinityIcon className="size-6" />,
  },
  {
    title: "Customer Support",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <MessagesSquare className="size-6" />,
  },
  {
    title: "Reliability",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi necessitatibus, culpa at vitae molestias tenetur explicabo.",
    icon: <InfinityIcon className="size-6" />,
  },
];

const Features = () => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm text-muted-foreground">WHY WE ARE UNIQUE</p>
            <h2 className="text-3xl font-medium md:text-5xl">
              Bringing the best to you by the best in the industry
            </h2>

            <p className="text-muted-foreground md:max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi
              necessitatibus, culpa at vitae molestias tenetur explicabo.
              Voluptatum amet architecto suscipit pariatur eligendi repellendus
              mollitia dolore unde sint?
            </p>
          </div>
        </div>
        <div className="mx-auto mt-20 grid gap-6 md:grid-cols-3">
          {feature.map((feature, idx) => (
            <div
              className="flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[200px] md:p-8"
              key={idx}
            >
              <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-background">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-medium md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
