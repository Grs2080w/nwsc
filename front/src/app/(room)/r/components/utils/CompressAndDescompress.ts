import { deflate, inflate } from "pako";

/**
 *
 *  Here is the code for compressing and decompressing data, text or images
 *
 */

const compress = (data: string) => {
	const compressed = deflate(data, { level: 9 });
	let result = "";
	const chunkSize = 0x8000; // 32KB
	for (let i = 0; i < compressed.length; i += chunkSize) {
		const chunk = compressed.subarray(i, i + chunkSize);
		// biome-ignore lint/suspicious/noExplicitAny: Its correct
		result += String.fromCharCode.apply(null, chunk as any);
	}
	return btoa(result);
};

const decompress = (data: string) => {
	const binary = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
	return inflate(binary, { to: "string" });
};

async function compressImage(file: File, quality = 0.7): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject();
					return;
				}

				// Resize
				const maxWidth = 800;
				const scale = Math.min(maxWidth / img.width, 1);
				canvas.width = img.width * scale;
				canvas.height = img.height * scale;

				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Reexport as JPEG (already compressed)
				const compressedData = canvas.toDataURL("image/jpeg", quality);
				resolve(compressedData);
			};
			img.onerror = reject;
			img.src = event.target?.result as string;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export { compress, decompress, compressImage };
