import { NextResponse } from "next/server";
import { tagSchema } from "@/lib/validations/tag.schema";
import { createTagService, getTagsService } from "@/services/tag.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = tagSchema.parse(body);

    const result = await createTagService(validated);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error?.errors?.[0]?.message || error.message,
      },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 20;

    const result = await getTagsService({
      type,
      search,
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