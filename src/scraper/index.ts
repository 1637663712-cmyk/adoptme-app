import { prisma } from "@/lib/prisma";
import { scrapeWeibo } from "./sources/weibo";
import { scrapeXianyu } from "./sources/xianyu";
import { scrape58Tongcheng } from "./sources/58tongcheng";
import { cleanAndDedupe } from "./cleaner";

interface ScrapeResult {
  source: string;
  items: {
    title: string;
    species: string;
    breed?: string;
    age?: string;
    gender?: string;
    location: string;
    description: string;
    photos: string[];
    sourceUrl?: string;
    contactPhone?: string;
    contactWechat?: string;
  }[];
}

export async function runScraper(sources?: string[]) {
  const allSources = sources || ["weibo", "xianyu", "58tongcheng"];
  const results: ScrapeResult[] = [];

  for (const source of allSources) {
    const log = await prisma.scrapeLog.create({
      data: {
        source,
        status: "started",
        itemsFound: 0,
        itemsNew: 0,
        startedAt: new Date(),
      },
    });

    try {
      let items: ScrapeResult["items"] = [];

      switch (source) {
        case "weibo":
          items = await scrapeWeibo();
          break;
        case "xianyu":
          items = await scrapeXianyu();
          break;
        case "58tongcheng":
          items = await scrape58Tongcheng();
          break;
      }

      // Clean and deduplicate
      const cleaned = await cleanAndDedupe(items);

      // Insert into database
      let newCount = 0;
      for (const item of cleaned) {
        // Check for duplicates by title + location
        const existing = await prisma.pet.findFirst({
          where: {
            title: item.title,
            location: item.location,
            source: "SCRAPED",
          },
        });

        if (!existing) {
          await prisma.pet.create({
            data: {
              ...item,
              photos: JSON.stringify(item.photos),
              status: "AVAILABLE",
              source: "SCRAPED",
              sourceUrl: item.sourceUrl,
              contactPhone: item.contactPhone,
              contactWechat: item.contactWechat,
            },
          });
          newCount++;
        }
      }

      await prisma.scrapeLog.update({
        where: { id: log.id },
        data: {
          status: "success",
          itemsFound: items.length,
          itemsNew: newCount,
          finishedAt: new Date(),
        },
      });

      results.push({ source, items: cleaned });
    } catch (error) {
      console.error(`Scraper ${source} failed:`, error);
      await prisma.scrapeLog.update({
        where: { id: log.id },
        data: {
          status: "failed",
          error: String(error),
          finishedAt: new Date(),
        },
      });
    }
  }

  return results;
}
