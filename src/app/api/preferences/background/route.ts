import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = req.url.split("?").pop()?.split("=").pop();

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/${name}.jpg`, buffer);

    return Response.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "fail", error: e });
  }
}