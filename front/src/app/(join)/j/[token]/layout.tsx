import "@/app/styles/globals.css";
import type { Metadata } from "next";

// Components
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Nwsc - Join",
	description: "Join in a private room by Nwsc",
	icons: {
		icon: "/favicon/favicon.ico",
	},
	manifest: "/favicon/site.webmanifest",
	authors: [{ name: "Gabriel Santos", url: "https://github.com/Grs2080w" }],
	keywords: ["Nwsc", "WebSocket", "Messages", "Chat"],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="overflow-hidden">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
				/>
			</head>
			<body className="overflow-hidden">
				<Toaster />
				<main>{children}</main>
			</body>
		</html>
	);
}
