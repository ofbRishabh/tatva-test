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

const Footer = ({ site }: { site: Site | null }) => {
  // Handle case when site is null
  if (!site) {
    return (
      <section className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex space-x-4">
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Safely access nested properties with fallbacks
  const siteName = site.settings?.brand?.siteName || site.name || "Site";
  const siteDescription =
    site.settings?.brand?.siteDescription || site.description || "";
  const siteLogoUrl = site.settings?.brand?.siteLogoUrl || "";

  const footerConfig = site.settings?.config?.footer || {};
  const additionalLinks = footerConfig.additionalLinks || [];
  const socialLinks = footerConfig.socialLinks || {};
  const legalLinks = footerConfig.legalLinks || [];

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

  const pages = site?.pages || []; // Add fallback to empty array

  // Safely filter and sort footer pages
  const footerPages = pages
    .filter((page) => {
      // Only include pages that are:
      // 1. Visible (published)
      // 2. Explicitly marked to show in footer
      // 3. Have a valid sortOrder (>= 0)
      return (
        page &&
        page.visible === true &&
        page.showInFooter === true &&
        typeof page.sortOrder === "number" &&
        page.sortOrder >= 0
      );
    })
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const sections: Sections = [
    // Only show "Quick Links" section if there are footer pages
    ...(footerPages.length > 0
      ? [
          {
            title: "Quick Links",
            links: footerPages.map((page) => ({
              name: page.displayName || page.name,
              href: `/${page.slug}`,
            })),
          },
        ]
      : []),
    // Add additional footer links if they exist
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
                {siteLogoUrl ? (
                  <Image
                    src={siteLogoUrl}
                    alt={siteName}
                    title={siteName}
                    height={50}
                    width={150}
                  />
                ) : (
                  <span className="text-xl font-bold">{siteName}</span>
                )}
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
