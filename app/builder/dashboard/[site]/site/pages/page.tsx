"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPages, createPage, deletePage } from "@/lib/actions";
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
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function PagesPage({ params }: { params: { site: string } }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const siteId = resolvedParams.site;

  useEffect(() => {
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

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newPage = await createPage(siteId, {
        name: newPageName,
        slug: newPageSlug,
        displayName: newPageName,
        sortOrder: pages.length,
        visible: true,
        showInHeader: false,
        showInFooter: false,
        sections: [],
      });

      setPages([...pages, newPage]);
      setNewPageName("");
      setNewPageSlug("");
      setIsDialogOpen(false);
      toast.success("Page created successfully");
    } catch (error) {
      console.error("Failed to create page:", error);
      toast.error("Failed to create page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) {
      return;
    }

    setIsLoading(true);

    try {
      await deletePage(pageId);
      setPages(pages.filter((page) => page.id !== pageId));
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPageEditor = (pageId: string) => {
    router.push(`/dashboard/${siteId}/site/pages/${pageId}`);
  };

  const navigateToPagePreview = (slug: string) => {
    // Open in new tab
    window.open(`/${siteId}/${slug}`, "_blank");
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreatePage}>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>
                  Add a new page to your site. The slug will be used in the URL.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newPageName}
                    onChange={(e) => {
                      setNewPageName(e.target.value);
                      // Generate slug from name if slug is empty
                      if (!newPageSlug) {
                        setNewPageSlug(
                          e.target.value.toLowerCase().replace(/\s+/g, "-")
                        );
                      }
                    }}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={newPageSlug}
                    onChange={(e) =>
                      setNewPageSlug(
                        e.target.value.toLowerCase().replace(/\s+/g, "-")
                      )
                    }
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Page"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">
                No pages found. Create your first page to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      {page.displayName || page.name}
                    </TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>{page.visible ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToPageEditor(page.id)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToPagePreview(page.slug)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
