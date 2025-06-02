import { Menu, ChevronDown } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Site } from "@/app/types/site";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  description?: string;
  items?: MenuItem[];
}

const Header = ({ site }: { site: Site | null }) => {
  // Handle case when site is null
  if (!site) {
    return (
      <section className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="hidden lg:flex space-x-6">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </nav>
        </div>
      </section>
    );
  }

  // Safely access nested properties with fallbacks
  const headerConfig = site.settings?.config?.header || {};
  const additionalLinks = headerConfig.additionalLinks || [];
  const navItemAllignment = headerConfig.navItemAllignment || "left";
  const primaryButton = headerConfig.primaryButton || {};

  const brandConfig = site.settings?.brand || {};
  const siteName = brandConfig.siteName || site.name || "Site";
  const siteLogoUrl = brandConfig.siteLogoUrl || "";

  // Safely filter and sort pages for header navigation
  const headerPages = site.pages
    ? site.pages
        .filter((page) => {
          // Only include pages that are:
          // 1. Visible (published)
          // 2. Explicitly marked to show in header
          // 3. Have a valid sortOrder (>= 0)
          return (
            page.visible === true &&
            page.showInHeader === true &&
            typeof page.sortOrder === "number" &&
            page.sortOrder >= 0
          );
        })
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : [];

  // Group pages for dropdown if there are many
  const menuItems: MenuItem[] = [
    // First add pages that should show in header
    ...headerPages.map((page) => ({
      title: page.displayName || page.name,
      url: `/${page.slug}`,
    })),
    // Then add additional links from settings
    ...additionalLinks.map((link) => ({
      title: link.title,
      url: link.url,
    })),
  ];

  // Determine navigation alignment classes
  const navAlignmentClass =
    navItemAllignment === "center"
      ? "justify-center"
      : navItemAllignment === "right"
      ? "justify-end"
      : "justify-start";

  return (
    <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {siteLogoUrl ? (
                <Image
                  src={siteLogoUrl}
                  alt={siteName}
                  title={siteName}
                  height={40}
                  width={120}
                  className="h-auto max-h-10"
                  priority
                />
              ) : (
                <span className="text-xl font-bold">{siteName}</span>
              )}
            </Link>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className={`flex-1 mx-8 ${navAlignmentClass}`}>
            <NavigationMenuList>
              {menuItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.items && item.items.length > 0 ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent">
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[400px] p-4">
                          <div className="grid gap-3">
                            {item.items.map((subItem, subIndex) => (
                              <NavigationMenuLink key={subIndex} asChild>
                                <Link
                                  href={subItem.url}
                                  className="block rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  {subItem.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                      {subItem.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Primary Button */}
          {primaryButton && primaryButton.title && primaryButton.url && (
            <div className="flex items-center">
              <Button asChild>
                <Link href={primaryButton.url}>{primaryButton.title}</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-4">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {siteLogoUrl ? (
                <Image
                  src={siteLogoUrl}
                  alt={siteName}
                  title={siteName}
                  height={32}
                  width={96}
                  className="h-auto max-h-8"
                  priority
                />
              ) : (
                <span className="text-lg font-bold">{siteName}</span>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">{siteName}</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <Accordion type="single" collapsible className="w-full">
                    {menuItems.map((item, index) => (
                      <div key={index}>
                        {item.items && item.items.length > 0 ? (
                          <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger className="text-sm font-medium">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col space-y-2 pl-4">
                                {item.items.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    href={subItem.url}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <div className="py-3">
                            <Link
                              href={item.url}
                              className="text-sm font-medium hover:text-primary transition-colors"
                            >
                              {item.title}
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </Accordion>

                  {/* Mobile Primary Button */}
                  {primaryButton &&
                    primaryButton.title &&
                    primaryButton.url && (
                      <div className="mt-6 pt-6 border-t">
                        <Button asChild className="w-full">
                          <Link href={primaryButton.url}>
                            {primaryButton.title}
                          </Link>
                        </Button>
                      </div>
                    )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Header };
