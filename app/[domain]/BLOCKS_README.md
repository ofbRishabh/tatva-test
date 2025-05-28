# Block Registry - Adding New Blocks

This simplified block registry makes it easy to add new blocks to your website builder with live component previews.

## How to Add a New Block

### Method 1: Simple Addition (Recommended)

1. **Create your block component** in `app/[domain]/blocks/your-block-name/index.tsx`

2. **Export the required schema and sample data** from your block:

```typescript
// app/[domain]/blocks/your-block-name/index.tsx
import React from "react";

// Define the JSON schema for form generation
export const schema = {
  title: "Your Block Name",
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "Title",
      default: "Sample Title",
    },
    // ... other properties
  },
};

// Define UI schema for custom form widgets
export const uiSchema = {
  title: {
    "ui:placeholder": "Enter your title here",
  },
  // ... other UI customizations
};

// Define sample data for previews
export const sampleData = {
  title: "This is a sample title",
  // ... other sample data
};

// Your component
interface YourBlockProps {
  title?: string;
  // ... other props
}

const YourBlock: React.FC<YourBlockProps> = ({
  title = sampleData.title,
  // ... other props with defaults
}) => {
  return (
    <section>
      <h2>{title}</h2>
      {/* Your component JSX */}
    </section>
  );
};

export default YourBlock;
```

3. **Add the dynamic import** to the `componentMap` in `block-registry.ts`:

```typescript
const componentMap = {
  // ...existing imports...
  YourBlockName: dynamic(() => import("./blocks/your-block-name")),
} as const;
```

4. **Add the block configuration** to the `blockConfigs` array:

```typescript
{
  id: "YourBlockName",
  metadata: {
    name: "Your Block Display Name",
    description: "Description of what your block does",
    category: "Content", // Header, Content, Social Proof, Conversion, About, Commerce
    tags: ["tag1", "tag2", "tag3"],
    previewImageUrl: "/previews/your-block-name.png", // Optional fallback
  },
}
```

5. **That's it!** Your block will automatically be:
   - Available in the section selector with live preview
   - Editable with auto-generated forms
   - Filterable by category and tags

## Key Features

### Live Component Previews

- ✅ **Real components**: See actual rendered components, not static images
- ✅ **Sample data**: Components render with realistic sample data
- ✅ **Responsive**: Previews scale to fit the selector cards
- ✅ **Interactive hover**: Add button appears on hover

### Auto-Discovery

- ✅ **Schema discovery**: Forms are automatically generated from block schemas
- ✅ **Sample data**: Default values come from exported sample data
- ✅ **No manual imports**: Editor automatically finds block schemas

### Enhanced UX

- ✅ **Search**: Find blocks by name, description, or tags
- ✅ **Category filtering**: Filter by block categories
- ✅ **Tag system**: Multiple tags for better organization
- ✅ **Real-time preview**: See changes as you type in the editor

## Block Component Structure

Each block should follow this pattern:

```typescript
// Required exports for full functionality
export const schema = { /* JSON Schema */ };
export const uiSchema = { /* RJSF UI Schema */ };
export const sampleData = { /* Sample data for previews */ };

// Component with default props from sample data
const YourBlock: React.FC<Props> = ({
  prop1 = sampleData.prop1,
  prop2 = sampleData.prop2
}) => {
  return (/* Your JSX */);
};

export default YourBlock;
```

## Available Categories

- **Header**: Hero sections, banners
- **Content**: Features, stats, FAQ, general content
- **Social Proof**: Testimonials, logos, reviews
- **Conversion**: CTA sections, forms
- **About**: Team, company info
- **Commerce**: Products, services, pricing

## Benefits of This Approach

- ✅ **Live previews**: See real components instead of static images
- ✅ **Auto-discovery**: No manual schema imports needed
- ✅ **Type safe**: Full TypeScript support
- ✅ **Consistent**: Standardized structure for all blocks
- ✅ **Developer friendly**: Clear patterns and minimal boilerplate
- ✅ **User friendly**: Better UX with search, filtering, and live previews
