import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  parent?: {
    title: string;
    href: string;
  };
  title: string;
}

export function PageHeader({ parent, title }: PageHeaderProps) {
  return (
    <header className="sticky  top-0 h-16 border-b bg-background flex items-center px-4 ">
      <div className="flex w-full items-center justify-between">
        {/* Left side: Sidebar Trigger + Breadcrumb */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {parent && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={parent.href}>
                      {parent.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </header>
  );
}
