import { useEffect, useState } from "react";

export function useKeyboardStatus(threshold = 150) {
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
	const [heightDiffValue, setHeightDiffValue] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (typeof window === "undefined" || !window.visualViewport) {
			return;
		}

		const initialHeight = window.visualViewport.height;

		const onResize = () => {
			// biome-ignore lint/style/noNonNullAssertion: Verification is done above
			const currentHeight = window.visualViewport!.height;
			const diff = initialHeight - currentHeight;
			setHeightDiffValue(diff);
			setHeight(currentHeight);

			setIsKeyboardOpen(diff > threshold);
		};

		window.visualViewport.addEventListener("resize", onResize);
		window.visualViewport.addEventListener("scroll", onResize);

		onResize();

		return () => {
			// biome-ignore lint/style/noNonNullAssertion: Verification is done above
			window.visualViewport!.removeEventListener("resize", onResize);
			// biome-ignore lint/style/noNonNullAssertion: Verification is done above
			window.visualViewport!.removeEventListener("scroll", onResize);
		};
	}, [threshold]);

	return { isKeyboardOpen, heightDiffValue, height };
}
