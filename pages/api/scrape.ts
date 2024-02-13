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
  error_object?: any;
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
    const response = await fetch(url);
    console.log("this is stauts", response.status);
    console.log("this is stauts text", response.statusText);
    // Check if the response status is 200
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const title: string | null = $("title").text() || null;

      if (title) {
        return res.json({ title });
      }
    }

    // Check if the response status is 404 (Page Not Found)
    if (response.status === 404) {
      // If the response status is 404, there's no need to parse the HTML
      return res.json({
        title: "Page Not Found - The page you visited doesn't exist",
      });
    }
    if (response.status === 400) {
      // If the response status is 404, there's no need to parse the HTML
      return res.json({
        title: "Bad request- Cannot generate Title for this website",
      });
    }
  } catch (error) {
    // Catch any other errors (e.g., network errors)
    return res
      .status(500)
      .json({ error: "Failed to scrape URL", error_object: error });
  }
}
