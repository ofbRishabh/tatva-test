import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  heading: string;
  description: string;
  items?: FaqItem[];
  supportHeading: string;
  supportDescription: string;
  supportButtonText: string;
  supportButtonUrl: string;
}

export const schema = {
  title: "FAQ Section",
  type: "object",
  properties: {
    heading: {
      type: "string",
      title: "Heading",
      default: "Frequently asked questions",
    },
    description: {
      type: "string",
      title: "Description",
      default:
        "Find answers to common questions about our products. Can't find what you're looking for? Contact our support team.",
    },
    items: {
      type: "array",
      title: "FAQ Items",
      items: {
        type: "object",
        properties: {
          id: { type: "string", title: "ID" },
          question: { type: "string", title: "Question" },
          answer: { type: "string", title: "Answer" },
        },
        required: ["id", "question", "answer"],
      },
    },
    supportHeading: {
      type: "string",
      title: "Support Heading",
      default: "Need more support?",
    },
    supportDescription: {
      type: "string",
      title: "Support Description",
      default:
        "Our dedicated support team is here to help you with any questions or concerns. Get in touch with us for personalized assistance.",
    },
    supportButtonText: {
      type: "string",
      title: "Support Button Text",
      default: "Contact Support",
    },
    supportButtonUrl: {
      type: "string",
      title: "Support Button URL",
      default: "https://www.shadcnblocks.com",
    },
  },
};

export const uiSchema = {
  description: { "ui:widget": "textarea" },
  items: {
    items: {
      answer: { "ui:widget": "textarea" },
    },
  },
  supportDescription: { "ui:widget": "textarea" },
  supportButtonUrl: { "ui:widget": "url" },
};

export const sampleData = {
  heading: "Frequently asked questions",
  description:
    "Find answers to common questions about our products. Can't find what you're looking for? Contact our support team.",
  items: [
    {
      id: "faq-1",
      question: "What is the return policy?",
      answer:
        "You can return any item within 30 days of purchase for a full refund, provided it is in its original condition.",
    },
    {
      id: "faq-2",
      question: "How do I track my order?",
      answer:
        "Once your order is shipped, you will receive an email with a tracking number. You can use this number on our website to track your order.",
    },
    {
      id: "faq-3",
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination.",
    },
    {
      id: "faq-4",
      question: "Can I change my order after it has been placed?",
      answer:
        "You can change your order within 24 hours of placing it by contacting our customer service team.",
    },
    {
      id: "faq-5",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay.",
    },
    {
      id: "faq-6",
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@example.com or by calling 1-800-123-4567.",
    },
    {
      id: "faq-7",
      question: "Are there any discounts for bulk purchases?",
      answer:
        "Yes, we offer discounts for bulk purchases. Please contact our sales team for more information.",
    },
  ],
  supportHeading: "Need more support?",
  supportDescription:
    "Our dedicated support team is here to help you with any questions or concerns. Get in touch with us for personalized assistance.",
  supportButtonText: "Contact Support",
  supportButtonUrl: "https://www.shadcnblocks.com",
};

const Faq = ({
  heading = sampleData.heading,
  description = sampleData.description,
  items = sampleData.items,
  supportHeading = sampleData.supportHeading,
  supportDescription = sampleData.supportDescription,
  supportButtonText = sampleData.supportButtonText,
  supportButtonUrl = sampleData.supportButtonUrl,
}: FaqProps) => {
  return (
    <section className="">
      <div className="container space-y-16">
        <div className="mx-auto flex  flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg bg-accent p-4 text-center md:rounded-xl md:p-6 lg:p-8">
          <div className="relative">
            <Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://shadcnblocks.com/images/block/avatar-2.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://shadcnblocks.com/images/block/avatar-3.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="mb-4 size-16 border md:mb-5">
              <AvatarImage src="https://shadcnblocks.com/images/block/avatar-1.webp" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="mb-2 max-w-3xl font-semibold lg:text-lg">
            {supportHeading}
          </h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {supportDescription}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto" asChild>
              <a href={supportButtonUrl} target="_blank">
                {supportButtonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
