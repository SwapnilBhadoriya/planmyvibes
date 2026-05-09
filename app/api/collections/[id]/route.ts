import { NextResponse } from "next/server";
import { deleteCollectionService, getCollectionByIdService, updateCollectionService } from "@/services/collection.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const data = await getCollectionByIdService(id);

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const {
      title,
      description,
      destinationId,
      type,
      coverImage,
      addPlaceIds,
      removePlaceIds,
      orderedPlaceIds,
    } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (destinationId !== undefined) data.destinationId = destinationId;
    if (type !== undefined) data.type = type;
    if (coverImage !== undefined) data.coverImage = coverImage; // allow null to clear

    const result = await updateCollectionService({
      id,
      data,
      addPlaceIds,
      removePlaceIds,
      orderedPlaceIds,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await deleteCollectionService(id);

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