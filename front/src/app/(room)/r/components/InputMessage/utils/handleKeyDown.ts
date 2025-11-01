interface Params {
	event: React.KeyboardEvent<HTMLTextAreaElement>;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const handleKeyDown = ({ event, buttonRef }: Params) => {
	if (event.key === "Enter" && !event.shiftKey) {
		if (buttonRef.current) {
			buttonRef.current.click();
		}
	}
};

export default handleKeyDown;
