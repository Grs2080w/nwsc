import localFont from "next/font/local";

export const muthiara = localFont({
	src: "./Muthiara.otf",
	variable: "--font-title",
});

export const titleFontMapper = {
	Muthiara: muthiara.variable,
};

export const defaultFontMapper = {
	Muthiara: muthiara.variable,
};
