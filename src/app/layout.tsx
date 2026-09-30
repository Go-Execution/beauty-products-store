import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Baraka | Pure Beauty",
  description: "Discover pure, minimalist beauty with Baraka's exclusive range of luxury perfumes, creams, and artisanal soaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <div className="site-wrapper">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
