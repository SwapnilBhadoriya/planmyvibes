import { NextResponse } from "next/server";
import { destinationSchema } from "@/lib/validations/destination.schema";
import { deleteDestinationService, getDestinationByIdService, updateDestinationService } from "@/services/destination.service";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await req.formData();
    const { id } = await context.params;

    // 🔹 Extract fields
    const data = {
      name: formData.get("name") || undefined,
      slug: formData.get("slug") || undefined,
      type: formData.get("type") || undefined,
      parentId: formData.get("parentId") || undefined,

      description: formData.get("description") || undefined,
      shortDescription: formData.get("shortDescription") || undefined,

      bestTimeStartMonth: formData.get("bestTimeStartMonth")
        ? Number(formData.get("bestTimeStartMonth"))
        : undefined,

      bestTimeEndMonth: formData.get("bestTimeEndMonth")
        ? Number(formData.get("bestTimeEndMonth"))
        : undefined,

      bestTimeNote: formData.get("bestTimeNote") || undefined,

      avgBudgetPerDay: formData.get("avgBudgetPerDay")
        ? Number(formData.get("avgBudgetPerDay"))
        : undefined,

      isActive: formData.get("isActive")
        ? formData.get("isActive") === "true"
        : undefined,
    };

  
    const validated = destinationSchema.partial().parse(data);


    const bannerFile = formData.get("banner") as File | null;
    const coverFile = formData.get("cover") as File | null;

    const removeBanner = formData.get("removeBanner") === "true";
    const removeCover = formData.get("removeCover") === "true";

    const result = await updateDestinationService({
      id,
      data: validated,
      bannerFile,
      coverFile,
      removeBanner,
      removeCover,
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const result = await deleteDestinationService(id);

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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new Error("ID is required");
    }

    const data = await getDestinationByIdService(id);

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

