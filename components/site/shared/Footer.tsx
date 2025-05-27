import { Site } from "@/app/types/site";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

type SocialLink = {
  icon: React.ReactElement;
  href: string;
  label: string;
};

type Sections = Array<{
  title: string;
  links: Array<{ name: string; href: string }>;
}>;

const Footer = ({ site }: { site: Site }) => {
  const { siteName, siteDescription, siteLogoUrl } = site.settings.brand;
  const { additionalLinks, socialLinks, legalLinks } =
    site.settings.config.footer;

  const defaultSocialLinks: SocialLink[] = [
    socialLinks.instagram
      ? {
          icon: <Instagram className="size-5" />,
          href: socialLinks.instagram,
          label: "Instagram",
        }
      : null,
    socialLinks.facebook
      ? {
          icon: <Facebook className="size-5" />,
          href: socialLinks.facebook,
          label: "Facebook",
        }
      : null,
    socialLinks.twitter
      ? {
          icon: <Twitter className="size-5" />,
          href: socialLinks.twitter,
          label: "Twitter",
        }
      : null,
    socialLinks.linkdin
      ? {
          icon: <Linkedin className="size-5" />,
          href: socialLinks.linkdin,
          label: "LinkedIn",
        }
      : null,
  ].filter(Boolean) as SocialLink[];

  const pages = site.pages;

  const footerPages = pages
    .filter((page) => page.visible && page.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const sections: Sections = [
    {
      title: "Quick Links",
      links: footerPages.map((page) => ({
        name: page.name,
        href: `/${page.slug}`,
      })),
    },
    ...(additionalLinks && additionalLinks.length > 0
      ? [
          {
            title: "Other",
            links: additionalLinks.map((link) => ({
              name: link.title,
              href: link.url,
            })),
          },
        ]
      : []),
  ];
  return (
    <section>
      <div>
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <Link href={"/"}>
                <Image
                  src={siteLogoUrl}
                  alt={siteName}
                  title={siteName}
                  height={50}
                  width={150}
                />
              </Link>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              {siteDescription}
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {defaultSocialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20" dir="rtl">
            {[...sections].map((section, sectionIdx) => (
              <div key={sectionIdx} className="text-left" dir="ltr">
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">
            © 2025 {siteName} All rights reserved.
          </p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Footer };
