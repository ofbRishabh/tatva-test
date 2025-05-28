"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import validator from "@rjsf/validator-ajv8";
import {
  blockRegistry,
  fullBlockRegistry,
} from "@/app/[domain]/block-registry";

// Lazy load react-jsonschema-form as it's a client component
import dynamic from "next/dynamic";
const Form = dynamic(() => import("@rjsf/shadcn").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div>Loading form...</div>,
});

// Import custom widgets
const ColorPickerWidget = dynamic(
  () => import("@/components/site/RJSFWidget/ColorPickerWidget"),
  {
    ssr: false,
    loading: () => <div>Loading color picker...</div>,
  }
);

const ImageUploaderWidget = dynamic(
  () => import("@/components/site/RJSFWidget/ImageUploaderWidget"),
  {
    ssr: false,
    loading: () => <div>Loading image uploader...</div>,
  }
);

const URLWidget = dynamic(
  () => import("@/components/site/RJSFWidget/URLWidget"),
  {
    ssr: false,
    loading: () => <div>Loading URL input...</div>,
  }
);

// Customize form widgets
const widgets = {
  ColorPickerWidget,
  ImageUploaderWidget,
  url: URLWidget,
};

interface SectionEditorProps {
  sectionType: string;
  sectionContent: any;
  onSave: (content: any) => void;
}

export function SectionEditor({
  sectionType,
  sectionContent,
  onSave,
}: SectionEditorProps) {
  const [formData, setFormData] = useState<any>(null);
  const [tab, setTab] = useState<string>("edit");
  const [loading, setLoading] = useState(false);
  const [schemaInfo, setSchemaInfo] = useState<any>(null);

  // Dynamically load schema info from the block component
  useEffect(() => {
    const loadSchemaInfo = async () => {
      try {
        // Import the block module to get schema, uiSchema, and sampleData
        const blockPath = `@/app/[domain]/blocks/${sectionType.toLowerCase()}`;
        const blockModule = await import(blockPath);

        setSchemaInfo({
          schema: blockModule.schema,
          uiSchema: blockModule.uiSchema,
          sampleData: blockModule.sampleData,
        });
      } catch (error) {
        console.warn(`Could not load schema for ${sectionType}:`, error);
        setSchemaInfo(null);
      }
    };

    loadSchemaInfo();
  }, [sectionType]);

  useEffect(() => {
    // Populate form with existing content or sample data
    if (Object.keys(sectionContent || {}).length > 0) {
      setFormData(sectionContent);
    } else if (schemaInfo?.sampleData) {
      setFormData(schemaInfo.sampleData);
    }
  }, [sectionType, sectionContent, schemaInfo]);

  const handleSubmit = async ({ formData }: { formData: any }) => {
    setLoading(true);
    try {
      await onSave(formData);
      toast.success("Section updated successfully");
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  // If schema doesn't exist for the section type
  if (!schemaInfo) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <p className="text-muted-foreground">
          Loading editor for{" "}
          {fullBlockRegistry[sectionType]?.metadata?.name || sectionType}...
        </p>
      </div>
    );
  }

  return (
    <div className="section-editor">
      <Tabs defaultValue="edit" value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          {formData && (
            <Form
              schema={schemaInfo.schema}
              uiSchema={schemaInfo.uiSchema}
              formData={formData}
              onSubmit={handleSubmit}
              widgets={widgets}
              className="rjsf-form"
              liveValidate
              validator={validator}
            >
              <div className="flex justify-end mt-6 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Reset to sample data
                    setFormData(schemaInfo.sampleData);
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-secondary p-2 flex justify-between items-center">
              <p className="text-sm text-secondary-foreground">Preview</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab("edit")}
              >
                Edit
              </Button>
            </div>
            <div className="p-4">
              {formData && blockRegistry[sectionType] ? (
                <div className="preview-container">
                  {React.createElement(blockRegistry[sectionType], formData)}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Preview not available for this section type.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="json">
          <div className="border rounded-md p-4 bg-background">
            <p className="text-center text-muted-foreground mb-4">JSON Data</p>
            <pre className="language-json whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-[60vh]">
              {formData
                ? JSON.stringify(formData, null, 2)
                : "No content to preview"}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
