import { Footer } from "@/components/site/shared/Footer";
import { Header } from "@/components/site/shared/Header";
import { getSiteBySubdomain } from "@/lib/actions";
import "./index.css"; // Ensure global styles are imported

export default async function Layout(props: {
  children: React.ReactNode;
  params: { domain: string };
}) {
  const { children, params } = props;

  const domain = decodeURIComponent(params.domain);

  let site = null;

  try {
    // The domain param is now just the subdomain (e.g., "mysite")
    // since the middleware extracts it from "mysite.site.localhost"
    const subdomain = domain;

    // Use the proper action function instead of API call
    site = await getSiteBySubdomain(subdomain);
  } catch (error) {
    console.error("Failed to fetch site data:", error);
  }

  return (
    <div className="container p-4 flex flex-col min-h-screen mx-auto">
      <Header site={site} />
      <main className="flex-1 flex">{children}</main>
      <Footer site={site} />
    </div>
  );
}
