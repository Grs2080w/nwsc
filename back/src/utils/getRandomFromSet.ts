export default function getRandomFromSet<T>(set: Set<T>, id: string): T {
	const index: number = Math.floor(Math.random() * set.size);

	const value = Array.from(set)[index];
	if (value === id) {
		return getRandomFromSet(set, id);
	} else {
		return value;
	}
}
