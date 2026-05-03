import path from "path";

export async function uploadFile(
  file: File,
  options: {
    folder: string;
    fileName: string;
  }
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fs = await import("fs/promises");

  const dirPath = `./public/${options.folder}`;
  await fs.mkdir(dirPath, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";

  const fullFileName = `${options.fileName}.${ext}`;
  const fullPath = path.join(dirPath, fullFileName);

  await fs.writeFile(fullPath, buffer);

  return `/${options.folder}/${fullFileName}`;
}