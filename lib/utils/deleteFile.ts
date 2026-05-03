import fs from "fs/promises";
import path from "path";

export async function deleteFile(fileUrl: string) {
  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);

    await fs.unlink(filePath);
  } catch (err) {
    console.error("File delete error:", err);
  }
}