import { NextResponse } from "next/server";
import { read, write } from "../../../lib/file-adapter";

// Handles GET requests to /api
export async function GET(request: Request) {
  const data = read("preferences", "preferences", "./data");
  return NextResponse.json(data);
};

// Handles POST requests to /api
export async function POST(request: Request) {
  const data = await request.json();
  console.log(data)
  write("preferences", "preferences", data, "./data");
  return NextResponse.json({ message: "OK" });
}