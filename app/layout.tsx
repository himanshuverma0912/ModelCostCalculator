import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

// Load the fonts
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
  title: "Model Cost Calculator",
  description: "Calculate your GenAI stack costs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body */}
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased bg-[#fdfbf7]`}>
        {children}
      </body>
    </html>
  );
}