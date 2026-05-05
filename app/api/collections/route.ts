import { NextResponse } from "next/server";
import { collectionSchema } from "@/lib/validations/collection.schema";
import { createCollectionService, getCollectionsService } from "@/services/collection.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = collectionSchema.parse(body);

    const result = await createCollectionService(validated);

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

    const destinationId = searchParams.get("destinationId");
    const type = searchParams.get("type");

    const data = await getCollectionsService({
      destinationId,
      type,
    });

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}