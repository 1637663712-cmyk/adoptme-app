// 数据清洗与去重模块

interface ScrapedItem {
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
}

// 常见垃圾信息关键词
const spamKeywords = [
  "广告",
  "加微信",
  "日赚",
  "兼职",
  "代理",
  "微商",
  "扫码",
  "关注公众号",
  "免费领取",
  "点击链接",
];

// 手机号正则（中国）
const phoneRegex = /1[3-9]\d{9}/g;

// 微信号正则
const wechatRegex = /[Vv][Xx信][:：]?\s*[a-zA-Z][a-zA-Z0-9_-]{5,19}/g;

export async function cleanAndDedupe(items: ScrapedItem[]): Promise<ScrapedItem[]> {
  const cleaned: ScrapedItem[] = [];

  for (const item of items) {
    // 1. 过滤垃圾信息
    const hasSpam = spamKeywords.some((kw) => item.description.includes(kw));
    if (hasSpam) continue;

    // 2. 标准化数据
    let description = item.description.trim();

    // 提取手机号
    const phones = description.match(phoneRegex);
    if (phones && !item.contactPhone) {
      item.contactPhone = phones[0];
    }

    // 提取微信号
    const wechats = description.match(wechatRegex);
    if (wechats && !item.contactWechat) {
      item.contactWechat = wechats[0].replace(/[Vv][Xx信][:：]\s*/, "");
    }

    // 清理描述中的特殊字符和多余空白
    description = description.replace(/\s+/g, " ").trim();

    // 3. 标准化物种
    let species = item.species.toUpperCase();
    if (species.includes("狗") || species.includes("DOG")) species = "DOG";
    else if (species.includes("猫") || species.includes("CAT")) species = "CAT";
    else species = "OTHER";

    // 4. 标准化地点
    const location = item.location.replace(/\s+/g, "").trim();

    cleaned.push({
      ...item,
      species,
      location,
      description,
      photos: item.photos.filter((url) => url.startsWith("http")),
    });
  }

  // 5. 去重（基于标题+地点）
  const seen = new Set<string>();
  const deduped: ScrapedItem[] = [];

  for (const item of cleaned) {
    const key = `${item.title}__${item.location}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }

  return deduped;
}
