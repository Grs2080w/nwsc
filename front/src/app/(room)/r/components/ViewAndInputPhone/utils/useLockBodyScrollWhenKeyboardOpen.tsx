import { useEffect } from "react";

/**
 *
 *  Hook deprecated
 *
 */

export function useLockBodyScrollWhenKeyboardOpen(isKeyboardOpen: boolean) {
	useEffect(() => {
		if (isKeyboardOpen) {
			document.documentElement.style.overflow = "hidden";
		} else {
			document.documentElement.style.overflow = "";
		}

		return () => {
			document.documentElement.style.overflow = "";
		};
	}, [isKeyboardOpen]);
}
