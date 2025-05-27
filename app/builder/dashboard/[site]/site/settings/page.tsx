"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Form from "@rjsf/shadcn";

import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

export const config: RJSFSchema = {
  type: "object",
  properties: {
    config: {
      type: "object",
      properties: {
        header: {
          type: "object",
          properties: {
            navItemAllignment: {
              title: "Navigation Item Alignment",
              type: "string",
              enum: ["left", "center", "right"],
            },
            primaryButton: {
              title: "Primary Button",
              type: "object",
              properties: {
                buttonText: { type: "string" },
                buttonLink: { type: "string", format: "uri" },
              },
            },
            additionalLinks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  linkText: { title: "Link Text", type: "string" },
                  linkUrl: { title: "Link URL", type: "string", format: "uri" },
                },
              },
            },
          },
        },
        footer: {
          type: "object",
          properties: {
            additionalLinks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  linkText: { title: "Link Text", type: "string" },
                  linkUrl: { title: "Link URL", type: "string", format: "uri" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const brand: RJSFSchema = {
  type: "object",
  properties: {
    siteName: { type: "string" },
    siteTitle: { type: "string" },
    siteDescription: { type: "string" },
    siteLogoUrl: { type: "string", format: "url" },
    siteFaviconUrl: { type: "string", format: "url" },
    siteLogoSize: {
      type: "string",
      enum: ["sm", "md", "lg"],
    },
    theme: {
      type: "object",
      properties: {
        primaryColor: { type: "string", format: "color" },
        secondaryColor: { type: "string", format: "color" },
        palette: { type: "string" },
        fontFamily: { type: "string" },
      },
    },
  },
};

export const integration: RJSFSchema = {
  type: "object",
  properties: {
    googleAnalyticsId: {
      title: "Google Analytics ID",
      type: "string",
    },
    facebookPixelId: {
      title: "Facebook Pixel ID",
      type: "string",
    },
    googleTagManagerId: {
      title: "Google Tag Manager ID",
      type: "string",
    },
    googleAdsId: {
      title: "Google Ads ID",
      type: "string",
    },
  },
};

export default function SettingPage() {
  return (
    <div>
      <Card className="w-full max-w-[400px] h-full p-4 space-y-4 mx-auto">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>
          <TabsContent value="config">
            <Form
              schema={config}
              validator={validator}
              onSubmit={({ formData }) => {
                console.log("Form Data:", formData);
              }}
            />
          </TabsContent>
          <TabsContent value="brand">
            <Form
              schema={brand}
              validator={validator}
              onSubmit={({ formData }) => {
                console.log("Brand Data:", formData);
              }}
            />
          </TabsContent>
          <TabsContent value="integration">
            <Form
              schema={integration}
              validator={validator}
              onSubmit={({ formData }) => {
                console.log("Integration Data:", formData);
              }}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
