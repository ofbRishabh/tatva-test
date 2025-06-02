export interface Site {
  id: string; // Changed from number to string to match database
  name: string;
  description?: string; // Made optional as it might not always be present
  subDomain: string;
  customDomain?: string; // Made optional
  settings?: {
    config?: {
      header?: {
        navItemAllignment?: string;
        primaryButton?: {
          title?: string;
          url?: string;
        };
        additionalLinks?: Array<{
          title: string;
          url: string;
        }>; // Changed from fixed array to optional array
      };
      footer?: {
        additionalLinks?: Array<{
          title: string;
          url: string;
        }>; // Changed from fixed array to optional array
        socialLinks?: {
          linkdin?: string; // Made all social links optional
          facebook?: string;
          instagram?: string;
          twitter?: string;
        };
        legalLinks?: Array<{
          name: string;
          href: string;
        }>; // Changed from fixed array to optional array
      };
    };
    brand?: {
      siteName?: string;
      siteTitle?: string;
      siteDescription?: string;
      siteLogoUrl?: string;
      siteFaviconUrl?: string;
      siteLogoSize?: "sm" | "md" | "lg";
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        palette?: string;
        fontFamily?: string;
      };
    };
    integrations?: {
      googleAnalyticsId?: string;
      facebookPixelId?: string;
      googleTagManagerId?: string;
      googleAdsId?: string;
    };
  };
  pages?: Page[]; // Changed from fixed array to optional array of Page objects
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  siteId: string;
  name: string;
  slug: string;
  displayName?: string;
  description?: string;
  sortOrder: number;
  showInHeader: boolean;
  showInFooter: boolean;
  metaTitle?: string;
  metaDescription?: string;
  visible: boolean;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  type: string;
  content: any;
  sortOrder: number;
}
