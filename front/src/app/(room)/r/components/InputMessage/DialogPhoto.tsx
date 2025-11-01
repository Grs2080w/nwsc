import { useEffect, useState } from "react";

// Utils
import getBinaryImage from "./utils/getBinaryImage";

// Components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";

interface DialogPhotoProps {
	setAddDialogPhoto: React.Dispatch<React.SetStateAction<boolean>>;
	setInputFileValue: React.Dispatch<React.SetStateAction<string[]>>;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
	addDialogPhoto: boolean;
}

export default function DialogPhoto({
	addDialogPhoto,
	setAddDialogPhoto,
	setInputFileValue,
	buttonRef,
}: DialogPhotoProps) {
	const [files, setFiles] = useState<File[] | undefined>();

	const handleDrop = (files: File[]) => {
		setFiles(files);
		getBinaryImage({ files, setInputFileValue });
	};

	const handleError = (error: Error) => {
		console.error(error);
		toast.error(error.message, {
			duration: 5000,
			position: "top-center",
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Its correct
	useEffect(() => {
		setFiles([]);
	}, [addDialogPhoto]);

	return (
		<Dialog open={addDialogPhoto} onOpenChange={setAddDialogPhoto}>
			<DialogContent>
				<DialogTitle>Photo</DialogTitle>
				<DialogDescription>
					Add images to send to your friends!
				</DialogDescription>

				<div>
					<Dropzone
						accept={{
							"image/jpeg": [],
							"image/png": [],
							"image/webp": [],
						}}
						maxFiles={5}
						maxSize={1024 * 1024 * 50}
						minSize={1}
						onDrop={handleDrop}
						onError={handleError}
						src={files}
					>
						<DropzoneEmptyState />
						<DropzoneContent />
					</Dropzone>
				</div>
				<div className="w-full flex justify-end gap-2">
					<Button
						type="button"
						variant={"outline"}
						onClick={() => {
							setAddDialogPhoto(false);
						}}
					>
						Cancel
					</Button>
					<Button
						type="button"
						disabled={files?.length === 0}
						onClick={() => {
							setAddDialogPhoto(false);
							buttonRef.current?.click();
						}}
					>
						Send
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
