import { Menu } from "lucide-react";

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

const Header = ({ site }: { site: Site }) => {
  const { additionalLinks, navItemAllignment, primaryButton } =
    site.settings.config.header;
  const { siteName, siteLogoUrl } = site.settings.brand;

  const pages = site.pages
    .filter((page) => page.visible && page.showInHeader && page.sortOrder >= 0)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const menu: MenuItem[] = [
    ...pages.map((page) => ({
      title: page.name,
      url: `/${site.subDomain}/${page.slug}`,
    })),
    ...(additionalLinks?.map((link) => ({
      title: link.title,
      url: link.url,
    })) ?? []),
  ];

  const navAlignmentClass = (() => {
    const alignment = navItemAllignment?.toLowerCase?.();
    switch (alignment) {
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      case "left":
      default:
        return "justify-start";
    }
  })();

  return (
    <section className="">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image width={150} height={50} src={siteLogoUrl} alt={siteName} />
          </Link>

          {/* Aligned Navigation */}
          <div className={`flex flex-1 mx-3 ${navAlignmentClass}`}>
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Primary CTA */}
          <div className="flex gap-2">
            {primaryButton?.url && primaryButton?.title && (
              <Button asChild size="lg">
                <a href={primaryButton.url}>{primaryButton.title}</a>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image width={150} height={50} src={siteLogoUrl} alt={siteName} />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        src={siteLogoUrl}
                        alt={siteName}
                        width={150}
                        height={50}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  {primaryButton?.url && primaryButton?.title && (
                    <Button asChild>
                      <a href={primaryButton.url}>{primaryButton.title}</a>
                    </Button>
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

// Desktop Menu Item
const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// Mobile Menu Item
const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

// Shared submenu link
const SubMenuLink = ({ item }: { item: MenuItem }) => (
  <a
    className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
    href={item.url}
  >
    {item.icon && <div className="text-foreground">{item.icon}</div>}
    <div>
      <div className="text-sm font-semibold">{item.title}</div>
      {item.description && (
        <p className="text-sm leading-snug text-muted-foreground">
          {item.description}
        </p>
      )}
    </div>
  </a>
);

export { Header };
