import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";

interface ScrapeRequest {
  url: string;
}

interface ScrapeResponse {
  title: string;
}
interface MessageResponse {
  message: string;
}
interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResponse | ErrorResponse | MessageResponse>
) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "hello world" });
  } else if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { url } = req.body as ScrapeRequest;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title: string | null = $("title").text() || null;

    // Check if title is available
    if (title) {
      res.json({ title });
    } else {
      res.json({ title: "Sorry, the title of this page is not available" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape URL" });
  }
}
