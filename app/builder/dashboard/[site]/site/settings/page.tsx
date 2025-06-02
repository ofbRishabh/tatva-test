"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Palette,
  Settings,
  BarChart3,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getSite, updateSite, getPages } from "@/lib/actions";
import { Site, Page } from "@/app/types/site";
import { PageHeader } from "@/components/layout/page-header";

interface LinkItem {
  title: string;
  url: string;
}

interface LegalLink {
  name: string;
  href: string;
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("brand");

  const resolvedParams = React.use(params);
  const siteId = resolvedParams.site;

  // Form states
  const [brandSettings, setBrandSettings] = useState({
    siteName: "",
    siteTitle: "",
    siteDescription: "",
    siteLogoUrl: "",
    siteFaviconUrl: "",
    siteLogoSize: "md",
    theme: {
      primaryColor: "#4F46E5",
      secondaryColor: "#22D3EE",
      palette: "light",
      fontFamily: "Inter, sans-serif",
    },
  });

  const [headerSettings, setHeaderSettings] = useState({
    navItemAllignment: "left",
    primaryButton: {
      title: "",
      url: "",
    },
    additionalLinks: [] as LinkItem[],
  });

  const [footerSettings, setFooterSettings] = useState({
    additionalLinks: [] as LinkItem[],
    legalLinks: [] as LegalLink[],
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkdin: "",
    },
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalyticsId: "",
    facebookPixelId: "",
    googleTagManagerId: "",
    googleAdsId: "",
  });

  // Dialog states
  const [linkDialog, setLinkDialog] = useState({
    open: false,
    type: "" as "header" | "footer" | "legal" | "",
    editIndex: -1,
    title: "",
    url: "",
    name: "",
    href: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [siteData, pagesData] = await Promise.all([
          getSite(siteId),
          getPages(siteId),
        ]);

        if (siteData) {
          setSite(siteData);
          setPages(pagesData);

          // Populate form data
          const settings = siteData.settings || {};

          setBrandSettings({
            siteName: settings.brand?.siteName || "",
            siteTitle: settings.brand?.siteTitle || "",
            siteDescription: settings.brand?.siteDescription || "",
            siteLogoUrl: settings.brand?.siteLogoUrl || "",
            siteFaviconUrl: settings.brand?.siteFaviconUrl || "",
            siteLogoSize: settings.brand?.siteLogoSize || "md",
            theme: {
              primaryColor: settings.brand?.theme?.primaryColor || "#4F46E5",
              secondaryColor:
                settings.brand?.theme?.secondaryColor || "#22D3EE",
              palette: settings.brand?.theme?.palette || "light",
              fontFamily:
                settings.brand?.theme?.fontFamily || "Inter, sans-serif",
            },
          });

          setHeaderSettings({
            navItemAllignment:
              settings.config?.header?.navItemAllignment || "left",
            primaryButton: {
              title: settings.config?.header?.primaryButton?.title || "",
              url: settings.config?.header?.primaryButton?.url || "",
            },
            additionalLinks: settings.config?.header?.additionalLinks || [],
          });

          setFooterSettings({
            additionalLinks: settings.config?.footer?.additionalLinks || [],
            legalLinks: settings.config?.footer?.legalLinks || [],
            socialLinks: {
              instagram: settings.config?.footer?.socialLinks?.instagram || "",
              facebook: settings.config?.footer?.socialLinks?.facebook || "",
              twitter: settings.config?.footer?.socialLinks?.twitter || "",
              linkdin: settings.config?.footer?.socialLinks?.linkdin || "",
            },
          });

          setIntegrationSettings({
            googleAnalyticsId: settings.integrations?.googleAnalyticsId || "",
            facebookPixelId: settings.integrations?.facebookPixelId || "",
            googleTagManagerId: settings.integrations?.googleTagManagerId || "",
            googleAdsId: settings.integrations?.googleAdsId || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch site data:", error);
        toast.error("Failed to load site settings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [siteId]);

  const handleSave = async () => {
    if (!site) return;

    setIsSaving(true);
    try {
      const updatedSettings = {
        brand: brandSettings,
        config: {
          header: headerSettings,
          footer: footerSettings,
        },
        integrations: integrationSettings,
      };

      // Type assertion to handle the complex nested type
      await updateSite(site.id.toString(), {
        settings: updatedSettings,
      } as Partial<Omit<Site, "id" | "createdAt" | "updatedAt">>);
      setHasUnsavedChanges(false);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (hasUnsavedChanges) {
      toast.error("Please save your changes before previewing");
      return;
    }
    window.open(`/${siteId}`, "_blank");
  };

  const openLinkDialog = (
    type: "header" | "footer" | "legal",
    editIndex = -1
  ) => {
    const isEdit = editIndex >= 0;
    let item: LinkItem | LegalLink | null = null;

    if (isEdit) {
      if (type === "header") {
        item = headerSettings.additionalLinks[editIndex];
      } else if (type === "footer") {
        item = footerSettings.additionalLinks[editIndex];
      } else if (type === "legal") {
        item = footerSettings.legalLinks[editIndex];
      }
    }

    setLinkDialog({
      open: true,
      type,
      editIndex,
      title: item && "title" in item ? item.title : "",
      url: item && "url" in item ? item.url : "",
      name: item && "name" in item ? item.name : "",
      href: item && "href" in item ? item.href : "",
    });
  };

  const saveLinkDialog = () => {
    const { type, editIndex, title, url, name, href } = linkDialog;

    if (type === "header") {
      const newLinks = [...headerSettings.additionalLinks];
      const linkData = { title, url };

      if (editIndex >= 0) {
        newLinks[editIndex] = linkData;
      } else {
        newLinks.push(linkData);
      }

      setHeaderSettings({ ...headerSettings, additionalLinks: newLinks });
    } else if (type === "footer") {
      const newLinks = [...footerSettings.additionalLinks];
      const linkData = { title, url };

      if (editIndex >= 0) {
        newLinks[editIndex] = linkData;
      } else {
        newLinks.push(linkData);
      }

      setFooterSettings({ ...footerSettings, additionalLinks: newLinks });
    } else if (type === "legal") {
      const newLinks = [...footerSettings.legalLinks];
      const linkData = { name, href };

      if (editIndex >= 0) {
        newLinks[editIndex] = linkData;
      } else {
        newLinks.push(linkData);
      }

      setFooterSettings({ ...footerSettings, legalLinks: newLinks });
    }

    setLinkDialog({
      open: false,
      type: "",
      editIndex: -1,
      title: "",
      url: "",
      name: "",
      href: "",
    });
    setHasUnsavedChanges(true);
  };

  const removeLink = (type: "header" | "footer" | "legal", index: number) => {
    if (type === "header") {
      const newLinks = headerSettings.additionalLinks.filter(
        (_, i) => i !== index
      );
      setHeaderSettings({ ...headerSettings, additionalLinks: newLinks });
    } else if (type === "footer") {
      const newLinks = footerSettings.additionalLinks.filter(
        (_, i) => i !== index
      );
      setFooterSettings({ ...footerSettings, additionalLinks: newLinks });
    } else if (type === "legal") {
      const newLinks = footerSettings.legalLinks.filter((_, i) => i !== index);
      setFooterSettings({ ...footerSettings, legalLinks: newLinks });
    }

    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Loading site settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Site Settings" />
      <div className=" p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div></div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600">
                Unsaved Changes
              </Badge>
            )}
            {/* <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </Button> */}
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Palette className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="text-lg font-semibold">
                    {brandSettings.siteName || "Not Set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <LinkIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nav Links</p>
                  <p className="text-lg font-semibold">
                    {pages.filter((p) => p.showInHeader).length +
                      headerSettings.additionalLinks.length}
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
                  <p className="text-sm text-muted-foreground">Integrations</p>
                  <p className="text-lg font-semibold">
                    {Object.values(integrationSettings).filter(Boolean).length}
                    /4
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 text-center">
            <TabsTrigger
              value="brand"
              className="flex items-center justify-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Brand
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="flex items-center justify-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center justify-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Brand Settings */}
          <TabsContent value="brand" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name *</Label>
                    <Input
                      id="siteName"
                      value={brandSettings.siteName}
                      onChange={(e) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteName: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g., Tatva AI"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteTitle">Site Title</Label>
                    <Input
                      id="siteTitle"
                      value={brandSettings.siteTitle}
                      onChange={(e) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteTitle: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g., Build AI-Powered Sites Effortlessly"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={brandSettings.siteDescription}
                      onChange={(e) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteDescription: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Brief description of your site..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteLogoUrl">Logo URL</Label>
                    <Input
                      id="siteLogoUrl"
                      value={brandSettings.siteLogoUrl}
                      onChange={(e) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteLogoUrl: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteFaviconUrl">Favicon URL</Label>
                    <Input
                      id="siteFaviconUrl"
                      value={brandSettings.siteFaviconUrl}
                      onChange={(e) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteFaviconUrl: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteLogoSize">Logo Size</Label>
                    <Select
                      value={brandSettings.siteLogoSize}
                      onValueChange={(value) => {
                        setBrandSettings({
                          ...brandSettings,
                          siteLogoSize: value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme & Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={brandSettings.theme.primaryColor}
                        onChange={(e) => {
                          setBrandSettings({
                            ...brandSettings,
                            theme: {
                              ...brandSettings.theme,
                              primaryColor: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-20"
                      />
                      <Input
                        value={brandSettings.theme.primaryColor}
                        onChange={(e) => {
                          setBrandSettings({
                            ...brandSettings,
                            theme: {
                              ...brandSettings.theme,
                              primaryColor: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="#4F46E5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={brandSettings.theme.secondaryColor}
                        onChange={(e) => {
                          setBrandSettings({
                            ...brandSettings,
                            theme: {
                              ...brandSettings.theme,
                              secondaryColor: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-20"
                      />
                      <Input
                        value={brandSettings.theme.secondaryColor}
                        onChange={(e) => {
                          setBrandSettings({
                            ...brandSettings,
                            theme: {
                              ...brandSettings.theme,
                              secondaryColor: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="#22D3EE"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="palette">Color Palette</Label>
                    <Select
                      value={brandSettings.theme.palette}
                      onValueChange={(value) => {
                        setBrandSettings({
                          ...brandSettings,
                          theme: { ...brandSettings.theme, palette: value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      value={brandSettings.theme.fontFamily}
                      onValueChange={(value) => {
                        setBrandSettings({
                          ...brandSettings,
                          theme: { ...brandSettings.theme, fontFamily: value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                        <SelectItem value="system-ui, sans-serif">
                          System UI
                        </SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                        <SelectItem value="Times New Roman, serif">
                          Times New Roman
                        </SelectItem>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Settings */}
          <TabsContent value="layout" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Header Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Header Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Navigation Alignment</Label>
                    <Select
                      value={headerSettings.navItemAllignment}
                      onValueChange={(value) => {
                        setHeaderSettings({
                          ...headerSettings,
                          navItemAllignment: value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Primary CTA Button</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Button text (e.g., Get Started)"
                        value={headerSettings.primaryButton.title}
                        onChange={(e) => {
                          setHeaderSettings({
                            ...headerSettings,
                            primaryButton: {
                              ...headerSettings.primaryButton,
                              title: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Input
                        placeholder="Button URL (e.g., /signup)"
                        value={headerSettings.primaryButton.url}
                        onChange={(e) => {
                          setHeaderSettings({
                            ...headerSettings,
                            primaryButton: {
                              ...headerSettings.primaryButton,
                              url: e.target.value,
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Additional Header Links</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLinkDialog("header")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {headerSettings.additionalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{link.title}</span>
                            <br />
                            <span className="text-sm text-muted-foreground">
                              {link.url}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openLinkDialog("header", index)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink("header", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Footer Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Additional Footer Links</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLinkDialog("footer")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {footerSettings.additionalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{link.title}</span>
                            <br />
                            <span className="text-sm text-muted-foreground">
                              {link.url}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openLinkDialog("footer", index)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink("footer", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Legal Links</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openLinkDialog("legal")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Legal Link
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {footerSettings.legalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{link.name}</span>
                            <br />
                            <span className="text-sm text-muted-foreground">
                              {link.href}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openLinkDialog("legal", index)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink("legal", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Social Media Links</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Instagram</Label>
                        <Input
                          placeholder="Instagram URL"
                          value={footerSettings.socialLinks.instagram}
                          onChange={(e) => {
                            setFooterSettings({
                              ...footerSettings,
                              socialLinks: {
                                ...footerSettings.socialLinks,
                                instagram: e.target.value,
                              },
                            });
                            setHasUnsavedChanges(true);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Facebook</Label>
                        <Input
                          placeholder="Facebook URL"
                          value={footerSettings.socialLinks.facebook}
                          onChange={(e) => {
                            setFooterSettings({
                              ...footerSettings,
                              socialLinks: {
                                ...footerSettings.socialLinks,
                                facebook: e.target.value,
                              },
                            });
                            setHasUnsavedChanges(true);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Twitter</Label>
                        <Input
                          placeholder="Twitter URL"
                          value={footerSettings.socialLinks.twitter}
                          onChange={(e) => {
                            setFooterSettings({
                              ...footerSettings,
                              socialLinks: {
                                ...footerSettings.socialLinks,
                                twitter: e.target.value,
                              },
                            });
                            setHasUnsavedChanges(true);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">LinkedIn</Label>
                        <Input
                          placeholder="LinkedIn URL"
                          value={footerSettings.socialLinks.linkdin}
                          onChange={(e) => {
                            setFooterSettings({
                              ...footerSettings,
                              socialLinks: {
                                ...footerSettings.socialLinks,
                                linkdin: e.target.value,
                              },
                            });
                            setHasUnsavedChanges(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Marketing Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">
                      Google Analytics ID
                    </Label>
                    <Input
                      id="googleAnalyticsId"
                      value={integrationSettings.googleAnalyticsId}
                      onChange={(e) => {
                        setIntegrationSettings({
                          ...integrationSettings,
                          googleAnalyticsId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleTagManagerId">
                      Google Tag Manager ID
                    </Label>
                    <Input
                      id="googleTagManagerId"
                      value={integrationSettings.googleTagManagerId}
                      onChange={(e) => {
                        setIntegrationSettings({
                          ...integrationSettings,
                          googleTagManagerId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      value={integrationSettings.facebookPixelId}
                      onChange={(e) => {
                        setIntegrationSettings({
                          ...integrationSettings,
                          facebookPixelId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="123456789012345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleAdsId">Google Ads ID</Label>
                    <Input
                      id="googleAdsId"
                      value={integrationSettings.googleAdsId}
                      onChange={(e) => {
                        setIntegrationSettings({
                          ...integrationSettings,
                          googleAdsId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="AW-123456789"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Preview Your Site
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Save your changes to see how your site looks with the
                    current settings.
                  </p>
                  <Button onClick={handlePreview} disabled={hasUnsavedChanges}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Site Preview
                  </Button>
                  {hasUnsavedChanges && (
                    <p className="text-sm text-orange-600 mt-2">
                      Please save your changes before previewing
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Link Dialog */}
        <Dialog
          open={linkDialog.open}
          onOpenChange={(open) =>
            !open && setLinkDialog({ ...linkDialog, open: false })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {linkDialog.editIndex >= 0 ? "Edit" : "Add"}{" "}
                {linkDialog.type === "legal" ? "Legal Link" : "Link"}
              </DialogTitle>
              <DialogDescription>
                {linkDialog.type === "legal"
                  ? "Add a legal link like Privacy Policy or Terms of Service"
                  : "Add a navigation link to your header or footer"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkTitle">
                  {linkDialog.type === "legal" ? "Name" : "Title"}
                </Label>
                <Input
                  id="linkTitle"
                  value={
                    linkDialog.type === "legal"
                      ? linkDialog.name
                      : linkDialog.title
                  }
                  onChange={(e) =>
                    setLinkDialog({
                      ...linkDialog,
                      [linkDialog.type === "legal" ? "name" : "title"]:
                        e.target.value,
                    })
                  }
                  placeholder={
                    linkDialog.type === "legal"
                      ? "e.g., Privacy Policy"
                      : "e.g., About Us"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={
                    linkDialog.type === "legal"
                      ? linkDialog.href
                      : linkDialog.url
                  }
                  onChange={(e) =>
                    setLinkDialog({
                      ...linkDialog,
                      [linkDialog.type === "legal" ? "href" : "url"]:
                        e.target.value,
                    })
                  }
                  placeholder="e.g., /about or https://example.com"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLinkDialog({ ...linkDialog, open: false })}
              >
                Cancel
              </Button>
              <Button onClick={saveLinkDialog}>
                {linkDialog.editIndex >= 0 ? "Update" : "Add"} Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
