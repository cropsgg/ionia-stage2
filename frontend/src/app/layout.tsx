import { Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Notifications from "@/components/common/Notifications";
import CookieConsent from "@/components/common/CookieConsent";
import { Providers } from "./providers";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ionia Learning Platform",
  description: "Personalized Learning Management System for Schools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar className="fixed top-0 left-0 right-0 h-16 z-50" />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer className="z-40 bg-emerald-900" />
            <Notifications />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}