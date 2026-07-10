"use client";

import Book from "@/Components/Home/Book";
import Destination from "@/Components/Home/Destination";

export default function BookNowPage() {
  return (
    <div className="flex flex-col w-full">
      <Book />
      <Destination />
    </div>
  );
}
