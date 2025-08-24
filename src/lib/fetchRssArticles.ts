import Parser from "rss-parser";

type RssUrlLists = {
	[site: string]: {
		url: string;
	};
};

interface RssFeed {
	title: string;
	description: string;
	link: string;
	pubDate: string;
	enclosure: {
		url: string;
		type: string;
	};
}

const parser = new Parser<RssFeed>({
	customFields: {
		item: ["title", "description", "link", "pubDate", "enclosure"],
	},
});

export async function fetchAllRssArticles(
	rssUrlLists: RssUrlLists
): Promise<{ [site: string]: RssFeed[] }> {
	const feeds: { [site: string]: RssFeed[] } = {};
	for (const [site, info] of Object.entries(rssUrlLists)) {
		const feed = await parser.parseURL(info.url);
		const items = feed.items.map((i) => {
			return {
				title: i.title as string,
				description: i.description as string,
				link: i.link as string,
				pubDate: i.pubDate as string,
				enclosure: i.enclosure as { url: string; type: string },
			};
		});
		feeds[site] = items;
	}
	return feeds;
}
