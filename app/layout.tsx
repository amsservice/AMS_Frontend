import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "Attendance app",
  description: "school attendance management system" ,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >  
        <Providers>
        <AuthProvider>  
      
        {children}
        <Toaster/>
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
