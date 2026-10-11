import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Little Basket | Everything little, thoughtfully chosen", description: "Shop baby essentials, maternity must-haves and compare diaper prices across trusted retailers in India." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
