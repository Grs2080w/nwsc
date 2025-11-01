import { useEffect } from "react";

/**
 *
 *  When KeyPressed state is true, all the users in the room receive the status typing
 *
 */

const useKeyPress = (
	setKeyPressed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter" || event.key === "Shift") {
				setKeyPressed(false);
			} else {
				setKeyPressed(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [setKeyPressed]);
};

export default useKeyPress;
