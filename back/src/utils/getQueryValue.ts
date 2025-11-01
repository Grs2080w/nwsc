export default function getQueryValue(value: string | string[] | undefined): string {
	return Array.isArray(value) ? value[0] : (value ?? "");
}