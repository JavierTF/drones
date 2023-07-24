// import './globals.css'
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Musalian exam",
  description: "Javier Toussent Fis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
      {/* <body className={inter.className}>{children}</body> */}
    </html>
  );
}
