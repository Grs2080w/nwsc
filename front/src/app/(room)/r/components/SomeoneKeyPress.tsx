export default function SomeOneKeyPress() {
	return (
		<div className="flex justify-center items-center w-12 rounded-lg m-1 text-center bg-message-friend pt-4 py-3">
			<div className="flex space-x-0.5">
				<span className="w-2 h-2 bg-white dark:bg-text rounded-full animate-bounce [animation-delay:-0.3s]"></span>
				<span className="w-2 h-2 bg-white dark:bg-text rounded-full animate-bounce [animation-delay:-0.15s]"></span>
				<span className="w-2 h-2 bg-white dark:bg-text rounded-full animate-bounce"></span>
			</div>
		</div>
	);
}
