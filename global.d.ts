declare module "*.css" {
	const content: Record<string, string>;
	export default content;
}

declare module "./app/globals.css";
declare module "./globals.css";