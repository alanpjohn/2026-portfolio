import { getAllWorkItems } from "@/lib/api/work";
import { WorkPageClient } from "@/components/work/WorkPageClient";
import { seoConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: seoConfig.pages.work.title,
  description: seoConfig.pages.work.description,
  openGraph: {
    title: seoConfig.pages.work.title,
    description: seoConfig.pages.work.description,
    url: "/work",
    type: "website",
    images: [
      {
        url: "/static/og/default.png",
        width: 1200,
        height: 630,
        alt: "Work - Alan John",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.pages.work.title,
    description: seoConfig.pages.work.description,
    images: ["/static/og/default.png"],
  },
};

export default function WorkPage() {
  const items = getAllWorkItems();
  const experiences = items.filter((item) => item.type === "experience");
  const projects = items.filter((item) => item.type === "project");

  return <WorkPageClient experiences={experiences} projects={projects} />;
}
