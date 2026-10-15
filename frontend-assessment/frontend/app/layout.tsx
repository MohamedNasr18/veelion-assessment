import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VeeLion",
  description: "Task dashboard and activity feed modules",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <Navbar />
          <div className="page-body">{children}</div>
        </div>
      </body>
    </html>
  );
}
