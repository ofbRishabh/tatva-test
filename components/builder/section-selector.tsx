"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fullBlockRegistry } from "@/app/[domain]/block-registry";
import React from "react";

interface SectionSelectorProps {
  onSelect: (sectionType: string) => void;
}

export function SectionSelector({ onSelect }: SectionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract section types from the registry
  const sectionTypes = useMemo(() => {
    return Object.entries(fullBlockRegistry).map(([id, item]) => ({
      id,
      name: item.metadata.name,
      description: item.metadata.description,
      category: item.metadata.category,
      component: item.component,
      tags: item.metadata.tags || [],
    }));
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    return [...new Set(sectionTypes.map((type) => type.category))];
  }, [sectionTypes]);

  const filteredSectionTypes = sectionTypes.filter((type) => {
    const matchesSearch =
      searchQuery === "" ||
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === null || type.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section-selector space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedCategory(
                    category === selectedCategory ? null : category
                  )
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredSectionTypes.map((type) => (
          <Card
            key={type.id}
            className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md overflow-hidden"
            onClick={() => onSelect(type.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {type.category}
                </Badge>
              </div>
              {type.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {type.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {type.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{type.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {/* Live Component Preview */}
              <div className="border-t bg-muted/20 relative overflow-hidden h-32">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60 z-10" />
                <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%] overflow-hidden">
                  <div className="pointer-events-none w-full h-full">
                    {React.createElement(type.component, {})}
                  </div>
                </div>

                {/* Add Section Button Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm">
                  <Button size="sm" className="shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSectionTypes.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-muted rounded-lg">
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              No sections found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
