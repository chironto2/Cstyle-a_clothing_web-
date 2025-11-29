import { NextResponse, type NextRequest } from 'next/server';
import {
  getPublicProducts,
  getProductById,
} from '@/lib/services/productService';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const productId = searchParams.get('id');
  const limitParam = searchParams.get('limit');

  try {
    if (productId) {
      if (!ObjectId.isValid(productId)) {
        return NextResponse.json(
          { message: 'Invalid product ID format' },
          { status: 400 }
        );
      }
      const product = await getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    } else {
      let limit: number | undefined = undefined;
      if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limit = parsedLimit;
        }
      }

      const productsArray = await getPublicProducts(limit);
      return NextResponse.json(productsArray, { status: 200 });
    }
  } catch (error: any) {
    console.error('[API /api/products] Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch products due to a server error.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
