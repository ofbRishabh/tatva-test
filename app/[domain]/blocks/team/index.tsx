import { Dribbble, Github, Linkedin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const schema = {
  title: "Team Section",
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "Our team",
    },
    heading: {
      type: "string",
      title: "Heading",
      default: "The team you'll be working with",
    },
    description: {
      type: "string",
      title: "Description",
      default: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    people: {
      type: "array",
      title: "Team Members",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "ID",
          },
          name: {
            type: "string",
            title: "Name",
          },
          role: {
            type: "string",
            title: "Role",
          },
          description: {
            type: "string",
            title: "Description",
          },
          avatar: {
            type: "string",
            title: "Avatar URL",
          },
          socials: {
            type: "object",
            title: "Social Links",
            properties: {
              github: {
                type: "string",
                title: "GitHub URL",
              },
              linkedin: {
                type: "string",
                title: "LinkedIn URL",
              },
              dribbble: {
                type: "string",
                title: "Dribbble URL",
              },
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  title: {
    "ui:placeholder": "e.g. Our team",
  },
  heading: {
    "ui:placeholder": "e.g. The team you'll be working with",
  },
  description: {
    "ui:widget": "textarea",
    "ui:placeholder": "Brief description of your team",
  },
  people: {
    items: {
      id: { "ui:placeholder": "Unique identifier for team member" },
      name: { "ui:placeholder": "Team member name" },
      role: { "ui:placeholder": "Team member role" },
      description: {
        "ui:widget": "textarea",
        "ui:placeholder": "Brief description of the team member",
      },
      avatar: { "ui:placeholder": "URL to team member avatar" },
      socials: {
        github: { "ui:placeholder": "https://github.com/username" },
        linkedin: { "ui:placeholder": "https://linkedin.com/in/username" },
        dribbble: { "ui:placeholder": "https://dribbble.com/username" },
      },
    },
  },
};

interface TeamProps {
  title?: string;
  heading?: string;
  description?: string;
  people?: Array<{
    id: string;
    name: string;
    role: string;
    description: string;
    avatar: string;
    socials?: {
      github?: string;
      linkedin?: string;
      dribbble?: string;
    };
  }>;
}

export const sampleData = {
  title: "Our team",
  heading: "The team you'll be working with",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  people: [
    {
      id: "person-1",
      name: "Olivia Martin",
      role: "CEO",
      description:
        "Leads our company vision and strategy with over 15 years of industry experience.",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
      socials: {
        github: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      id: "person-2",
      name: "Jackson Lee",
      role: "CTO",
      description:
        "Oversees all technical aspects and implementation of our products.",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
      socials: {
        github: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      id: "person-3",
      name: "Sofia Chen",
      role: "Design Director",
      description:
        "Creates the visual language and user experience across all our platforms.",
      avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
      socials: {
        github: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
    {
      id: "person-4",
      name: "Marcus Kim",
      role: "Product Manager",
      description:
        "Coordinates development priorities and ensures timely delivery of features.",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
      socials: {
        github: "#",
        linkedin: "#",
        dribbble: "#",
      },
    },
  ],
};

const Team: React.FC<TeamProps> = ({
  title = sampleData.title,
  heading = sampleData.heading,
  description = sampleData.description,
  people = sampleData.people,
}: TeamProps) => {
  return (
    <section className="py-12">
      <div className="container flex flex-col items-start text-left">
        <p className="semibold">{title}</p>
        <h2 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">
          {heading}
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          {description}
        </p>
      </div>
      <div className="container mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-start">
            <Avatar className="mb-4 size-20 md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="font-medium">{person.name}</p>
            <p className="text-muted-foreground">{person.role}</p>
            <p className="py-3 text-sm text-muted-foreground">
              {person.description}
            </p>
            <div className="mt-2 flex gap-4">
              {person.socials?.github && (
                <a href={person.socials.github}>
                  <Github className="size-5 text-muted-foreground" />
                </a>
              )}
              {person.socials?.linkedin && (
                <a href={person.socials.linkedin}>
                  <Linkedin className="size-5 text-muted-foreground" />
                </a>
              )}
              {person.socials?.dribbble && (
                <a href={person.socials.dribbble}>
                  <Dribbble className="size-5 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
