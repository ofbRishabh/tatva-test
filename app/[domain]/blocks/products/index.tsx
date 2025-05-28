import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const schema = {
  title: "Products Section",
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "Our Products",
    },
    description: {
      type: "string",
      title: "Description",
      default: "Browse our premium construction solutions.",
    },
    products: {
      type: "array",
      title: "Products",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            title: "ID",
          },
          name: {
            type: "string",
            title: "Product Name",
          },
          description: {
            type: "string",
            title: "Product Description",
          },
          imageUrl: {
            type: "string",
            title: "Image URL",
          },
          link: {
            type: "string",
            title: "Product Link",
          },
        },
      },
    },
  },
};

export const uiSchema = {
  title: {
    "ui:placeholder": "e.g. Our Products",
  },
  description: {
    "ui:widget": "textarea",
    "ui:placeholder": "Brief description of your product collection",
  },
  products: {
    items: {
      id: { "ui:placeholder": "Unique identifier for the product" },
      name: { "ui:placeholder": "Product name" },
      description: { "ui:placeholder": "Brief product description" },
      imageUrl: { "ui:placeholder": "URL to product image" },
      link: { "ui:placeholder": "Link to product page" },
    },
  },
};

interface ProductsProps {
  title?: string;
  description?: string;
  products?: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    link?: string;
  }>;
}

export const sampleData = {
  title: "Our Products",
  description: "Browse our premium construction solutions.",
  products: [
    {
      id: "prod-1",
      name: "POLYPLAST Ready Mix Plaster",
      description: "High-quality ready-to-use plaster for walls.",
      imageUrl: "https://placehold.co/600x400?text=Plaster",
      link: "#",
    },
    {
      id: "prod-2",
      name: "BLOCK JOINTING MORTAR",
      description: "Formulated for AAC, CLC, and concrete blocks.",
      imageUrl: "https://placehold.co/600x400?text=Mortar",
      link: "#",
    },
    {
      id: "prod-3",
      name: "Tile Adhesive",
      description: "Fix ceramic and vitrified tiles with ease.",
      imageUrl: "https://placehold.co/600x400?text=Tile+Adhesive",
      link: "#",
    },
    {
      id: "prod-4",
      name: "Waterproofing Solution",
      description: "Prevents water leakage in buildings.",
      imageUrl: "https://placehold.co/600x400?text=Waterproofing",
      link: "#",
    },
    {
      id: "prod-5",
      name: "Wall Putty",
      description: "Smoothens wall surfaces before painting.",
      imageUrl: "https://placehold.co/600x400?text=Wall+Putty",
      link: "#",
    },
    {
      id: "prod-6",
      name: "Gypsum Plaster",
      description: "Provides a smooth finish to walls and ceilings.",
      imageUrl: "https://placehold.co/600x400?text=Gypsum+Plaster",
      link: "#",
    },
  ],
};

const Products: React.FC<ProductsProps> = ({
  products = sampleData.products,
  title = sampleData.title,
  description = sampleData.description,
}: ProductsProps) => {
  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mb-10 text-lg text-muted-foreground">{description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col h-full overflow-hidden"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader className="text-left">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-0">
                <Button asChild>
                  <a href={product.link || "#"}>View Product</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
