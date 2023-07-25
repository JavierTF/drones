export const metadata = {
  title: "Musala's exam",
  description: "Javier Toussent Fis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
