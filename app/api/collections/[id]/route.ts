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
      addPlaceIds,
      removePlaceIds,
      orderedPlaceIds,
    } = body;

   
    const data = Object.fromEntries(
      Object.entries({
        title,
        description,
        destinationId,
        type,
      }).filter(([_, v]) => v !== undefined)
    );

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