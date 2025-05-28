export interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  default?: any;
  format?: string;
  enum?: string[];
  multiline?: boolean;
  properties?: Record<string, SchemaProperty>;
  items?: {
    type: string;
    properties?: Record<string, SchemaProperty>;
  };
}

export interface BlockSchema {
  title?: string;
  type?: string;
  properties?: Record<string, SchemaProperty>;
}
