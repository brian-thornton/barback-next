import { NextResponse } from "next/server";
import { read, write } from "../../../lib/file-adapter";

// Handles GET requests to /api
export async function GET(request: Request) {
  const data = read("beers", "beers", "./data");
  return NextResponse.json(data);
};

// Handles POST requests to /api
export async function POST(request: Request) {
  const data = await request.json();
  write("beers", "beers", data, "./data");
  return NextResponse.json({ message: "OK" });
}