import type { MarkdownHeading } from "astro";

export interface TocItem extends MarkdownHeading {
	children: TocItem[];
}

export function generateToc(headings: MarkdownHeading[]): TocItem[] {
	const toc: TocItem[] = [];
	const stack: TocItem[] = [];

	for (const heading of headings) {
		const item: TocItem = { ...heading, children: [] };

		while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
			stack.pop();
		}

		if (stack.length === 0) {
			toc.push(item);
		} else {
			stack[stack.length - 1].children.push(item);
		}

		stack.push(item);
	}
	return toc;
}
