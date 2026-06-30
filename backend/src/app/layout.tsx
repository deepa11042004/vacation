import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel CRM Backend API",
  description: "Backend API endpoints for Travel CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
