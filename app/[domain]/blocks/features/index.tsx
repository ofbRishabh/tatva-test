export const schema = {
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
          iconUrl: {
            type: "string",
            title: "Icon Image URL",
          },
        },
      },
    },
  },
};

export const uiSchema = {
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
      iconUrl: {
        "ui:placeholder": "https://example.com/icon.png",
      },
      description: {
        "ui:widget": "textarea",
      },
    },
  },
};

export const sampleData = {
  heading: "Bringing the best to you by the best in the industry",
  subheading: "WHY WE ARE UNIQUE",
  description:
    "We bring excellence and innovation through our experienced team, cutting-edge tech, and relentless commitment to quality.",
  features: [
    {
      title: "Quality",
      description:
        "High standards of execution and commitment to quality in every project we handle.",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    },
    {
      title: "Innovation",
      description:
        "We embrace modern technology and innovation to deliver smarter solutions.",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    },
    {
      title: "Customer Support",
      description:
        "A dedicated support team ready to assist you every step of the way.",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
    },
    {
      title: "Reliability",
      description:
        "Trusted by hundreds of partners, delivering consistently and on time.",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006552.png",
    },
  ],
};

interface FeatureItem {
  title: string;
  description: string;
  iconUrl: string;
}

interface FeaturesProps {
  heading?: string;
  subheading?: string;
  description?: string;
  features?: FeatureItem[];
}

const Features: React.FC<FeaturesProps> = ({
  heading = sampleData.heading,
  subheading = sampleData.subheading,
  description = sampleData.description,
  features = sampleData.features,
}) => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm text-muted-foreground">{subheading}</p>
            <h2 className="text-3xl font-medium md:text-5xl">{heading}</h2>
            <p className="text-muted-foreground md:max-w-2xl">{description}</p>
          </div>
        </div>

        <div className="mx-auto mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              className="flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[200px] md:p-8"
              key={idx}
            >
              <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-background">
                {feature?.iconUrl ? (
                  <img
                    src={feature?.iconUrl}
                    alt={feature?.title}
                    className="size-6 object-contain"
                  />
                ) : null}
              </span>
              <div>
                <h3 className="text-lg font-medium md:text-2xl">
                  {feature?.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature?.description}
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
