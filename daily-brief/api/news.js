// api/news.js - Vercel Serverless Function
// 运行在 Vercel 境外服务器上，直接抓取 Google News，不需要任何 CORS 代理

export default async function handler(req, res) {
  // 允许跨域（你的前端页面调用这个函数）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: '缺少参数 q' });
  }

  const rssUrl = 'https://news.google.com/rss/search?q='
    + encodeURIComponent(q)
    + '&hl=zh-CN&gl=CN&ceid=CN:zh-Hans';

  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });

    if (!response.ok) {
      throw new Error('Google News 返回 ' + response.status);
    }

    const xmlText = await response.text();

    // 简单解析 RSS，提取 item
    const items = [];
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];
      const title = (itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                     itemXml.match(/<title>(.*?)<\/title>/))?.[1] || '';
      const description = (itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                           itemXml.match(/<description>(.*?)<\/description>/))?.[1] || '';
      const source = itemXml.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'Google News';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

      items.push({
        title: title.replace(/<[^>]+>/g, '').trim(),
        description: description.replace(/<[^>]+>/g, '').trim(),
        source,
        pubDate
      });

      if (items.length >= 10) break;
    }

    if (!items.length) {
      throw new Error('未找到新闻条目');
    }

    res.status(200).json({ items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
