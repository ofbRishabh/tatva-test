"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { PlusCircle, GripVertical, Settings, Trash2 } from "lucide-react";
import { Page, Section } from "@/app/types/site";
import {
  addSection,
  removeSection,
  updateSection,
  reorderSections,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SectionSelector } from "./section-selector";
import { SectionEditor } from "./section-editor";
import { toast } from "sonner";
import { blockRegistry } from "@/app/[domain]/block-registry";

// Add dynamic import for section components
import dynamic from "next/dynamic";

interface PageBuilderProps {
  page: Page;
  preview?: boolean;
}

export function PageBuilder({ page, preview = false }: PageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(
    [...(page.sections || [])].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    )
  );
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  // Add a new section
  const handleAddSection = async (sectionType: string) => {
    try {
      // Create a new section with default empty content
      // The actual content will be set when the user edits the section
      const newSection: Omit<Section, "id"> = {
        type: sectionType,
        content: {},
        sortOrder: sections.length,
      };

      const updatedPage = await addSection(page.id, newSection);
      setSections(updatedPage.sections || []);

      toast.success(`${sectionType} section added`);
      setShowTypeSelector(false);

      // Find the new section to edit it
      const addedSection = updatedPage.sections?.find(
        (s) => s.type === sectionType && s.sortOrder === sections.length
      );

      if (addedSection) {
        setCurrentSection(addedSection);
        setShowSectionEditor(true);
      }
    } catch (error) {
      console.error("Failed to add section:", error);
      toast.error("Failed to add section");
    }
  };

  // Handle removing a section
  const handleRemoveSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to remove this section?")) {
      return;
    }

    try {
      const updatedPage = await removeSection(page.id, sectionId);
      setSections(updatedPage.sections || []);
      toast.success("Section removed");

      // Close editor if we're currently editing this section
      if (currentSection?.id === sectionId) {
        setCurrentSection(null);
        setShowSectionEditor(false);
      }
    } catch (error) {
      console.error("Failed to remove section:", error);
      toast.error("Failed to remove section");
    }
  };

  // Handle editing a section
  const handleSectionEdit = (section: Section) => {
    setCurrentSection(section);
    setShowSectionEditor(true);
  };

  // Save section changes
  const handleSaveSection = async (content: any) => {
    if (!currentSection) return;

    try {
      const updatedPage = await updateSection(page.id, currentSection.id, {
        content,
      });

      setSections(updatedPage.sections || []);
      setShowSectionEditor(false);
      setCurrentSection(null);
      toast.success("Section updated");
    } catch (error) {
      console.error("Failed to update section:", error);
      toast.error("Failed to update section");
    }
  };

  // Handle reordering sections with drag and drop
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Update locally first for better UX
    const newSections = [...sections];
    const [moved] = newSections.splice(sourceIndex, 1);
    newSections.splice(destinationIndex, 0, moved);

    // Update sort order
    newSections.forEach((section, i) => {
      section.sortOrder = i;
    });

    setSections(newSections);

    // Then update on the server
    try {
      const sectionIds = newSections.map((section) => section.id);
      await reorderSections(page.id, sectionIds);
      toast.success("Sections reordered");
    } catch (error) {
      console.error("Failed to reorder sections:", error);
      toast.error("Failed to reorder sections");

      // Restore original order if there was an error
      setSections(
        [...(page.sections || [])].sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
        )
      );
    }
  };

  // Render the appropriate sections based on preview mode
  const renderSections = () => {
    if (preview) {
      return (
        <div className="space-y-12">
          {sections.map((section) => {
            const BlockComponent = blockRegistry[section.type];
            return BlockComponent ? (
              <div key={section.id} className="relative group">
                <BlockComponent {...section.content} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-1 text-white text-xs">
                  {section.type}
                </div>
              </div>
            ) : (
              <div
                key={section.id}
                className="p-8 border rounded-md text-center"
              >
                Unknown section type: {section.type}
              </div>
            );
          })}
          {sections.length === 0 && (
            <div className="bg-accent flex flex-col items-center justify-center p-8 rounded-md">
              <p className="text-muted-foreground">
                This page doesn't have any sections yet.
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      // Existing section editor/management UI
      sections.length === 0 ? (
        <div className="bg-accent flex flex-col items-center justify-center p-8 rounded-md">
          <p className="text-muted-foreground mb-4">
            This page doesn't have any sections yet.
          </p>
          <Button onClick={() => setShowTypeSelector(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Section
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-accent rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-3 cursor-grab"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{section.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                Position: {section.sortOrder + 1}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSectionEdit(section)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleRemoveSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    );
  };

  return (
    <div className="page-builder">
      {!preview && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Page Sections</h2>
          <Button onClick={() => setShowTypeSelector(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      )}

      {renderSections()}

      {/* Section Type Selector Dialog */}
      <Dialog open={showTypeSelector} onOpenChange={setShowTypeSelector}>
        <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <SectionSelector onSelect={handleAddSection} />
        </DialogContent>
      </Dialog>

      {/* Section Editor Dialog */}
      <Dialog open={showSectionEditor} onOpenChange={setShowSectionEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {currentSection?.type} Section</DialogTitle>
          </DialogHeader>
          {currentSection && (
            <SectionEditor
              sectionType={currentSection.type}
              sectionContent={currentSection.content}
              onSave={handleSaveSection}
            />
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSectionEditor(false);
                setCurrentSection(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
