import Link from "next/link";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-dvh">
			<h1 className="text-7xl font-bold text-primary">404</h1>
			<h1 className="text-4xl font-bold text-primary">Not Found</h1>
			<p className="text-lg text-primary/30 font-bold mt-3 max-w-[80vw] text-center">
				The page you are looking for does not exist.
			</p>

			<Link href="/">
				<p className="text-sm text-primary font-bold cursor-pointer mt-5 font-mono hover:text-text hover:cursor-pointer hover:underline">
					Go Back
				</p>
			</Link>
		</div>
	);
}
