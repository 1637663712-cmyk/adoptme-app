// 定时任务调度器
// 使用 node-cron 定时执行爬虫任务

import cron, { ScheduledTask } from "node-cron";
import { runScraper } from "./index";

// 每6小时执行一次: 0 */6 * * *
// 对于开发/演示，可以改为更频繁的调度
const SCRAPE_SCHEDULE = process.env.SCRAPE_SCHEDULE || "0 */6 * * *";

let job: ScheduledTask | null = null;

export function startScheduler() {
  if (job) {
    console.log("[Scheduler] Already running");
    return;
  }

  console.log(`[Scheduler] Starting with schedule: ${SCRAPE_SCHEDULE}`);

  job = cron.schedule(SCRAPE_SCHEDULE, async () => {
    console.log(`[Scheduler] Running scrape at ${new Date().toISOString()}`);
    try {
      const results = await runScraper();
      console.log(
        `[Scheduler] Completed: ${results.map((r) => `${r.source}=${r.items.length}`).join(", ")}`
      );
    } catch (error) {
      console.error("[Scheduler] Error:", error);
    }
  });

  console.log("[Scheduler] Started");
}

export function stopScheduler() {
  if (job) {
    job.stop();
    job = null;
    console.log("[Scheduler] Stopped");
  }
}

// 如果直接运行此文件，则启动调度器
// 可在 package.json 中添加脚本: "scraper": "tsx src/scraper/scheduler.ts"
// 实际部署时，建议使用 Vercel Cron Jobs 或独立 VPS 运行
