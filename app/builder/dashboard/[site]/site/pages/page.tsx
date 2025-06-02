"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getPages, createPage, deletePage, reorderPages } from "@/lib/actions";
import { Page } from "@/app/types/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  Search,
  Globe,
  FileText,
  Copy,
  Settings,
  ExternalLink,
  ChevronDown,
  Filter,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layout/page-header";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function PagesPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [siteId, setSiteId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    visible: true,
    showInHeader: false,
    showInFooter: false,
  });

  const router = useRouter();

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSiteId(resolvedParams.site);
    };
    resolveParams();
  }, [params]);

  // Filter and search pages
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesSearch =
        searchQuery === "" ||
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.displayName &&
          page.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        filterVisible === null || page.visible === filterVisible;

      return matchesSearch && matchesFilter;
    });
  }, [pages, searchQuery, filterVisible]);

  useEffect(() => {
    if (!siteId) return;

    async function fetchPages() {
      try {
        const fetchedPages = await getPages(siteId);
        setPages(fetchedPages);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
        toast.error("Failed to load pages");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPages();
  }, [siteId]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      visible: true,
      showInHeader: false,
      showInFooter: false,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from name
      if (field === "name" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Page name is required");
      return false;
    }

    if (!formData.slug.trim()) {
      toast.error("Page slug is required");
      return false;
    }

    // Check if slug is unique
    if (pages.some((page) => page.slug === formData.slug)) {
      toast.error("A page with this slug already exists");
      return false;
    }

    return true;
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreating(true);

    try {
      const newPage = await createPage(siteId, {
        siteId,
        name: formData.name,
        slug: formData.slug,
        displayName: formData.name, // Use name as display name
        description: formData.description,
        sortOrder: pages.length,
        visible: formData.visible,
        showInHeader: formData.showInHeader,
        showInFooter: formData.showInFooter,
      });

      setPages([...pages, newPage]);
      resetForm();
      setIsDialogOpen(false);
      toast.success("Page created successfully");
    } catch (error) {
      console.error("Failed to create page:", error);
      toast.error("Failed to create page");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    // Check if this is the only page
    if (pages.length <= 1) {
      toast.error(
        "Cannot delete the last page. Every site must have at least one page."
      );
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${pageName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deletePage(pageId);
      setPages(pages.filter((page) => page.id !== pageId));
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    }
  };

  const handleDuplicatePage = async (page: Page) => {
    try {
      const duplicatedPage = await createPage(siteId, {
        siteId,
        name: `${page.name} (Copy)`,
        slug: `${page.slug}-copy`,
        displayName: `${page.displayName || page.name} (Copy)`,
        description: page.description,
        sortOrder: pages.length,
        visible: false, // Start as draft
        showInHeader: false,
        showInFooter: false,
      });

      setPages([...pages, duplicatedPage]);
      toast.success("Page duplicated successfully");
    } catch (error) {
      console.error("Failed to duplicate page:", error);
      toast.error("Failed to duplicate page");
    }
  };

  const navigateToPageEditor = (pageId: string) => {
    router.push(`/dashboard/${siteId}/site/pages/${pageId}`);
  };

  const navigateToPagePreview = (slug: string) => {
    window.open(`/${siteId}/${slug}`, "_blank");
  };

  const copyPageUrl = (slug: string) => {
    const url = `${window.location.origin}/${siteId}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Page URL copied to clipboard");
  };

  const getPageStats = () => {
    const total = pages.length;
    const visible = pages.filter((p) => p.visible).length;
    const draft = total - visible;
    return { total, visible, draft };
  };

  const stats = getPageStats();

  // Get the home page (first visible page or first page overall)
  const getHomePage = () => {
    if (pages.length === 0) return null;

    // Return the first visible page (sorted by sortOrder)
    const visiblePages = pages.filter((page) => page.visible);
    if (visiblePages.length > 0) {
      return visiblePages.sort((a, b) => a.sortOrder - b.sortOrder)[0];
    }

    // If no visible pages, return the first page overall
    return pages.sort((a, b) => a.sortOrder - b.sortOrder)[0];
  };

  const homePage = getHomePage();

  // Handle reordering pages with drag and drop
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Create a new array sorted by current sortOrder to ensure correct ordering
    const sortedPages = [...filteredPages].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    // Update locally first for better UX
    const newPages = [...sortedPages];
    const [moved] = newPages.splice(sourceIndex, 1);
    newPages.splice(destinationIndex, 0, moved);

    // Update the pages state immediately for visual feedback
    const updatedAllPages = pages.map((page) => {
      const newIndex = newPages.findIndex((p) => p.id === page.id);
      if (newIndex !== -1) {
        return { ...page, sortOrder: newIndex };
      }
      return page;
    });

    setPages(updatedAllPages);

    // Then update on the server
    try {
      const pageIds = newPages.map((page) => page.id);
      await reorderPages(siteId, pageIds);
      toast.success("Pages reordered successfully");
    } catch (error) {
      console.error("Failed to reorder pages:", error);
      toast.error("Failed to reorder pages");
      // Revert the local changes on error
      setPages(pages);
    }
  };

  // Sort pages by sortOrder for display
  const sortedFilteredPages = useMemo(() => {
    return [...filteredPages].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );
  }, [filteredPages]);

  if (!siteId) {
    return (
      <div className="p-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Pages" />
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={resetForm}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Page
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleCreatePage}>
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                  <DialogDescription>
                    Add a new page to your site. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Page Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., About Us"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="e.g., about-us"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", generateSlug(e.target.value))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Will be accessible at: /{siteId}/
                      {formData.slug || "page-slug"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of this page..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="visible">Page Visible</Label>
                      <Switch
                        id="visible"
                        checked={formData.visible}
                        onCheckedChange={(checked) =>
                          handleInputChange("visible", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showInHeader">Show in Header</Label>
                      <Switch
                        id="showInHeader"
                        checked={formData.showInHeader}
                        onCheckedChange={(checked) =>
                          handleInputChange("showInHeader", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showInFooter">Show in Footer</Label>
                      <Switch
                        id="showInFooter"
                        checked={formData.showInFooter}
                        onCheckedChange={(checked) =>
                          handleInputChange("showInFooter", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Page"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-2">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Pages
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Published
                  </p>
                  <p className="text-2xl font-bold">{stats.visible}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Draft
                  </p>
                  <p className="text-2xl font-bold">{stats.draft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Pages ({filteredPages.length})</CardTitle>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterVisible(null)}>
                      All Pages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterVisible(true)}>
                      Published Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterVisible(false)}>
                      Draft Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading pages...</p>
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="py-12 text-center">
                {pages.length === 0 ? (
                  <>
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Create your first page to get started building your site.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Page
                    </Button>
                  </>
                ) : (
                  <>
                    <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No pages found
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your search terms or filters.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Order</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Navigation</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <Droppable droppableId="pages">
                      {(provided) => (
                        <TableBody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {sortedFilteredPages.map((page, index) => (
                            <Draggable
                              key={page.id}
                              draggableId={page.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={
                                    snapshot.isDragging ? "bg-muted/50" : ""
                                  }
                                >
                                  <TableCell>
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing flex items-center justify-center"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <div>
                                      <div className="font-medium flex items-center gap-2">
                                        {page.displayName || page.name}
                                        {homePage?.id === page.id && (
                                          <Badge
                                            variant="default"
                                            className="text-xs bg-blue-600"
                                          >
                                            Home Page
                                          </Badge>
                                        )}
                                      </div>
                                      {page.description && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                          {page.description}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <code className="text-sm bg-muted px-2 py-1 rounded">
                                        /{page.slug}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyPageUrl(page.slug)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <Badge
                                      variant={
                                        page.visible ? "default" : "secondary"
                                      }
                                    >
                                      {page.visible ? "Published" : "Draft"}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex gap-1">
                                      {page.showInHeader && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Header
                                        </Badge>
                                      )}
                                      {page.showInFooter && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Footer
                                        </Badge>
                                      )}
                                      {!page.showInHeader &&
                                        !page.showInFooter && (
                                          <span className="text-sm text-muted-foreground">
                                            —
                                          </span>
                                        )}
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          navigateToPageEditor(page.id)
                                        }
                                        title="Edit page"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          navigateToPagePreview(page.slug)
                                        }
                                        title="Preview page"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleDuplicatePage(page)
                                            }
                                          >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Duplicate
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() =>
                                              handleDeletePage(
                                                page.id,
                                                page.name
                                              )
                                            }
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      )}
                    </Droppable>
                  </Table>
                </div>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
