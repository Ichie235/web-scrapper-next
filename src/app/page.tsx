"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";


function Home() {
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post<{ title: string }>(
        "api/scrape",
        { url }
      );
      setTitle(response.data.title);
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  return (
    <main className="w-full flex flex-col items-center justify-center py-10">
      <div className="w-full flex flex-col items-center px-4">
        <h1 className="text-blue-900 text-3xl font-semibold mb-6">
          Web Scraper{" "}
        </h1>
        <p className="mb-3 w-fit">Enter a URL to generate Title of the Page</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={handleChange}
            className="w-48 md:w-96 h-11 border border-gray-600 rounded-lg px-2 text-black"
          />
          <br />
          <button
            className="bg-blue-700 rounded-lg px-4 py-2 mt-6"
            type="submit"
          >
            Submit
          </button>
        </form>
        {title && (
          <h2 className="text-xl font-bold mt-4">
            The title of this page is:{" "}
            <span className="text-blue-800">{title}</span>
          </h2>
        )}
      </div>
    </main>
  );
}

export default Home;
