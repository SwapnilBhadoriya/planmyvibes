import { NextResponse } from "next/server";
import { updateTagService, deleteTagService } from "@/services/tag.service";
import { tagSchema } from "@/lib/validations/tag.schema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const validated = tagSchema.partial().parse(body);

    const data = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const result = await updateTagService(Number(id), data);

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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await deleteTagService(Number(id));

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}