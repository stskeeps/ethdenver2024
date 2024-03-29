import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { HeliaProvider } from "../providers/HeliaProvider";
import { theme } from "../../theme";

export const metadata = {
    title: "ETHDenver 2024 Demo",
    description: "Verifiable Indexing for Ethereum",
};

export default function RootLayout({ children }: { children: any }) {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <HeliaProvider>{children}</HeliaProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
