import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobHunt Pro | Personalized Career Tracking",
  description: "AI-powered job scraping and recommendation dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
        <div className="flex relative min-h-screen overflow-x-hidden">
          <Sidebar />
          {/* Main content area takes remaining space. On mobile sidebar is overlay, on desktop it's fixed. 
              The lg:pl-64 class matches the sidebar width. But since sidebar is collapsible, 
              we'll handle the spacing more dynamically or keep it simple with lg:ml-20/64.
          */}
          <main className="flex-1 w-full lg:pl-64 transition-all duration-300 ease-in-out p-4 md:p-8">
            <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
