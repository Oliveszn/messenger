"use client";

import Link from "next/link";

export default function ThreadsHome() {
  return (
    <div>
      <Link href={"/threads/new"}>Add new</Link>
    </div>
  );
}
