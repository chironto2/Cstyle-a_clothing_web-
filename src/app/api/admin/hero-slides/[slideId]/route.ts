import { NextResponse, type NextRequest } from 'next/server';
import {
  updateHeroSlide,
  deleteHeroSlide,
} from '@/lib/services/heroSlideService';
import type { HeroSlide } from '@/types';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: { slideId: string } }
) {
  const { slideId } = await params;
  console.log(`[API /api/admin/hero-slides/${slideId}] PUT request received`);
  // TODO: Add admin role check here

  if (!ObjectId.isValid(slideId)) {
    return NextResponse.json(
      { message: 'Invalid slide ID format' },
      { status: 400 }
    );
  }

  try {
    const body: Partial<
      Omit<HeroSlide, 'id' | '_id' | 'createdAt' | 'updatedAt'>
    > = await req.json();
    console.log(`[API /api/admin/hero-slides/${slideId}] Update body:`, body);

    // Remove immutable fields that cannot be updated
    const { _id, id, createdAt, updatedAt, ...updateData } = body as any;

    // Ensure displayOrder is a number if provided in the body
    if (
      updateData.displayOrder !== undefined &&
      typeof updateData.displayOrder === 'string'
    ) {
      updateData.displayOrder = parseInt(updateData.displayOrder, 10);
      if (isNaN(updateData.displayOrder)) {
        updateData.displayOrder = 0; // Default or handle error
      }
    } else if (
      updateData.displayOrder !== undefined &&
      typeof updateData.displayOrder !== 'number'
    ) {
      updateData.displayOrder = 0; // Default if not a string or number (e.g. null)
    }

    const updatedSlide = await updateHeroSlide(slideId, updateData);

    if (!updatedSlide) {
      return NextResponse.json(
        { message: 'Hero slide not found or update failed.' },
        { status: 404 }
      );
    }

    console.log(
      `[API /api/admin/hero-slides/${slideId}] Slide updated successfully.`
    );
    return NextResponse.json(updatedSlide, { status: 200 });
  } catch (e: unknown) {
    const error = e as Error;
    console.error(
      `[API /api/admin/hero-slides/${slideId}] PUT Critical Error:`,
      error.message,
      error.stack
    );

    let errorMessage =
      'An unexpected server error occurred while updating the hero slide.';
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON in request body.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: 'Failed to update hero slide.', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slideId: string } }
) {
  const { slideId } = await params;
  console.log(
    `[API /api/admin/hero-slides/${slideId}] DELETE request received`
  );
  // TODO: Add admin role check here

  if (!ObjectId.isValid(slideId)) {
    return NextResponse.json(
      { message: 'Invalid slide ID format' },
      { status: 400 }
    );
  }

  try {
    const success = await deleteHeroSlide(slideId);

    if (!success) {
      return NextResponse.json(
        { message: 'Hero slide not found or delete failed.' },
        { status: 404 }
      );
    }

    console.log(
      `[API /api/admin/hero-slides/${slideId}] Slide deleted successfully.`
    );
    return NextResponse.json(
      { message: 'Hero slide deleted successfully' },
      { status: 200 }
    );
  } catch (e: unknown) {
    const error = e as Error;
    console.error(
      `[API /api/admin/hero-slides/${slideId}] DELETE Critical Error:`,
      error.message,
      error.stack
    );

    const errorMessage =
      typeof error.message === 'string' && error.message
        ? error.message
        : 'An unexpected server error occurred while deleting the hero slide.';

    return NextResponse.json(
      { message: 'Failed to delete hero slide.', error: errorMessage },
      { status: 500 }
    );
  }
}
