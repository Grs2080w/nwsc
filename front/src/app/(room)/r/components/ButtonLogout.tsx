import { Button } from "@/components/ui/button";

export default function ButtonLogout() {
	return (
		<Button
			onClick={() => {
				// biome-ignore lint/suspicious/noDocumentCookie: Just for safety
				document.cookie = "nwsc-token=; path=/; max-age=0";
				// biome-ignore lint/suspicious/noDocumentCookie: Just for safety
				document.cookie = "nwsc-auth=; path=/; max-age=0";
				window.location.href = "/";
			}}
			variant={"secondary"}
			className="flex gap-2 fixed top-3 left-3 p-2 rounded-md justify-center items-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#e3e3e3"
				className="rotate-180"
			>
				<title>Logout</title>
				<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
			</svg>{" "}
			Out
		</Button>
	);
}
