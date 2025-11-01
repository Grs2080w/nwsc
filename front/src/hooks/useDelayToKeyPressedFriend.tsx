import { useEffect, useRef } from "react";

interface UseDelayToKeyPressedFriendProps {
	setsomeOnekeyPressed: React.Dispatch<React.SetStateAction<boolean>>;
	someOnekeyPressed: boolean;
}

/**
 * 
 * 
 *  Hook Deprecaded
 * 
 */

export default function useDelayToKeyPressedFriend({
	setsomeOnekeyPressed,
	someOnekeyPressed,
}: UseDelayToKeyPressedFriendProps) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (someOnekeyPressed) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				setsomeOnekeyPressed(false);
				timeoutRef.current = null;
			}, 1000);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [someOnekeyPressed, setsomeOnekeyPressed]);
}
