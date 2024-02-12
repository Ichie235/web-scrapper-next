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
    const title: string = $("title").text();
    res.json({ title });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape URL" });
  }
}
