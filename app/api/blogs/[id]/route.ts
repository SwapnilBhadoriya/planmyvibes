import { NextResponse } from "next/server";
import { deleteBlogService, getBlogByIdService, updateBlogService } from "@/services/blog.service";
import { blogUpdateSchema } from "@/lib/validations/blog.schema";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await deleteBlogService(id);

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const body = await req.json();
    const validated = blogUpdateSchema.parse(body);
    const data = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const result = await updateBlogService({
      id,
      data,
    });

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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const data = await getBlogByIdService(id);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}
