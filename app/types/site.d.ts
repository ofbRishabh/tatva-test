export interface Site {
  id: number;
  name: string;
  description: string;
  subDomain: string;
  customDomain: string;
  settings: {
    config: {
      header: {
        navItemAllignment: string;
        primaryButton: {
          title: string;
          url: string;
        };
        additionalLinks: [
          {
            title: string;
            url: string;
          }
        ];
      };
      footer: {
        additionalLinks: [
          {
            title: string;
            url: string;
          }
        ];
        socialLinks: {
          linkdin: string;
          facebook: string;
          instagram: string;
          twitter: string;
        };
        legalLinks: [
          {
            name: string;
            href: string;
          }
        ];
      };
    };
    brand: {
      siteName: string;
      siteTitle: string;
      siteDescription: string;
      siteLogoUrl: string;
      siteFaviconUrl: string;
      siteLogoSize: "sm" | "md" | "lg";
      theme: {
        primaryColor: string;
        secondaryColor: string;
        palette: string;
        fontFamily: string;
      };
    };
    integrations: {
      googleAnalyticsId: string;
      facebookPixelId: string;
      googleTagManagerId: string;
      googleAdsId: string;
    };
  };
  pages: [
    {
      id: string;
      name: string;
      slug: string;
      sortOrder: number;
      visible: boolean;
      showInHeader: boolean;
      showInFooter: boolean;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  visible: boolean;
  displayName: string;
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
