import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const MANIFEST_PATH = path.join(process.cwd(), "content", "manifest.json");

/** Dev-only: manifest mtime for client polling (pairs with pnpm watch:content). */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!fs.existsSync(MANIFEST_PATH)) {
    return NextResponse.json(
      { revision: 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const { mtimeMs } = fs.statSync(MANIFEST_PATH);
  return NextResponse.json(
    { revision: mtimeMs },
    { headers: { "Cache-Control": "no-store" } }
  );
}
