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
  write("preferences", "preferences", data, "./data");
  return NextResponse.json({ message: "OK" });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/uploads/${file.name}`, buffer);

    revalidatePath("/");

    return NextResponse.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}