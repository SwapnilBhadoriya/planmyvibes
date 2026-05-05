import { NextResponse } from "next/server";
import { blogSchema } from "@/lib/validations/blog.schema";
import { createBlogService, getBlogsService } from "@/services/blog.service";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ validate input only (not DB relation)
    const validated = blogSchema.parse(body);

    const result = await createBlogService(validated);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.errors?.[0]?.message || error.message,
      },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    const type = searchParams.get("type");

    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10;

    const result = await getBlogsService({
      entityType,
      entityId,
      type,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
