"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPage, updatePage } from "@/lib/actions";
import { Page } from "@/app/types/site";
import { PageBuilder } from "@/components/builder/page-builder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Globe,
  Settings,
  Layers,
  BarChart3,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ site: string; pageId: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{
    site: string;
    pageId: string;
  } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageEditorClient
      siteId={resolvedParams.site}
      pageId={resolvedParams.pageId}
    />
  );
}

function PageEditorClient({
  siteId,
  pageId,
}: {
  siteId: string;
  pageId: string;
}) {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();

  // Page settings state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    visible: true,
    showInHeader: false,
    showInFooter: false,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    async function fetchPage() {
      try {
        const fetchedPage = await getPage(pageId);
        if (fetchedPage) {
          setPage(fetchedPage);

          // Populate settings form
          setFormData({
            name: fetchedPage.name,
            slug: fetchedPage.slug,
            description: fetchedPage.description || "",
            visible: fetchedPage.visible,
            showInHeader: fetchedPage.showInHeader || false,
            showInFooter: fetchedPage.showInFooter || false,
            metaTitle: fetchedPage.metaTitle || "",
            metaDescription: fetchedPage.metaDescription || "",
          });
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from name if slug hasn't been manually changed
      if (
        field === "name" &&
        typeof value === "string" &&
        prev.slug === generateSlug(prev.name)
      ) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.push(`/dashboard/${siteId}/site/pages`);
      }
    } else {
      router.push(`/dashboard/${siteId}/site/pages`);
    }
  };

  const handleOpenPreview = () => {
    window.open(`/${siteId}/${formData.slug}`, "_blank");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    setIsSaving(true);

    try {
      const updatedPage = await updatePage(page.id, {
        name: formData.name,
        displayName: formData.name, // Use name as display name
        slug: formData.slug,
        description: formData.description,
        visible: formData.visible,
        showInHeader: formData.showInHeader,
        showInFooter: formData.showInFooter,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      });

      setPage(updatedPage);
      setHasUnsavedChanges(false);
      toast.success("Page settings saved successfully");
    } catch (error) {
      console.error("Failed to save page settings:", error);
      toast.error("Failed to save page settings");
    } finally {
      setIsSaving(false);
    }
  };

  const getPageStats = () => {
    if (!page) return { sections: 0, lastModified: null };

    return {
      sections: page.sections?.length || 0,
      lastModified: page.updatedAt || page.createdAt,
    };
  };

  const stats = getPageStats();

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading page editor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <Settings className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            The page you are looking for does not exist or has been deleted.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Page Editor"
        parent={{ title: "Pages", href: `/dashboard/${siteId}/site/pages` }}
      />
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {page.displayName || page.name}
                </h1>
                <Badge variant={page.visible ? "default" : "secondary"}>
                  {page.visible ? "Published" : "Draft"}
                </Badge>
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-orange-600">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                /{siteId}/{formData.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleOpenPreview}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sections</p>
                  <p className="text-xl font-semibold">{stats.sections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xl font-semibold">
                    {page.visible ? "Live" : "Draft"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SEO Score</p>
                  <p className="text-xl font-semibold">
                    {formData.metaTitle && formData.metaDescription
                      ? "Good"
                      : "Needs Work"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modified</p>
                  <p className="text-sm font-semibold">
                    {stats.lastModified
                      ? new Date(stats.lastModified).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Page Builder
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings & SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Content Editor</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="preview-mode" className="text-sm">
                      Preview Mode
                    </Label>
                    <Switch
                      checked={isPreview}
                      onCheckedChange={setIsPreview}
                      id="preview-mode"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PageBuilder page={page} preview={isPreview} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Page Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="e.g., About Us"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          handleInputChange(
                            "slug",
                            generateSlug(e.target.value)
                          )
                        }
                        placeholder="e.g., about-us"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Will be accessible at: /{siteId}/{formData.slug}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Brief description of this page..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isSaving || !hasUnsavedChanges}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Meta Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        handleInputChange("metaTitle", e.target.value)
                      }
                      placeholder="Leave blank to use display name"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        handleInputChange("metaDescription", e.target.value)
                      }
                      placeholder="Brief description for search engines..."
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Visibility & Navigation</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="visible">Page Visible</Label>
                          <p className="text-xs text-muted-foreground">
                            Make this page publicly accessible
                          </p>
                        </div>
                        <Switch
                          id="visible"
                          checked={formData.visible}
                          onCheckedChange={(checked) =>
                            handleInputChange("visible", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showInHeader">Show in Header</Label>
                          <p className="text-xs text-muted-foreground">
                            Include in main navigation
                          </p>
                        </div>
                        <Switch
                          id="showInHeader"
                          checked={formData.showInHeader}
                          onCheckedChange={(checked) =>
                            handleInputChange("showInHeader", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showInFooter">Show in Footer</Label>
                          <p className="text-xs text-muted-foreground">
                            Include in footer links
                          </p>
                        </div>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
