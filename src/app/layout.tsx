import { Toaster } from "@/components/ui/toaster";

import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";

const OnchainProviders = dynamic(
  () => import("@/components/OnchainProviders"),
  {
    ssr: false,
  }
);

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="mx-8">
        <OnchainProviders>
          {children}
          <Toaster />
        </OnchainProviders>
      </body>
    </html>
  );
}
