import type { Metadata } from "next";
import RootLayoutClient from "./layout.client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tutorcito",
	description: "Conectamos estudiantes con tutores expertos",
	category: "Educación",
	keywords: [
		"Tutorias",
		"tutores",
		"Tutores universitarios"
	]
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
