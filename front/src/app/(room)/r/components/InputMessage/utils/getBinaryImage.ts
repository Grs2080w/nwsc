import { compressImage } from "../../utils/CompressAndDescompress";

interface GetBinaryImageProps {
	files: File[];
	setInputFileValue: React.Dispatch<React.SetStateAction<string[]>>;
}

export default async function getBinaryImage({
	files,
	setInputFileValue,
}: GetBinaryImageProps) {
	for (const file of files) {
		const imageCompressed = await compressImage(file);

		setInputFileValue((prev) => [...prev, imageCompressed as string]);
	}
}
