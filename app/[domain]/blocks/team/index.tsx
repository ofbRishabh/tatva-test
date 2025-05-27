import { Dribbble, Github, Linkedin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const people = [
  {
    id: "person-1",
    name: "Name",
    role: "Role",
    description:
      "Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.",
    avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
  },
  {
    id: "person-2",
    name: "Name",
    role: "Role",
    description: "Elig doloremque mollitia fugiat omnis!",
    avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
  },
  {
    id: "person-3",
    name: "Name",
    role: "Role",
    description:
      "Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.",
    avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
  },
];

const Team = () => {
  return (
    <section className="py-12">
      <div className="container flex flex-col items-start text-left">
        <p className="semibold">Our team</p>
        <h2 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">
          The team you&apos;ll be working with
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
              <a href="#">
                <Github className="size-5 text-muted-foreground" />
              </a>
              <a href="#">
                <Linkedin className="size-5 text-muted-foreground" />
              </a>
              <a href="#">
                <Dribbble className="size-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
