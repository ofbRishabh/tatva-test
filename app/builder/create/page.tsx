import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSite() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Create a New Site</CardTitle>
            <CardDescription className="text-center">
              Enter your site name and domain to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <Input placeholder="Business Name" />
              <Textarea placeholder="Describe your business" />
              <Input type="url" placeholder="Link1 to your business" />
              <Input type="url" placeholder="Link2 to your business" />
              <Input type="url" placeholder="Link3 to your business" />
              <Button type="submit">Next</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
