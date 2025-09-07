import type { Metadata } from "next";
import { Tomorrow } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import Nav from "@/components/Nav";
import { getServerSession } from "next-auth"; // Import getServerSession
import { authOptions } from "./api/auth/[...nextauth]/route";

const tomorrow = Tomorrow({
  subsets: ["latin"],
  variable: "--font-tomorrow",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Habit Tracker SaaS",
  description: "Track your daily habits and streaks",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${tomorrow.className} antialiased`}>
        <Provider session={session}>
          <Nav />
          {children}
        </Provider>
      </body>
    </html>
  );
}