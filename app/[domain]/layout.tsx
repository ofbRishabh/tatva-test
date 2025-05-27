import { Footer } from "@/components/site/shared/Footer";
import { Header } from "@/components/site/shared/Header";
import "./index.css"; // Ensure global styles are imported

export default async function Layout(props: {
  children: React.ReactNode;
  params: { domain: string };
}) {
  const { children, params } = props;

  const domain = params.domain;

  let site = null;

  try {
    const res = await fetch(
      `http://localhost:3000/api/sites?domain=${domain}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      site = data?.[0] || null;
    }
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
