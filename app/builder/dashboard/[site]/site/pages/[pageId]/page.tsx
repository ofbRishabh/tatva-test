"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPage, updatePage } from "@/lib/actions";
import { Page } from "@/app/types/site";
import { PageBuilder } from "@/components/builder/page-builder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function PageEditorPage({
  params,
}: {
  params: { site: string; pageId: string };
}) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const siteId = resolvedParams.site;
  const pageId = resolvedParams.pageId;

  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Page settings state
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [visible, setVisible] = useState(true);
  const [showInHeader, setShowInHeader] = useState(false);
  const [showInFooter, setShowInFooter] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    async function fetchPage() {
      try {
        const fetchedPage = await getPage(pageId);
        if (fetchedPage) {
          setPage(fetchedPage);

          // Populate settings form
          setName(fetchedPage.name);
          setDisplayName(fetchedPage.displayName || fetchedPage.name);
          setSlug(fetchedPage.slug);
          setVisible(fetchedPage.visible);
          setShowInHeader(fetchedPage.showInHeader);
          setShowInFooter(fetchedPage.showInFooter);
          setMetaTitle(fetchedPage.metaTitle || "");
          setMetaDescription(fetchedPage.metaDescription || "");
        }
      } catch (error) {
        console.error("Failed to fetch page:", error);
        toast.error("Failed to load page");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [pageId]);

  const handleBack = () => {
    router.push(`/builder/dashboard/${siteId}/site/pages`);
  };

  const handleOpenPreview = () => {
    window.open(`/${siteId}/${slug}`, "_blank");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    setIsSaving(true);

    try {
      const updatedPage = await updatePage(page.id, {
        name,
        displayName,
        slug,
        visible,
        showInHeader,
        showInFooter,
        metaTitle,
        metaDescription,
      });

      setPage(updatedPage);
      toast.success("Page settings saved successfully");
    } catch (error) {
      console.error("Failed to save page settings:", error);
      toast.error("Failed to save page settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loading Page...</h1>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Page not found</h1>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            {page.displayName || page.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleOpenPreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder">
        <TabsList className="mb-4">
          <TabsTrigger value="builder">Page Builder</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Switch
              checked={isPreview}
              onCheckedChange={setIsPreview}
              id="preview-mode"
            />
            <Label htmlFor="preview-mode" className="ml-2">
              Preview Mode
            </Label>
          </div>

          <PageBuilder page={page} preview={isPreview} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Page Name (Internal)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Leave blank to use page display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search engines"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visible"
                    checked={visible}
                    onCheckedChange={setVisible}
                  />
                  <Label htmlFor="visible">Page Visible</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showInHeader"
                    checked={showInHeader}
                    onCheckedChange={setShowInHeader}
                  />
                  <Label htmlFor="showInHeader">Show in Header</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showInFooter"
                    checked={showInFooter}
                    onCheckedChange={setShowInFooter}
                  />
                  <Label htmlFor="showInFooter">Show in Footer</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
