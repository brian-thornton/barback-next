import { NextResponse } from "next/server";
import { read, write } from "../../../lib/file-adapter";

// Handles GET requests to /api
export async function GET(request: Request) {
  const data = read("beers", "downstairs", "./data");
  return NextResponse.json(data);
};

// Handles POST requests to /api
export async function POST(request: Request) {
  const data = await request.json();
  console.log(data)
  write("beers", "downstairs", data, "./data");
  return NextResponse.json({ message: "Hello World" });
}