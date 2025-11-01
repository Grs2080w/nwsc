import "./styles/globals.css";
import type { Metadata } from "next";

// Components
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./toggleTheme";

// vercel
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
	title: "Nwsc",
	description: "A messaging app created by @g.snts",
	icons: {
		icon: "/favicon/favicon.ico",
	},
	manifest: "/favicon/site.webmanifest",
	authors: [{ name: "Gabriel Santos", url: "https://github.com/Grs2080w" }],
	keywords: ["Nwsc", "WebSocket", "Messages", "Chat", "Online", "Free"],
	applicationName: "Nwsc",
	category: "communication",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
};

export default function RootLayout({
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
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<ModeToggle />
					{children}
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
