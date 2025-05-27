"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@rjsf/shadcn";
import { RJSFSchema } from "@rjsf/utils";

export default function ConfigPage() {
  return (
    <div>
      <Tabs defaultValue="brand" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="brand">dehwgvdhgwevdhgew</TabsContent>
        <TabsContent value="config">Change your password here.</TabsContent>
        <TabsContent value="integrations">
          Manage your integrations here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
