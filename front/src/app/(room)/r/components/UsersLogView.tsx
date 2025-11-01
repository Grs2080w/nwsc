import { Badge } from "@/components/ui/badge";

interface Users {
	name: string;
	id: string;
}

interface UsersLogViewProps {
	usersOnline: Users[];
}

export default function UsersLogView({ usersOnline }: UsersLogViewProps) {
	const logsSet: Set<string> = new Set(
		usersOnline.map((user) => user.name.toLowerCase()),
	);
	const logsArray: string[] = Array.from(logsSet);

	return (
		<div className="flex flex-col items-center justify-around rounded-[10px] w-90 h-[60dvh] ">
			<div className="text-center text-2xl font-mono mb-5 font-bold shrink-0">
				Users Connected{" "}
			</div>

			<div className="flex flex-wrap gap-2 w-full overflow-y-auto p-2.5 items-start justify-center content-start h-full">
				{logsArray.map((user, index) => (
					<Badge key={index}>
						<div className="font-mono text-md mr-2">{user}</div>
						<div className="bg-green-400 size-2 rounded-full"></div>
					</Badge>
				))}
			</div>
		</div>
	);
}
