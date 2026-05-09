import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/utils/upload";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 });
        }

        const timestamp = Date.now();
        const url = await uploadFile(file, {
            folder: "uploads/blogs",
            fileName: `img-${timestamp}`,
        });

        return NextResponse.json({ success: true, url });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
