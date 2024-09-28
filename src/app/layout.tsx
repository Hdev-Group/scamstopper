"use client";
import React from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Inter as FontSans } from "next/font/google"
import type { Metadata } from "next";
import './globals.css'
import { ConvexClientProvider } from "./ConvexClientProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" >
        <head>
          <title>ScamStopper</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet"></link>
        </head>
        <body
          className={`bg-white dark:bg-neutral-950`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
