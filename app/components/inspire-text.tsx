"use client";
import { useEffect, useState } from "react";

const inspire = [
  {
    text: "If you don't understand the data, you don't understand the problem",
    whom: "Mike Acton",
    where: "CppCon 2014",
    link: "https://www.youtube.com/watch?v=rX0ItVEVjHc",
  },
  {
    text: "Where there is one, there is many",
    whom: "Mike Acton",
    where: "CppCon 2014",
    link: "https://www.youtube.com/watch?v=rX0ItVEVjHc",
  },
  {
    text: "Virtuals don't cost much, but if you call them a lot it can add up. aka - death by a thousand paper cuts",
    whom: "Richard Fabian",
    where: "Data Oriented Design",
    link: "https://www.dataorienteddesign.com/dodbook.pdf",
  },
  {
    text: "Within us resides the power to overcome these challenges and achieve something beautiful. That one day, we'll look back at where we started and be amazed by how far we've come",
    whom: "Technoblade",
    where: null,
    link: null,
  },
  {
    text: "I'm not a great programmer; I'm just a good programmer with great habits",
    whom: "Kent Beck",
    where: null,
    link: null,
  },
];

export default function InspireText() {
  const [quote, setQuote] = useState<typeof inspire[0] | null>(null);

  // Select after hydration so server and client initial renders match (both null)
  useEffect(() => {
    setQuote(inspire[Math.floor(Math.random() * inspire.length)]);
  }, []);

  if (!quote) return null;

  return (
    <div className="px-10 py-5 bg-gradient-to-r from-transparent via-zinc-900/50 to-transparent rounded-sm">
      <h2 className="text-2xl text-zinc-200 italic">{quote.text}</h2>
      <div className="flex justify-center gap-6 mt-2">
        <h2 className="text-zinc-200 italic">{quote.whom}</h2>
        {quote.where != null ? <a className="text-zinc-200" href={quote.link}>
          {quote.where}
        </a> : <></>}
      </div>
    </div>
  );
}
