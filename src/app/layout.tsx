"use client"

import type {Metadata} from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import {ReactNode} from "react";
import {Provider} from "react-redux";
import {store} from "@/configs/store";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Provider store={store}>
            {children}
        </Provider>
        </body>
        </html>
    );
}
