import { ArrowRight } from "lucide-react";

export const schema = {
  title: "Stats Section",
  type: "object",
  properties: {
    heading: {
      type: "string",
      title: "Heading",
      default: "Platform performance insights",
    },
    description: {
      type: "string",
      title: "Description",
      default: "Ensuring stability and scalability for all users",
    },
    link: {
      type: "object",
      title: "Link",
      properties: {
        text: {
          type: "string",
          title: "Link Text",
          default: "Read the full impact report",
        },
        url: {
          type: "string",
          title: "Link URL",
          default: "https://www.shadcnblocks.com",
        },
      },
    },
    stats: {
      type: "array",
      title: "Stats",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "ID",
          },
          value: {
            type: "string",
            title: "Stat Value",
          },
          label: {
            type: "string",
            title: "Stat Label",
          },
        },
      },
    },
  },
};

export const uiSchema = {
  heading: {
    "ui:placeholder": "e.g. Platform performance insights",
  },
  description: {
    "ui:widget": "textarea",
    "ui:placeholder": "Brief description of the stats section",
  },
  link: {
    text: { "ui:placeholder": "e.g. Read the full impact report" },
    url: { "ui:placeholder": "https://..." },
  },
  stats: {
    items: {
      id: { "ui:placeholder": "Unique identifier for the stat" },
      value: { "ui:placeholder": "e.g. 250%+" },
      label: { "ui:placeholder": "e.g. average growth in user engagement" },
    },
  },
};

interface StatsProps {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

export const sampleData = {
  heading: "Platform performance insights",
  description: "Ensuring stability and scalability for all users",
  link: {
    text: "Read the full impact report",
    url: "https://www.shadcnblocks.com",
  },
  stats: [
    {
      id: "stat-1",
      value: "250%+",
      label: "average growth in user engagement",
    },
    {
      id: "stat-2",
      value: "$2.5m",
      label: "annual savings per enterprise partner",
    },
    {
      id: "stat-3",
      value: "200+",
      label: "integrations with top industry platforms",
    },
    {
      id: "stat-4",
      value: "99.9%",
      label: "customer satisfaction over the last year",
    },
  ],
};

const Stats: React.FC<StatsProps> = ({
  heading = sampleData.heading,
  description = sampleData.description,
  link = sampleData.link,
  stats = sampleData.stats,
}: StatsProps) => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
          <p>{description}</p>
          <a
            href={link.url}
            className="flex items-center gap-1 font-bold hover:underline"
          >
            {link.text}
            <ArrowRight className="h-auto w-4" />
          </a>
        </div>
        <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-5">
              <div className="text-6xl font-bold">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
