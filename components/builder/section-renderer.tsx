"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PlusCircle,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  Settings,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/app/types/site";
import {
  fullBlockRegistry,
  BlockRegistryItem,
  getAllBlockTypes,
} from "@/app/[domain]/block-registry";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionSelector } from "./section-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionRendererProps {
  sections: Section[];
  onAddSection?: (sectionType: string) => void;
  onEditSection?: (sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onMoveSection?: (sectionId: string, direction: "up" | "down") => void;
  onPreviewSection?: (sectionId: string) => void;
  readOnly?: boolean;
}

export function SectionRenderer({
  sections,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onMoveSection,
  onPreviewSection,
  readOnly = false,
}: SectionRendererProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleSectionSelect = (sectionType: string) => {
    if (onAddSection) {
      onAddSection(sectionType);
    }
    setIsAddingSection(false);
  };

  // Get section metadata from block registry
  const getSectionMetadata = (sectionType: string) => {
    return (
      fullBlockRegistry[sectionType]?.metadata || {
        name: sectionType,
        description: "Section description not available",
        category: "Other",
      }
    );
  };

  return (
    <div className="section-renderer space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Page Sections</h2>
        {!readOnly && (
          <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose a Section Type</DialogTitle>
                <DialogDescription>
                  Select a section type to add to your page
                </DialogDescription>
              </DialogHeader>
              <SectionSelector onSelect={handleSectionSelect} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20">
          <Layers className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-semibold text-lg">No sections yet</h3>
          <p className="text-muted-foreground mb-4">
            Add sections to build your page
          </p>
          {!readOnly && (
            <Button
              variant="outline"
              onClick={() => setIsAddingSection(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Your First Section
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {sections.map((section, index) => {
            const metadata = getSectionMetadata(section.type);
            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {metadata.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {metadata.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{metadata.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    {metadata.previewImageUrl ? (
                      <div className="border rounded-md overflow-hidden w-16 h-16 flex-shrink-0">
                        <Image
                          src={metadata.previewImageUrl}
                          alt={metadata.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="border rounded-md w-16 h-16 flex items-center justify-center bg-muted/30 flex-shrink-0">
                        <Layers className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium">Type: {section.type}</p>
                      <p className="text-muted-foreground truncate max-w-md mt-1">
                        {metadata.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="mr-1 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </p>
                    </div>
                  </div>
                </CardContent>
                {!readOnly && (
                  <CardFooter className="bg-muted/20 py-2 px-4 flex justify-end gap-2">
                    <TooltipProvider>
                      {onMoveSection && index > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMoveSection(section.id, "up")}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move up</TooltipContent>
                        </Tooltip>
                      )}

                      {onMoveSection && index < sections.length - 1 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMoveSection(section.id, "down")}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move down</TooltipContent>
                        </Tooltip>
                      )}

                      {onEditSection && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditSection(section.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit section</TooltipContent>
                        </Tooltip>
                      )}

                      {onPreviewSection && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPreviewSection(section.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview section</TooltipContent>
                        </Tooltip>
                      )}

                      {onDeleteSection && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteSection(section.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete section</TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!readOnly && sections.length > 0 && (
        <Button
          variant="outline"
          onClick={() => setIsAddingSection(true)}
          className="w-full flex items-center justify-center gap-2 border-dashed"
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Section
        </Button>
      )}
    </div>
  );
}
