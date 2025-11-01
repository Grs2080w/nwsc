"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface DialogProgressProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function DialogProgress({ open, setOpen }: DialogProgressProps) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>
				<div className="flex flex-col justify-center items-center gap-3">
					<div className="w-full flex justify-center">
						<div className="p-3 bg-primary/15 rounded-lg size-10 flex justify-center items-center">
							<Spinner />
						</div>
					</div>

					<p className="font-semibold">Loading the Messages...</p>

					<p className="text-sm text-muted-foreground text-center max-w-[80%]">
						Please wait a few seconds, it may take a while... It is not
						advisable to close this dialogue.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
