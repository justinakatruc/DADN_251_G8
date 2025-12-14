import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "./components/AppLayout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Yolo:Home app",
  description: "Real-time IoT dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased md:overflow-hidden">
        <AppLayout>{children}</AppLayout>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
